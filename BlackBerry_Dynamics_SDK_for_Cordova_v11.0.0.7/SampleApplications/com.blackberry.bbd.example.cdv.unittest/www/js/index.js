/*
 * (c) 2020 BlackBerry Limited. All rights reserved.
 */

(function() {
    var app = {
        // Application Constructor
        initialize: function() {
            this.updateViewportMetaTag();
            this.bindEvents();
        },
        /*
        * updateViewportMetaTag method is used for adding 'viewport-fit=cover' to 'content' attribute
        * of viewport meta tag in case iOS>=11 or Android are running on device (the iOS 10 is not able
        * to recognize the viewport-fit attribute).
        * After iOS 10 is dropped, the function could be removed and 'viewport-fit=cover' should
        * be manually added to 'content' attribute of meta tag in index-ios.html file
        */
        updateViewportMetaTag: function() {
            if (shouldAppendViewportFit()) {
                var metaTagsCollection = document.getElementsByTagName('meta');

                for (var i = 0, count = metaTagsCollection.length; i < count; i++) {
                    var viewportTagName = metaTagsCollection[i].name;
                    if (viewportTagName && viewportTagName.includes('viewport')) {
                        var viewportTag = metaTagsCollection[i],
                            viewportTagContent = viewportTag.content + ', viewport-fit=cover';
                        break;
                    }
                }

                // Update viewport tag attribute
                viewportTag.setAttribute('content', viewportTagContent);
            }

            function shouldAppendViewportFit() {
                if (/(iPhone|iPod|iPad)/i.test(window.navigator.userAgent)) {
                    // Get iOS major version
                    var iosVersion = parseInt((window.navigator.userAgent).match(/OS (\d+)_(\d+)_?(\d+)? like Mac OS X/i)[1]);

                    return iosVersion >= 11;
                }
                return true; // Android
            }
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
        // function, we must explicity call 'app.receivedEvent(...);'
        onDeviceReady: function() {
            console.log("onDeviceReady");

            if (typeof jasmineEnv !== 'undefined')
                jasmineEnv.execute();
        }
    };

    app.initialize();   
}());
