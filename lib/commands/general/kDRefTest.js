
/**
kDRefTest

Desktop <> Newton

ULong 'rtst'
ULong length
NSOF object


This command is first sent from the desktop to the Newton. The Newton
immediately echos the object back to the desktop. The object can be any
NewtonScript object (anything that can be sent through object read/write).
This command can also be sent with no ref attached. If the length is 0 the
command is echoed back to the desktop with no ref included.
 */

(function() {
  var EventCommand, kDRefTest,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDRefTest = (function(superClass) {
    extend(kDRefTest, superClass);

    kDRefTest.id = 'rtst';

    kDRefTest.prototype.id = kDRefTest.id;

    kDRefTest.prototype.name = 'kDRefTest';

    kDRefTest.prototype.length = null;

    function kDRefTest() {
      kDRefTest.__super__.constructor.apply(this, arguments);
    }

    kDRefTest.prototype.dataToBinary = function() {
      var lengthBuff, testData;
      testData = NsOF.encode(this.data);
      lengthBuff = new Buffer(4);
      lengthBuff.writeUInt32BE(data.length, 0);
      return Buffer.concat([lengthBuff, testData]);
    };

    kDRefTest.prototype.dataFromBinary = function(dataBuffer) {
      var err;
      this.length = dataBuffer.readUInt32BE(0);
      try {
        return this.data = NsOF.decode(dataBuffer.slice(4));
      } catch (_error) {
        err = _error;
        console.log("error decoding reftest");
        console.log(dataBuffer.slice(4).toString('hex'));
        throw err;
      }
    };

    return kDRefTest;

  })(EventCommand);

}).call(this);
