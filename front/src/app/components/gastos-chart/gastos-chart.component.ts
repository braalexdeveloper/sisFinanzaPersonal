import { Component } from '@angular/core';
import { ChartType, ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-gastos-chart',
  standalone:true,
  imports: [BaseChartDirective],
  templateUrl: './gastos-chart.component.html',
  styleUrl: './gastos-chart.component.scss'
})
export class GastosChartComponent {
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
    datasets: [
      { data: [500, 1200, 700, 2000], label: 'Gastos' }
    ]
  };

  barChartType: ChartType = 'bar';
 
}
