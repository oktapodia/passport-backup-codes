/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , Strategy = require('../lib/strategy');


describe('Strategy', function () {

  let userTest = {};

  before(function (done) {
    userTest.username = 'johndoe';
    userTest.codes = [1234, 2345, 3456];

    done();
  });

  describe('passing request to verify callback', function () {
    var strategy = new Strategy({ passReqToCallback: true }, function (req, user, done) {
      if (user.codes === userTest.codes) {
        return done(null, user.codes);
      }
      return done(null, false);
    }, function (req, user, code, done) {
      user.codes = user.codes.filter((value) => {
        return code !== value;
      });

      return done();
    });

    var user
      , info;

    before(function (done) {
      chai.passport.use(strategy)
        .success(function (u, i) {
          user = u;
          info = i;
          done();
        })
        .req(function (req) {
          req.user = userTest;

          req.body = {};
          req.body.code = 3456;
        })
        .authenticate();
    });

    it('should supply user', function () {
      expect(user.username).to.be.a.string;
      expect(user.secret).to.equal(userTest.secret);

    });
  });
});
