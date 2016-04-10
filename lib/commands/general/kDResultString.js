
/**
kDResultString

Desktop > Newton

ULong 'ress'
ULong length
SLong error code 
NSOF  error string

Reports a desktop error to the Newton. The string is included since the Newton 
doesn't know how to decode all the desktop errors
 */

(function() {
  var EventCommand, NsOF, kDResultString,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  module.exports = kDResultString = (function(superClass) {
    extend(kDResultString, superClass);

    kDResultString.id = 'ress';

    kDResultString.prototype.id = kDResultString.id;

    kDResultString.prototype.name = 'kDResultString';

    kDResultString.prototype.length = null;

    function kDResultString() {
      kDResultString.__super__.constructor.apply(this, arguments);
    }

    kDResultString.prototype.dataToBinary = function() {
      var errorData, headerData, lengthBuff, result;
      errorData = NsOF.encode(this.data.message);
      lengthBuff = new Buffer('ffffffff', 'hex');
      headerData = new Buffer(4);
      headerData.writeInt32BE(this.data.code, 0);
      result = Buffer.concat([lengthBuff, headerData, errorData]);
      console.log(result.toString('hex'));
      return result;
    };

    return kDResultString;

  })(EventCommand);

}).call(this);
