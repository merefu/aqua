#!/usr/bin/env node

switch(process.env.MODE) {
	case 'efio-bot':
		require('./src/efio-bot');
		break;

	case 'cli':
	default:
		require('./src/cli');
}