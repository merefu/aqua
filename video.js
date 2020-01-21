const { createWorker } = require('@ffmpeg/ffmpeg');
const fs = require('fs');
const path = require('path');

async function getFrameCount(file) {	
	let output = [];

	const worker = createWorker({
		logger: ({ message }) => output.push(message),
	});
	await worker.load();

	const baseName = path.basename(file);
	await worker.write(baseName, file);

	await worker.run(`-i ${baseName} -map 0:v:0 -c copy -f null -`);

	const matches = output.join('\r\n').match(/frame=\s(\d+?)\s/g);
	const count = parseInt(matches[matches.length - 1].split(' ')[1]);

	return count;
}

async function extractFrames(file, frames, config) {
	config = {
		outputExtension: 'png',
		...config
	};

	frames = [...new Set(frames)].sort((a, b) => a - b);

	const worker = createWorker();
	await worker.load();

	const baseName = path.basename(file);
	await worker.write(baseName, file);

	const args = [
		'-filter_complex', `select='${frames.map(frame => `eq(n,${frame})`).join('+')}'`,
		'-vframes', frames.length.toString(),
		'-vsync', '0',
		'-start_number', '0',
	];
	await worker.transcode(baseName, `%d.${config.outputExtension}`, args.join(' '));

	const images = {};
	for(let i = 0; i < frames.length; ++i) {
		const { data } = await worker.read(`${i}.${config.outputExtension}`);
		images[frames[i]] = Buffer.from(data);
	}

	return images;
}

module.exports = exports = {
	getFrameCount,
	extractFrames,
};