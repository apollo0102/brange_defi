const { default: axios } = require('axios');
const CoinGecko = require('coingecko-api');

export const getCoinGeckoPrices = async () => {
  const CoinGeckoClient = new CoinGecko();
  let data = await CoinGeckoClient.exchanges.fetchTickers('bitfinex', {
    coin_ids: ['bitcoin', 'ethereum', 'ripple', 'litecoin', 'stellar']
  });
  var _coinList = {};
  var _datacc = data.data.tickers.filter(t => t.target === 'USD');
    [
        'BTC',
        'BNB',
        'binancecoin',
        'BINANCECOIN',
        'ETH',
        'BDT',
        'XRP',
        'LTC',
        'XLM',
    ].forEach((i) => {
        var _temp = _datacc.filter(t => t.base == i);
        var _res = _temp.length == 0 ? [] : _temp[0];
        _coinList[i] = _res.last;
    })
  // console.log(_coinList);
  // console.log(_coinList["ETH"]);
  // https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd
  axios
  .get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd', {})
  .then((response) => {
    // console.log(response.data)
    // console.log(response.data["binancecoin"]["usd"])
  })
  .catch((error) => {
    console.log(error)
  })
}


// getCoinGeckoPrices();