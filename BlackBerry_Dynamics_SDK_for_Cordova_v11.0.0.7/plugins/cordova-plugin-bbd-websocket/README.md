BBD Cordova WebSocket plugin
============================
> The WebSocket plugin implements the secure WebSocket APIs based on standard WebSocket specification (see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

Location
========
`BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordova-plugin-bbd-websocket`

> __Note:__ `BBD Cordova WebSocket plugin` is dependent on
> * `BBD Cordova Base plugin`

Installation
============
To add this plugin to your application, run the following command in the project directory:
```
$ cd <path/to/package>/BlackBerry_Dynamics_SDK_for_Cordova_<version>/SampleApplications/cordovaApp
$ cordova plugin add ../../plugins/cordova-plugin-bbd-websocket
```

API reference
=============

`window.WebSocket`
```javascript
/**
 * @class WebSocket
 *
 * @classdesc Implements the secure WebSocket API based on standard WebSocket specification (see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).
 * WebSocket object provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection.
 * WebSocket supports both `ws://` and `wss://` protocols.
 * WebSocket supports text or binary (`Blob`, `ArrayBuffer`) data types for sending and receiving messages.
 * To construct a WebSocket, use the WebSocket() constructor.
 * WebSocket supports both callback and event handlers for "open", "message", "close", "error" events.
 *
 * @param {number} url A string giving the URL over which the connection is established. "ws" and "wss" schemes are supported.
 * @param {string[]} [protocols=[]] Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols, so that a single server can implement multiple WebSocket sub-protocols.
 * @param {Object} [options={'headers':[]}] An object including 'headers' property with an array of objects using to pass custom headers for creating WebSocket connection.
 * @property {string} url Returns the URL that was used to establish the WebSocket connection.
 * @property {number} readyState Returns the state of the WebSocket object's connection. Possible values are:
 *  0 - state CONNECTING, socket has been created. The connection is not yet open
 *  1 - state OPEN, the connection is open and ready to communicate
 *  2 - state CLOSING, the connection is in the process of closing
 *  3 - state CLOSED, the connection is closed or couldn't be opened
 * @property {string} protocols Returns the subprotocol selected by the server, if any. It can be used in conjunction with the array form of the constructor's second argument to perform subprotocol negotiation.
 * @property {string} extensions Returns the extensions selected by the server, if any.
 * @property {string} binaryType Controls the binary data type being received over the WebSocket connection. Can be set to change how binary data is returned. The default is "blob". Possible values are:
 *  "blob" - uses Blob objects for binary data
 *  "arraybuffer" - uses ArrayBuffer objects for binary data
 * @property {function} onopen This function is the callback handler that is called when the connection is successfully opened.
 * @property {function} onmessage This function is the callback handler that is called when a message is received from the server.
 * @property {function} onerror This function is the callback handler that is called when an error occurs.
 */
```

`WebSocket.close`
```javascript
/**
 * @function WebSocket#close
 * @description Call this function to close the WebSocket connection. Function optionally is using code as the WebSocket connection close code and reason as the the WebSocket connection close reason.
 * @param {number} [code=1000] A numeric value indicating the status code explaining why the connection is being closed. If this parameter is not specified, a default value of 1000 (Normal Closure) is used.
 * @param {string} [reason='Normal closure'] A human-readable string explaining why the connection is closing.
 */

// Example of WebSocket usage with event approach.
var webSocket = new WebSocket('wss://echo.wss-websocket.net');
var dataString = 'test string';
var blob = new Blob([dataString], {
    type: 'text/plain'
});

webSocket.addEventListener('open', function(event) {
    console.log('open event:', event);
    webSocket.send(blob);
});

webSocket.addEventListener('message', function(event) {
    console.log('message event:', event);
    console.log('message', event.data);
    console.log('is Blob message:', event.data instanceof Blob);
    webSocket.close();
})

webSocket.addEventListener('close', function(event) {
    console.log('close event:', event);
});

webSocket.addEventListener('error', function(event) {
    console.log('error event:', event);
});
```

`WebSocket#send`
```javascript
/**
 * @function WebSocket#send
 * @description Call this function to send data using opened socket connection. Data can be a string, a Blob, or an ArrayBuffer.
 * @param {string | ArrayBuffer | Blob} data The data to send to the server. It can be one of the following types: "string", "Blob", "ArrayBuffer".
 */

// Example of WebSocket usage with callback approach.
var webSocket = new WebSocket(
    "ws://echo.wss-websocket.net",
    ["soap", "wamp"],
    { headers: [{'Authorization': 'Basic someEncodedString'}]}
);

webSocket.onopen = function(event) {
    console.log('open event:', event);
    webSocket.send('Test message');
}

webSocket.onmessage = function(event) {
    console.log('message event:', event);
    console.log('message', event.data);
    webSocket.close();
}

webSocket.onclose = function(event) {
    console.log('close event:', event);
}

webSocket.onerror = function(event) {
    console.log('error event:', event);
}
```
