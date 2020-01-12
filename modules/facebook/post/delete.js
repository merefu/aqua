const FB = require('@root/fb');

module.exports = exports = {
    command: 'delete <id>',
    describe: 'Delete a post',
    builder: yargs => yargs
    	.option('dryrun', {
    		alias: 'd',
    		describe: 'Do a test run, does not actually post or alter anything',
    		type: 'boolean',
    		nargs: 0,
    		default: false,
    	}),
    handler: async argv => {
        const fbHelper = new FB.Helper(new FB(), argv.accessToken);
        await fbHelper.deletePost(argv.id);
    },
};
