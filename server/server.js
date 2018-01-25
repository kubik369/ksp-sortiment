import express from 'express';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import multer from 'multer';

import {
  getUsers, getProducts, registerUser, addCredit, buy, addStock,
  uploadImage, renameProduct,
} from './routes';
import config from '../config.js';
import webpackConfig from '../webpack.config.js';

const multerUpload = multer({dest: config.imagePath});

const html = `
  <!doctype html>
  <html>
    <head>
      <title>Sortiment</title>
      <link rel="stylesheet" href="/static/css/bootstrap.min.css">
      <link rel="stylesheet" href="/static/css/bootstrap-theme.min.css">
      <link rel="stylesheet" href="/static/css/react-spinner.css">
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
      <div id='root' />
      <script src="/static/bundle.js"></script>
    </body>
  </html>
`;

export function runServer() {
  const app = express();

  app.use(bodyParser.json({limit: '10mb'}));
  app.use(bodyParser.urlencoded({extended: true}));

  if (config.dev) {
    const compiler = webpack(webpackConfig);

    app.use(require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: {colors: true, chunks: false},
    }));

    app.use(require('webpack-hot-middleware')(compiler, {
      log: console.log,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
    }));
  }

  app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send(html);
  });
  app.get('/users', getUsers);
  app.get('/products', getProducts);

  app.post('/register', registerUser);
  app.post('/credit', addCredit);
  app.post('/buy', buy);
  app.post('/addStock', addStock);
  app.post('/renameProduct', renameProduct);
  app.post('/uploadProductImage', multerUpload.single('image'), uploadImage);

  app.use('/images', express.static('images'));
  app.use('/static', express.static('static'));

  // redirect everything else to /
  app.get('*', (req, res) => res.redirect('/'));

  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on localhost:${config.port}`);
  });
}
