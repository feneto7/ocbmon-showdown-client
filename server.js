const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const yargs = require('yargs');

const { ports, ssl } = require('./config/config-server');

const argv = yargs.option('httpOnly', {
  alias: 'http',
  type: 'boolean',
  description: 'Run the server without HTTP.',
  default: false,
}).parse();

const checkLoginResponse = (loginDataString) => {
  if (loginDataString.charAt(0) === ']') {
    const loginData = JSON.parse(loginDataString.substring(1));
    return loginData.actionsuccess === true;
  }

  return false;
};

const checkRegisteredResponse = (loginDataString) => {
  if (loginDataString.charAt(0) === ']') {
    const loginData = JSON.parse(loginDataString.substring(1));
    return !('actionerror' in loginData);
  }

  return false;
};

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handle action.php requests
app.post('/~~clodown/action.php', (request, response) => {
  // encaminha para o servidor principal preservando o formato x-www-form-urlencoded
  const axios = require('axios');
  const mainServerUrl = 'http://localhost:8000';

  // re-encode body como application/x-www-form-urlencoded para o servidor principal
  const formData = new URLSearchParams();
  for (const key of Object.keys(request.body || {})) {
    const value = request.body[key];
    // força string simples (PS espera chaves planas)
    formData.append(key, typeof value === 'string' ? value : String(value));
  }

  axios.post(`${mainServerUrl}/action.php`, formData.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    transformRequest: [(data) => data],
  })
    .then(serverResponse => {
      // repassa exatamente o que o servidor principal respondeu (string)
      response.type('text/plain');
      response.send(serverResponse.data);
    })
    .catch(error => {
      console.error('Error forwarding to main server:', error.message);
      response.status(500).send('Internal Server Error');
    });
});

// Servir sprites localmente e fazer fallback para o servidor principal
const pathSpritesLocal = path.join(__dirname, 'sprites');
app.use('/sprites', express.static(pathSpritesLocal, { fallthrough: true }));
app.get('/sprites/*', async (request, response, next) => {
  try {
    const axios = require('axios');
    const mainServerUrl = 'http://localhost:8000';
    const tryFetch = async (url) => {
      const res = await axios.get(url, { responseType: 'stream', validateStatus: () => true });
      if (res.status >= 200 && res.status < 300) return res;
      return null;
    };
    // 1) tenta mesmo caminho
    let upstream = await tryFetch(`${mainServerUrl}${request.originalUrl}`);
    // 2) fallback para assets do mod Wack
    if (!upstream) {
      const rel = request.originalUrl.replace(/^\/sprites\//, '');
      upstream = await tryFetch(`${mainServerUrl}/sprites/wack/${rel}`);
    }
    if (!upstream) return next();
    response.set(upstream.headers);
    upstream.data.pipe(response);
  } catch (err) {
    next();
  }
});

// stub simples para getteams em ambiente local
app.get('/~~clodown/action.php', (request, response) => {
  if (request.query && request.query.act === 'getteams') {
    // O cliente espera um payload estilo loginserver: string iniciando com ']'
    response.type('text/plain');
    return response.send(']{"teams":[]}');
  }
  response.status(404).send('Not Found');
});

app.use('*.php', (request, response) => response.sendStatus(404));
app.get('/lobby-banner', (request, response) => {
  const banners = fs.readdirSync('./banners');
  const banner = banners[Math.floor(Math.random() * banners.length)];

  response.sendFile(path.join(__dirname, 'banners', banner));
});
app.get('*', (request, response, next) => {
  if (request.path.startsWith('/sprites/afd')) {
    const afdPath = path.join(__dirname, 'public', request.path);
    if (!fs.existsSync(afdPath)) {
      return response.redirect(request.path.replace('/sprites/afd', '/sprites/gen5'));
    }
  }

  next();
});
app.use(express.static('./public', { index: 'index.html', fallthrough: true }));
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, './public/index.html'));
});

// Always use HTTP for local development
const httpServer = http.createServer(app);
httpServer.listen(ports.http, () => console.log(`Listening on ${ports.http}`));
