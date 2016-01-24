(function() {
  var EventCommand, kDRequestToDock,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');


  /**
  kDRequestToDock
  
  Desktop < Newton
  
  ULong 'rtdk'
  ULong length = 4
  ULong protocol version
  
  The Newton initiates a session by sending this command to the desktop, which is
  listening on the network, serial, etc. The protocol version is the version of 
  the messaging protocol that's being used by the Newton ROM. The desktop sends 
  a kDInitiateDocking command in response.
   */

  EventCommand = require('../event-command');

  module.exports = kDRequestToDock = (function(superClass) {
    extend(kDRequestToDock, superClass);

    kDRequestToDock.id = 'rtdk';

    kDRequestToDock.kBaseProtocolVersion = 9;

    kDRequestToDock.kDanteProtocolVersion = 10;

    kDRequestToDock.prototype.id = kDRequestToDock.id;

    kDRequestToDock.prototype.name = 'kDRequestToDock';

    kDRequestToDock.prototype.length = 4;

    function kDRequestToDock() {
      kDRequestToDock.__super__.constructor.apply(this, arguments);
    }

    kDRequestToDock.prototype.dataToBinary = function() {
      var data;
      data = new Buffer(8);
      data.writeUInt32BE(this.length, 0);
      data.writeUInt32BE(this.data, 4);
      return data;
    };

    kDRequestToDock.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      return this.data = {
        protocolVersion: dataBuffer.readUInt32BE(4)
      };
    };

    return kDRequestToDock;

  })(EventCommand);

}).call(this);
