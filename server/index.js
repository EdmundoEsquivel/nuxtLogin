const express = require("express");
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();

// Import and Set Nuxt.js options
let config = require("../nuxt.config.js");
const router = require("./router")
const res = require("express/lib/response");
config.dev = !(process.env.NODE_ENV === "production");

const { sequelize } = require("./models/index.js");
const req = require("express/lib/request");

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(
    session({
      secret: "df8550e245537e86c11de81e",
      resave: false,
      saveUninitialized: false,
    })
  );

 app.use('/', router)
  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
}
start();
