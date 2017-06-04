import { browser, by, element } from 'protractor';

export class NgMetricSenderPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('metric-root h1')).getText();
  }
}
