/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , util = require('util');


/**
 * `Strategy` constructor.
 *
 * The backup codes strategy authentication strategy authenticates requests based on the
 * single use code value submitted through an HTML-based form.
 *
 * Applications must supply a `setup` callback which accepts `user`, and then
 * calls the `done` callback.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *   - `codeField`  field name where the single use code value is found, defaults to _code_
 *   - `window`     size of time step delay window, defaults to 6
 *
 * Examples:
 *
 *     passport.use(new BackupCodesStrategy(
 *       function (user, done) {
 *         if (user.codes) {
 *           return done(null, user.codes);
 *         }
 *         return done(null, false);
 *       },
 *       function (user, code, done) {
 *         user.codes = user.codes.filter((value) => {
 *           return code !== value;
 *         });
 *
 *         return done();
 *       });
 *     ));
 *
 * @param {Object} options
 * @param {Function} setup
 * @param {Function} tearDown
 * @api public
 */
function Strategy(options, setup, tearDown) {
  if (typeof options == 'function') {
    tearDown = setup;
    setup = options;
    options = {};
  }

  if (!setup) { throw new TypeError('BackupCodesStrategy requires a setup callback'); }
  if (!tearDown) { throw new TypeError('BackupCodesStrategy requires a tearDown callback'); }


  this._codeField = options.codeField || 'code';
  this._passReqToCallback = options.passReqToCallback || false;

  passport.Strategy.call(this);
  this._setup = setup;
  this._tearDown = tearDown;
  this.name = 'backup-codes';
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on single use code values.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  const value = lookup(req.body, this._codeField) || lookup(req.query, this._codeField);
  const self = this;

  function verified(err, codes) {
    if (err) { return self.error(err); }

    if (!Array.isArray(codes)) {
      return self.error('The `codes` provided must be an array');
    }

    if (!codes.includes(value)) {
      return self.fail('Invalid code');
    }

    if (self._passReqToCallback) {
      return self._tearDown(req, req.user, value, tearDownFunc);
    } else {
      return self._tearDown(req.user, value, tearDownFunc);
    }
  }

  /**
   * Function called to remove the code after using it
   * @param err
   * @param codes
   * @returns {Test|undefined|void|*}
   */
  function tearDownFunc(err, codes) {
    if (err) { return self.error(err); }

    return self.success(req.user);
  }

  try {
    if (self._passReqToCallback) {
      this._setup(req, req.user, verified);
    } else {
      this._setup(req.user, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }

  function lookup(obj, field) {
    if (!obj) { return null; }
    var chain = field.split(']').join('').split('[');
    for (var i = 0, len = chain.length; i < len; i++) {
      var prop = obj[chain[i]];
      if (typeof(prop) === 'undefined') { return null; }
      if (typeof(prop) !== 'object') { return prop; }
      obj = prop;
    }
    return null;
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
