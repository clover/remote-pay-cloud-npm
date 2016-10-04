//*********************************************
// Connect to the device , send, receive messages
//*********************************************

var CloverID = require("./CloverID.js");
var CloverError = require("./CloverError.js");
var EventEmitter = require("eventemitter3");
var XmlHttpSupport = require("./xmlHttpSupport.js");

var RemoteMessageBuilder = require("./RemoteMessageBuilder.js");

var Logger = require('./Logger.js');

/**
 * The object used to communicate with the device.
 *
 *
 * @constructor
 */
function WebSocketDevice(allowOvertakeConnection, friendlyId) {
    this.log = Logger.create();
    // This is the websocket connection
    this.deviceSocket = null;
    // The id for the ping interval timer so we can stop it
    this.pingIntervalId = null;
    // flag for echoing messages to the console
    this.echoAllMessages = false;
    // The last time a pong was received, set to current time initially
    this.pongReceivedMillis = new Date().getTime();
    // The last time a ping was sent, set to current time initially
    this.pingSentMillis = new Date().getTime();
    // How often a ping is sent
    this.millisecondsBetweenPings = 5000; // 5 seconds
    // How long should it be before we warn on a dead connection
    this.deadConnectionWarnThreshold = this.millisecondsBetweenPings * 2;
    // How long should it be before we error on a dead connection
    this.deadConnectionErrorThreshold = this.deadConnectionWarnThreshold * 4;
    // How long should it be before we shut down on a dead connection
    this.deadConnectionShutdownThreshold = this.deadConnectionErrorThreshold * 2;
    this.allowOvertakeConnection = allowOvertakeConnection;
    this.friendlyId = CloverID.getNewId();
    if(friendlyId) {
        this.friendlyId = friendlyId;
    }
    // Flag to indicate if we attempt reconnects
    this.reconnect = true;
    this.reconnectAttempts = 0;
    this.numberOfReconnectAttemptsBeforeWeGiveUp = 5;
    this.timebetweenReconnectAttempts = 6000;
    // A queue of messages that may be populated while we attempt to reconnect.
    this.resendQueue = [];

    // Used to emit messages and state of the device
    this.eventEmitter = new EventEmitter();

    /**
     * Initiates contact with the device.
     *
     * @param {url} ws_address - the web service url to connect to to communicate with the clover device
     */
    this.contactDevice = function(ws_address) {
        this.baseAddress = ws_address;
        this.reContactDevice(this.generateAddress(this.baseAddress));
    };

    this.generateAddress = function(baseAddress) {
        var connect = "?";
        if(baseAddress.indexOf("?") > -1){
            connect = "&";
        }
        var generatedAddress = baseAddress + connect + "friendlyId=" + this.friendlyId;
        if(this.allowOvertakeConnection) {
            generatedAddress = generatedAddress + connect + "forceConnect=true";
        } else {
            generatedAddress = generatedAddress + connect + "forceConnect=false";
        }
        return generatedAddress;
    };
    /**
     * Initiates contact with the device.
     *
     * @param {url} ws_address - the web service url to connect to to communicate with the clover device
     */
    this.reContactDevice = function(ws_address) {
        var me = this;
        // Reset the timestamp values
        // this.pongReceivedMillis = new Date().getTime();
        this.pingSentMillis = new Date().getTime();

        /*
         * Start the websocket connection to the device
         */
        if (ws_address) {
            // This will be a connection to the clover POSApiServer/SupportServer.  The url
            // can include the device id to contact, and let the server determine how to get
            // to the device (it is doing that now , but it is hardcoded)
            // deviceSocket = new WebSocket("ws://localhost:18000");
            try {
                me.log.debug("contacting device");

                // A different way to deal with the 401 error that
                // occurs when a websocket connection is made to the
                // server (sometimes).  Do a preliminary OPTIONS
                // request.  Although this happens regarless of if the error
                // happens, it is tremendously faster.
                var wssUrl = ws_address;// me.deviceSocket.url;

                var httpUrl = null;
                if (wssUrl.indexOf("wss") > -1) {
                    httpUrl = wssUrl.replace("wss", "https");
                } else {
                    httpUrl = ws_address.replace("ws", "http");
                }

                if (!me.xmlHttpSupport) {
                    me.xmlHttpSupport = new XmlHttpSupport();
                }
                me.xmlHttpSupport.options(httpUrl,
                    function () {me.startSSSS(ws_address)},
                    function () {me.startSSSS(ws_address)}
                    );
            } catch (error) {
                me.log.error(error);
            }
        }
    };

    this.startSSSS = function(ws_address) {
        var me = this;
        // See com.clover.support.handler.remote_pay.RemotePayConnectionControlHandler#X_CLOVER_CONNECTED_ID
        var connectedId = me.xmlHttpSupport.getResponseHeader("X-CLOVER-CONNECTED-ID");

        if (connectedId && !this.allowOvertakeConnection) {
            if (this.friendlyId == connectedId) {
                // Do anything here?  This is already connected.
                this.log.debug("Trying to connect, but already connected.");
            } else {
                this.connectionDenied(connectedId);
                return;
            }
            if (this.deviceSocket && this.deviceSocket.readyState == WebSocket.OPEN) {
                return;
            }
        }

        if (!this.deviceSocket || this.deviceSocket.readyState != WebSocket.OPEN) {
            this.log.debug("Contacting url - " + ws_address);
            this.deviceSocket = new WebSocket(
                //        "ws://192.168.0.56:49152"
                //        selectedDevice.websocket_direct
                ws_address
            );
            this.log.debug("this.deviceSocket = " + this.deviceSocket);
            this.deviceSocket.onopen = function (event) {
                me.log.debug("deviceSocket.onopen");
                me.reconnecting = false;
                me.reconnectAttempts = 0;
                // Set up the ping for every X seconds
                if(me.pingIntervalId) {
                    clearInterval(me.pingIntervalId);
                }
                me.pingIntervalId = setInterval(function () {
                    me.checkDeadConnection();
                    me.ping();
                }, me.millisecondsBetweenPings);
                me.onopen(event);
            };

            this.deviceSocket.onmessage = function (event) {
                var jsonMessage = JSON.parse(event.data);
                me.receiveMessage(jsonMessage);
            };

            this.deviceSocket.onerror = function (event) {
                me.log.error(event);
                if (me.reconnect) {
                    me.startupReconnect(me.timebetweenReconnectAttempts);
                }
                else {
                    me.onerror(event);
                }
            };

            this.deviceSocket.onclose = function (event) {
                try {
                    me.log.debug("Clearing ping thread");
                    if(me.pingIntervalId) {
                        clearInterval(me.pingIntervalId);
                    }
                } catch (e) {
                    me.log.error(e);
                }
                me.onclose(event);
            }
        }
    };


    this.startupReconnect = function(delay) {
        if(!delay)delay=1;
        if (this.reconnectAttempts < this.numberOfReconnectAttemptsBeforeWeGiveUp) {
            this.reconnectAttempts++;
            setTimeout(
                function () {
                    this.reconnectAttempts++;
                    this.attemptReconnect();
                }.bind(this), delay);
        }
        else {
            this.log.error("Exceeded number of reconnect attempts, giving up. There are " +
                this.resendQueue.length + " messages that were queued, but not sent.");
            this.reconnectAttempts = 0;
            this.onerror(event);
        }
    };

    /**
     * Called to check the state of the connection.
     *
     * @private
     */
    this.checkDeadConnection  = function() {
        if(this.pongReceivedMillis < this.pingSentMillis) {
            var currentMillis = new Date().getTime();
            var lag = (currentMillis - this.pongReceivedMillis);
            if(lag > this.deadConnectionWarnThreshold) {
                if(lag > this.deadConnectionErrorThreshold) {
                    this.pongReceivedMillis = new Date().getTime();
                    this.connectionError(lag);
                }
                else {
                    this.connectionWarning(lag);
                }
            }
        }
        else {
            this.connectionOK();
        }
    };

    /**
     * Called when an initial connection is actively denied, typically because the
     * device is already paired to another terminal.
     *
     * @param terminalIdPairedTo
     */
    this.connectionDenied = function(terminalIdPairedTo) {
        this.eventEmitter.emit(WebSocketDevice.CONNECTION_DENIED, terminalIdPairedTo);
        this.eventEmitter.emit(WebSocketDevice.ALL_MESSAGES, terminalIdPairedTo);
    };

    /**
     * Called when the connection is OK.
     * Emits the
     *  WebSocketDevice.CONNECTION_OK message to registered listeners.
     */
    this.connectionOK = function() {
        var message = "Connection Ok";
        this.eventEmitter.emit(WebSocketDevice.CONNECTION_OK, message);
        this.eventEmitter.emit(WebSocketDevice.ALL_MESSAGES, message);
    };

    /**
     * The connection was taken away from us.  Do NOT try to reconnect!
     *
     * @param message
     */
    this.connectionStolen = function(message) {
        this.eventEmitter.emit(WebSocketDevice.CONNECTION_STOLEN, message);
        this.eventEmitter.emit(WebSocketDevice.ALL_MESSAGES, message);
        this.forceClose(true);
    };

    /**
     * Called when the lag on communication has reached an error length
     * Emits the
     *  WebSocketDevice.CONNECTION_ERROR message to registered listeners.
     * @param {Number} lag - the number of milliseconds between communication to and from the device.  Measured as
     *  related to 'pong' responses to a 'ping'
     */
    this.connectionError = function(lag) {
        var message = "Connection appears to be dead...no response in " + lag + " milliseconds";
        // Protect users from themselves.  If the connection lag has exceeded an absolute maximum
        // without response, shut it down.
        if(lag > this.deadConnectionShutdownThreshold) {
            message += "  This exceeds the system maximum wait, shutting down.";
            this.forceClose();
        }
        this.eventEmitter.emit(WebSocketDevice.CONNECTION_ERROR, message);
        this.eventEmitter.emit(WebSocketDevice.ALL_MESSAGES, message);
    };

    /**
     * Called when the lag on communication has reached a warning length
     * Emits the
     *  WebSocketDevice.CONNECTION_WARNING message to registered listeners.
     * @param {Number} lag - the number of milliseconds between communication to and from the device.  Measured as
     *  related to 'pong' responses to a 'ping'
     */
    this.connectionWarning = function(lag) {
        var message = "Connection is slow...no response in " + lag + " milliseconds";
        this.eventEmitter.emit(WebSocketDevice.CONNECTION_WARNING, message);
        this.eventEmitter.emit(WebSocketDevice.ALL_MESSAGES, message);
    };

    /**
     * Called on device error
     * Emits the
     *  WebSocketDevice.DEVICE_ERROR event to registered listeners.
     * @param event
     */
    this.onerror = function(event) {
        this.eventEmitter.emit(WebSocketDevice.DEVICE_ERROR, event);
        this.eventEmitter.emit(WebSocketDevice.ALL_MESSAGES, event);
    };

    /**
     * Called when the device is opened
     * Emits the
     *  WebSocketDevice.DEVICE_OPEN event to registered listeners.
     * @param event
     */
    this.onopen = function(event) {
        this.eventEmitter.emit(WebSocketDevice.DEVICE_OPEN, event);
        this.eventEmitter.emit(WebSocketDevice.ALL_MESSAGES, event);
    };

    /**
     * Called when the device is closed
     * Emits the
     *  WebSocketDevice.DEVICE_CLOSE event to registered listeners.
     * @param event
     */
    this.onclose = function(event) {
        this.eventEmitter.emit(WebSocketDevice.DEVICE_CLOSE, event);
        this.eventEmitter.emit(WebSocketDevice.ALL_MESSAGES, event);
    };

    /**
     * Called to initiate disconnect from the device
     */
    this.disconnectFromDevice = function() {
        this.reconnect = false;
        this.forceClose();
    };

    /**
     * Do not really want to ever have to do this, but it is
     * sometimes needed.  The above #WebSocketDevice.disconnectFromDevice
     * is how this should be closed.  That sends a message to the device
     * to tell it that we are closing.  But this may be needed if the
     * device is not responsive.
     *
     * @param skipSendShutdown - if true, then the shutdown message is NOT
     *  sent to the device.
     */
    this.forceClose = function (skipSendShutdown) {
        try {
            clearInterval(this.pingIntervalId);
        } catch (e) {
        }
        if(!skipSendShutdown) {
            var oldReconnect = this.reconnect;
            this.reconnect = false;
            try {
                this.sendShutdown();
            } catch (e) {
            }
            this.reconnect = oldReconnect;
        }
        setTimeout(function() {
            if (this.deviceSocket) {
                try {
                    this.deviceSocket.close();
                } catch (e) {
                }
            }
        }.bind(this), 2000);
    };

    /**
     * Called to attempt to reconnect ot the device
     * @private
     */
    this.attemptReconnect = function() {
        {
            // Disconnect without telling the peer that we
            // wantto, because it appears
            // the connection may have gone stale.
            clearInterval(this.pingIntervalId);
            if(this.deviceSocket.readyState == WebSocket.OPEN) {
                this.deviceSocket.close();
            }
        }
        this.reconnecting = true;
        this.log.debug("attempting reconnect...");
        var me = this;
        if (this["bootStrapReconnect"]) {
            // Depending on the configuration, we may be able to tell the device to wake
            // up.
            this["bootStrapReconnect"](
                function() {
                    me.reContactDevice(me.generateAddress(me.baseAddress));
                }
            );
        } else {
            // Cannot tell device to wake up, we do not have a bootstrap/notification
            // configuration for it. It may require that the user starts the cloud pay display
            this.reContactDevice(this.generateAddress(this.baseAddress));
        }
    };

    /**
     * Send a message on the websocket.  The parameter will be serialized to json
     * @param {Object} message - the message to send
     */
    this.sendMessage = function(message) {
        var stringMessage = message==null?null:JSON.stringify(message);
        if(this.echoAllMessages) {
            this.log.debug("sending message:" + stringMessage)
        }
        // If the deviceSocket is closed or closing, we may try to reconnect
        if(this.deviceSocket.readyState == WebSocket.CLOSING || this.deviceSocket.readyState == WebSocket.CLOSED) {
            // If we are set up to try to reconnect
            if(this.reconnect) {
                // Push the message we just got on a resend queue
                if (stringMessage) {
                    this.resendQueue.push(stringMessage);
                }
                // If we are not already trying to reconnect, try now
                if(!this.reconnecting) {
                    this.attemptReconnect();
                }
            }
            else {
                this.disconnectFromDevice();
                throw new CloverError(CloverError.DEVICE_OFFLINE, "Device disconnected, message not sent: " +
                  stringMessage );
            }
        }
        else {
            // If the websocket is not completely connected yet, put the message on the queue and call sendMessage again
            // with a null message.  That way the message order will be correct.  If another message comes through
            // before the timeout expires, the queue will be drained first, so the message will go throgh in order, and
            // the send that results from the timeout will do nothing.
            if (this.deviceSocket.readyState == WebSocket.CONNECTING) {
                // The message is not null, put it on the queue and call
                // send again.
                if (stringMessage) {
                    this.resendQueue.push(stringMessage);
                    var me = this;
                    setTimeout(me.sendMessage.bind(me), me.millisecondsBetweenPings);
                }
            } else {
                // If there is anything in the resend queue, send it now.
                while (this.resendQueue.length > 0) {
                    this.deviceSocket.send(this.resendQueue.shift());
                }
                // If a message was passed, send it.
                if (stringMessage) {
                    this.deviceSocket.send(stringMessage);
                }
            }
        }
    };

    /**
     * Get a message on the websocket.
     * @param {Object} message - the message received on the socket
     * @private
     */
    this.receiveMessage = function(message) {
        if(this.echoAllMessages) {
            var stringMessage = JSON.stringify(message);
            this.log.debug("receive message:" + stringMessage)
        }
        if(message.hasOwnProperty("type")) {
            if(message["type"] == RemoteMessageBuilder.PONG) {
                this.pongReceived(message);
            } else if(message["type"] == RemoteMessageBuilder.PING) {
                this.pingReceived(message);
            } if(message["type"] == RemoteMessageBuilder.FORCE) {
                this.connectionStolen(message);
            }
        }
        if(message.hasOwnProperty("method")) {
            // note: Look at JSON.parse(text[, reviver]).
            // This can be used with the MethodToMessage class
            // to automatically parse the json into the correct objects.
            this.eventEmitter.emit(message.method, message);
        }
        this.eventEmitter.emit(WebSocketDevice.ALL_MESSAGES, message);
    };

    /**
     * Registers event callbacks for message method types, and device state.
     *
     * @see LanMethod
     *
     * @param {string} eventName - one of the LanMethod types, or one of the
     *  LOCAL_EVENT types for device state.
     * @param {function} callback - the function called with the event data
     */
    this.on = function (eventName, callback) {
        this.eventEmitter.on(eventName, callback);
    };

    /**
     * Unregisters an event callback.
     *
     * @param eventName
     * @param callback
     */
    this.removeListener = function (eventName, callback) {
        this.eventEmitter.removeListener(eventName, callback);
    };

    /**
     * Unregisters a set of event callbacks.
     *
     * @param {Array} listeners - an array of objects of the form {"event":LanMethod.FINISH_OK, "callback":finishOKCB}
     */
    this.removeListeners = function (listeners) {
        for(var idx=0;idx<listeners.length;idx++){
            this.removeListener(listeners[idx].event, listeners[idx.callback]);
        }
    };

    /**
     * Registers event callbacks for message method types, and device state. The callback will be
     * called at most once.
     *
     * @see LanMethod
     *
     * @param {string} eventName - one of the LanMethod types, or one of the
     *  LOCAL_EVENT types for device state.
     * @param {function} callback - the function called with the event data
     */
    this.once = function (eventName, callback) {
        this.eventEmitter.once(eventName, callback);
    };

    /**
     * @private
     */
    this.pongReceived = function() {
        this.pongReceivedMillis = new Date().getTime();
    };

    /**
     * @private
     */
    this.pingReceived = function() {
        this.pong();
    };

    /**
     * @private
     */
    this.pong = function() {
        this.pingSentMillis = new Date().getTime();
        this.sendMessage(this.messageBuilder.buildPong());
    };

    /**
     * @private
     */
    this.ping = function() {
        this.pingSentMillis = new Date().getTime();
        this.sendMessage(this.messageBuilder.buildPing());
    }
}

