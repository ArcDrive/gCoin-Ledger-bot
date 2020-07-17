const fs = require('fs');

module.exports = {
	name: 'pay',
	description: 'Transferrs gCoin from one user to another within the gCoin system. Allows users to complete large financial transactions within the system without paying the 1% tax to convert into in-game currency first',
	usage: '@[user] [amount]',
	args: true,
	execute(message, args) {
		const payAmount = parseInt(args[1]);

		if (isNaN(payAmount)) {
			return message.channel.send('`' + args[1] + '` can not be converted to a number. Please enter a numerical value.');
		}

		let ledgerArray = [];
		let payer = -1;
		let receiver = -1;
		const rawdata = fs.readFileSync('./ledger.json');
		ledgerArray = JSON.parse(rawdata);

		ledgerArray.forEach((item, i) => {
			if (item.id == message.author.id) {
				payer = i;
			}
			if (item.mention == args[0]) {
				receiver = i;
			}
		});

		if (payer == -1) {
			return message.reply('you aren\'t in the system. Please make a deposit first.');
		}

		if (receiver == -1) {
			return message.channel.send(args[0] + ' is not in the system. They need to make a deposit before they can interact in the `gCoin` economy');
		}

		if (ledgerArray[payer].gCoin < payAmount) {
			return message.reply('you do not have enough gCoin to make this payment. Your current balance is: `' + ledgerArray[payer].gCoin + '`');
		}

		ledgerArray[payer].gCoin -= payAmount;
		ledgerArray[receiver].gCoin += payAmount;

		message.channel.send('Payment successfull: `' + payAmount + ' gCoin` transferred from ' + ledgerArray[payer].mention + ' to ' + ledgerArray[receiver].mention + '.');

		const data = JSON.stringify(ledgerArray);

		fs.writeFile('./ledger.json', data, (err) => {
			if (err) {
				console.log(err);
			}
			else {
				console.log('File written successfully');
			}
		});
	},
};
