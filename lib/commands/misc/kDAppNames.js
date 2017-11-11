
/**
kDAppNames

Desktop < Newton

ULong 'appn'
ULong length
NSOF  result frame

This command returns the names of the applications present on the newton. It
also, optionally, returns the names of the soups associated with each
application. The array looks like this:

[{name: "app name", soups: ["soup1", "soup2"]},
     {name: "another app name", ...}, ...]

Some built-in names are included. "System information" includes the system and
directory soups. If there are packages installed, a "Packages" item is listed.
If a card is present and has a backup there will be a "Card backup" item. If
there are soups that don't have an associated application (or whose application
I can't figure out) there's an "Other information" entry.

The soup names are optionally returned depending on the value received with
kDGetAppNames.
 */

(function() {
  var EventCommand, NsOF, kDAppNames,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  module.exports = kDAppNames = (function(superClass) {
    extend(kDAppNames, superClass);

    kDAppNames.id = 'appn';

    kDAppNames.prototype.id = kDAppNames.id;

    kDAppNames.prototype.name = 'kDAppNames';

    kDAppNames.prototype.length = null;

    function kDAppNames() {
      kDAppNames.__super__.constructor.apply(this, arguments);
    }

    kDAppNames.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      return this.data = NsOF.decode(dataBuffer.slice(4));
    };

    return kDAppNames;

  })(EventCommand);

}).call(this);

//# sourceMappingURL=kDAppNames.js.map
