import express from 'express';
import Promise from 'bluebird';
import db from 'sqlite';
import webpack from 'webpack';
import bodyParser from 'body-parser';

import {
  getUsers,
  getProducts,
  registerUser,
  addCredit,
  buy,
  addStock,
} from './routes';
import config from '../config.js';
import webpackConfig from '../webpack.config.js';

export function runServer() {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  if (config.dev) {
    const compiler = webpack(webpackConfig);

    app.use(require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: {
        colors: true,
        chunks: false,
      },
    }));
    app.use(require('webpack-hot-middleware')(compiler));
  }

  app.get('/', (req, res) => res.send(`
    <!doctype html>
    <html>
      <head>
        <title>Sortiment</title>
        <link rel="stylesheet" href="/static/css/bootstrap.min.css">
        <link rel="stylesheet" href="/static/css/bootstrap-theme.min.css">
      </head>
      <style>
        html, body, #root {
          height: 100%;
          margin: 0 0 0 0;
        }

        #root {
          background-image: url('/images/background.jpg');
        }

      </style>
      <body>
        <div id='root'>
        </div>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `));
  app.get('/users', getUsers);
  app.get('/products', getProducts);

  app.post('/register', registerUser);
  app.post('/credit', addCredit);
  app.post('/buy', buy);
  app.post('/addStock', addStock);

  app.use('/images', express.static('images'));
  app.use('/static', express.static('static'));

  // redirect everything else to /
  app.get('*', (req, res) => res.redirect('/'));

  Promise.resolve()
    .then(() => db.open(`./${config.database}`, {Promise}))
    .then(() => db.migrate())
    .catch((err) => console.error(err.stack))
    .finally(() => {
      console.log(`Server running on localhost:${config.port}`); // eslint-disable-line no-console
      app.listen(config.port);
    });
}
