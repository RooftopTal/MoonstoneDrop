import {AfterViewInit, Component, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {Moonstone} from '../../models/moonstone.model';
import {Chart, Legend, LinearScale, PointElement, ScatterController, Tooltip,} from 'chart.js';
import {ColourService} from '../../services/colour.service';

// register everything the map needs
Chart.register(ScatterController, LinearScale, PointElement, Tooltip, Legend);

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements AfterViewInit {
  @Input()
  set stones(value: Moonstone[]) {
    this.updateChartData(value);
  }
  @ViewChild('moonstoneCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  static readonly mapSize = 36;
  chart?: Chart;

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
          datasets: [{
            label: "Moonstones",
            borderColor: '#36A2EB',
            backgroundColor: '#9BD0F5',
            data: []
          }]
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
            tooltip: { enabled: false } // disable standard hover tooltips
          },
        },
        plugins: [this.alwaysShowLabelsPlugin]
      },
    );
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
