/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 *
 * "cordova-plugin-bbd-xmlhttprequest" plugin unit tests.
 */
describe('"cordova-plugin-bbd-xmlhttprequest" plugin:', function() {

    it('Check "cordova-plugin-bbd-xmlhttprequest" plugin installation', function() {
        expect(window).toBeDefined();
        expect(window.XMLHttpRequest).toBeDefined();
        expect(window.XMLHttpRequest.toString()).toBe("function GDXMLHttpRequest() { [native code] }");
    });

    it('Check "cordova-plugin-bbd-xmlhttprequest" deprecation message', function() {
        var deprecationMessage = 'cordova-plugin-bbd-xmlhttprequest is deprecated since version 9.0, ' +
            'where XMLHttpRequest is secured within cordova-plugin-bbd-base. It will be removed in future versions.';
        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";

        spyOn(console, "warn");

        var xhr = new XMLHttpRequest();
        xhr.open(method, url);

        var warningMessage = console.warn.calls.mostRecent().args[0];

        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(warningMessage).toContain(deprecationMessage);
    });
});
