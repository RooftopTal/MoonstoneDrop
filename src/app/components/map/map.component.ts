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

  private colourService = inject(ColourService);

  static readonly mapSize = 36;

  chart?: Chart;

  ngAfterViewInit() {
    this.chart = new Chart(
      this.canvas.nativeElement,
      {
        type: 'scatter',
        data: {
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
            tooltip: {
              callbacks: {
                label: function(context) {
                  // Show depth in tooltip
                  return `Depth: ${context.label}`;
                }
              }
            }
          },
        },
      },
    );
  }

  private updateChartData(inputStones: Moonstone[]) {
    if (!this.chart) return;

    if (!inputStones || inputStones.length === 0) {
      this.chart.data.datasets[0].data = [];
      this.chart.data.datasets[0].backgroundColor = [];
    } else {
      this.chart.data.datasets[0].backgroundColor = ColourService.rainbow;
      this.chart.data.datasets[0].data = inputStones.map(this.toCartesian);
    }

    this.chart.update();
  }

  private toCartesian(stone: Moonstone) {
    const angleRad = (stone.degrees * Math.PI) / 180;

    return {
      x: stone.distance * Math.cos(angleRad) + MapComponent.mapSize/2,
      y: stone.distance * Math.sin(angleRad) + MapComponent.mapSize/2,
      label: stone.depth
    };
  }
}
