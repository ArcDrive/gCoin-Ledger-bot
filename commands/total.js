const fs = require('fs');

module.exports = {
	name: 'total',
	description: 'The total amount of `gCoin` in the system',
	usage: '',
	args: false,
	execute(message) {
		const rawdata = fs.readFileSync('./ledger.json');
		const ledgerArray = JSON.parse(rawdata);

		let total = 0;

		ledgerArray.forEach((item) => {
			total += item.gCoin;
		});

		message.channel.send('The total amount of `gCoin` in the system is: ```' + total + '```');
	},
};
