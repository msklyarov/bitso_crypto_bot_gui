const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const { path, pick, pipe, map } = require('ramda');

class BitsoApi {
  constructor(key, secret, useDevServer) {
    this.key = key;
    this.secret = secret;
    this.useDevServer = useDevServer;
  }

  getBaseServerUrl() {
    return this.useDevServer ? 'https://api-dev.bitso.com' : 'https://api.bitso.com';
  }

  getAuthHeader(httpMethod, requestPath, jsonPayload = '') {
    const nonce = new Date().getTime();

    // Create the signature
    const Data = nonce + httpMethod + requestPath + jsonPayload;

    const signature = crypto.createHmac('sha256', this.secret).update(Data).digest('hex');

    // Build the auth header
    return `Bitso ${this.key}:${nonce}:${signature}`;
  };

  async loadBtcBalance() {
    const httpMethod = 'GET';
    const apiEndPoint = '/v3/balance/';

    const authHeader = this.getAuthHeader(httpMethod, apiEndPoint);

    const result = await axios({
      url: `${this.getBaseServerUrl()}${apiEndPoint}`,
      method: httpMethod,
      headers: {
        'Authorization': authHeader
      }
    });

    const availableBtc = path(['data', 'payload', 'balances'], result)
      .find(item => item.currency == 'btc')
      .available;

    return Number(availableBtc);
  };

  async getBtcMxnAsk() {
    const httpMethod = 'GET';
    const apiEndPoint = '/v3/ticker/';

    const result = await axios({
      url: `${this.getBaseServerUrl()}${apiEndPoint}`,
      method: httpMethod,
      params: {
        book: 'btc_mxn'
      },
      headers: {
        'Content-type': 'application/json',
      }
    });

    const ticker = path(['data', 'payload', 'ask'], result)

    return Number(ticker);
  };

  async getBtcMxnOpenOrders() {
    const httpMethod = 'GET';
    const apiEndPoint = '/v3/open_orders?book=btc_mxn';

    const authHeader = this.getAuthHeader(httpMethod, apiEndPoint);

    const result = await axios({
      url: `${this.getBaseServerUrl()}${apiEndPoint}`,
      method: httpMethod,
      headers: {
        'Content-type': 'application/json',
        'Authorization': authHeader
      }
    });

    const books = pipe(
      path(['data', 'payload']),
      map(pick(['oid', 'price', 'original_amount']))
    )(result);

    return books;
  };

  async cancelOrders(oids) {
    const httpMethod = 'DELETE';
    const apiEndPoint = `/v3/orders/${oids.join('-')}`;

    const authHeader = this.getAuthHeader(httpMethod, apiEndPoint);

    const result = await axios({
      url: `${this.getBaseServerUrl()}${apiEndPoint}`,
      method: httpMethod,
      headers: {
        'Content-type': 'application/json',
        'Authorization': authHeader
      }
    });

    return result;
  };

  async placeSellBtcMxnOrder (amount, price) {
    const httpMethod = 'POST';
    const apiEndPoint = '/v3/orders/';

    const jsonPayload = JSON.stringify({
      price,
      book: 'btc_mxn',
      type: 'limit',
      major: amount,
      side: 'sell',
    });

    const authHeader = this.getAuthHeader(httpMethod, apiEndPoint, jsonPayload);

    const result = await axios({
      url: `${this.getBaseServerUrl()}${apiEndPoint}`,
      method: httpMethod,
      headers: {
        'Content-type': 'application/json',
        'Authorization': authHeader
      },
      data: jsonPayload
    });

    return result;
  };
}

const jsonFileToObj = (inputFileName) => {
  let jsonDb = {};
  if (fs.existsSync(inputFileName)) {
    jsonDb = JSON.parse(fs.readFileSync(inputFileName));
  } else {
    console.log(`\nInput file name ${inputFileName} doesn't exist`);
    process.exit(1);
  }

  return jsonDb;
};

module.exports = {
  jsonFileToObj,
  BitsoApi,
};

