const fs = require('fs');

module.exports = {
	name: 'withdraw',
	description: '[Ledger Manager Only] Withdraws gCoin from a user\'s account. PLEASE NOTE: THERE IS A 1% TAX ON WITHDRAWALS. THIS COMMAND ONLY SUBMITS A REQUEST, THE MONEY WILL BE GIVEN THROUGH THE IN-GAME LEDGER MANAGER',
	usage: '@[user] [amount]',
	cooldown: 0,
	args: true,
	execute(message, args) {

		const ledgerManagerId = 234116673102282752;

		if (message.author.id != ledgerManagerId) {
			console.log('Unauthorized withdrawal attempt. Offender\'s id: ' + message.author.id + ' Your id: ' + ledgerManagerId);
			return message.channel.send('Sorry, you aren\'t a ledger manager! Please contact an official ledger manager to withdraw gCoin.');
		}

		const withdrawAmount = parseInt(args[1]);
		const tax = Math.floor(withdrawAmount * 0.01);
		const total = withdrawAmount + tax;
		let gCoin = 0;

		let ledgerArray = [];
		const rawdata = fs.readFileSync('./ledger.json');
		ledgerArray = JSON.parse(rawdata);

		ledgerArray.forEach((item) => {
			if(item.mention == args[0]) {
				gCoin = item.gCoin;
				if (gCoin >= total) {
					item.gCoin -= total;
					message.channel.send([
						'Withdraw amount: `' + withdrawAmount + '`',
						'Tax: `' + tax + '`',
						'Total gCoin deducted from account: `' + total + '`',
						args[0] + '\'s remaining balance: `' + item.gCoin + '`',
					]);
				}
				else {
					message.channel.send([
						args[0] + ' does not have enough gCoin in their account.',
						'Withdraw amount: `' + withdrawAmount + '`',
						'Tax: `' + tax + '`',
						'Total gCoin attempted to remove from account: `' + total + '`',
						args[0] + '\'s balance: `' + gCoin + '`',
					]);
				}
			}
		});

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
