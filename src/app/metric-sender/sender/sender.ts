import {DataPoint} from '../data-point';
import {InjectionToken} from '@angular/core';


export const METRIC_SENDER_TOKEN = new InjectionToken('METRIC_SENDER_TOKEN');

export abstract class Sender {
  abstract send(data: DataPoint);
}
