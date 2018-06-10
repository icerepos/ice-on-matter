const { downloadShopifyCSV, syncBestSellers } = require('./utils/products');
const constants = require('./utils/constants');
const { parseAllPages } = require('./utils/best-sellers');
const argv = require('yargs').argv;

const startMagic = async () => {
  if (argv.download !== undefined) {
    await downloadShopifyCSV(constants.csvURL, constants.dataFileLoc);
  }
  let flatProducts = await parseAllPages(constants.bestURL);
  await syncBestSellers(constants.dataFileLoc, flatProducts);
}

startMagic();
