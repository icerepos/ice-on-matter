const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const { writeToFile } = require('./utils');

function parsePage($) {
	let products = [];
	$('.box-product').each(function(i, elem) {
		products[i] = {
			id: parseInt($(this).find('span').eq(0).text().trim().split('id_art')[1]),
			versions: [],
		};
		$(this).find('.product-versions').find('ul').each(function(j, velem) {
			products[i].versions.push(parseInt($(this).attr('optionsfor')));
		});
	});
	return products;
}

async function flattenProducts(products) {
	let flattenArray = [];
	let productLength = products.length;
	products.forEach(function(item) {
		productLength += item.versions.length;
		flattenArray.push({
			Handle: `${item.id}`
		});
		item.versions.forEach(function(vers) {
			flattenArray.push({
				Handle: `${vers}`
			});
		});
	});
	await writeToFile('flat-products', 'json', flattenArray);
	console.log('Products Length      : ' + productLength);
	return flattenArray;
}

const parseAllPages = async (inputArray) => {
	let promises = [], jsonResponse = [];
	inputArray.forEach(function(item, i) {
		promises[i] = axios.get(item);
	});
	const resolveArray = await Promise.all(promises);

	resolveArray.forEach(function(response, i) {
		if(response.status === 200) {
			var html = response.data;
      let $ = cheerio.load(html);
			jsonResponse[i] = parsePage($);
		}
	});
	await writeToFile('products', 'json', ...jsonResponse);
	return await flattenProducts(...jsonResponse);
};

module.exports = {
	parseAllPages,
}
