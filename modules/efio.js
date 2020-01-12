module.exports = exports = {
    command: 'efio',
    describe: 'Every Frame In Order',
    builder: yargs => yargs
    	.commandDir('efio')
    	.updateStrings({'Commands:': 'Commands:'})
    	.demandCommand(1, ''),
    handler: argv => {},
};
