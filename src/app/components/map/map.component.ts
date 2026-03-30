import {AfterViewInit, Component, ElementRef, inject, input, Input, ViewChild} from '@angular/core';
import {Moonstone} from '../../models/moonstone.model';
import {
  Chart,
  ScatterController,
  LinearScale,
  PointElement,
  Tooltip,
  Legend, ScatterDataPoint
} from 'chart.js';

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

        },
      },
    );
  }

  private updateChartData(inputStones: Moonstone[]) {
    if (!this.chart) return;

    if (!inputStones || inputStones.length === 0) {
      this.chart.data.datasets[0].data = [];
    } else {
      this.chart.data.datasets[0].data = inputStones.map(this.toCartesian);
    }

    this.chart.update();
  }

  private toCartesian(stone: Moonstone) {
    const angleRad = (stone.degrees * Math.PI) / 180;

    return {
      x: stone.distance * Math.cos(angleRad) + MapComponent.mapSize/2,
      y: stone.distance * Math.sin(angleRad) + MapComponent.mapSize/2,
    };
  }
}
