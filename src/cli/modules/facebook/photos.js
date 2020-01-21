module.exports = exports = {
    command: 'photos',
    describe: 'Photos',
    builder: yargs => yargs
        .commandDir('photos')
        .options({
        	object: {
        		describe: 'Object',
        		type: 'string',
        		default: 'me',
        	},
        	edge: {
        		describe: 'Edge',
        		choices: ['photos'],
        		default: 'photos',
        	},
        })
        .updateStrings({'Commands:': 'Commands:'})
        .demandCommand(1, ''),
    handler: argv => {},
};