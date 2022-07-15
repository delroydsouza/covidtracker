import { Component, OnInit } from '@angular/core';

import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeath = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];
  loading = true;
  datatable = [];
  chart = {
    PieChart: 'PieChart',
    ColumnChart: 'ColumnChart',
    LineChart: 'LineChart',
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
      is3D: true,
    },
  };
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        console.log(result);
        this.globalData = result;
        result.forEach((cs) => {
          if (!Number.isNaN(cs.confirmed)) {
            this.totalActive += cs.active;
            this.totalConfirmed += cs.confirmed;
            this.totalDeath += cs.death;
            this.totalRecovered += cs.active;
          }
        });

        this.initChart('c');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  updateChart(input: HTMLInputElement) {
    console.log(input.value);
    this.initChart(input.value);
  }

  initChart(caseType: string) {
    this.datatable = [];
    // this.datatable.push(["Country", "Cases"])

    this.globalData.forEach((cs) => {
      let value: number;
      if (caseType == 'c') if (cs.confirmed > 2000) value = cs.confirmed;

      if (caseType == 'a') if (cs.active > 2000) value = cs.active;
      if (caseType == 'd') if (cs.death > 1000) value = cs.death;

      if (caseType == 'r') if (cs.recovered > 2000) value = cs.recovered;

      this.datatable.push([cs.country, value]);
    });
    console.log(this.datatable);
  }
}
