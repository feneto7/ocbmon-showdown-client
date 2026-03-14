import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configDir = path.resolve(__dirname, 'config');

/** Em dev, reescreve URLs absolutas do play para paths relativos (/) para funcionar com root local */
function devIndexHtmlPlugin() {
  return {
    name: 'dev-index-html-urls',
    transformIndexHtml(html) {
      return html.replace(/\/\/play\.pokemonshowdown\.com/g, '');
    },
  };
}

/** Sirve /config/* a partir da pasta config na raiz do projeto (fora do root do Vite) */
function configMiddleware() {
  return {
    name: 'serve-config',
    configureServer(server) {
      server.middlewares.use('/config', (req, res, next) => {
        const subPath = req.url === '/' || req.url === '' ? 'config.js' : req.url.replace(/^\//, '');
        const file = path.resolve(configDir, subPath);
        if (!file.startsWith(path.resolve(configDir)) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
          return next();
        }
        res.setHeader('Content-Type', file.endsWith('.js') ? 'application/javascript' : 'text/plain');
        fs.createReadStream(file).pipe(res);
      });
    },
  };
}

/**
 * Vite config para desenvolvimento local do cliente.
 * Serve a app principal (play) com hot reload; config fica na raiz do repo.
 */
export default {
  root: path.join(__dirname, 'play.pokemonshowdown.com'),
  publicDir: false,
  plugins: [devIndexHtmlPlugin(), configMiddleware()],
  server: {
    port: 5173,
    open: '/client.html',
    strictPort: false,
  },
  resolve: {
    alias: {
      '/config': configDir,
    },
  },
  // App atual usa scripts clássicos (não ES modules); Vite só serve estáticos
  build: {
    outDir: path.join(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.join(__dirname, 'play.pokemonshowdown.com', 'client.html'),
    },
  },
};
