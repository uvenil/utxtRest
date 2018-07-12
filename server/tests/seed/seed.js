const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Wort} = require('./../../models/wort');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'andrew@example.com',
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

const worte = [{
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

const populateWorte = (done) => {
  Wort.remove({}).then(() => {
    return Wort.insertMany(worte);
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
