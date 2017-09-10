'use strict';

/**
 * Time stamp regex that AlphaVantage uses.
 */
const timestamp = /[0-9]{4}-[0-9]{2}-[0-9]{2}( [0-9]{2}:[0-9]{2}:[0-9]{2})?/g;

/**
 * The data keys to replace from the AlphaVantage API.
 */
const keys = {
  'Meta Data': 'meta',
  '1. Information': 'information',
  Information: 'information',
  '2. Symbol': 'symbol',
  '3. Last Refreshed': 'updated',
  'Last Refreshed': 'updated',
  '4. Interval': 'interval',
  '4. Output Size': 'size',
  '5. Output Size': 'size',
  '4. Time Zone': 'zone',
  '5. Time Zone': 'zone',
  '6. Time Zone': 'zone',
  'Time Series (1min)': 'data',
  'Time Series (Daily)': 'data',
  'Weekly Time Series': 'data',
  'Monthly Time Series': 'data',
  '1. open': 'open',
  '2. high': 'high',
  '3. low': 'low',
  '4. close': 'close',
  '5. volume': 'volume',
  '6. volume': 'volume',
  '5. adjusted close': 'adjusted',
  '7. dividend amount': 'dividend',
  '8. split coefficient': 'split',
  'Rank A: Real-Time Performance': 'real',
  'Rank B: 1 Day Performance': '1day',
  'Rank C: 5 Day Performance': '5day',
  'Rank D: 1 Month Performance': '1month',
  'Rank E: 3 Month Performance': '3month',
  'Rank F: Year-to-Date (YTD) Performance': 'ytd',
  'Rank G: 1 Year Performance': '1year',
  'Rank H: 3 Year Performance': '3year',
  'Rank I: 5 Year Performance': '5year',
  'Rank J: 10 Year Performance': '10year'
};

module.exports = config => {
  /**
   * Recursively walk the data tree and replace weird keys with a normalized set.
   * 
   * @param {Object|String|Number} data
   *   The data to normalize.
   * 
   * @returns {Object|String|Number}
   *   Normalized data.
   */
  const polish = data => {
    // If this is not an object, dont recurse.
    if (typeof data !== 'object') {
      return data;
    }

    // If the data is a complex object, walk all subtrees to normalize all branches.
    let clean = {};
    Object.keys(data).forEach(key => {
      // If the key is a date time string, convert it to an iso timestamp.
      if (timestamp.test(key.toString())) {
        clean[new Date(key.toString()).toISOString()] = polish(data[key]);
        return;
      }

      clean[keys[key] || key] = polish(data[key]);
    });

    return clean;
  };

  /**
   * Util function to build the proper API url.
   * 
   * @param {String} fn
   *   The API function to use
   * @param {String} symbol
   *   The stock symbol to use
   * @param {String} size
   *   The data size to get
   * @param {String} type
   *   The data type to fetch
   * @param {String} interval
   *   The time interval to use
   * 
   * @returns {String}
   *   The API url to use for a given function and input parameters.
   */
  const url = (fn, symbol, size, type, interval) => {
    let params = [];

    if (fn !== undefined) {
      params.push(`function=${fn}`);
    }
    if (symbol !== undefined) {
      params.push(`symbol=${symbol}`);
    }
    if (size !== undefined) {
      params.push(`outputsize=${size}`);
    }
    if (type !== undefined) {
      params.push(`datatype=${type}`);
    }
    if (interval !== undefined) {
      params.push(`interval=${interval}`);
    }

    return `${config.base}${params.join('&')}`;
  };

  return {
    url,
    polish
  };
};