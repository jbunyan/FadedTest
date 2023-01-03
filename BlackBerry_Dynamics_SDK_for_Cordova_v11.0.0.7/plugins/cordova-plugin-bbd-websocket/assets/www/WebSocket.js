/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 */

;
(function() {
    var cordovaExec = require('cordova/exec');
    var base64 = require('cordova/base64');

    // =====================================================================================
    //      EventTarget
    //  Implementation of EventTarget interface for the GDWebSocket prototype.
    //  Implements the "addEventListener" and "removeEventListener" functions. "fireEvent"
    //  function is used as a callback trigger. "listeners" property is used to save binded
    //  to GDWebSocket callbacks for "open", "message", "close", "error" events
    // =====================================================================================
    var EventTarget = function() {
        var eventListeners = {};

        Object.defineProperty(this, 'listeners', {
            get: function() {
                return eventListeners;
            },
            enumerable: false
        });
    }

    Object.defineProperty(EventTarget, 'toString', {
        value: function() {
            return 'function EventTarget() { [native code] }';
        },
        enumerable: false
    })

    EventTarget.prototype.constructor = EventTarget;

    EventTarget.prototype.addEventListener = function(type, callback) {
        if (arguments < 2) {
            throw new Error("TypeError: Failed to execute 'addEventListener' on 'EventTarget': 2 arguments required, but only" + arguments.length + "present.");
        }
        if (typeof type === 'string' && typeof callback === 'function') {
            if (typeof this.listeners[type] == 'undefined') {
                this.listeners[type] = [];
            }

            this.listeners[type].push(callback);
        }
    };

    EventTarget.prototype.fireEvent = function(event) {
        if (typeof event == "string") {
            event = { type: event };
        }
        if (!event.target) {
            event.target = this;
        }

        if (!event.type) {
            event.type = event.target.toString();
        }

        if (this.listeners[event.type] instanceof Array) {
            var listeners = this.listeners[event.type];
            for (var i = 0, len = listeners.length; i < len; i++) {
                if (typeof listeners[i] === 'function') {
                    listeners[i].call(this, event);
                }
            }
        }
    };

    EventTarget.prototype.removeEventListener = function(type, listener) {
        if (this.eventListeners[type] instanceof Array) {
            var listeners = this.eventListeners[type];
            for (var i = 0, len = listeners.length; i < len; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }

    hideOwnPropertiesImplementation(EventTarget.prototype);

    // =====================================================================================
    //      WebSocket
    //  Inherits the own properties and prototype own properties of EventTarget
    // =====================================================================================
    var CLOSE_NORMAL = 1000;
    var CLOSE_NORMAL_REASON = 'Normal closure';

    var nextWebSocketId = 0;

    /**
     * @class WebSocket
     *
     * @classdesc Implements the secure WebSocket API based on standard WebSocket specification
     * (see <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket">https://developer.mozilla.org/en-US/docs/Web/API/WebSocket</a>).
     * <br/>
     * WebSocket object provides the API for creating and managing a WebSocket connection
     * to a server, as well as for sending and receiving data on the connection.
     * <br/>
     * WebSocket supports both `ws://` and `wss://` protocols.
     * <br/>
     * WebSocket supports text or binary (`Blob`, `ArrayBuffer`) data types for sending and receiving messages.
     * <br/>
     * To construct a WebSocket, use the WebSocket() constructor.
     * <br/>
     * WebSocket supports both callback and event handlers for "open", "message", "close", "error" events.
     *
     * @param {number} url A string giving the URL over which the connection is established.
     * "ws" and "wss" schemes are supported.
     *
     * @param {string[]} [protocols=[]] Either a single protocol string or an array of protocol strings.
     * These strings are used to indicate sub-protocols, so that a single server can implement
     * multiple WebSocket sub-protocols.
     *
     * @param {Object} [options={'headers':[]}] An object including 'headers' property with an array of objects
     * using to pass custom headers for creating WebSocket connection.
     *
     * @property {string} url Returns the URL that was used to establish the WebSocket connection.
     *
     * @property {number} readyState Returns the state of the WebSocket object's connection.
     * Possible values are:
     * <ul>
     *  <li>0 - state CONNECTING, socket has been created. The connection is not yet open</li>
     *  <li>1 - state OPEN, the connection is open and ready to communicate</li>
     *  <li>2 - state CLOSING, the connection is in the process of closing</li>
     *  <li>3 - state CLOSED, the connection is closed or couldn't be opened</li>
     * </ul>
     *
     * @property {string} protocols Returns the subprotocol selected by the server, if any.
     * It can be used in conjunction with the array form of the constructor's second argument
     * to perform subprotocol negotiation.
     *
     * @property {string} extensions Returns the extensions selected by the server, if any.
     *
     * @property {string} binaryType Controls the binary data type being received over the WebSocket connection.
     * Can be set to change how binary data is returned. The default is "blob".
     * Possible values are:
     * <ul>
     *  <li>"blob" - uses Blob objects for binary data</li>
     *  <li>"arraybuffer" - uses ArrayBuffer objects for binary data</li>
     * </ul>
     *
     * @property {function} onopen This function is the callback handler that is called
     * when the connection is successfully opened.
     *
     * @property {function} onmessage This function is the callback handler that is called
     * when a message is received from the server.
     *
     * @property {function} onclose This function is the callback handler that is called
     * when the connection is closed.
     *
     * @property {function} onerror This function is the callback handler that is called
     * when an error occurs.
     *
     */
    var GDWebSocket = function(url, protocols = [], options = { 'headers': [] }) {
        EventTarget.call(this);
        if (!url) {
            throw new Error('Failed to construct \'WebSocket\': url is required.');
        }

        if (!url.includes('ws://') && !url.includes('wss://')) {
            throw new Error('Failed to construct \'WebSocket\': url should use ws:// or wss:// scheme.');
        }

        protocols = protocols || [];
        options = options || { 'headers':[] };

        if (typeof protocols === 'string') {
            protocols = [protocols];
        } else if (!(Array.isArray(protocols))) {
            throw new Error('Failed to construct \'WebSocket\': ' +
                'defined subprotocols should be either a string or an array of strings.');
        }

        var webSocketOptions = {
            readyState: 0,
            extensions: '',
            protocol: '',
            url: url,
            binaryType: 'blob'
        }

        this.onopen = null;
        this.onmessage = null;
        this.onclose = null;
        this.onerror = null;

        Object.defineProperties(this, {
            '_socketId': {
                value: nextWebSocketId++
            },
            '_options': {
                get: function() {
                    return webSocketOptions;
                }
            },
            'toString': {
                value: function() {
                    return '[object GDWebSocket]';
                }
            }
        });

        cordovaExec(
            function(json) {
                var resultObj = JSON.parse(json);
                var eventType = resultObj.responseType;
                var eventData = resultObj.responseData;
                var socketId = resultObj.socketID;

                switch (eventType) {
                    case 'open':
                        if (this._socketId !== socketId) {
                            return;
                        }
                        this._options.readyState = this.OPEN;

                        var eventDataObj = JSON.parse(eventData);
                        var protocols = eventDataObj.protocols;
                        var extensions = eventDataObj.extensions;

                        if (protocols) {
                            this._options.protocol = protocols.join(', ');
                        }

                        if (extensions) {
                            this._options.extensions = extensions.join(', ');
                        }

                        var event = new GDWebSocketEvent('open');

                        this.fireEvent(event);
                        if (typeof this.onopen === "function") {
                            this.onopen(event);
                        }
                        break;
                    case 'message':
                        if (this._socketId !== socketId) {
                            return;
                        }

                        var event = new GDWebSocketEvent('message', { data: eventData });

                        this.fireEvent(event);
                        if (typeof this.onmessage === "function") {
                            this.onmessage(event);
                        }

                        break;
                    case 'message_binary':
                        if (this._socketId !== socketId) {
                            return;
                        }

                        if (this.binaryType === 'arraybuffer') {
                            eventData = base64.toArrayBuffer(eventData);
                        } else if (this.binaryType === 'blob') {
                            eventData = b64toBlob(eventData);
                        } else {
                            throw new TypeError(this.binaryType + 'is not a valid value for binaryType!');
                        }

                        var event = new GDWebSocketEvent('message', { data: eventData });

                        this.fireEvent(event);
                        if (typeof this.onmessage === "function") {
                            this.onmessage(event);
                        }

                        break;
                    case 'close':
                        if (this._socketId !== socketId) {
                            return;
                        }
                        this._options.readyState = this.CLOSED;

                        var eventDataObj = JSON.parse(eventData);

                        var event = new GDWebSocketEvent('close', {
                            code: eventDataObj.code || null,
                            reason: eventDataObj.reason || null
                        });

                        this.fireEvent(event);
                        if (typeof this.onclose === "function") {
                            this.onclose(event);
                        }

                        break;
                    case 'error':
                        if (this._socketId !== socketId) {
                            return;
                        }

                        var event = new GDWebSocketEvent('error', {
                            message: eventData
                        });

                        this.fireEvent(event);
                        if (typeof this.onerror === "function") {
                            this.onerror(event);
                        }

                        break;
                    default:
                        throw new Error('No such type of native WebSocket event!');
                }
            }.bind(this),
            function(errorMessage) {
                var message = 'Failed to construct \'WebSocket\'!'
                if (errorMessage) {
                    message += ' ' + errorMessage;
                }
                console.error(message);
            },
            "WebSocket",
            "connect",
            [ url, protocols, options, this._socketId]
        );
    };

    Object.defineProperties(GDWebSocket, {
        'CONNECTING': {
            value: 0,
            enumerable: true
        },
        'OPEN': {
            value: 1,
            enumerable: true
        },
        'CLOSING': {
            value: 2,
            enumerable: true
        },
        'CLOSED': {
            value: 3,
            enumerable: true
        },
        'toString': {
            value: function() {
                return 'function GDWebSocket() { [native code] }';
            }
        }
    });

    Object.preventExtensions(GDWebSocket);

    GDWebSocket.prototype = Object.create(EventTarget.prototype);

    GDWebSocket.prototype.constructor = GDWebSocket;

    Object.defineProperties(GDWebSocket.prototype, {
        'CONNECTING': {
            value: 0,
            enumerable: true
        },
        'OPEN': {
            value: 1,
            enumerable: true
        },
        'CLOSING': {
            value: 2,
            enumerable: true
        },
        'CLOSED': {
            value: 3,
            enumerable: true
        },
        'readyState': {
            get: function() {
                return this._options.readyState;
            },
            enumerable: true
        },
        'extensions': {
            get: function() {
                return this._options.extensions;
            },
            enumerable: true
        },
        'protocol': {
            get: function() {
                return this._options.protocol;
            },
            enumerable: true
        },
        'url': {
            get: function() {
                return this._options.url;
            },
            enumerable: true
        },
        'binaryType': {
            get: function() {
                return this._options.binaryType;
            },
            set: function(binaryType) {
                if (binaryType !== 'blob' && binaryType !== 'arraybuffer') {
                    throw new Error('binaryType must be either \'blob\' or \'arraybuffer\'');
                }
                this._options.binaryType = binaryType;
            },
            enumerable: true
        },
    });

    /**
     * @function WebSocket#close
     *
     * @description Call this function to close the WebSocket connection.
     * Function optionally is using code as the WebSocket connection close code and
     * reason as the the WebSocket connection close reason.
     *
     * @param {number} [code=1000] A numeric value indicating the status code explaining why the connection
     * is being closed. If this parameter is not specified, a default value of 1000 (Normal Closure) is used.
     *
     * @param {string} [reason='Normal closure'] A human-readable string explaining why the connection
     * is closing.
     *
     * @example
     * // Example of WebSocket usage with event approach.
     * // Also, see the example below with callback approach usage (it is added to WebSocket.send()).
     *
     * var webSocket = new WebSocket('wss://echo.wss-websocket.net');
     * var dataString = 'test string';
     * var blob = new Blob([dataString], {
     *   type: 'text/plain'
     * });
     *
     * webSocket.addEventListener('open', function(event) {
     *   console.log('open event:', event);
     *   webSocket.send(blob);
     * });
     *
     * webSocket.addEventListener('message', function(event) {
     *   console.log('message event:', event);
     *   console.log('message', event.data);
     *   console.log('is Blob message:', event.data instanceof Blob);
     *   webSocket.close();
     * })
     *
     * webSocket.addEventListener('close', function(event) {
     *   console.log('close event:', event);
     * });
     *
     * webSocket.addEventListener('error', function(event) {
     *   console.log('error event:', event);
     * });
     */
    GDWebSocket.prototype.close = function(code, reason) {
        if (this._options.readyState === this.CLOSING || this._options.readyState === this.CLOSED) {
            return;
        }

        this._options.readyState = this.CLOSING;

        var statusCode = typeof code === 'number' ? code : CLOSE_NORMAL;
        var closeReason = typeof reason === 'string' ? reason : CLOSE_NORMAL_REASON;

        cordovaExec(
            null,
            function(errorMessage) {
                var message = 'An error occurred while closing \'WebSocket\' connection!'
                if (errorMessage) {
                    message += ' ' + errorMessage;
                }
                console.error(message);
            },
            'WebSocket',
            'close',
            [statusCode, closeReason, this._socketId]);
    };

    /**
     * @function WebSocket#send
     *
     * @description Call this function to send data using opened socket connection.
     * Data can be a string, a Blob, or an ArrayBuffer.
     *
     * @param {string | ArrayBuffer | Blob} data The data to send to the server.
     * It can be one of the following types: "string", "Blob", "ArrayBuffer".
     *
     * @example
     * // Example of WebSocket usage with callback approach.
     *
     *  var webSocket = new WebSocket(
     *    "wss://echo.wss-websocket.net",
     *    ["soap", "wamp"],
     *    { headers: [{'Authorization': 'Basic someEncodedString'}]}
     *  );
     *
     *  webSocket.onopen = function(event) {
     *    console.log('open event:', event);
     *    webSocket.send('Test message');
     *  }
     *
     *  webSocket.onmessage = function(event) {
     *    console.log('message event:', event);
     *    console.log('message', event.data);
     *    webSocket.close();
     *  }
     *
     *  webSocket.onclose = function(event) {
     *    console.log('close event:', event);
     *  }
     *
     *  webSocket.onerror = function(event) {
     *    console.log('error event:', event);
     *  }
     */
    GDWebSocket.prototype.send = function(data = '') {
        if (this._options.readyState === this.CONNECTING) {
            throw new Error('InvalidStateError');
        }

        if (typeof data === 'string') {
            execSend.call(this, data, 'string');
            return;
        } else if (data instanceof ArrayBuffer) {
            execSend.call(this, base64.fromArrayBuffer(data), 'arraybuffer');
            return;
        } else if (data instanceof Blob) {
            var self = this;

            var reader = new window.FileReader();
            reader.onload = function(event) {
                var base64Data = reader.result.split(',')[1];
                execSend.call(self, base64Data, 'blob');
            }.bind(this);

            reader.readAsDataURL(data);
        } else {
            console.error(
                'Failed to send message with invalid data type! Data can be a string, a Blob, or an ArrayBuffer'
            );
        }

        function execSend(message, messageType) {
            cordovaExec(
                null,
                function(errorMessage) {
                    var message = 'An error occurred while sending \'WebSocket\' message!'
                    if (errorMessage) {
                        message += ' ' + errorMessage;
                    }
                    console.error(message);
                },
                'WebSocket',
                'send',
                [message, this._socketId, messageType]
            );
        }
    };

    hideOwnPropertiesImplementation(GDWebSocket.prototype);

    // =====================================================================================
    //      GDWebSocketEvent
    //  Event passed to WebSocket callbacks and events
    // =====================================================================================
    var GDWebSocketEvent = function(type, eventInitDict) {
        this.type = type.toString();
        Object.assign(this, eventInitDict);
    }

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data),
            byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize),
                byteNumbers = new Array(slice.length);

            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });

        return blob;
    };

    function hideOwnPropertiesImplementation(prototypeObject) {
        var propertiesToSkip = [
                'CONNECTING', 'OPEN', 'CLOSING', 'CLOSED', 'readyState',
                'protocol', 'extensions', 'url', 'binaryType'
            ];
        for (ownProperty in prototypeObject) {
            if (ownProperty === 'constructor' || propertiesToSkip.indexOf(ownProperty) > -1) {
                continue;
            }

            if (prototypeObject.hasOwnProperty(ownProperty) &&
                typeof prototypeObject[ownProperty] == 'function') {

                // Checking, if function property 'name' is configurable
                // (for old browser, which has pre-ES2015 implementation(Android 5.0) function name property isn't configurable)
                var objProtoProperty = prototypeObject[ownProperty],
                    isFuncNamePropConfigurable = Object.getOwnPropertyDescriptor(objProtoProperty, 'name').configurable;

                if (isFuncNamePropConfigurable) {
                    Object.defineProperty(prototypeObject[ownProperty],
                        'name', {
                            value: ownProperty,
                            configurable: false
                        }
                    );
                }

                Object.defineProperty(prototypeObject[ownProperty],
                    'toString', {
                        value: function() {
                            var funcName = this.name || ownProperty;
                            return 'function ' + funcName + '() { [native code] }';
                        },
                        writable: false,
                        configurable: false
                    });

            }
        }
    }

    Object.preventExtensions(GDWebSocket.prototype);

    // Install the plugin.
    module.exports = GDWebSocket;

}()); // End the Module Definition.
//************************************************************************************************