/**
 * Special message method type used to receive all messages received by this device interface.  Used when registering
 * a callback to the WebSocketDevice.on function
 */
WebSocketDevice.ALL_MESSAGES = "ALL_MESSAGES";

// Device state events
/**
 * Prefix for events that are local to the device - right now just
 * for device state events.
 * @type {string}
 */
WebSocketDevice.LOCAL_EVENT = "LOCAL_EVENT";

/**
 * Event emitter key for connection stolen messages
 * @type {string}
 */
WebSocketDevice.CONNECTION_STOLEN = WebSocketDevice.LOCAL_EVENT + "_CONNECTION_STOLEN";
/**
 * Event emitter key for connection denied messages
 * @type {string}
 */
WebSocketDevice.CONNECTION_DENIED = WebSocketDevice.LOCAL_EVENT + "_CONNECTION_DENIED";
/**
 * Event emitter key for connection ok messages
 * @type {string}
 */
WebSocketDevice.CONNECTION_OK = WebSocketDevice.LOCAL_EVENT + "_CONNECTION_OK";
/**
 * Event emitter key for connection error messages
 * @type {string}
 */
WebSocketDevice.CONNECTION_ERROR = WebSocketDevice.LOCAL_EVENT + "_CONNECTION_ERROR";
/**
 * Event emitter key for connection warning messages
 * @type {string}
 */
