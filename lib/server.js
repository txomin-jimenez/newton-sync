
/**
@class NcuServer
 */

(function() {
  var NcuServer,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
      this.initialize();
    }


    /**
    @method initialize
     */

    NcuServer.prototype._initialize = function() {
      return this._initNetServer();
    };


    /**
    @method initNetServer
     */

    NcuServer.prototype._initNetServer = function() {
      this._netServer = net.createServer(this._newConnection);
      this._netServer.listen(this.newtonPort, '0.0.0.0');
      return console.log("NCU server listening connections at port " + this.newtonPort);
    };


    /**
    @method newConnection
     */

    NcuServer.prototype._newConnection = function(socket) {
      console.log("new connection from " + socket.remoteAddress);
      this._connections.push(socket);
      socket.on('data', (function(_this) {
        return function(data) {
          return _this._dataReceived(socket, data);
        };
      })(this));
      return socket.on('end', (function(_this) {
        return function() {
          return _this._connections.splice(_this._connections.indexOf(socket), 1);
        };
      })(this));
    };


    /**
    @method dataReceived
     */

    NcuServer.prototype._dataReceived = function(socket, data) {
      return console.log(data);
    };

    return NcuServer;

  })();

}).call(this);
