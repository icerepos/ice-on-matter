let fs = require('fs-extra');

async function writeToFile (filename, type, content) {
	await new Promise((resolve, reject) => {
		if (type && type === 'json') content = JSON.stringify(content, null, 4);
		fs.writeFile(`data/${filename}${type ? '.' : ''}${type}`, content, (err) => {
			if (err) reject(err);
			else {
				resolve();
				console.log(`${filename}${type ? '.' : ''}${type} successfully written!`);
			}
		});
	});
}

module.exports = {
	writeToFile,
}
