'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
const alpha = require('../')();

test(`sector performance data works`, () => {
  expect.assertions(11);
  return alpha.performance.sector().then(data => {
    expect(data['Meta Data']).toBeDefined();
    expect(data['Rank A: Real-Time Performance']).toBeDefined();
    expect(data['Rank B: 1 Day Performance']).toBeDefined();
    expect(data['Rank C: 5 Day Performance']).toBeDefined();
    expect(data['Rank D: 1 Month Performance']).toBeDefined();
    expect(data['Rank E: 3 Month Performance']).toBeDefined();
    expect(data['Rank F: Year-to-Date (YTD) Performance']).toBeDefined();
    expect(data['Rank G: 1 Year Performance']).toBeDefined();
    expect(data['Rank H: 3 Year Performance']).toBeDefined();
    expect(data['Rank I: 5 Year Performance']).toBeDefined();
    expect(data['Rank J: 10 Year Performance']).toBeDefined();
  });
});