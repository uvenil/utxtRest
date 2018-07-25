// wort = hyperwort, satz = hypersatz


// !!! hier:
// mongoose-schema-extend läuft nur bis "mongoose": "5.1.4" und kann evtl deinstalliert werden
// Expensify-React16 oder react-Boilerplate deploy
// Verknüpfung mit frontend, Frontend auf utxt anpassen
// tests aktualisieren
// seed2 dient zum Testen der Datenbankspeicherung (Mongoose.save)
// , ggf. zirkuläre Sätze ermitteln in 2D, 3D, xD
// Usergruppen mit Rechten
// Utxt Patent anmelden


require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const cors = require("cors");

// var {mongoose} = require('./db/mongoose');
var {Wort} = require('./models/wort');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT;
var app = express();

app.use(cors("*"));

app.use(bodyParser.json());

app.use('*', (req, res, next) => {
  console.log("path", req.path);
  console.log("originalUrl", req.originalUrl);
  next();
})


app.post('/worte', authenticate, (req, res) => {
  const aktTime = new Date().getTime();
  var wort = new Wort({
    wort: req.body.wort,
    'wortuser._creator': req.user._id
  });

  wort.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/worte', authenticate, (req, res) => {
  Wort.find({
    'wortuser._creator': req.user._id
  }).then((worte) => {
    res.send({worte});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/worte/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Wort.findOne({
    _id: id,
    'wortuser._creator': req.user._id
  }).then((wort) => {
    if (!wort) {
      return res.status(404).send();
    }

    res.send({wort});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/worte/:id', authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const wort = await Wort.findOneAndRemove({
      _id: id,
      'wortuser._creator': req.user._id
    });
    if (!wort) {
      return res.status(404).send();
    }

    res.send({wort});
  } catch (e) {
    res.status(400).send();
  }
});

app.patch('/worte/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['wort', 'archived']);
  body.time = {};
  const aktTime = new Date().getTime();
  
  body.time.lastModified = aktTime;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.archived) && body.archived) {
  } else {
    body.archived = false;
  }
  
  Wort.findOneAndUpdate({ _id: id, 'wortuser._creator': req.user._id}, {$set: body}, {new: true}).then((wort) => {
    if (!wort) {
      return res.status(404).send();
    }

    res.send({wort});
  }).catch((e) => {
    res.status(400).send();
  })
});

// POST /users
app.post('/users', async (req, res) => {  // signin
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();

    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/users/me', authenticate, (req, res) => {  // loggedin
  res.send(req.user);
});

// Einloggen nach Delete user noch möglich; nur 1 Token jeweils gespeichert
app.post('/users/login', async (req, res) => {  // login
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

app.delete('/users/me/token', authenticate, async (req, res) => { // logout
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
