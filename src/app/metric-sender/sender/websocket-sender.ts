import {Inject, Injectable, InjectionToken, NgZone, OnDestroy} from '@angular/core';
import * as io from 'socket.io-client';
import {DataPoint} from '../data-point';
import {Sender} from './sender';

export const WEBSOCKET_SENDER_URL_TOKEN = new InjectionToken('WEBSOCKET_SENDER_URL_TOKEN');


// https://github.com/godmodelabs/statsc
@Injectable()
export class WebsocketSender extends Sender implements OnDestroy {
  private queue: DataPoint[] = [];
  private socket: any;

  constructor(@Inject(WEBSOCKET_SENDER_URL_TOKEN) private url: string, private zone: NgZone) {
    super();
    this.url = this.url || 'http://localhost:8885';
    this.initSocket();
  }

  send(data: DataPoint) {
    this.queue.push(data);
    this.processQueue();
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  }

  private initSocket() {
    this.zone.runOutsideAngular(() => {
      this.socket = io(this.url);
    });
  }

  private processQueue() {
    this.zone.runOutsideAngular(() => {
      this.requestIdleCallback((deadline) => {
        while (this.queue.length > 0) {
          const dp = this.queue.shift();
          this.socket.emit('statsc', dp);
          if (deadline.timeRemaining() <= 0 && this.queue.length > 0) {
            this.processQueue();
            break;
          }
        }
      });
    });
  }

  private requestIdleCallback(callback) {
    if ('requestIdleCallback' in window) {
      window['requestIdleCallback'](callback);
    } else {
      throw new Error(`Browser does not support 'requestIdleCallback'`);
    }
  }
}
