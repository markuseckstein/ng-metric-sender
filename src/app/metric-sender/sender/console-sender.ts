import {Sender} from './sender';
import {DataPoint} from '../data-point';
import {Injectable} from '@angular/core';

@Injectable()
export class ConsoleSender extends Sender {

  send(data: DataPoint) {
    console.log(data);
  }
}
