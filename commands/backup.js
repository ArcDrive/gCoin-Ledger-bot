const fs = require('fs');

module.exports = {
	name: 'backup',
	description: '[Ledger Manager only] Creates a backup.',
	aliases: [],
	usage: '',
	args: false,
	execute(message) {
		const rawdata = fs.readFileSync('./ledger.json');
		const ledgerArray = JSON.parse(rawdata);

		const ledgerManagerId = 234116673102282752;

		if (message.author.id != ledgerManagerId) {
			console.log('Unauthorized balanceCheck attempt. Offender\'s id: ' + message.author.id + ' Your id: ' + ledgerManagerId);
			return message.channel.send('You aren\'t a ledger manager!');
		}

		const data = JSON.stringify(ledgerArray);
		const timeInSec = Date.now() / 1000 | 0;

		fs.writeFile('./backups/ledgerBackup' + timeInSec, data, (err) => {
			if (err) {
				console.log(err);
			}
			else {
				console.log('Backup created successfully.');
				message.channel.send('Backup created successfully.');
			}
		});
	},
};
