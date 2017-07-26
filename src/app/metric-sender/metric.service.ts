import {Inject, Injectable, InjectionToken, NgZone, Optional} from '@angular/core';
import {DataPoint} from './data-point';
import {METRIC_SENDER_TOKEN, Sender} from './sender/sender';

export const METRIC_SENDER_PREFIX = new InjectionToken<string>('METRIC_SENDER_PREFIX');


@Injectable()
export class MetricService {

  constructor(@Inject(METRIC_SENDER_TOKEN) private sender: Sender[],
              @Optional() @Inject(METRIC_SENDER_PREFIX) private prefix: string,
              private zone: NgZone) {
  }

  /**
   * Increment the counter at `stat` by one.
   *
   * @param  {string} stat
   * @param  {number} sampleRate
   */
  public increment(stat: string, sampleRate?: string): void {
    this.send({action: 'i', name: stat, sr: sampleRate});
  };

  /**
   * Decrement the counter at `stat` by one.
   *
   * @param  {string} stat
   * @param  {number} sampleRate
   */
  public decrement(stat: string, sampleRate?: string): void {
    this.send({action: 'd', name: stat, sr: sampleRate});
  };

  /**
   * Set the gauge at `stat` to `value`.
   *
   * @param  {string} stat
   * @param  {number} value
   * @param  {number} sampleRate
   */
  public gauge(stat: string, value: number, sampleRate?: string): void {
    this.send({action: 'g', name: stat, value: value, sr: sampleRate});
  };

  /**
   * Log `time` to `stat`.
   *
   * `time` can either be
   *   - a number in milliseconds
   *   - a Date object, created at the timer's start
   *   - a synchronous function to be timed
   *
   * @param  {string}               stat
   * @param  {number|Date|function} time
   * @param  {number}               sampleRate
   */
  public timing(stat: string, time: number | Date | Function, sampleRate?: string): void {
    if ('number' === typeof time) {
      this.send({action: 't', name: stat, value: time, sr: sampleRate});
      return;
    }
    if (time instanceof Date) {
      this.send({action: 't', name: stat, value: this.fromNow(time), sr: sampleRate});
      return;
    }
    if ('function' === typeof time) {
      const start = new Date();
      time();
      this.send({action: 't', name: stat, value: this.fromNow(start), sr: sampleRate});
    }
  };

  /**
   * Timer utility in functional style.
   *
   * Returns a function you can call when you want to mark your timer as
   * resolved.
   *
   * @param  {string}   stat
   * @param  {number}   sampleRate
   * @return {function}
   */
  public timer(stat: string, sampleRate?: string): () => void {
    const start = new Date();
    return () => {
      this.send({action: 't', name: stat, value: this.fromNow(start), sr: sampleRate});
    }
  };

  /**
   * Calculate the difference between `now` and the given Date object.
   *
   * @param  {object} time
   * @return {number} difference in milliseconds
   */
  private fromNow(date: Date): number {
    return (new Date().getTime()) - date.getTime();
  }

  private send(data: DataPoint): void {
    this.zone.runOutsideAngular(() => {
      if (this.prefix) {
        data.name = `${this.prefix}.${data.name}`;
      }
      this.sender.forEach(sender => {
        sender.send(data);
      });
    });
  }
}
