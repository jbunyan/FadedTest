/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 */

;
(function() {
    var cordovaExec = require('cordova/exec'),
        isOpenFirstChannelCalled = false;

    /**
     * @class GDPushChannelResponse
     * @classdesc This class encapsulates the response returned from the GDPush class.
     *
     * @param {string} json The input data (formatted as JSON text) used to construct the
     * response object.
     *
     * @property {string} channelID The unique ID for the push channel that generated this response.
     *
     * @property {string} responseType This value is used to distinguish what action triggered this response.
     * Valid values are:
     * <ul>
     *   <li>open - The channel was just successfully opened.</li>
     *   <li>message - A new message was received from the server.  The responseData property will be
     *   populated with the data from the server.</li>
     *   <li>error - A channel error occurred.  The responseData may or may not be populated with a
     *   description of the error.</li>
     *   <li>close - The channel connection was closed.</li>
     *   <li>pingFail - Ping Failure is an optional feature of the Push Channel framework. The application
     *   server registers for ping after receiving the Push Channel token from the client.  If an
     *   application server registers for ping, then the server will be periodically checked ("pinged") by
     *   the BlackBerry Dynamics Network Operating Center (NOC). If the application server does not respond to a
     *   ping, then the NOC notifies the client.</li>
     * </ul>
     *
     * @property {string} responseData This field will be populated with data from the server if the
     * response contained data what was intended to be processed by the client.
     *
     * @return {GDPushChannelResponse}
     *
     * @example
     * // This object is used by GDPushChannel.parseChannelResponse() method and is not used directly
     */
    var GDPushChannelResponse = function(json) {
        var channelID = null,
            responseType = null,
            responseData = null;

        try {
            var obj = JSON.parse(unescape(json));
            channelID = obj.channelID;
            responseType = obj.responseType;

            /*
             * The response could have been JSON text, which we might need to revert to it's
             * string representation.
             */
            try {
                if (typeof obj.responseData === 'Object') {
                    responseData = JSON.stringify(obj.responseData);
                } else {
                    responseData = obj.responseData;
                }
            } catch (e) {
                responseData = obj.responseData;
            }
        } catch (e) {
            responseType = "error";
        }
        Object.defineProperties(this, {
            'channelID': {
                get: function() {
                    return channelID;
                }
            },
            'responseType': {
                get: function() {
                    return responseType;
                }
            },
            'responseData': {
                get: function() {
                    return responseData;
                }
            },
            'toString': {
                value: function() {
                    return '[object GDPushChannelResponse]';
                }
            }
        })
    };

    Object.preventExtensions(GDPushChannelResponse);

    /**
     * @class GDPushChannel
     * @classdesc This class encapsulates the GD Push Channel object.  The Push Channel framework is a
     * BlackBerry Dynamics (GD) feature used to receive notifications from an application server.  Note that
     * the GD Push Channel feature is not part of the native iOS notification feature set; however,
     * Push Channels are dependent on the Push Connection, and Push Channels can only be established when
     * the Push Connection is open and operating.<br/>
     * <br/>
     * Push Channels are established from the client end, then used by the server when needed. The sequence
     * of events is as follows:<br/>
     * <ol>
     * <li>The client sets an event handler for Push Channel notifications</li>
     * <li>The client application requests a Push Channel token from the BlackBerry Dynamics proxy infrastructure</li>
     * <li>The client application sends the token to its server using, for example, a socket or HTTP request</li>
     * <li>The client can now wait for a Push Channel notification</li>
     * </ol>
     * The BlackBerry Dynamics platform keeps data communications between client and server alive while the client is
     * waiting for a Push Channel notification. This is achieved by sending "heartbeat" messages at an interval
     * that is dynamically optimized for battery and network performance.<br/>
     * <br/>
     *
     * @property {function} onChannelResponse This function is the callback handler that is called
     * whenever a response is returned from the channel connection.  This function should check
     * the value of the responseType returned and determine the required action to take.  If the
     * responseType = "open", then the channelID returned in the response should be used to reference this
     * channel in subsequent calls over this connection (see <a href="#open">GDPushChannel.open</a>).  NOTE: This
     * function is required to be a non-null value.
     */
    var GDPushChannel = function(responseCallback) {
        var channelResponseCallback = null;
        if (typeof responseCallback === 'function') {
            channelResponseCallback = responseCallback;
        }

        Object.defineProperties(this, {
            'onChannelResponse': {
                get: function() {
                    return channelResponseCallback;
                },
                set: function(callback) {
                    channelResponseCallback = callback;
                }
            },
            'toString': {
                value: function() {
                    return '[object GDPushChannel]';
                }
            }
        });
    };

    Object.defineProperty(GDPushChannel, 'toString', {
        value: function() {
            return 'function GDPushChannel() { [native code] }';
        }
    });

    Object.preventExtensions(GDPushChannel);
    /**
     * @function GDPushChannel#open
     *
     * @description Call this function to open the Push Channel. This function can only be called when
     * the channel is not opened.  This function creates a request for a Push Channel to be sent to the Good
     * Dynamics proxy infrastructure Network Operating Center (NOC). The NOC will create the channel, and
     * issue a Push Channel token, which can then be used to identify the channel. The application code that
     * handles the notification must initiate sending of the Push Channel token to the application server, out of band.
     * The application server will then be able to use the token to address Push Channel messages back to the application, 
     * via the BlackBerry Dynamics proxy infrastructure. See the Push Channel Back-End API of Blackberry Dynamics Docs
     * (<a href="https://developer.blackberry.com/devzone/files/blackberry-dynamics/ios/group__pushchannelconstants.html#ga8e79bdad653db4b0570f8c2329ad73a1">
     * GDPushChannelOpenedNotification & Push Channel Back-End API of Blackberry Dynamics</a>).
     *
     * @return {GDPushChannelResponse} A push channel response object in JSON format.  The result should be
     * parsed and saved as a GDPushChannelResponse object in the callback handler.  If the channel was
     * opened then the response object will be initialized with a channelID property that can be used to
     * reference this channel connection.  Additionally, the response will also contain a token that uniquely
     * identifies the device associated with this push channel.  Since this is an asynchronous call, the
     * response will be returned via the onChannelResponse callback.
     * 
     * Note that it can take some time for establishing push connection during opening first Push Channel.
     * Please, wait until "onChannelResponse" callback is called with "GDPushChannelResponse" response object.
     *
     * @example
     * function myPushChannel() {
     *     var savedChannelID,
     *         pushChannelToken;
     *     var channel = new window.plugins.GDPushChannel(pushChannelResponse);
     *     channel.open();
     *
     *     channel.isAvailable(function(result) {
     *         console.log("GDPushChannel status: ", result);
     *     });
     *
     *     //-- GDPushChannelResponse
     *     function pushChannelResponse(response) {
     *         try {
     *             var channelResponse = channel.parseChannelResponse(response);
     *
     *             console.log("Got response channelID: " + channelResponse.channelID);
     *             console.log("Got response responseType: " + channelResponse.responseType);
     *             console.log("Got response responseData: " + channelResponse.responseData);
     *             switch (channelResponse.responseType) {
     *                 case "open":
     *                     savedChannelID = channelResponse.channelID;
     *                     pushChannelToken = channelResponse.responseData;
     *                     console.log("Channel connection opened with ID :" + savedChannelID);
     *                     break;
     *
     *                 //  Send application server the savedChannelID (token) here at following format:
     *                 //   POST https://gdmdc.good.com//GNP1.0?method=notify HTTP/1.1
     *                 //   Host: gdmdc.good.com:443
     *                 //   Content-Type: text/plain; charset=utf-8
     *                 //   Content-length: 30
     *                 //   X-Good-GNP-Token: pushChannelToken
     *                 //  For more details see Push Channel Back-End API:
     *                 //   https://developer.blackberry.com/devzone/files/blackberry-dynamics/ios/_g_n_p.html
     *
     *                 case "message":
     *                     // handle pushed message from the server
     *                     channel.close(channelResponse.channelID);
     *                     break;
     *                 case "error":
     *                     console.log("Received an error status from the channel connection.");
     *                     break;
     *                 case "close":
     *                     console.log("Channel connection closed successfully.");
     *                     break;
     *                 case "pingFail":
     *                     break;
     *                 default:
     *                     break;
     *             }
     *         } catch (e) {
     *             throw new Error("Invalid response object sent to channel response callback handler.");
     *         }
     *     };
     *
     * };
     */
    GDPushChannel.prototype.open = function() {
        // Make sure that the response callback handler is not null.
        if (this.onChannelResponse === null ||
            typeof this.onChannelResponse === 'undefined') {
            throw new Error("onChannelResponse callback handler for GDPushChannel object is null.");
        }

        var messageForNotAvailableConnection = 'secure push connection is not established',
            connetionAttempts = 10,
            self = this;

        cordovaExec(function(response) {
            if (response.indexOf(messageForNotAvailableConnection) === -1) {
                self.onChannelResponse(response);
            } else {
                retryOpenConnection();
            }
        }, null, "GDPush", "open", null);

        function retryOpenConnection() {
            var connectionInterval = setInterval(function() {
                cordovaExec(function(response) {
                    if (response.indexOf(messageForNotAvailableConnection) === -1 || connetionAttempts === 0) {
                        clearInterval(connectionInterval);
                        self.onChannelResponse(response);
                        return;
                    }
                    connetionAttempts--;
                }, null, "GDPush", "open", null);
            }, 1000);
        }
    };

    /**
     * @function GDPushChannel#close
     *
     * @description Call this function to initiate permanent disconnection of the Push Channel.  This function
     * creates a request for Push Channel termination to be sent to the BlackBerry Dynamics proxy infrastructure Network
     * Operating Center (NOC). The NOC will delete the channel, and invalidate the Push Channel token that was
     * issued when the channel was initially opened.
     *
     * @param {string} channelID The unique ID for the push channel to close.
     *
     * @example
     * See the example above (it is added to GDPushChannel.open() method).
     */
    GDPushChannel.prototype.close = function(channelID) {
        if (channelID === null || typeof channelID === 'undefined') {
            throw new Error("Null channelID passed to GDPushChannel.close.");
        }

        var parms = [channelID];
        cordovaExec(this.onChannelResponse, this.onChannelResponse, "GDPush", "close", parms);
    };

    /**
     * @function GDPushChannel#parseChannelResponse
     *
     * @description Call this function to transform the push channel response text into a
     * GDPushChannelResponse object.
     *
     * @param {string} responseText A string representing the push channel response text.
     *
     * @return {GDPushChannelResponse} The push channel response object.
     *
     * @example
     * See the example <a href="./GDPushChannel.html">here</a>
     */
    GDPushChannel.prototype.parseChannelResponse = function(responseText) {
        return new GDPushChannelResponse(responseText);
    };

    /**
     * @function GDPushChannel#isAvailable
     *
     * @description This function returns the current status of the Push Channel connection.
     *
     * @param {function} responseCallback Callback function to invoke when the function returns.
     * A single result string will be passed as the input to the callback function: "true" or
     * "false".
     *
     * @return {string} "true" or "false".
     *
     * @example
     * See the example <a href="./GDPushChannel.html">here</a>
     */
    GDPushChannel.prototype.isAvailable = function(responseCallback) {
        cordovaExec(responseCallback, responseCallback, "GDPush", "isConnected", null);
    };


    // ***** END: MODULE METHOD DEFINITIONS - GDPushChannel *****
    function hideJSFunctionsImplementationInConsoleForObject(prototypeObject) {
        for (protoFunction in prototypeObject) {
            if (prototypeObject.hasOwnProperty(protoFunction)) {
                Object.defineProperty(prototypeObject[protoFunction],
                    'name', { value: protoFunction, writable: false }
                );

                Object.defineProperty(prototypeObject[protoFunction],
                    'toString', {
                        value: function() {
                            return 'function ' + this.name + '() { [native code] }';
                        },
                        writable: false
                    });
            }
        }

        Object.preventExtensions(prototypeObject);
    }

    // hide functions implementation in web inspector
    hideJSFunctionsImplementationInConsoleForObject(GDPushChannel.prototype);

    // Install the plugin.
    module.exports = GDPushChannel;
}()); // End the Module Definition.
//************************************************************************************************
