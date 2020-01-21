const FB = require('@root/fb');

module.exports = exports = {
    command: 'create',
    describe: 'Make a page post',
    builder: yargs => yargs
    	.options({
            attachmentId: {
                describe: 'An optional ID of a unpublished photo (see no_story field in /{user-id}/photos) uploaded to Facebook to include as a photo comment.',
                type: 'string',
            },
            attachmentShareUrl: {
                describe: 'The URL of a GIF to include as a animated GIF comment.',
                type: 'string',
            },
            attachmentUrl: {
                describe: 'The URL of an image to include as a photo comment.',
                type: 'string',
            },
            source: {
            	describe: 'A photo, encoded as form data, to use as a photo comment.',
            	type: 'string',
            },
            message: {
                describe: 'The comment text. Mention other Facebook Pages in your message text using the following syntax: @[page-id]',
                type: 'string',
            },
    	})
        .check(argv => {
        	if(!(argv.attachmentId || argv.attachmentShareUrl || argv.attachmentUrl || argv.source || argv.message)) throw new Error('One of attachment_id, attachment_share_url, attachment_url, message, or source must be provided when publishing.');
            return true;
        }),
    handler: async argv => {
        const fbHelper = new FB.Helper(new FB(), argv.accessToken);
        const data = await fbHelper.publishComment(argv.object, {
            ...(argv.attachmentId && { attachment_id: argv.attachmentId }),
            ...(argv.attachmentShareUrl && { attachment_share_url: argv.attachmentShareUrl }),
            ...(argv.attachmentUrl && { attachment_url: argv.attachmentUrl }),
            ...(argv.source && { source: argv.source }),
            ...(argv.message && { message: argv.message }),
        });

        switch(argv.outputFormat) {
            case 'json':
                console.log(JSON.stingify(data));
                break;

            case 'text':
                console.log(`Successfully posted comment. Comment ID: ${data.id}`);
                break;
        }
    },
};
