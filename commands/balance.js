const fs = require('fs');

module.exports = {
	name: 'balance',
	description: 'Checks the user\'s gCoin',
	aliases: ['bal', 'bank'],
	usage: '',
	args: false,
	execute(message) {
		const rawdata = fs.readFileSync('./ledger.json');
		const ledgerArray = JSON.parse(rawdata);
		const id = message.author.id;

		ledgerArray.forEach((item) => {
			if (item.id == id) {
				return message.channel.send('You have `' + item.gCoin + '` gCoin in your account.');
			}
		});
	},
};
