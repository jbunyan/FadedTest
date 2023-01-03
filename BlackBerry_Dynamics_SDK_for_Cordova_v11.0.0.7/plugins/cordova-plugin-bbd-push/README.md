BBD Cordova Push plugin
=======================
> The Push plugin encapsulates the response returned from the GDPush class.

Location
========
`BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordova-plugin-bbd-push`

> __Note:__ `BBD Cordova Push plugin` is dependent on
> * `BBD Cordova Base plugin`

Installation
============
To add this plugin to your application, run the following command in the project directory:
```
$ cd <path/to/package>/BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordovaApp
$ cordova plugin add ../cordova-plugin-bbd-push
```

API reference
=============
`window.plugins.GDPushChannel`
```javascript
/**
* @class GDPushChannel
* @classdesc This class encapsulates the GD Push Channel object.  The Push Channel framework is a BlackBerry Dynamics (GD) feature used to receive notifications from an application server.  Note that the GD Push Channel feature is not part of the native iOS notification feature set; however, Push Channels are dependent on the Push Connection, and Push Channels can only be established when the Push Connection is open and operating.  
  
Push Channels are established from the client end, then used by the server when needed. The sequence of events is as follows:  
  
1. The client sets an event handler for Push Channel notifications  
2. The client application requests a Push Channel token from the BlackBerry Dynamics proxy infrastructure  
3. The client application sends the token to its server using, for example, a socket or HTTP request  
4. The client can now wait for a Push Channel notification  
  
The BlackBerry Dynamics platform keeps data communications between client and server alive while the client is waiting for a Push Channel notification. This is achieved by sending "heartbeat" messages at an interval that is dynamically optimized for battery and network performance.  
  
* @property {function} onChannelResponse This function is the callback handler that is called whenever a response is returned from the channel connection.  This function should check the value of the responseType returned and determine the required action to take.  If the responseType = "open", then the channelID returned in the response should be used to reference this channel in subsequent calls over this connection (see GDPushChannel.open).
NOTE: This function is required to be a non-null value.
*/
```

`window.plugins.GDPushChannel.open`
```javascript
/**
* @function GDPushChannel#open
* @description Call this function to open the Push Channel. This function can only be called when the channel is not opened.  This function creates a request for a Push Channel to be sent to the Good Dynamics proxy infrastructure Network Operating Center (NOC). The NOC will create the channel, and issue a Push Channel token, which can then be used to identify the channel. The application code that handles the notification must initiate sending of the Push Channel token to the application server, out of band. The application server will then be able to use the token to address Push Channel messages back to the application, via the BlackBerry Dynamics proxy infrastructure. See the Push Channel Back-End API of Blackberry Dynamics Docs:  
 "https://developer.blackberry.com/devzone/files/blackberry-dynamics/ios/group__pushchannelconstants.html#ga8e79bdad653db4b0570f8c2329ad73a1"
* @return {GDPushChannelResponse} A push channel response object in JSON format.  The result should be parsed and saved as a GDPushChannelResponse object in the callback handler.  If the channel was opened then the response object will be initialized with a channelID property that can be used to reference this channel connection.  Additionally, the response will also contain a token that uniquely identifies the device associated with this push channel. Since this is an asynchronous call, the response will be returned via the onChannelResponse callback.  
  
Note that it can take some time for establishing push connection during opening first Push Channel. Please, wait until "onChannelResponse" callback is called with "GDPushChannelResponse" response object.  
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
```

`window.plugins.GDPushChannel.close`
```javascript
/**
* @function GDPushChannel#close
* @description Call this function to initiate permanent disconnection of the Push Channel.  This function creates a request for Push Channel termination to be sent to the BlackBerry Dynamics proxy infrastructure Network Operating Center (NOC). The NOC will delete the channel, and invalidate the Push Channel token that was issued when the channel was initially opened.
* @param {string} channelID The unique ID for the push channel to close.
*/
```

`window.plugins.GDPushChannel.parseChannelResponse`
```javascript
/**
* @function GDPushChannel#parseChannelResponse
* @description Call this function to transform the push channel response text into a GDPushChannelResponse object.
* @param {string} responseText A string representing the push channel response text.
* @return {GDPushChannelResponse} The push channel response object.
*/
```

`window.plugins.GDPushChannel.isAvailable`
```javascript
/**
* @function GDPushChannel#isAvailable
* @description This function returns the current status of the Push Channel connection.
* @param {function} responseCallback Callback function to invoke when the function returns. A single result string will be passed as the input to the callback function: "true" or "false".
* @return {string} "true" or "false".
*/
```

=============
`window.plugins.GDPushConnection`

`GDPushConnection` API is removed since version 10.1. Use `GDPushChannel` API instead.
