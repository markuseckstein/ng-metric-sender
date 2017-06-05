import {Component, OnInit} from '@angular/core';
import {MetricService} from './metric-sender/metric.service';

@Component({
  selector: 'metric-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'metric';

  constructor(private metrics: MetricService) {
    this.metrics.increment('AppComponent');

  }


  ngOnInit(): void {
    setInterval(() => {
      this.metrics.increment('myInterval');
    }, 1000);
  }
}
