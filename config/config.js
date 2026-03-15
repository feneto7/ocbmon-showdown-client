/** @type {import('../play.pokemonshowdown.com/src/client-main').PSConfig} */
var Config = Config || {};

/* version */ Config.version = "0";

Config.bannedHosts = ['cool.jit.su', 'pokeball-nixonserver.rhcloud.com'];

Config.whitelist = [
	'wikipedia.org'

	// The full list is maintained outside of this repository so changes to it
	// don't clutter the commit log. Feel free to copy our list for your own
	// purposes; it's here: https://play.pokemonshowdown.com/config/config.js

	// If you would like to change our list, simply message Zarel on Smogon or
	// Discord.
];

// `defaultserver` specifies the server to use when the domain name in the
// address bar is `Config.routes.client`. Em localhost usa o server local.
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

