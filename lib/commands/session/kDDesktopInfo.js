(function() {
  var EventCommand, NsOF, Utils, kDDesktopInfo,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');


  /**
  kDDesktopInfo
  
  Desktop > Newton
  
  ULong   'dinf'
  ULong   length
  ULong   protocol version 
  ULong   desktop type i
  ULong   encrypted key 1 
  ULong   encrypted key 2
  ULong   session type
  ULong   allow selective sync
  NSOF    desktop apps
  
  This command is used to negotiate the real protocol version. The protocol 
  version sent with the kDRequestToDock command is now fixed at version 9 (the 
  version used by the 1.0 ROMs) so we can support package loading with NPI 1.0, 
  Connection 2.0 and NTK 1.0. Connection 3.0 will send this command with the real
  protocol version it wants to use to talk to the Newton. The Newton will respond
  with a number equal to or lower than the number sent to it by the desktop. The 
  desktop can then decide whether it can talk the specified protocol or not.
  
  The desktop type identifies the sender – 0 for Macintosh and 1 for Windows.
  
  The password key is used as part of password verification.
  
  Session type will be the real session type and should override what was sent in
  kDInitiateDocking. In fact, it will either be the same as was sent in 
  kDInitiateDocking or kSettingUpSession to indicate that although the desktop has
  accepted a connection, the user has not yet specified an operation.
  
  AllowSelectiveSync is a boolean. The desktop should say no when the user hasn't
  yet done a full sync and, therefore, can't do a selective sync.
    
  DesktopApps is an array of frames that describes who the Newton is talking with.
  Each frame in the array looks like this:
      { name: "Newton Backup Utility", id: 1, version: 1 }
      
  There might be more than one item in the array if the Newton is connecting with a DIL app. The built- in Connection app expects 1 item in the array that has id:
        1: NBU
        2: NCU
  
  It won't allow connection with any other id.
   */

  EventCommand = require('../event-command');

  Utils = require('../../utils');

  NsOF = require('../../nsof');

  module.exports = kDDesktopInfo = (function(superClass) {
    extend(kDDesktopInfo, superClass);

    kDDesktopInfo.id = 'dinf';

    kDDesktopInfo.prototype.id = kDDesktopInfo.id;

    kDDesktopInfo.prototype.name = 'kDDesktopInfo';

    function kDDesktopInfo() {
      kDDesktopInfo.__super__.constructor.apply(this, arguments);
    }

    kDDesktopInfo.prototype.dataToBinary = function() {
      var data, desktopAppsData, lengthBuff;
      data = new Buffer(24);
      data.writeUInt32BE(this.data.protocolVersion, 0);
      data.writeUInt32BE(this.data.desktopType, 4);
      data.writeUInt32BE(this.data.encryptedKey1, 8);
      data.writeUInt32BE(this.data.encryptedKey2, 12);
      data.writeUInt32BE(this.data.sessionType, 16);
      data.writeUInt32BE(this.data.allowSelectiveSync, 20);
      desktopAppsData = NsOF.fromValue(this.data.desktopApps);
      lengthBuff = new Buffer(4);
      lengthBuff.writeUInt32BE(data.length + desktopAppsData.length, 0);
      return Buffer.concat([lengthBuff, data, desktopAppsData, new Buffer([0x00, 0x00])]);
    };

    kDDesktopInfo.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      return this.data = {
        protocolVersion: dataBuffer.readUInt32BE(4),
        desktopType: dataBuffer.readUInt32BE(8),
        encryptedKey1: dataBuffer.readUInt32BE(12),
        encryptedKey2: dataBuffer.readUInt32BE(16),
        sessionType: dataBuffer.readUInt32BE(20),
        allowSelectiveSync: dataBuffer.readUInt32BE(24),
        desktopApps: dataBuffer.slice(28)
      };
    };

    return kDDesktopInfo;

  })(EventCommand);

}).call(this);
