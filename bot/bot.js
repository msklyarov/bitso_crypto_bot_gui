const { jsonFileToObj, BitsoApi } = require('./utils');

const config = jsonFileToObj('./config.json');
const bitsoApi = new BitsoApi(config.key, config.secret, config.useDevServer);

(async () => {
  let btcCount = await bitsoApi.loadBtcBalance();
  console.log('Available balance in BTC: ', btcCount);

  const lowestAsk = await bitsoApi.getBtcMxnAsk();
  console.log('Lowest sell order price (BTC/MXN): ', lowestAsk);

  const openOrders = await bitsoApi.getBtcMxnOpenOrders();
  const openOrdersAboveLowestPrice = openOrders.filter(order => order.price !== lowestAsk - 0.01);

  // cancel BTC orders above lowest price
  if (openOrdersAboveLowestPrice.length > 0) {
    console.log('Cancel open BTC/MXN orders: ', JSON.stringify(openOrdersAboveLowestPrice, null, 2));

    const cancelResult = await bitsoApi.cancelOrders(
      openOrdersAboveLowestPrice.map(order => order.oid));

    console.log('Cancel result: ', cancelResult.statusText);
    btcCount = await bitsoApi.loadBtcBalance();
    console.log('New available balance in BTC: ', btcCount);
  }

  if (btcCount > 0) {
    // create orders for selling of BTC
    const sellBtcAmount = Math.min(btcCount, config.btcOrderAmount);
    console.log('Creating order for BTC amount: ', sellBtcAmount);

    const placeResult = await bitsoApi.placeSellBtcMxnOrder(
      sellBtcAmount, lowestAsk - 0.01);

    console.log('Place order result: ', placeResult.statusText);
  }
})();
