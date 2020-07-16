const fs = require('fs');

module.exports = {
	name: 'checkbalance',
	description: '[Ledger Manager only] Checks another user\'s gCoin',
	aliases: ['checkbal', 'checkbank', 'cbal'],
	usage: '@[user]',
	args: true,
	execute(message, args) {
		const rawdata = fs.readFileSync('./ledger.json');
		const ledgerArray = JSON.parse(rawdata);

		const ledgerManagerId = 234116673102282752;

		if (message.author.id != ledgerManagerId) {
			console.log('Unauthorized balanceCheck attempt. Offender\'s id: ' + message.author.id + ' Your id: ' + ledgerManagerId);
			return message.channel.send('You aren\'t a ledger manager! Stop prying into other people\'s business!');
		}

		ledgerArray.forEach((item) => {
			if (item.mention == args[0]) {
				return message.channel.send(args[0] + ' has `' + item.gCoin + '` `gCoin` in their account.');
			}
		});
	},
};
