module.exports = exports = {
    command: 'facebook',
    describe: 'Facebook',
    builder: yargs => yargs
    	.commandDir('facebook')
    	.options({
    		accessToken: {
    			describe: 'Access Token',
    			type: 'string',
    			demandOption: true,
    		},
    		outputFormat: {
    			alias: 'f',
    			describe: 'Output format for commands',
    			choices: ['text', 'json'],
    			default: 'text',
    		},
    	})
    	.updateStrings({'Commands:': 'Categories:'})
    	.demandCommand(1, ''),
    handler: argv => {},
};
