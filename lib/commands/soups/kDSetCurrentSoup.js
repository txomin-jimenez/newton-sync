
/**
kDSetCurrentSoup

Desktop > Newton

ULong 'ssou'
ULong length
soup name   // C string

This command sets the current soup. Most of the other commands pertain to this 
soup so this command must preceed any command that uses the current soup. If the
soup doesn't exist a kDSoupNotFound error is returned but the connection is left
alive so the desktop can create the soup if necessary. Soup names must be < 25
characters.
 */

(function() {
  var EventCommand, Utils, kDSetCurrentSoup,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  Utils = require('../../utils');

  module.exports = kDSetCurrentSoup = (function(superClass) {
    extend(kDSetCurrentSoup, superClass);

    kDSetCurrentSoup.id = 'ssou';

    kDSetCurrentSoup.prototype.id = kDSetCurrentSoup.id;

    kDSetCurrentSoup.prototype.name = 'kDSetCurrentSoup';

    kDSetCurrentSoup.prototype.length = null;

    function kDSetCurrentSoup() {
      kDSetCurrentSoup.__super__.constructor.apply(this, arguments);
    }

    kDSetCurrentSoup.prototype.dataToBinary = function() {
      var frameData, lengthBuff;
      frameData = Utils.unichar.toUniCharBuffer(this.data);
      lengthBuff = new Buffer(4);
      lengthBuff.writeUInt32BE(frameData.length, 0);
      return Buffer.concat([lengthBuff, frameData]);
    };

    return kDSetCurrentSoup;

  })(EventCommand);

}).call(this);
