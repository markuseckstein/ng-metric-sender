import { NgMetricSenderPage } from './app.po';

describe('ng-metric-sender App', () => {
  let page: NgMetricSenderPage;

  beforeEach(() => {
    page = new NgMetricSenderPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to metric!!'))
      .then(done, done.fail);
  });
});
