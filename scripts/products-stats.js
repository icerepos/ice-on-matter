const fse = require('fs-extra');
const csvToJson = require('convert-csv-to-json');

const writeDataToFile = (data, filename, sheetname) => {
  fse.outputFile(`json/${filename}/${sheetname}.json`, JSON.stringify(data), 'utf8', function (error) {
    if (error) console.error(error);
  });
};

const callParse = (filename) => {
  let fileInputName = `${__dirname}/../data/${filename}.csv`;
  let fileOutputName = `${__dirname}/../json/${filename}.json`;
  let csvtoJsonDelimiter = csvToJson.fieldDelimiter(',');
  let categories = [], vendors = [], categoryCount = {}, vendorCount = {};
  let productWithVariantLength = 0, productLength = 0;
  let jsonData = csvtoJsonDelimiter.getJsonFromCsv(fileInputName);
  let lastID = -1;

  for (let i = 0; i < jsonData.length; i++) {
    let type = (jsonData[i].Type || '').replace(/\"/g, ''), vendor = (jsonData[i].Vendor || '').replace(/\"/g, '');
    if (jsonData[i]['\"VariantSKU\"']) productWithVariantLength++;
    if (jsonData[i]['\"VariantSKU\"'] && jsonData[i].Handle && lastID !== jsonData[i].Handle) {
      lastID = jsonData[i].Handle;
      productLength++;
    }
    if (type) {
      if (!categoryCount[type]) categoryCount[type] = 1;
      else categoryCount[type]++;
      if (categories.indexOf(type) <= -1) {
        categories.push(type);
      }
    }
    if (vendor) {
      if (!vendorCount[vendor]) vendorCount[vendor] = 1;
      else vendorCount[vendor]++;
      if (vendors.indexOf(vendor) <= -1) {
        vendors.push(vendor);
      }
    }
  }
  console.log('Products Length      : ' + productLength);
  console.log('Products Variants    : ' + productWithVariantLength);
  console.log('Category Length      : ' + categories.length);
  console.log('Vendor Length        : ' + vendors.length);
  writeDataToFile(jsonData, filename, 'index');
  writeDataToFile(categories, filename, 'category');
  writeDataToFile(vendors, filename, 'vendor');
  writeDataToFile(categoryCount, filename, 'categoryCount');
  writeDataToFile(vendorCount, filename, 'vendorCount');
};

const init = () => {
  let filename = process.argv.length > 2 ? process.argv[2] : '';
  if (filename) {
    callParse(filename);
  } else {
    filename = 'shopify-filtered';
    callParse(filename);
  }
};

init();
