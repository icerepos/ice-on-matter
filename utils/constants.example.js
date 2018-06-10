const path = require('path');
let fileloc = './../data/shopify.csv';

module.exports = {
  'csvURL': 'localhost/shopify.csv',
  'dataFileLoc': path.join(__dirname, fileloc),
  'bestURL': [
  	'localhost/clothing.html',
  	'localhost/footwear.html',
  ],
};
