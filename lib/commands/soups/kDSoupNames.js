
/**
kDSoupNames

Desktop < Newton

ULong 'soup'
ULong length
NSOF  [names] // array of strings
NSOF  [signatures/    // array of corresponding soup signatures

This command is sent in response to a kDGetSoupNames command. It returns 
the names and signatures of all the soups in the current store.
 */

(function() {
  var EventCommand, NsOF, kDSoupNames,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  module.exports = kDSoupNames = (function(superClass) {
    extend(kDSoupNames, superClass);

    kDSoupNames.id = 'soup';

    kDSoupNames.prototype.id = kDSoupNames.id;

    kDSoupNames.prototype.name = 'kDSoupNames';

    kDSoupNames.prototype.length = null;

    function kDSoupNames() {
      kDSoupNames.__super__.constructor.apply(this, arguments);
    }

    kDSoupNames.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      return this.data = NsOF.decode(dataBuffer.slice(4));
    };

    return kDSoupNames;

  })(EventCommand);

}).call(this);
