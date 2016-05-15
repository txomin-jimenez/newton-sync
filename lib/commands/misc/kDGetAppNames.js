
/**
kDGetAppNames

Desktop > Newton
ULong 'gapp'
ULong length = 4
ULong what to return

This command asks the Newton to send information about the applications
installed on the Newton. See the kDAppNames description below for details of
the information returned. The what to return parameter determines what
information is returned; see the Info to return with kDAppNames enum
in DockProtocol.h.
  0: return names and soups for all stores
  1: return names and soups for current store
  2: return just names for all stores
  3: return just names for current store
 */

(function() {
  var EventCommand, kDGetAppNames,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDGetAppNames = (function(superClass) {
    extend(kDGetAppNames, superClass);

    kDGetAppNames.id = 'gapp';

    kDGetAppNames.prototype.id = kDGetAppNames.id;

    kDGetAppNames.prototype.name = 'kDGetAppNames';

    kDGetAppNames.prototype.length = 4;

    function kDGetAppNames() {
      kDGetAppNames.__super__.constructor.apply(this, arguments);
    }

    kDGetAppNames.prototype.dataToBinary = function() {
      var data;
      data = new Buffer(8);
      data.writeUInt32BE(this.length, 0);
      data.writeUInt32BE(this.data, 4);
      return data;
    };

    return kDGetAppNames;

  })(EventCommand);

}).call(this);
