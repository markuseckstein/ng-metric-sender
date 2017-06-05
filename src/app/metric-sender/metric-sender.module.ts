import {ModuleWithProviders, NgModule} from '@angular/core';
import {METRIC_SENDER_PREFIX, MetricService} from './metric.service';
import {ConsoleSender} from './sender/console-sender';
import {METRIC_SENDER_TOKEN} from './sender/sender';
import {WEBSOCKET_SENDER_URL_TOKEN, WebsocketSender} from './sender/websocket-sender';

@NgModule({
  imports: [],
  declarations: []
})
export class MetricSenderModule {
  public static forRootWithUrl(url = 'http://localhost:8885'): ModuleWithProviders {
    return {
      ngModule: MetricSenderModule,
      providers: [
        {provide: WEBSOCKET_SENDER_URL_TOKEN, useValue: url},
        {provide: METRIC_SENDER_TOKEN, useClass: WebsocketSender, multi: true},
        {provide: METRIC_SENDER_TOKEN, useClass: ConsoleSender, multi: true}
      ]
    }
  }

  public static forChildWithPrefix(prefix: string = null): ModuleWithProviders {
    return {
      ngModule: MetricSenderModule,
      providers: [
        {provide: METRIC_SENDER_PREFIX, useValue: prefix},
        MetricService
      ]
    }
  }
}
