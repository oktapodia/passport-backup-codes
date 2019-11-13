/* global describe, it, expect */

var Strategy = require('../lib/strategy');


describe('Strategy', function() {

  var strategy = new Strategy(function(){}, function(){});

  it('should be named otp', function() {
    expect(strategy.name).to.equal('backup-codes');
  });

  it('should throw if constructed without a setup callback', function() {
    expect(function() {
      var s = new Strategy();
    }).to.throw(TypeError, 'BackupCodesStrategy requires a setup callback');
  });

  it('should throw if constructed without a tearDown callback', function() {
    expect(function() {
      var s = new Strategy(() => {});
    }).to.throw(TypeError, 'BackupCodesStrategy requires a tearDown callback');
  });

});
