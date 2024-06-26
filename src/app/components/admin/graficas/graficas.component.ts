import { Component, OnInit } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { CitasFbService } from '../../../services/firebase/citas-fb.service';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-graficas',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './graficas.component.html',
  styleUrl: './graficas.component.css',
})
export class GraficasComponent implements OnInit {
  public chart: Chart | null = null;
  isLoading = false;
  dias: string[] = [];
  citas: number[] = [];

  private CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(90, 120, 255)',
  };

  constructor(private citasService: CitasFbService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.isLoading = true;
    this.citasService
      .getUltimasSieteDias()
      .then((data) => {
        data.forEach((dia) => {
          this.dias.push(dia.fecha);
          this.citas.push(dia.cantCitas);
        });
        this.initializeChart();
      })
      .catch((error) => {
        console.error('Ooops No se pudieron obtener los datos', error);
      });
  }

  initializeChart(): void {
    const data = {
      labels: this.dias,
      datasets: [
        {
          label: 'Citas por dia',
          data: this.citas,
          borderColor: this.CHART_COLORS.purple,
          backgroundColor: this.transparentize(this.CHART_COLORS.blue, 0.5),
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 15,
        },
      ],
    };
    const ctx = document.getElementById('chart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line' as ChartType,
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              autoSkip: true,
              includeBounds: true,
              stepSize: this.getStepSize(),
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: 'black',
            },
          },
        },
      },
    });
    this.isLoading = false;
  }

  private getStepSize(): number {
    const maxCitas = Math.max(...this.citas);
    let stepSize = 1;
    if (maxCitas < 10) {
      stepSize = 1;
    } else if (maxCitas % 5 === 0) {
      stepSize = 5;
    } else if (maxCitas % 2 === 0) {
      stepSize = 2;
    } else {
      stepSize = Math.ceil(maxCitas / 5);
    }
    return stepSize;
  }

  private transparentize(color: string, opacity: number): string {
    const alpha = 1 - opacity;
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
  }
}
