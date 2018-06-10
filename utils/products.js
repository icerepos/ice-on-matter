const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const _ = require('lodash');
const jsonToCSV = require('json-2-csv');
const csvjson = require('csvjson');
const { writeToFile } = require('./utils');

const syncBestSellers = async (filePath, flatProducts) => {
  let csvData = fs.readFileSync(filePath, { encoding : 'utf8'});
  let jsonData = csvjson.toObject(csvData);

  console.log("Total Products -> " + jsonData.length);
  let resultData = _.flatten(_.map(flatProducts, function(item) {
    return _.filter(jsonData, item);
  }));

  console.log("Filtered Products -> " + resultData.length);
  let csv = await new Promise((resolve, reject) => {
    jsonToCSV.json2csv(resultData, function (error, csv) {
      if (error) reject(error);
      else {
        resolve(csv);
      }
    }, {
      delimiter: ','
    });
  });
  await writeToFile('shopify-filtered', 'csv', csv);
}

async function download (file, writeFilePath) {
  const res = await fetch(file);
  await new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(writeFilePath);
    res.body.pipe(fileStream);
    res.body.on('error', (err) => {
      reject(err);
    });
    fileStream.on('finish', () => {
      resolve();
      console.log('CSV downloaded successfully!');
    });
  });
}

const downloadShopifyCSV = async (csvURL, writeFilePath) => {
  try {
    fs.unlink(writeFilePath);
  } catch (e) {}
  await download(csvURL, writeFilePath);
};

module.exports = {
  downloadShopifyCSV,
  syncBestSellers,
}
