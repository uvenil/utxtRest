const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Wort} = require('./../models/wort');
const {User} = require('./../models/user');
const {worte, populateWorte, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateWorte);

describe('POST /worte', () => {
  it('should create a new wort', (done) => {
    var wort = 'Test wort wort';

    request(app)
      .post('/worte')
      .set('x-auth', users[0].tokens[0].token)
      .send({wort})
      .expect(200)
      .expect((res) => {
        expect(res.body.wort).toBe(wort);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Wort.find({wort}).then((worte) => {
          expect(worte.length).toBe(1);
          expect(worte[0].wort).toBe(wort);
          expect(typeof worte[0].time.lastModified).toBe('number');
          expect(typeof worte[0].time.createdAt).toBe('number');
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create wort with invalid body data', (done) => {
    request(app)
      .post('/worte')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Wort.find().then((worte) => {
          expect(worte.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /worte', () => {
  it('should get all worte', (done) => {
    request(app)
      .get('/worte')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.worte.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /worte/:id', () => {
  it('should return wort doc', (done) => {
    request(app)
      .get(`/worte/${worte[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.wort.wort).toBe(worte[0].wort);
      })
      .end(done);
  });

  it('should not return wort doc created by other user', (done) => {
    request(app)
      .get(`/worte/${worte[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if wort not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/worte/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/worte/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /worte/:id', () => {
  it('should remove a wort', (done) => {
    var hexId = worte[1]._id.toHexString();

    request(app)
      .delete(`/worte/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.wort._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Wort.findById(hexId).then((wort) => {
          expect(wort).not.toBeTruthy();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should remove a wort', (done) => {
    var hexId = worte[0]._id.toHexString();

    request(app)
      .delete(`/worte/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Wort.findById(hexId).then((wort) => {
          expect(wort).toBeTruthy();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if wort not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/worte/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/worte/123abc')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /worte/:id', () => {
  it('should update the wort', (done) => {
    var hexId = worte[0]._id.toHexString();
    var wort = 'This should be the new wort';

    request(app)
      .patch(`/worte/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        archived: true,
        wort
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.wort.wort).toBe(wort);
        expect(res.body.wort.archived).toBe(true);
        expect(typeof res.body.wort.time.archivedAt).toBe('number');
        expect(typeof res.body.wort.time.lastModified).toBe('number');
        expect(typeof res.body.wort.time.createdAt).toBe('number');
      })
      .end(done);
  });

  it('should not update the wort created by other user', (done) => {
    var hexId = worte[0]._id.toHexString();
    var wort = 'This should be the new wort';

    request(app)
      .patch(`/worte/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        archived: true,
        wort
      })
      .expect(404)
      .end(done);
  });

  it('should clear archivedAt when wort is not archived', (done) => {
    var hexId = worte[1]._id.toHexString();
    var wort = 'This should be the new wort!!';

    request(app)
      .patch(`/worte/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        archived: false,
        wort
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.wort.wort).toBe(wort);
        expect(res.body.wort.archived).toBe(false);
        expect(res.body.wort.time.archivedAt).not.toBeTruthy();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          // expect(user.tokens[0]).toHaveProperty("access", 'auth');
          // expect(user.tokens[0]).toHaveProperty("token", res.headers['x-auth']);
          expect(user.tokens[0]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).not.toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
