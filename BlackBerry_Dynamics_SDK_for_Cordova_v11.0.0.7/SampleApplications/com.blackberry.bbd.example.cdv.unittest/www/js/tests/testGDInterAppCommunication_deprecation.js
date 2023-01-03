 /*
  * (c) 2021 BlackBerry Limited. All rights reserved.
  *
  * GDInterAppCommunication plugin functional tests.
  */
describe('GDInterAppCommunication', function () {

    it('Check GDInterAppCommunication plugin installation', function () {
         expect(window).toBeDefined();
         expect(window.plugins).toBeDefined();
         expect(window.plugins.GDInterAppCommunication).toBeDefined();
         expect(window.plugins.GDInterAppCommunication.getGDAppDetails).toBeDefined();
    });

    /**
     * NOTE: This plugin check for apps installed on device. So we're now just checking case for empty service id and version.
     * Because we can not be sure about what app will be installed when test are runned, this is the only possible case checked.
     * All other logic is tested with native unit tests.
     */
    it('Check InterAppCommunication positive case', function(done) {
        var success = function(result) {
                expect(result).toBeDefined();

                expect(result.length).toBe(0);
                done();
            },
            fail = function(error) {
                expect("getGDAppDetails").toBe("working and not returning " + error);
                done();
            };

        window.plugins.GDInterAppCommunication.getGDAppDetails("", "", success, fail);
    });

    it('Check InterAppCommunication deprecation message', function() {
        var deprecationMessage = '"getGDAppDetails" is deprecated now. It will be removed in future versions.';

        spyOn(console, "warn");
        window.plugins.GDInterAppCommunication.getGDAppDetails("", "", function() { }, function() { });

        var warningMessage = console.warn.calls.mostRecent().args[0];

        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(warningMessage).toContain(deprecationMessage);
    });

});
