/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , Strategy = require('../lib/strategy');


describe('Strategy', function () {
  let user = {};

  before(function (done) {
    user.username = 'johndoe';
    user.codes = [1234, 2345, 3456];

    done();
  });

  describe('failing authentication', function () {
    var strategy = new Strategy(function (user, done) {
      return done(null, ['123']);
    }, () => {});

    var info;

    before(function (done) {
      chai.passport.use(strategy)
        .fail(function (i) {
          info = i;
          done();
        })
        .req(function (req) {
          req.user = user;
          req.body = {};
          req.body.code = '123456';
        })
        .authenticate();
    });

    it('should fail', function () {
      expect(info).to.equal('Invalid code');
    });
  });
});
