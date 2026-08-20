import {AfterViewInit, Component, effect, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {Moonstone} from '../../models/moonstone.model';
import {Chart, LinearScale, LineElement, PointElement, ScatterController, Tooltip,} from 'chart.js';
import {ColourService} from '../../services/colour.service';
import {BoardPhotoService} from '../../services/board-photo.service';
import {SettingsService} from '../../services/settings.service';

// register everything the map needs
Chart.register(ScatterController, LinearScale, LineElement, PointElement, Tooltip);

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements AfterViewInit {
  private _stones: Moonstone[] = [];

  private static readonly deploymentZoneInset = 10;
  private static readonly backdropColour = '#fefcf5';

  @Input()
  set stones(value: Moonstone[]) {
    this._stones = value;
    this.updateChartData(value);
  }
  @ViewChild('moonstoneCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  static readonly mapSize = 36;
  chart?: Chart;

  private boardPhoto = inject(BoardPhotoService);
  private settings = inject(SettingsService);

  private chartAreaBackgroundPlugin = {
    id: 'chartAreaBackground',
    beforeDraw: (chart: Chart) => {
      const { ctx, chartArea: { top, left, width, height } } = chart;
      ctx.save();
      const photo = this.boardPhoto.image();
      if (photo) {
        ctx.globalAlpha = 0.2;
        ctx.drawImage(photo, left, top, width, height);
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = MapComponent.backdropColour;
        ctx.fillRect(left, top, width, height);
      }
      ctx.restore();
    }
  };

  constructor() {
    effect(() => {
      this.boardPhoto.image();
      this.settings.showDeploymentZones();
      this.chart?.update();
    });
  }

  private deploymentZonePlugin = {
    id: 'deploymentZone',
    beforeDatasetsDraw: (chart: Chart) => {
      if (!this.settings.showDeploymentZones()) return;

      const deploymentZoneIndex = chart.data.datasets.findIndex(
        (dataset) => dataset.label === 'Deployment Zone',
      );

      if (deploymentZoneIndex === -1 || !chart.isDatasetVisible(deploymentZoneIndex)) return;

      const {ctx, scales} = chart;
      const xScale = scales['x'];
      const yScale = scales['y'];
      const edge = MapComponent.deploymentZoneInset;
      const innerEdge = MapComponent.mapSize - edge;
      const lines = [
        [
          {x: edge, y: 0},
          {x: edge, y: MapComponent.mapSize},
        ],
        [
          {x: innerEdge, y: 0},
          {x: innerEdge, y: MapComponent.mapSize},
        ],
        [
          {x: 0, y: edge},
          {x: MapComponent.mapSize, y: edge},
        ],
        [
          {x: 0, y: innerEdge},
          {x: MapComponent.mapSize, y: innerEdge},
        ],
      ];

      ctx.save();
      ctx.strokeStyle = '#36A2EB';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.setLineDash([2, 5]);
      lines.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(xScale.getPixelForValue(start.x), yScale.getPixelForValue(start.y));
        ctx.lineTo(xScale.getPixelForValue(end.x), yScale.getPixelForValue(end.y));
        ctx.stroke();
      });
      ctx.restore();
    },
  };

  private pointHaloPlugin = {
    id: 'pointHalo',
    beforeDatasetsDraw: (chart: Chart) => {
      if (!chart.isDatasetVisible(0)) return;

      const { ctx } = chart;
      ctx.save();
      ctx.fillStyle = MapComponent.backdropColour;
      chart.getDatasetMeta(0).data.forEach((point) => {
        const radius = (point.options as { radius?: number }).radius ?? 3;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius + 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    },
  };

  private alwaysShowLabelsPlugin = ({
    id: 'alwaysShowLabels',
    afterDatasetsDraw(chart: Chart) {
      const ctx = chart.ctx;

      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((point, index) => {
          const data = dataset.data[index] as any;
          const depth = data.z; // your depth value

          if (depth !== undefined) {
            ctx.save();
            ctx.fillStyle = '#000'; // text color
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(depth, point.x, point.y - 6); // slightly above the point
            ctx.restore();
          }
        });
      });
    }
  });

  ngAfterViewInit() {
    this.chart = new Chart(
      this.canvas.nativeElement,
      {
        type: 'scatter',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Moonstones',
              borderColor: '#36A2EB',
              backgroundColor: '#9BD0F5',
              data: []
            },
            {
              label: 'Deployment Zone',
              backgroundColor: 'transparent',
              data: [],
              fill: false,
              pointRadius: 0,
              pointHoverRadius: 0,
              showLine: true,
            }
          ]
        },
        options: {
          aspectRatio: 1,
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: { min: 0, max: MapComponent.mapSize, ticks: {stepSize: 12} },
            y: { min: 0, max: MapComponent.mapSize, ticks: {stepSize: 12} },
          },
          plugins: {
            tooltip: { enabled: false },
            legend: { display: false },
          },
        },
        plugins: [this.chartAreaBackgroundPlugin, this.deploymentZonePlugin, this.pointHaloPlugin, this.alwaysShowLabelsPlugin]
      },
    );
    this.updateChartData(this._stones);
  }

  private updateChartData(inputStones: Moonstone[]) {
    if (!this.chart) return;

    if (!inputStones || inputStones.length === 0) {
      this.chart.data.labels = [];
      this.chart.data.datasets[0].data = [];
      this.chart.data.datasets[0].backgroundColor = [];
      this.chart.data.datasets[0].borderColor = [];
    } else {
      this.chart.data.labels = inputStones.map((stone) => `Depth: ${stone.depth}`);
      this.chart.data.datasets[0].backgroundColor = ColourService.rainbow;
      this.chart.data.datasets[0].borderColor = ColourService.rainbow;
      this.chart.data.datasets[0].data = inputStones.map(this.toCartesian);
    }

    this.chart.update();
  }

  private toCartesian(stone: Moonstone) {
    const angleRad = (stone.degrees * Math.PI) / 180;

    return {
      x: stone.distance * Math.cos(angleRad) + MapComponent.mapSize/2,
      y: stone.distance * Math.sin(angleRad) + MapComponent.mapSize/2,
      z: stone.depth,
    };
  }
}
