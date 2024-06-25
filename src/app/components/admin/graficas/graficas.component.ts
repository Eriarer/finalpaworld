import { Component, OnInit  } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';


@Component({
  selector: 'app-graficas',
  standalone: true,
  imports: [],
  templateUrl: './graficas.component.html',
  styleUrl: './graficas.component.css'
})
export class GraficasComponent implements OnInit{
  
  public chart: Chart | null = null;

  private CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    blue: 'rgb(54, 162, 235)'
  };
  ngOnInit(): void {
    this.initializeChart();
  }

  initializeChart(): void {
    const data = {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
      datasets: [{
        label: 'Dataset',
        data: this.generateRandomNumbers(6, -100, 100),
        borderColor: this.CHART_COLORS.red,
        backgroundColor: this.transparentize(this.CHART_COLORS.red, 0.5),
        pointStyle: 'circle',
        pointRadius: 10,
        pointHoverRadius: 15
      }]
    };

    const ctx = document.getElementById('chart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line' as ChartType,
      data: data
    });
  }

  private generateRandomNumbers(count: number, min: number, max: number, decimalPlaces: number = 2): number[] {
    const numArray = [];
    for (let i = 0; i < count; i++) {
      const randomValue = (Math.random() * (max - min) + min).toFixed(decimalPlaces);
      numArray.push(parseFloat(randomValue));
    }
    return numArray;
  }

  private transparentize(color: string, opacity: number): string {
    const alpha = 1 - opacity;
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
  }
  
}
