
/**
kDPWWrong

Desktop > Newton

ULong 'pwbd'
ULong length=0

If the password sent from the Newton is wrong, the desktop indicates this with a
kDPWWrong response. If too many attempts at entering a password have been made,
the desktop can instead respond with a kDResult command indicating a 
kDBadPassword error.
 */

(function() {
  var EventCommand, kDPWWrong,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDPWWrong = (function(superClass) {
    extend(kDPWWrong, superClass);

    kDPWWrong.id = 'pwbd';

    kDPWWrong.prototype.id = kDPWWrong.id;

    kDPWWrong.prototype.name = 'kDPWWrong';

    kDPWWrong.prototype.length = 0;

    function kDPWWrong() {
      kDPWWrong.__super__.constructor.apply(this, arguments);
    }

    kDPWWrong.prototype.dataFromBinary = function(dataBuffer) {
      return null;
    };

    return kDPWWrong;

  })(EventCommand);

}).call(this);
