import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from 'express';
import { FinanceService } from '../../services/finance.service';
import { format } from 'date-fns';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { DisplayColumns } from '../../interfaces/display-columns';
import { RouterLink } from "@angular/router";
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HistoryByType } from '../../interfaces/history-data';


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
    MatCardActions,
    MatTableModule,
    DatePipe,
    RouterLink,
    MatSortModule,
  ],
  templateUrl: './history-data.component.html',
  styleUrl: './history-data.component.scss',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class HistoryDataComponent implements AfterViewInit {
  financeService = inject(FinanceService);

  displayedColumns: DisplayColumns[] = [];
  displayColumnsShow: string[] = [];

  now = new Date();
  firstDay = new Date(this.now.getFullYear(), this.now.getMonth(), 1);
  lastDay = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0);

  selectedDate = new Date();

  dataSource: MatTableDataSource<HistoryByType>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource(
      this.financeService.groupedPaymentsArray()
    );
  }

  ngOnInit() {
    this.displayedColumns = [
      { name: 'type', show: true },
      { name: 'amount', show: true },
    ];

    this.displayColumnsShow = this.displayedColumns
      .filter((col) => col.show)
      .map((col) => col.name);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  setMonthAndYear(date: Date, datepicker: MatDatepicker<Date>) {
    this.selectedDate = date;
    const yearMonth = format(date, 'yyyy-MM');
    this.financeService.setYearMonth(yearMonth);
    datepicker.close();
  }

  onDateChange(event: any) {
    const date = event.value;
    if (date) {
      const yearMonth = format(date, 'yyyy-MM');
      this.financeService.setYearMonth(yearMonth);
    }
  }
}