WebSocketDevice.CONNECTION_WARNING = WebSocketDevice.LOCAL_EVENT + "_CONNECTION_WARNING";
/**
 * Event emitter key for device error events
 * @type {string}
 */
WebSocketDevice.DEVICE_ERROR = WebSocketDevice.LOCAL_EVENT + "_DEVICE_ERROR";
/**
 * Event emitter key for device open events
 * @type {string}
 */
WebSocketDevice.DEVICE_OPEN = WebSocketDevice.LOCAL_EVENT + "_DEVICE_OPEN";
/**
 * Event emitter key for device close events
 * @type {string}
 */
WebSocketDevice.DEVICE_CLOSE = WebSocketDevice.LOCAL_EVENT + "_DEVICE_CLOSE";


//**************************************************************
// Functionality to deal with sending messages
//**************************************************************


// Send an update to the order to the device.  No idea what the update is,
// this is just the comms
/**
 * TElls the device to display the passed order.
 *
 * @param {Object} order - the entire order json object
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendShowOrderScreen = function(order, ackId) {
    var payload = {
        "order": JSON.stringify(order)
    };
    var lanMessage = this.messageBuilder.buildShowOrderScreen(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) {
        lanMessage.id = ackId;
    }

    this.sendMessage(lanMessage);
};

/**
 * @typedef {Object} Operation
 * @property {string} orderId - the id of the order the operation is on
 * @property {StringArray} ids - a array container of ids for the order operation
 */

