# Passport-backup-codes

[Passport](http://passportjs.org/) strategy for backup codes authentication using
a single use value.

This module is heavily inspired from [passport-totp](https://github.com/jaredhanson/passport-totp)

This module lets you authenticate using a single use code in your Node.js
applications. By plugging into Passport, Single use code authentication can be
easily and unobtrusively integrated into any application or framework that
supports [Connect](http://www.senchalabs.org/connect/)-style middleware,
including [Express](http://expressjs.com/).

## Install

    $ npm install passport-backup-codes

## Usage

#### Configure Strategy

The backup codes authentication strategy authenticates a user using a single use code provided by the software 
application (known as a token). The strategy requires a `setup` callback.

The `setup` callback accepts a previously authenticated `user` and calls 
the `tearDown` callback which will calls `done` providing a `key` and `period` used 
to verify the HOTP value. Authentication fails if the value is not verified.

    passport.use(new BackupCodesStrategy(
      function(user, done) {
        BackupCodes.findOne({ userId: user.id }, function (err, codes) {
          if (err) { return done(err); }
          return done(null, codes);
        });
      },
      function(user, code, done) {
        BackupCodes.findOne({ userId: user.id }, function (err, codes) {
          if (err) { return done(err); }
          
          codes = codes.filter((value) => {
            return code !== value;
          });
          
          BackupCodes.update(codes, function(err) {
            if (err) { return done(err); }

            return done();
          });
          
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'backup-codes'` strategy, to authenticate
requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.post('/verify-otp', 
      passport.authenticate('backup-codes', { failureRedirect: '/verify-otp' }),
      function(req, res) {
        req.session.authFactors = [ 'superadmin' ];
        res.redirect('/');
      });

## Tests

    $ npm install
    $ npm run test

## Credits

  - [Sebastien BRAMILLE](http://github.com/oktapodia)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2019 Sebastien BRAMILLE
