var MockNewton,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

var path = require( 'path' );
var newtonSync = require( path.resolve( path.join( __dirname, '../..' ) ) );
var NewtonDevice = newtonSync.NewtonDevice;

var net = require('net');

module.exports = MockNewton = (function(superClass) {
  extend(MockNewton, superClass);

  function MockNewton() {
    return MockNewton.__super__.constructor.apply(this, arguments);
  }

  MockNewton.name = 'Test Suite Newton';

  MockNewton.prototype.testData = {
    foo: 'bar'
  };

  MockNewton.prototype.afunction = function() {
    return null;
  };

  return MockNewton;

})(NewtonDevice);
