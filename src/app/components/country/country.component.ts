import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataService } from 'src/app/services/data.service';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  data: any = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeath = 0;
  totalRecovered = 0;
  dataTable = [];
  countries: string[] = [];
  selectedCountryData: DateWiseData[];
  dateWiseData;
  loading = true;
  // options: {
  //   height: 500;
  //   animation: {
  //     duration: 1000;
  //     easing: 'out';
  //   };
  // };

  chart = {
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
    merge(
      this.dataService.getDateWiseData().pipe(
        map((result) => {
          this.dateWiseData = result;
        })
      ),
      this.dataService.getGlobalData().pipe(
        map((result) => {
          this.data = result;
          this.data.forEach((cs) => {
            this.countries.push(cs.country);
          });
        })
      )
    ).subscribe({
      complete: () => {
        this.updateValues('India');
        this.loading = false;
      },
    });
  }

  updateChart() {
    this.dataTable = [];
    this.dataTable.push(['Date', 'Cases']);
    this.selectedCountryData.forEach((cs) => {
      this.dataTable.push([cs.date, cs.cases]);
    });
  }

  updateValues(country: string) {
    console.log(country);
    this.data.forEach((cs) => {
      if (cs.country == country) {
        this.totalActive = cs.active;
        this.totalDeath = cs.death;
        this.totalRecovered = cs.recovered;
        this.totalConfirmed = cs.confirmed;
      }
    });

    this.selectedCountryData = this.dateWiseData[country];
    // console.log(this.selectedCountryData);
    this.updateChart();
  }
}
