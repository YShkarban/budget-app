import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FabMenuComponent } from './fab-menu/fab-menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BalanceCardComponent } from './balance-card/balance-card.component';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { FinanceService } from '../../services/finance.service';
import { format } from 'date-fns';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Router } from 'express';
import { RouterLink } from "@angular/router";

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
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    FabMenuComponent,
    MatToolbarModule,
    BalanceCardComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class DashboardComponent implements OnInit {
  //router = inject(Router);
  private dialog = inject(MatDialog);
  financeService = inject(FinanceService);

  fabMenuOpen = false;

  now = new Date();
  firstDay = new Date(this.now.getFullYear(), this.now.getMonth(), 1);
  lastDay = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0);

  selectedDate = new Date();

  pastMonth: boolean = false;

  ngOnInit(): void {
    this.checkSelectedMonth();
  }

  addCategory() {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  setMonthAndYear(date: Date, datepicker: MatDatepicker<Date>) {
    this.selectedDate = date;
    const yearMonth = format(date, 'yyyy-MM');
    this.financeService.setYearMonth(yearMonth);
    this.checkSelectedMonth();
    datepicker.close();
  }

  onDateChange(event: any) {
    const date = event.value;
    if (date) {
      const yearMonth = format(date, 'yyyy-MM');
      this.financeService.setYearMonth(yearMonth);
    }
  }

  checkSelectedMonth() {
    this.pastMonth = this.firstDay > this.selectedDate;
  }
}
