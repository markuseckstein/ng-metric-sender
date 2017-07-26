import {TestBed, inject} from '@angular/core/testing';

import {MetricService} from './metric.service';
import {MetricSenderModule} from './metric-sender.module';
import {Sender} from './sender/sender';
import {DataPoint} from './data-point';
import {NgZone} from '@angular/core';

describe('MetricService', () => {
  describe('Module Setup', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          MetricSenderModule.forRootWithUrl(),
          MetricSenderModule.forChildWithPrefix('test')]
      });
    });

    it('should be createable when module is imported correctly', inject([MetricService], (service: MetricService) => {

      expect(service).toBeTruthy();
    }));
  });

  describe('public method', () => {
    class TestSender implements Sender {
      send(data: DataPoint) {
      }
    }

    class MockNgZone {
      run(fn) {
        return fn();
      }

      runOutsideAngular(fn) {
        return fn();
      }
    }

    let sut: MetricService;
    let spy: jasmine.Spy;
    const zone: NgZone = new MockNgZone() as NgZone;

    beforeEach(() => {
      const testSender = new TestSender();
      spy = spyOn(testSender, 'send');
      sut = new MetricService([testSender], 'testPrefix', zone);
    });

    it('increment should send correct data', () => {
      sut.increment('stat1', 'xx');
      expect(spy).toHaveBeenCalledWith({
        action: 'i',
        name: 'testPrefix.stat1',
        sr: 'xx'
      })
    });

    it('decrement should send correct data', () => {
      sut.decrement('stat1');
      expect(spy).toHaveBeenCalledWith({
        action: 'd',
        name: 'testPrefix.stat1',
        sr: undefined
      })
    });

    it('gauge should send correct data', () => {
      sut.gauge('stat1', 42);
      expect(spy).toHaveBeenCalledWith({
        action: 'g',
        name: 'testPrefix.stat1',
        value: 42,
        sr: undefined
      })
    });

    it('timing should send correct data with number parameter', () => {
      sut.timing('stat1', 420);
      expect(spy).toHaveBeenCalledWith({
        action: 't',
        name: 'testPrefix.stat1',
        value: 420,
        sr: undefined
      })
    });

    it('timing should send correct data with Date parameter', () => {
      let testDate = new Date();
      testDate = new Date(testDate.getTime() - 200);
      sut.timing('stat1', testDate);
      expect(spy).toHaveBeenCalledWith({
        action: 't',
        name: 'testPrefix.stat1',
        value: jasmine.any(Number),
        sr: undefined
      })
    });

    it('timing should send correct data with function parameter', () => {
      sut.timing('stat1', () => console.log('some test function'));
      expect(spy).toHaveBeenCalledWith({
        action: 't',
        name: 'testPrefix.stat1',
        value: jasmine.any(Number),
        sr: undefined
      })
    });

    it('timer should send correct data', () => {
      const timerFunction = sut.timer('stat1');
      timerFunction();
      expect(spy).toHaveBeenCalledWith({
        action: 't',
        name: 'testPrefix.stat1',
        value: jasmine.any(Number),
        sr: undefined
      })
    });
  });
});