/**
 * @typedef {Object} StringArray
 * @property {string[]} elements - string elements
 */

/**
 * Sends an update to the order to the device, and causes it to display the change.
 *
 * @param {Object} order - the entire order json object
 * @param {Operation} lineItemsAddedOperation
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendShowOrderLineItemAdded = function(order, lineItemsAddedOperation, ackId) {
    var payload = {
        "order": JSON.stringify(order),
        "lineItemsAddedOperation": JSON.stringify(lineItemsAddedOperation)
    };
    var lanMessage = this.messageBuilder.buildShowOrderScreen(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Sends an update to the order to the device, and causes it to display the change.
 *
 * @param {Object} order - the entire order json object
 * @param {Operation} lineItemsDeletedOperation
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendShowOrderLineItemRemoved = function(order, lineItemsDeletedOperation, ackId) {
    var payload = {
        "order": JSON.stringify(order),
        "lineItemsDeletedOperation": JSON.stringify(lineItemsDeletedOperation)
    };
    var lanMessage = this.messageBuilder.buildShowOrderScreen(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Sends an update to the order to the device, and causes it to display the change.
 *
 * @param {Object} order - the entire order json object
 * @param {Operation} discountsAddedOperation
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendShowOrderDiscountAdded = function(order, discountsAddedOperation, ackId) {
    var payload = {
        "order": JSON.stringify(order),
        "discountsAddedOperation": JSON.stringify(discountsAddedOperation)
    };
    var lanMessage = this.messageBuilder.buildShowOrderScreen(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Sends an update to the order to the device, and causes it to display the change.
 *
 * @param {Object} order - the entire order json object
 * @param {Operation} discountsDeletedOperation
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendShowOrderDiscountRemoved = function(order, discountsDeletedOperation, ackId) {
    var payload = {
        "order": JSON.stringify(order),
        "discountsDeletedOperation": JSON.stringify(discountsDeletedOperation)
    };
    var lanMessage = this.messageBuilder.buildShowOrderScreen(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 *
 * @param {KeyPress} keyCode - the KeyPress to send to the device
 * @param [ackId] - an optional id for the message.  If set then the keypress will be acknowledged,
 *  otherwise there will be no response.
 */
