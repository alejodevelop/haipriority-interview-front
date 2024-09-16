import {Component, OnInit, ViewChildren, QueryList, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subscription, forkJoin} from 'rxjs';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartType, ChartData, Chart} from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {CreditService} from '../credit/credit.service';
import {DebitService} from '../debit/debit.service';
import {LoanService} from '../loan/loan.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalDebitMoney = 0;
  totalCreditDebt = 0;
  totalLoanDebt = 0;
  totalCreditCards = 0;
  totalDebitCards = 0;
  totalLoans = 0;
  private subscription: Subscription | undefined;

  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective> | undefined;

  constructor(
    private creditService: CreditService,
    private debitService: DebitService,
    private loanService: LoanService
  ) {
    Chart.register(DataLabelsPlugin);
  }

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics() {
    this.subscription = forkJoin({
      creditCards: this.creditService.getCreditCards(),
      debitCards: this.debitService.getDebitCards(),
      loans: this.loanService.getLoans()
    }).subscribe({
      next: ({creditCards, debitCards, loans}) => {
        this.totalCreditCards = creditCards.length;
        this.totalDebitCards = debitCards.length;
        this.totalLoans = loans.length;

        this.totalDebitMoney = debitCards.reduce((sum, card) => sum + card.balance, 0);
        this.totalCreditDebt = creditCards.reduce((sum, card) => sum + card.balance, 0);
        this.totalLoanDebt = loans.reduce((sum, loan) => sum + loan.balance, 0);

        this.initCharts();
      },
      error: (error) => {
        console.error('Error loading statistics', error);
      }
    });
  }

  initCharts() {
    this.pieChartData.datasets[0].data = [this.totalDebitMoney, this.totalCreditDebt, this.totalLoanDebt];
    this.barChartData.datasets[0].data = [this.totalCreditDebt];
    this.barChartData.datasets[1].data = [this.totalDebitMoney];
    this.barChartData.datasets[2].data = [this.totalLoanDebt];

    if (this.charts) {
      this.charts.forEach(chart => chart.update());
    }
  }

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        color: '#ffffff',
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
          return '';
        },
      },
    },
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Dinero en Tarjetas de Débito', 'Deuda en Tarjetas de Crédito', 'Deuda en Préstamos'],
    datasets: [
      {
        data: [this.totalDebitMoney, this.totalCreditDebt, this.totalLoanDebt],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';

  public stackedBarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        color: '#ffffff',
      }
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true,
      },
    },
  };

  public barChartData: ChartData<'bar'> = {
    labels: ['Productos'],
    datasets: [
      {
        label: 'Tarjetas de Crédito',
        data: [this.totalCreditDebt],
        backgroundColor: '#f44336',
      },
      {
        label: 'Tarjetas de Débito',
        data: [this.totalDebitMoney],
        backgroundColor: '#4caf50',
      },
      {
        label: 'Préstamos',
        data: [this.totalLoanDebt],
        backgroundColor: '#2196f3',
      },
    ],
  };
  public stackedBarChartType: ChartType = 'bar';

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
