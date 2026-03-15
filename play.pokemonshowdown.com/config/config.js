/** @type {import('../src/client-main').PSConfig} */
var Config = Config || {};

/* version */ Config.version = "0";

Config.bannedHosts = ['cool.jit.su', 'pokeball-nixonserver.rhcloud.com'];

Config.whitelist = [
	'wikipedia.org'
];

// Em localhost usa o server local; em produção usa o servidor no Render.
if (typeof location !== 'undefined' && (location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
	Config.defaultserver = {
		id: 'local',
		host: 'localhost',
		port: 8000,
		httpport: 8000,
		altport: 8000,
		registered: false
	};
} else {
	Config.defaultserver = {
		id: 'ocbmons',
		host: 'ocbmon-showdown.onrender.com',
		port: 443,
		httpport: 80,
		altport: 80,
		registered: false
	};
}

Config.roomsFirstOpenScript = function () {
};

Config.customcolors = {
	'zarel': 'aeo'
};

Config.routes = {
	root: 'ocbmon-showdown-client.vercel.app',
	client: 'ocbmon-showdown-client.vercel.app',
	dex: 'dex.pokemonshowdown.com',
	replays: 'replay.pokemonshowdown.com',
	users: 'pokemonshowdown.com/users',
	teams: 'teams.pokemonshowdown.com',
};
