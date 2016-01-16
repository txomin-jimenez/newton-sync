
/**
  Listens for Dock connections from Newton Devices, starts Dock Sessions for
  new connections
@class NcuServer
 */

(function() {
  var DockSession, NcuServer, net,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  net = require('net');

  DockSession = require('./dock-session');

  module.exports = NcuServer = (function() {

    /**
    @property newtonPort
     */
    NcuServer.prototype.newtonPort = 3679;


    /**
    @property netServer
     */

    NcuServer.prototype._netServer = null;


    /**
    @property _connections
     */

    NcuServer.prototype._connections = null;


    /**
    @class NcuServer
    @constructor
     */

    function NcuServer() {
      this._newConnection = bind(this._newConnection, this);
      this._initialize();
    }


    /**
      all init method go here
    @method initialize
     */

    NcuServer.prototype._initialize = function() {
      return this._initNetServer();
    };


    /**
      init TCP server listening for connections
    @method initNetServer
     */

    NcuServer.prototype._initNetServer = function() {
      this._connections = [];
      this._netServer = net.createServer(this._newConnection);
      this._netServer.listen(this.newtonPort, '0.0.0.0');
      return console.log("NCU server listening connections at port " + this.newtonPort);
    };


    /**
      new client connection handler. Creates a new session object. all session
      logic is handled inside
    @method newConnection
     */

    NcuServer.prototype._newConnection = function(socket) {
      var sessionObj;
      console.log("new connection from " + socket.remoteAddress);
      sessionObj = new DockSession({
        socket: socket
      });
      this._connections.push(sessionObj);
      return socket.on('close', (function(_this) {
        return function() {
          return _this._connections.splice(_this._connections.indexOf(sessionObj), 1);
        };
      })(this));
    };

    return NcuServer;

  })();

}).call(this);
