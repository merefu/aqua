const FB = require('@root/fb');
const fs = require('fs');
const moment = require('moment');

module.exports = exports = {
    command: 'create',
    describe: 'Upload a photo',
    builder: yargs => yargs
    	.options({
            message: {
                describe: 'Message',
                type: 'string',
            },
            source: {
                describe: 'Path to image file',
                type: 'string',
            },
            url: {
                describe: 'Image url',
                type: 'string',
            },
            publishTime: {
                describe: 'Publish Time',
                type: 'string'
            },
    	})
        .coerce({
            publishTime: input => moment(input, [moment.ISO_8601, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS, 'YYYY/MM/DD HH:mm:ss'], true),
        })
        .check(argv => {
            if(argv.publishTime && !argv.publishTime.isValid()) throw new Error('Invalid publishTime specified');
            if(!(argv.source || argv.url)) throw new Error('Must pass either source or url');
            if(argv.source && argv.url) throw new Error('source and url are exclusive');
            return true;
        }),
    handler: async argv => {
        const fbHelper = new FB.Helper(new FB(), argv.accessToken);
        const req = await fbHelper.publishPhoto(argv.object, argv.edge, {
            ...(argv.message && { message: argv.message }),
            ...(argv.source && { source: argv.source }),
            ...(argv.url && { url: argv.url }),
            ...(argv.publishTime && { scheduled_publish_time: argv.publishTime.unix() }),
        });
        const data = req.data;

        switch(argv.outputFormat) {
            case 'json':
                console.log(data);
                break;

            case 'text':
                console.log(data.id);
                console.log(data.post_id);
                break;
        }
    },
};