WebSocketDevice.prototype.sendKeyPress = function(keyCode, ackId) {
    var payload = {
        "keyPress": keyCode
    };
    var lanMessage = this.messageBuilder.buildKeyPress(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};


/**
 *
 * @param [ackId] - an optional id for the message.  If set then the break will be acknowledged,
 *  otherwise there will be no response.
 */
WebSocketDevice.prototype.sendBreak = function(ackId) {
    var payload = {

    };
    var lanMessage = this.messageBuilder.buildBreak(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};


//
/**
 * Send a message to start a transaction.  This will make the device display the payment screen
 *
 * @param {Object} payIntent - the payment intention object
 * @param {boolean} suppressOnScreenTips
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendTXStart = function(payIntent, suppressOnScreenTips, ackId) {

    // This is how they are doing the payload...
    var payload = {
        "payIntent": payIntent,
        "suppressOnScreenTips": suppressOnScreenTips
    };

    var lanMessage = this.messageBuilder.buildTxStart(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

//
/**
 * Verify that the signature is valid
 *
 * @param {Object} payment - the payment object with signature verification fields populated (positively)
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendSignatureVerified = function(payment, ackId) {
    var payload = {};
    payload.verified = true;
    payload.payment = JSON.stringify(payment);

    var lanMessage = this.messageBuilder.buildSignatureVerified(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

// Reject the signature
/**
 * Verify that the signature is NOT valid
 *
 * @param {Object} payment - the payment object with signature verification fields populated (negatively)
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendSignatureRejected = function(payment, ackId) {
    var payload = {};
    payload.verified = false;
    payload.payment = JSON.stringify(payment);

    var lanMessage = this.messageBuilder.buildSignatureVerified(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Void a payment
 *
 * @param {Object} payment - the payment object with signature verification fields populated (negatively)
 * @param voidReason
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendVoidPayment = function(payment, voidReason, ackId) {
    var payload = {};
    payload.payment = JSON.stringify(payment);
    payload.voidReason = voidReason;

    var lanMessage = this.messageBuilder.buildVoidPayment(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Vault a card
 *
 * @param {int} cardEntryMethods - card entry methods, bitwise OR of {@link CardEntryMethods} constants
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendVaultCard = function(cardEntryMethods, ackId) {
    var payload = {};
    payload.cardEntryMethods = cardEntryMethods;

    var lanMessage = this.messageBuilder.buildVaultCard(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Refund a payment, partial or complete
 *
 * @param {string} orderId - the id for the order the refund is against
 * @param {string} paymentId - the id for the payment on the order the refund is against
 * @param {number} [amount] - the amount that will be refunded.  If not included, the amount of
 *  the passed payment will be refunded.
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendRefund = function(orderId, paymentId, amount, ackId) {
    var payload = {};
    payload.orderId = orderId;
    payload.paymentId = paymentId;
    if(amount)payload.amount = amount;

    var lanMessage = this.messageBuilder.buildRefund(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Refund a payment, partial or complete
 *
 * @param {string} orderId - the id for the order the refund is against
 * @param {string} paymentId - the id for the payment on the order the refund is against
 * @param {number} [amount] - the amount that will be refunded.
 * @param {boolean} [fullRefund] - If true, the amount of the passed payment will be refunded.
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendRefundV2 = function(orderId, paymentId, amount, fullRefund, ackId) {
    var payload = {};
    payload.orderId = orderId;
    payload.paymentId = paymentId;
    if(fullRefund) {
        payload.fullRefund = fullRefund;
    } else if(amount) {
        payload.amount = amount;
    }
    payload.version = 2;
    var lanMessage = this.messageBuilder.buildRefund(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Capture a preauthorization
 *
 * @param {string} orderId - the id for the order the payment was against
 * @param {string} paymentId - the id for the payment on the order the preauth is against
 * @param {number} amount - the final amount for the payment, not including the tip
 * @param {number} [tipAmount] - the tip for the order
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendCapturePreAuth = function(orderId, paymentId, amount, tipAmount, ackId) {
    var payload = {};
    payload.orderId = orderId;
    payload.paymentId = paymentId;
    if(amount)payload.amount = amount;
    if(tipAmount)payload.tipAmount = tipAmount;

    var lanMessage = this.messageBuilder.buildCapturePreAuth(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};



/**
 * Capture a preauthorization
 *
 * @param allowOpenTabs
 * @param batchId
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendCloseout = function(allowOpenTabs, batchId, ackId) {
    var payload = {};
    payload.allowOpenTabs = allowOpenTabs;
    payload.batchId = batchId;

    var lanMessage = this.messageBuilder.buildCloseout(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};


/**
 * Adjust a payment
 *
 * @param {string} orderId - the id for the order the adjust is against
 * @param {string} paymentId - the id for the payment on the order the adjust is against
 * @param {number} tipAmount - the amount that will be adjusted.
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendTipAdjust = function(orderId, paymentId, tipAmount, ackId) {
    var payload = {};
    payload.orderId = orderId;
    payload.paymentId = paymentId;
    payload.tipAmount = tipAmount;

    var lanMessage = this.messageBuilder.buildTipAdjust(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Show the receipt options screen for a specific orderid/paymentid.
 *
 * @deprecated - this function will result in a Finish_OK message being returned.
 *  Use sendShowPaymentReceiptOptionsV2 instead.  sendShowPaymentReceiptOptionsV2
 *  results in only the UI_STATE messages, which is preferable.
 * @param {string} orderId - the id for the order
 * @param {string} paymentId - the id for the payment on the order
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendShowPaymentReceiptOptions = function(orderId, paymentId, ackId) {
    var payload = {};
    payload.orderId = orderId;
    payload.paymentId = paymentId;

    var lanMessage = this.messageBuilder.buildShowPaymentReceiptOptions(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Show the receipt options screen for a specific orderid/paymentid.
 *
 * @param {string} orderId - the id for the order
 * @param {string} paymentId - the id for the payment on the order
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendShowPaymentReceiptOptionsV2 = function(orderId, paymentId, ackId) {
    var payload = {};
    payload.orderId = orderId;
    payload.paymentId = paymentId;
    payload.version = 2;

    var lanMessage = this.messageBuilder.buildShowPaymentReceiptOptions(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Open the cash drawer (if one is connected).
 *
 * @param {string} reason - the reason the drawer was opened
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendOpenCashDrawer = function(reason, ackId) {
    var payload = {};
    payload.reason = reason;

    var lanMessage = this.messageBuilder.buildOpenCashDrawer(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Send a cancellation message
 *
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendFinishCancel = function(ackId) {
    var lanMessage = this.messageBuilder.buildFinishCancel();
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Send a message to show the 'Thank You' screen
 *
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendShowThankYouScreen = function(ackId) {
    var lanMessage = this.messageBuilder.buildShowThankYouScreen();
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Send a message to show the 'Welcome' screen
 *
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendShowWelcomeScreen = function(ackId) {
    var lanMessage = this.messageBuilder.buildShowWelcomeScreen();
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Send a message to show a custom message on the screen
 *
 * @param {string} message - the message to display
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendTerminalMessage = function(message, ackId) {
    var payload = {"text" : message};
    var lanMessage = this.messageBuilder.buildTerminalMessage(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Send a message to ask the device if it is there.
 *
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendDiscoveryRequest = function(ackId) {
    var lanMessage = this.messageBuilder.buildDiscoveryRequest();
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Send a message to ask the device to print some text
 *
 * @param textLines - an  array of strings
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendPrintText = function(textLines, ackId) {
    //List<String> textLines
    var payload = {"textLines" : textLines};
    var lanMessage = this.messageBuilder.buildPrintText(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Send a message to ask the device to shutdown the connection.
 */
WebSocketDevice.prototype.sendShutdown = function() {
    var lanMessage = this.messageBuilder.buildShutdown();
    // Note:  the 'ack' is not included here because the device will
    // be shutting down,
    this.sendMessage(lanMessage);
};

/**
 * Send a message with an image for the device to print.
 *
 * @param img - an image.  Can be obtained in a manner similar to :
 *  <pre>var img = document.getElementById("img_id");</pre>
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendPrintImage = function(img, ackId) {
    var payload = {"png" : this.getBase64Image(img) };
    var lanMessage = this.messageBuilder.buildPrintImage(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};


/**
 * Send a message with an image url for the device to print.
 *
 * @param urlString - a url to an image that is reachable from the device
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendPrintImageFromURL = function(urlString, ackId) {
    var payload = {"urlString" : urlString };
    var lanMessage = this.messageBuilder.buildPrintImage(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};

/**
 * Send a message to the device to get the last message it received, along with the response
 * returned (if any)
 *
 * @param {string} [ackId] - an optional identifier that can be used to track an acknowledgement
 *  to this message.  This should be a unique identifier, but this is NOT enforced in any way.
 *  A "ACK" message will be returned with this identifier as the message id if this
 *  parameter is included.  This "ACK" message will be in addition to any other message
 *  that may be generated as a result of this message being sent.
 */
WebSocketDevice.prototype.sendLastMessageRequest = function(ackId) {
    var payload = {};
    var lanMessage = this.messageBuilder.buildLastMessageRequest(payload);
    // If an id is included, then an "ACK" message will be sent for this message
    if(ackId) lanMessage.id = ackId;

    this.sendMessage(lanMessage);
};


/**
 * @private
 * @param img
 * @returns {string}
 */
WebSocketDevice.prototype.getBase64Image = function(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
};

//
// Expose the module.
//
if ('undefined' !== typeof module) {
    module.exports = WebSocketDevice;
}
