import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MetricSenderModule} from './metric-sender/metric-sender.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MetricSenderModule.forRootWithUrl('http://localhost:8124'),
    MetricSenderModule.forChildWithPrefix('testPrefix')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
