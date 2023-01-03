/*
 * (c) 2019 BlackBerry Limited. All rights reserved.
 */

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        document.addEventListener("offline", APP.showNoConnectionMsg, false);
        document.addEventListener("online", APP.onDeviceReady, false);

        if (navigator.network.connection.type.toUpperCase() == "WIFI") {
            APP.onDeviceReady();
        }
    }
};

app.initialize();