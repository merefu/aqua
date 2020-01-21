const FB = require('@root/fb');

module.exports = exports = {
    command: 'create',
    describe: 'Make a page post',
    builder: yargs => yargs
    	.options({
            message: {
                describe: 'Message',
                type: 'string',
            },
            link: {
                describe: 'Link',
                type: 'string',
            },
            publishTime: {
                describe: 'Publish Time',
                type: 'string'
            },
    	})
        .coerce('publishTime', input => moment(input, [moment.ISO_8601, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS, 'YYYY/MM/DD HH:mm:ss'], true))
        .check(argv => {
            if(argv.publishTime && !argv.publishTime.isValid()) throw new Error('Invalid publishTime specified');
            if(!(argv.message || argv.link)) throw new Error('Must pass either message or link');
            return true;
        }),
    handler: async argv => {
        const fbHelper = new FB.Helper(new FB(), argv.accessToken);
        const req = await fbHelper.publishPost(argv.object, argv.edge, {
            ...(argv.message && { message: argv.message }),
            ...(argv.link && { link: argv.link }),
            ...(argv.publishTime && { scheduled_publish_time: argv.publishTime.unix() }),
        });
        const data = req.data;

        switch(argv.outputFormat) {
            case 'json':
                console.log(data);
                break;

            case 'text':
                console.log(`Successfully created post. Post ID: ${data.id}`);
                break;
        }
    },
};
