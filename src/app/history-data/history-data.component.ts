import {
  AfterViewInit,
  Component,
  effect,
  inject,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FinanceService } from '../../services/finance.service';
import { format } from 'date-fns';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DisplayColumns } from '../../interfaces/display-columns';
import { RouterLink } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HistoryByType } from '../../interfaces/history-data';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DecimalPipe } from '@angular/common';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-history-data',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatTableModule,
    RouterLink,
    MatSortModule,
    BaseChartDirective,
    DecimalPipe,
  ],
  templateUrl: './history-data.component.html',
  styleUrl: './history-data.component.scss',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class HistoryDataComponent implements AfterViewInit {
  financeService = inject(FinanceService);

  now = new Date();
  firstDay = new Date(this.now.getFullYear(), this.now.getMonth(), 1);
  lastDay = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0);

  selectedDate = new Date(this.financeService.getCurrentYearMonth());

  dataSource: MatTableDataSource<HistoryByType>;
  displayedColumns: DisplayColumns[] = [];
  displayColumnsShow: string[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor() {
    this.dataSource = new MatTableDataSource(
      this.financeService
        .groupedPaymentsArray()
        .sort((a, b) => b.amount - a.amount)
    );
    effect(() => {
      const data = this.financeService
        .groupedPaymentsArray()
        .sort((a, b) => b.amount - a.amount);
      this.dataSource.data = data;
      this.updateChartsData();
    });
  }

  ngOnInit() {
    this.displayedColumns = [
      { name: 'type', show: true },
      { name: 'amount', show: true },
    ];

    this.displayColumnsShow = this.displayedColumns
      .filter((col) => col.show)
      .map((col) => col.name);

    //this.updatePieChartData();
    this.updateChartsData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  setMonthAndYear(date: Date, datepicker: MatDatepicker<Date>) {
    this.selectedDate = date;
    const yearMonth = format(date, 'yyyy-MM');
    this.financeService.setYearMonth(yearMonth);
    this.updateChartsData();
    datepicker.close();
  }

  onDateChange(event: any) {
    const date = event.value;
    if (date) {
      const yearMonth = format(date, 'yyyy-MM');
      this.financeService.setYearMonth(yearMonth);
    }
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
    },
  };

  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Expenses by Type',
        backgroundColor: '#36A2EB',
      },
    ],
  };

  private updateChartsData() {
    const groupedData = this.financeService
      .groupedPaymentsArray()
      .sort((a, b) => b.amount - a.amount);

    this.barChartData = {
      labels: groupedData.map((item) => item.type),
      datasets: [
        {
          data: groupedData.map((item) => item.amount),
          label: 'Expenses by Type',
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
        },
      ],
    };
  }

  // Pie
  // public pieChartType: ChartType = 'pie';

  // public pieChartOptions: ChartConfiguration['options'] = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: 'top',
  //     },
  //   },
  // };

  // public pieChartData: ChartData<'pie'> = {
  //   labels: [],
  //   datasets: [
  //     {
  //       data: [],
  //     },
  //   ],
  // };

  // private updatePieChartData() {
  //   const groupedData = this.financeService.groupedPaymentsArray();

  //   this.pieChartData = {
  //     labels: groupedData.map((item) => item.type),
  //     datasets: [
  //       {
  //         data: groupedData.map((item) => item.amount),
  //         backgroundColor: [
  //           '#FF6384',
  //           '#36A2EB',
  //           '#FFCE56',
  //           '#4BC0C0',
  //           '#9966FF',
  //           '#FF9F40',
  //         ],
  //       },
  //     ],
  //   };
  // }
}
