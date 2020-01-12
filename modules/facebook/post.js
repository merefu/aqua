module.exports = exports = {
    command: 'post',
    describe: 'Post',
    builder: yargs => yargs
        .commandDir('post')
        .options({
        	object: {
        		describe: 'Object',
        		type: 'string',
        		default: 'me',
        	},
        	edge: {
        		describe: 'Edge',
        		choices: ['feed', 'scheduled_posts'],
        		default: 'feed',
        	},
        })
        .updateStrings({'Commands:': 'Commands:'})
        .demandCommand(1, ''),
    handler: argv => {},
};