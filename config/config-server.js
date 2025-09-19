const Config = {};

Config.ports = {
	http: 4280,
	https: 42443,
};

Config.ssl = {
	privateKeyPath: '',
	certificatePath: '',
};
/*** Begin automatically generated configuration ***/
Config.defaultserver = {
	id: 'clodown',
	host: 'localhost',
	port: '8443',
	httpport: 8000,
	altport: 80,
	registered: true,
	https: false,
	afd: false,
	clientHost: 'localhost:4280',
	loginOverride: null,
};

module.exports = Config;
/*** End automatically generated configuration ***/
