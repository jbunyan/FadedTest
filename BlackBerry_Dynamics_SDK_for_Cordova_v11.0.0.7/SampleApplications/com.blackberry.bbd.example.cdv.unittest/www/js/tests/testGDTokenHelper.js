/*
 * (c) 2019 BlackBerry Limited. All rights reserved.
 * 
 * GDTokenHelper plugin functional tests.
 */
describe('GDTokenHelper plugin', function () {

    it('Check GDTokenHelper plugin installation', function () {
        expect(window).toBeDefined();
        expect(window.plugins).toBeDefined();
        expect(window.plugins.GDTokenHelper).toBeDefined();
    });

    it('TokenHelper test', function (done) {
        window.plugins.GDTokenHelper.getGDAuthToken("test", "serverName",
        function (result) {
            expect(result).toBeDefined();
            done();
        },
        function (result) {
            expect("GDAuthToken").toBe("received");
            done();
        });
    });

});
