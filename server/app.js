/* eslint-disable new-cap,global-require,no-param-reassign */
import each from 'lodash/each';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { matchPath } from 'react-router-dom';
import { StaticRouter, match, Router, Switch, Route } from 'react-router';
import AppHost from '../src/AppHost';
import createMemoryHistory from 'history/createMemoryHistory';
import Wrapper from '../src/Wrapper';

import getStore from '../src/store';
import router, { UserRoutes } from '../src/routes';
import authCallback from './auth-callback';
import routesClient from '../src/routes';
import User from '../src/user/User';
import { matchRoutes, renderRoutes } from 'react-router-config';
import routes2 from '../src/routes2';
import routes3 from '../src/routes';

const { JSDOM } = require('jsdom');

var expressStaticGzip = require("express-static-gzip");

const fs = require('fs');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const debug = require('debug')('busy:serverApp');

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

const ssrTimeout = 5000;

const OneWeek = 1000 * 60 * 60 * 24 * 7;

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

const rootDir = path.join(__dirname, '..');

if (process.env.NODE_ENV !== 'production') {
  require('../webpack')(app);
}


app.locals.env = process.env;
app.enable('trust proxy');
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.io = io;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
  /*app.use(function(req, res, next) {
    if (!/https/.test(req.protocol)){
      res.redirect("https://" + req.headers.host + req.url);
    } else {
      return next();
    }
  });*/
  app.use(expressStaticGzip(path.join(rootDir, 'public'), {enableBrotli: true}));

  //app.use(express.static(path.join(rootDir, 'public')));
} else {
  app.use(expressStaticGzip(path.join(rootDir, 'assets'), {enableBrotli: true}));
  //app.use(express.static(path.join(rootDir, 'assets')));
}

if (!process.env.IS_BROWSER) {
  global.window = (new JSDOM('')).window;

}


const indexPath = process.env.NODE_ENV === 'production'
  ? `${rootDir}/public/index.html`
  : `${rootDir}/templates/development_index.html`;

const indexHtml = fs.readFileSync(indexPath, 'utf-8');


function createTimeout(timeout, promise) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Request has timed out. It should take no longer than ${timeout}ms.`));
    }, timeout);
    promise.then(resolve, reject);
  });
}

async function fetchComponentData(dispatch, components, params, store, match, req, res) {
  const needs = components.needs;
  let promises = Promise.resolve(null);

  if (needs && typeof needs !=="undefined" && needs !== "undefined" && needs instanceof Function) {
    promises = needs({ store, match, req, res });
  }

  debug('promises', needs, Date.now());
  return Promise.all(promises).then(() => params);
}
function renderPage(req, store, props) {
  const context = {};
  let routesToRender = renderRoutes(routes2);

  const appHtml = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={ context} {...props}>
        {routes3}
      </StaticRouter>
    </Provider>

  );

  const preloadedState = store.getState();
  const helmet = Helmet.renderStatic();
  const header = helmet.meta.toString() + helmet.title.toString() + helmet.link.toString();
  return indexHtml
    .replace('<!--server:header-->', header)
    .replace('<!--server:html-->', appHtml)
    .replace(
      '<!--server:scripts-->',
      `<script>
        // WARNING: See the following for security issues around embedding JSON in HTML:
        // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>`
    );
}

let routes = [];

function loadCachedRoutes(){
  try {
    const basicRoutes = router.props.children.props.children; // Get > Wrapper > Switch > [Childrens]
    const userRoutes = [];//UserRoutes().props.children;
    routes = [...basicRoutes, ...userRoutes];
  } catch (e) {
    console.log('Could not evaluate routes for ssr', e);
  }

}

loadCachedRoutes();

async function serverSideResponse(req, res) {

  const store = getStore();
  global.postOrigin = `${req.protocol}://${req.get('host')}`;
  const promises = [];

  let matched = 
  routes.some(route => {
    // use `matchPath` here
    const match = matchPath(req.url, route.props);
    if (match && match.isExact) {

      promises.push(
        fetchComponentData(
          store.dispatch,
          route.props.component || route.props.render().type,
          match.params,
          store,
          match,
          req,
          res
        )
      );

    }

    return match;
  });
  return await createTimeout(ssrTimeout, 
    Promise.all(promises)
    .then(data => {  
        return renderPage(req, store, ...data)})
    .then(html => {return res.end(html);})
    .catch(error => res.end(error.message))
  )
}

app.get('/callback', authCallback({ sendCookie: true }));
app.get('/connect', authCallback({ allowAnyRedirect: false }));

app.get('/trending(/:category)', serverSideResponse);
app.get('/hot(/:category)', serverSideResponse);
app.get('/cashout(/:category)', serverSideResponse);
app.get('/created(/:category)', serverSideResponse);
app.get('/active(/:category)', serverSideResponse);
app.get('/responses(/:category)', serverSideResponse);
app.get('/votes(/:category)', serverSideResponse);

app.get('/@:name/posts', serverSideResponse);
app.get('/@:name/feed', serverSideResponse);
app.get('/@:name/replies', serverSideResponse);
app.get('/@:name', serverSideResponse);

app.get('/:category/@:author/:permlink', serverSideResponse);
app.get('/search/titles', serverSideResponse);

app.get('/settings', (req, res) => {
  res.send(indexHtml);
});

app.get('/:title', serverSideResponse);

app.get('/*', (req, res) => {
  res.send(indexHtml);
});

module.exports = { app, server };

console.log('UI Server running');
