import { TestBed, inject } from '@angular/core/testing';

import { MetricService } from './metric.service';
import {MetricSenderModule} from './metric-sender.module';

describe('MetricService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetricSenderModule.forRoot()]
    });
  });

  it('should be created', inject([MetricService], (service: MetricService) => {
    expect(service).toBeTruthy();
  }));
});
