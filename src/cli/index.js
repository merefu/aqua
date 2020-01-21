require('module-alias/register');
require('dotenv').config();

const yargs = require('yargs');
const argv = yargs.usage('usage: $0 <module>')
	.options({
		configurationFile: {
			alias: 'c',
			describe: 'Configuration file path',
			type: 'text',
			default: 'aqua.json'
		},
	})
	.commandDir('modules')
	.help(false)
	.version(false)
	.updateStrings({
		'Commands:': 'Modules:',
	})
	.wrap(null)
	.demandCommand(1, 'No module specified')
	.argv;