const FB = require('@root/fb');
const video = require('@root/video');
const fs = require('fs');
const moment = require('moment');

function getNextFrame(config, status) {
    status = {...status};

    if(status.ended) return status;

    const data = config.data,
          currentSeason = data.seasons[status.season],
          currentEpisode = currentSeason.episodes[status.episode],
          currentFrame = status.frame;

    const frameCount = currentEpisode.frames;

    status.frame += 1;

    if(status.frame > frameCount - 1) {
        status.frame = 0;
        status.episode += 1;
    }

    if(status.episode > currentSeason.episodes.length - 1) {
        status.episode = 0;
        status.season += 1;
    }

    if(status.season > data.seasons.length) {
        status.season = data.seasons.length - 1;
        status.episode = data.seasons[status.season].length - 1;
        status.frame = data.seasons[status.season].episodes[status.episode].frames;
        status.ended = true;
    }

    return status;
}

function calculateNeededFrames(config, status, count) {
    let neededFrames = [],
        currentStatus = status;

    for(let i = 0; i < count; ++i) {
        currentStatus = getNextFrame(config, currentStatus);
        neededFrames.push(currentStatus);
    }

    return neededFrames;
}

async function extractNeededFrames(config, frames) {
    let groupedFrames = {},
        neededFrames = {};

    for(let frame of frames) {
        if(!groupedFrames[frame.season]) groupedFrames[frame.season] = {};
        if(!groupedFrames[frame.season][frame.episode]) groupedFrames[frame.season][frame.episode] = [];
        groupedFrames[frame.season][frame.episode].push(frame.frame);
    }

    for(let season in groupedFrames) {
        for(let episode in groupedFrames[season]) {
            const file = config.data.seasons[season].episodes[episode].file;   

            console.log(`Fetching ${groupedFrames[season][episode].length} frames for Season ${season} Episode ${episode}`);
            if(!neededFrames[season]) neededFrames[season] = {};
            neededFrames[season][episode] = await video.extractFrames(file, groupedFrames[season][episode]);
        }
    }

    return neededFrames;
}

module.exports = exports = {
    command: 'schedule',
    describe: 'Run schedule job',
    builder: yargs => yargs
    	.options({
            configFile: {
                describe: 'Path to configuration file',
                type: 'string',
            },
            statusFile: {
                describe: 'Path to status file',
                type: 'string',
            },
            count: {
                describe: 'Number of frames to post',
                type: 'number',
            },
    	})
        .check(argv => {
            if(argv.count < 0) throw new Error('count must be greater than 0');
            return true;
        }),
    handler: async argv => {
        const fbHelper = new FB.Helper(new FB(), configFile.config.page_access_token), 
              configFile = JSON.parse(fs.readFileSync(argv.configFile, 'utf8')),
              statusFile = {
                season: 0,
                episode: 0,
                frame: -1,
                ended: false,
                frame_hash: '',
                publish_time: moment().add('20', 'minutes').toISOString(),
                ...JSON.parse(fs.readFileSync(argv.statusFile, 'utf8'))
              },
              count = argv.count,
              [publishInterval, publishIntervalUnit] = configFile.config.post_interval.split(' ');

        // TODO: Pre-extract frames here grouped by season and episode
        //const frames = await extractNeededFrames(configFile, calculateNeededFrames(configFile, statusFile, count));

        let currentStatus = statusFile;
        for(let frame = 0; frame < count; ++frame) {
            currentStatus = getNextFrame(configFile, currentStatus);

            if(currentStatus.ended) {
                console.log('No more frames to post');
                break;
            }

            currentStatus.publish_time = moment(currentStatus.publish_time).add(publishInterval, publishIntervalUnit);

            const frame = (await video.extractFrames(configFile.data.seasons[currentStatus.season].episodes[currentStatus.episode].file, [currentStatus.frame]))[currentStatus.frame],
                  frameHash = await video.hashImage(frame, configFile.config.hash_bits || 16);

            if(currentStatus.frame_hash || video.diffString(currentStatus.frame_hash, frameHash) > 100) {
                // TODO: Post here
                /*const req = await fbHelper.publishComment(argv.object, {
                    ...(argv.attachmentId && { attachment_id: argv.attachmentId }),
                    ...(argv.attachmentShareUrl && { attachment_share_url: argv.attachmentShareUrl }),
                    ...(argv.attachmentUrl && { attachment_url: argv.attachmentUrl }),
                    ...(argv.source && { source: argv.source }),
                    ...(argv.message && { message: argv.message }),
                });*/

                console.log(`Scheduled Season: ${currentStatus.season} Episode: ${currentStatus.episode} Frame: ${currentStatus.frame} at ${currentStatus.publish_time.toISOString()}`);
            } else {
                console.log(`Skipped Season: ${currentStatus.season} Episode: ${currentStatus.episode} Frame: ${currentStatus.frame} at ${currentStatus.publish_time.toISOString()}`);
            }

            currentStatus.frame_hash = frameHash;

            fs.writeFileSync(argv.statusFile, JSON.stringify(currentStatus, null, 4));
        }
    },
};
