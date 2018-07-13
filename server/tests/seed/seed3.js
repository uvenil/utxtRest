require('./../../config/config');

const {ObjectID} = require('mongodb');
var { mongoose } = require('./../../db/mongoose');

const jwt = require('jsonwebtoken');

const { Wort } = require('./../../models/wort');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'mic@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const wteil = [{
  _id: new ObjectID(),
  wort: 'First test wort',
  'wortuser._creator': userOneId
}, {
  _id: new ObjectID(),
  wort: 'Second test wort',
  archived: true,
  'time.archivedAt': 333,
  'wortuser._creator': userTwoId
}];

const worte = [{
  ...wteil[0],
  satzStats: {
    maxNesting: 1, // maximale Verschachtelungstiefe des Satzes
    avNesting: 2, // mittlere Verschachtelungstiefe des Satzes
    anzBasisworte: 3
  }, 
  satzteile: [{
    typ: "typ1",
    worte: [wteil[0]._id, wteil[1]._id], // wteil in der Verbingung Satz in der richtigen Reihenfolge
    worteIf: [wteil[0]._id] // Bedingung für die Gükltigkeit der Verbindung
  }, {
    typ: "typ3",
    worte: [wteil[1]._id, wteil[0]._id],
    worteIf: []
  }, {
    typ: "typ1",
    worte: [wteil[0]._id],
    worteIf: [wteil[1]._id]
  }],
  }, {
  ...wteil[1],
  archived: true,
  'time.archivedAt': 555,
  'wortuser._creator': userTwoId,
  satzteile: [{
      typ: "typ2",
      worte: [wteil[1]._id, wteil[0]._id], // wteil in der Verbingung Satz in der richtigen Reihenfolge
      worteIf: [wteil[1]._id] // Bedingung für die Gükltigkeit der Verbindung
  }]
}];

const done = () => {
  console.log("fertig!");
  };

const populateWorte = (done) => {
  Wort.remove({}).then(() => {
    var ul1 = new Wort(worte[0]).save();
    var ul2 = new Wort(worte[1]).save();

    return Promise.all([ul1, ul2])

    // return Wort.insertMany(worte);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {worte, populateWorte, users, populateUsers};

populateUsers(done);
populateWorte(done);
