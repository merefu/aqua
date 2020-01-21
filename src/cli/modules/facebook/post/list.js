const FB = require('@root/fb');
const moment = require('moment');

module.exports = exports = {
    command: 'list',
    describe: 'Get a list of a page\'s posts',
    builder: yargs => yargs
    	.options({
            until: {
                describe: 'Only fetch posts before this time',
                type: 'string',
            },
            since: {
                describe: 'Only fetch posts starting from this time',
                type: 'string',
            },
    	})
        .coerce(['until', 'since'], input => moment(input, [moment.ISO_8601, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS, 'YYYY/MM/DD HH:mm:ss'], true))
        .check(argv => {
            if(argv.until && !argv.until.isValid()) throw new Error('Invalid until time specified');
            if(argv.since && !argv.since.isValid()) throw new Error('Invalid since time specified');
            return true;
        })
        .help(),
    handler: async argv => {
        const fbHelper = new FB.Helper(new FB(), argv.accessToken);
        const posts = await fbHelper.getPosts(argv.object, argv.edge, {
            ...(argv.until && { until: moment(argv.until).unix() }),
            ...(argv.since && { since: moment(argv.since).unix() }),
        });

        switch(argv.outputFormat) {
            case 'json':
                console.log(JSON.stringify(posts));
                break;

            case 'text':
                console.log('Created Time\tID\tMessage');
                console.log(posts.map(post => `${post.created_time}\t${post.id}\t${post.message}`).join('\r\n'));
                break;
        }
    },
};
