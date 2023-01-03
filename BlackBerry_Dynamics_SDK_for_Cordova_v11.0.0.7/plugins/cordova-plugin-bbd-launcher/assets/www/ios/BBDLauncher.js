/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

;
(function() {
    var cordovaExec = require('cordova/exec');

    var METHODS = {
            show: 'show',
            hide: 'hide',
            open: 'open',
            close: 'close'
        },
        /**
         * @class Launcher
         *
         * @classdesc The Launcher object provides API to show and hide Launcher button.
         */
        Launcher = function() {
            Object.defineProperty(this, 'toString', {
                value: function() {
                    return '[object Launcher]'
                }
            });
        };

    Object.defineProperty(Launcher, 'toString', {
        value: function() {
            return 'function Launcher() { [native code] }'
        }
    });

    /**
     * @function Launcher#show
     *
     * @description This function shows Launcher button
     *
     * @example
     * window.launcher.show()
     *
     */
    Launcher.prototype.show = function() {
        execPluginMethod(METHODS.show);
    };

    Object.defineProperty(Launcher.prototype.show, 'toString', {
        value: function() {
            return 'function show() { [native code] }'
        }
    });
    /**
     * @function Launcher#hide
     *
     * @description This function hides Launcher button
     *
     * @example
     * window.launcher.hide()
     *
     */
    Launcher.prototype.hide = function() {
        execPluginMethod(METHODS.hide);
    };

    Object.defineProperty(Launcher.prototype.hide, 'toString', {
        value: function() {
            return 'function hide() { [native code] }'
        }
    });

    /**
     * @function Launcher#open
     *
     * @description This function opens Launcher
     * NOTE: method is available only on iOS
     *
     * @example
     * window.launcher.open()
     *
     */
    Launcher.prototype.open = function() {
        execPluginMethod(METHODS.open);
    };

    Object.defineProperty(Launcher.prototype.open, 'toString', {
        value: function() {
            return 'function open() { [native code] }'
        }
    });

    /**
     * @function Launcher#close
     *
     * @description This function closes Launcher
     * NOTE: method is available only on iOS
     *
     * @example
     * window.launcher.close()
     *
     */
    Launcher.prototype.close = function() {
        execPluginMethod(METHODS.close);
    };

    Object.defineProperty(Launcher.prototype.close, 'toString', {
        value: function() {
            return 'function close() { [native code] }'
        }
    });

    function execPluginMethod(method) {
        var featureName = 'BBDLauncher';

        cordovaExec(null, null, featureName, method, []);
    }

    var s_launcher = new Launcher();
    Object.preventExtensions(s_launcher);

    module.exports = s_launcher;
}()); // End the Module Definition.
