
/**
kDHello

Desktop <> Newton

ULong 'helo'
ULong length

This command is sent during long operations to let the Newton or desktop know
that the connection hasn't been dropped.
 */

(function() {
  var EventCommand, kDHello,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDHello = (function(superClass) {
    extend(kDHello, superClass);

    kDHello.id = 'helo';

    kDHello.prototype.id = kDHello.id;

    kDHello.prototype.name = 'kDHello';

    kDHello.prototype.length = 0;

    function kDHello() {
      kDHello.__super__.constructor.apply(this, arguments);
    }

    kDHello.prototype.dataFromBinary = function(dataBuffer) {
      return null;
    };

    return kDHello;

  })(EventCommand);

}).call(this);
