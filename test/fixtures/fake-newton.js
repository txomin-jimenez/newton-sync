var FakeNewton,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

var path = require( 'path' );
var newtonSync = require( path.resolve( path.join( __dirname, '../..' ) ) );
var NewtonDevice = newtonSync.NewtonDevice;

var net = require('net');

module.exports = FakeNewton = (function(superClass) {
  extend(FakeNewton, superClass);

  function FakeNewton() {
    return FakeNewton.__super__.constructor.apply(this, arguments);
  }

  FakeNewton.id = 'dock';

  FakeNewton.prototype.data = {
    foo: 'bar'
  };

  FakeNewton.prototype.afunction = function() {
    return null;
  };

  return FakeNewton;

})(NewtonDevice);
