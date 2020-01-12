module.exports = exports = {
    command: 'comments',
    describe: 'Comments',
    builder: yargs => yargs
        .commandDir('comments')
        .options({
        	object: {
        		describe: 'Object',
        		type: 'string',
                demandOption: true,
        	},
        })
        .updateStrings({'Commands:': 'Commands:'})
        .demandCommand(1, ''),
    handler: argv => {},
};