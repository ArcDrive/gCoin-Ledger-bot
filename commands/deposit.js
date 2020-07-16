const fs = require('fs');

module.exports = {
	name: 'deposit',
	description: '[Ledger Manager only] deposits gCoin into a user\'s account',
	usage: '@[user] [amount]',
	cooldown: 0,
	args: true,
	execute(message, args) {

		const ledgerManagerId = 234116673102282752;

		if (message.author.id != ledgerManagerId) {
			console.log('Unauthorized deposit attempt. Offender\'s id: ' + message.author.id + ' Your id: ' + ledgerManagerId);
			return message.channel.send('Sorry, you aren\'t a ledger manager! Please contact an official ledger manager to deposit gCoin.');
		}

		let ledgerArray = [];
		let foundMatch = false;

		const rawdata = fs.readFileSync('./ledger.json');
		ledgerArray = JSON.parse(rawdata);

		ledgerArray.forEach((item) => {
			if (item.mention == args[0]) {
				foundMatch = true;
				item.gCoin += parseInt(args[1]);
				message.channel.send('Deposited `' + args[1] + '` gCoin in ' + args[0] + '\'s account.');
			}
		});

		if (!foundMatch) {
			message.channel.send('User ' + args[0] + ' not found in existing file. Adding entry.');

			let id = args[0];

			if (id.startsWith('<@') && id.endsWith('>')) {
				id = id.slice(2, -1);

				if (id.startsWith('!')) {
					id = id.slice(1);
				}
				id = parseInt(id);
			}


			const player = {
				id: id,
				mention: args[0],
				gCoin: parseInt(args[1]),
			};

			ledgerArray.push(player);
		}

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
