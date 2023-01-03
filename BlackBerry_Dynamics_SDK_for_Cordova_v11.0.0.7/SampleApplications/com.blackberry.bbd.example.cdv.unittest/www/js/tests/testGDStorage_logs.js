 /*
  * (c) 2021 BlackBerry Limited. All rights reserved.
  *
  * GDStorage plugin unit tests. Directory Entry functionality
  */
describe('GDStorage plugin - gdlogs', function () {

    it('Check directoryEntry plugin installation', function () {
        expect(window).toBeDefined();
        expect(window.plugins).toBeDefined();
        expect(FileSystem).toBeDefined();
    });

    var gdFileSystem;

    beforeEach(function (done) {
        requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            gdFileSystem = fileSystem;
            done();
        }, null);
    });

    afterEach(function () {
        gdFileSystem = null;
    });

    it('Upload BlackBerry Dynamics logs', function(done) {
    	var success = function() {
    		    expect(true).toBe(true);
    		    done();
        	},
        	fail = function(error) {
                expect("Logs").toBe("uploaded but recieved " + error.code);
                done();
            };
        gdFileSystem.uploadLogs(success, fail);
    });

});
