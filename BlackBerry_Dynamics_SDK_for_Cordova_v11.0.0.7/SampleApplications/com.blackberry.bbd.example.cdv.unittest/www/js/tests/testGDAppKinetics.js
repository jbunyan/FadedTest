/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 *
 * GDAppKinetics plugin functional tests.
 */
describe('GDAppKinetics plugin', function () {

	var filebouncerURL = "com.qagood.gd.example.pg.appkinetics.filebouncer.IccReceivingActivity";

	var defaultFail = function() {
		expect(true).toBe(false);
	};

    it('Check GDTokenHelper plugin installation', function () {
        expect(window).toBeDefined();
        expect(window.plugins).toBeDefined();
        expect(window.plugins.GDAppKineticsPlugin).toBeDefined();
    });

     it('Check bringAppToFront() method - invalid ID', function(done) {
    	var urlToTest = "some.invalid.url.to.test";

        window.plugins.GDAppKineticsPlugin.bringAppToFront(urlToTest, function() {
            defaultFail();
            done();
        }, function() {
            done();
        });

    });

    it('Check bringAppToFront() method - empty ID', function(done) {
    	var urlToTest = "";

        window.plugins.GDAppKineticsPlugin.bringAppToFront(urlToTest, function() {
            defaultFail();
            done();
        }, function() {
            done();
        });

    });

    it('Check copyFilesToSecureFileSystem() method', function(done) {
        window.plugins.GDAppKineticsPlugin.copyFilesToSecureFileSystem(function(result) {
            done();
        });
    });

    //=================================SEND FILE TO APP TESTS========================================
    it('Check sendFileToApp() method - valid ID, existing file', function(done) {
        var urlToTest = filebouncerURL,
            filePath = "file.txt";

        window.plugins.GDAppKineticsPlugin.sendFileToApp(filePath ,urlToTest, function(result) {
            done();
        }, function() {
            defaultFail();
            done();
        });

    });


    it('Check sendFileToApp() method - valid ID, not existing file', function(done) {
        var urlToTest = filebouncerURL,
            filePath = "not-existing-file.txt";

        window.plugins.GDAppKineticsPlugin.sendFileToApp(filePath, urlToTest, function() {
            defaultFail();
            done();
        }, function() {
            done();
        });

    });

    it('Check sendFileToApp() method - invalid ID, not existing file', function(done) {
        var urlToTest = "some.invalid.id",
            filePath = "not-existing-file.txt";

        window.plugins.GDAppKineticsPlugin.sendFileToApp(filePath, urlToTest, function() {
            defaultFail();
            done();
        }, function() {
            done();
        });

    });

    it('Check sendFileToApp() method - invalid ID, existing file', function(done) {
        var urlToTest = "some.invalid.id",
            filePath = "file-to-be-sent.txt";

        window.plugins.GDAppKineticsPlugin.sendFileToApp(filePath, urlToTest, function() {
            defaultFail();
            done();
        }, function() {
            done();
        });

    });

    it('Check sendFileToApp() method - empty ID, not existing file', function(done) {
        var urlToTest = "",
            filePath = "not-existing-file.txt";

        window.plugins.GDAppKineticsPlugin.sendFileToApp(filePath, urlToTest, function() {
            defaultFail();
            done();
        }, function() {
            done();
        });

    });

    it('Check sendFileToApp() method - empty ID, existing file', function(done) {
        var urlToTest = "",
            filePath = "file-to-be-sent.txt";

        window.plugins.GDAppKineticsPlugin.sendFileToApp(filePath, urlToTest, function() {
            defaultFail();
            done();
        }, function() {
            done();
        });

    });

    //=================================READY TO PROVIDE SERVICE TESTS========================================
    it('Check readyToProvideService() method - existant service, valid version', function(done) {
        var serviceID = "com.good.gfeservice.send-email",
            serviceVersion = "1.0.0.0";

        window.plugins.GDAppKineticsPlugin.readyToProvideService(serviceID, serviceVersion, function(result) {
            done();
        }, function() {
            defaultFail();
            done();
        });

    });

      it('Check readyToProvideService() method - existent service, valid version, one more service', function(done) {
        var serviceID = "com.good.gfeservice.send-email.other",
            serviceVersion = "1.0.0.0";

        window.plugins.GDAppKineticsPlugin.readyToProvideService(serviceID, serviceVersion, function(result) {
            done();
        }, function() {
            defaultFail();
            done();
        });

    });

    it('Check readyToProvideService() method - empty service, empty version', function(done) {
        var serviceID = "",
            serviceVersion = "";

        window.plugins.GDAppKineticsPlugin.readyToProvideService(serviceID, serviceVersion, function() {
            done();
        }, function() {
            defaultFail();
            done();
        });

    });

    it('Check readyToProvideService() method - empty service, invalid version', function(done) {
        var serviceID = "",
            serviceVersion = "x.x.x.x";

        window.plugins.GDAppKineticsPlugin.readyToProvideService(serviceID, serviceVersion, function() {
            done();
        }, function() {
            defaultFail();
            done();
        });

    });

    it('Check readyToProvideService() method - empty service, valid version', function(done) {
        var serviceID = "",
            serviceVersion = "1.0.0.0";

        window.plugins.GDAppKineticsPlugin.readyToProvideService(serviceID, serviceVersion, function() {
            done();
        }, function() {
            defaultFail();
            done();
        });

    });

    it('Check readyToProvideService() method - nonexisting service, invalid version', function(done) {
        var serviceID = "non.existing.service.id",
            serviceVersion = "x.x.x.x";

        window.plugins.GDAppKineticsPlugin.readyToProvideService(serviceID, serviceVersion, function() {
            done();
        }, function() {
            defaultFail();
            done();
        });

    });

    it('Check readyToProvideService() method - nonexisting service, valid version', function(done) {
        var serviceID = "non.existing.service.id",
            serviceVersion = "1.0.0.0";

        window.plugins.GDAppKineticsPlugin.readyToProvideService(serviceID, serviceVersion, function() {
            done();
        }, function() {
            defaultFail();
            done();
        });

    });


      //=================================SEND EMAIL VIA GFE TESTS========================================
    it('Check sendEmailViaGFE() method - positive case, one receiver', function(done) {
        var to = ["vtaliar@good.com"],
            subject = "Test Email",
            body = "Hi, this is a test email",
            attachments = ["file.txt"];

        window.plugins.GDAppKineticsPlugin.sendEmailViaGFE(to, subject, body, attachments, function() {
            done();
        }, function() {
            defaultFail();
            done();
        });

    });

    it('Check sendEmailViaGFE() method - positive case, two receivers', function(done) {
        var to = ["vtaliar@good.com, vtaliar@gd.qagood.com"],
            subject = "Test Email",
            body = "Hi, this is a test email",
            attachments = ["file.txt"];

        window.plugins.GDAppKineticsPlugin.sendEmailViaGFE(to, subject, body, attachments, function() {
            done();
        }, function() {
            defaultFail();
            done();
        });

    });

    it('Check sendEmailViaGFE() method - positive case, blank subject', function(done) {
        var to = ["vtaliar@good.com"],
            subject = "",
            body = "Hi, this is a test email",
            attachments = ["file.txt"];

        window.plugins.GDAppKineticsPlugin.sendEmailViaGFE(to, subject, body, attachments, function() {
            done();
        }, function() {
            defaultFail();
            done();
        });

    });

    it('Check sendEmailViaGFE() method - positive case, blank body', function(done) {
        var to = ["vtaliar@good.com"],
            subject = "Test Email",
            body = "",
            attachments = ["file.txt"];

        window.plugins.GDAppKineticsPlugin.sendEmailViaGFE(to, subject, body, attachments, function() {
            done();
        }, function() {
            defaultFail();
            done();
        });

    });

    it('Check sendEmailViaGFE() method - positive case, blank subject, body and attachments', function(done) {
        var to = ["vtaliar@good.com"],
            subject = "",
            body = "",
            attachments = [];

        window.plugins.GDAppKineticsPlugin.sendEmailViaGFE(to, subject, body, attachments, function() {
            done();
        }, function() {
            defaultFail();
            done();
        });

    });

    it('Check sendEmailViaGFE() method - positive case, no receivers', function(done) {
        var to = [],
            subject = "",
            body = "",
            attachments = [];

        window.plugins.GDAppKineticsPlugin.sendEmailViaGFE(to, subject, body, attachments, function() {
            done();
        }, function() {
            defaultFail();
            done();
        });

    });

    it('Check sendEmailViaGFE() method - negative case, non-existant file in attachments', function(done) {
        var to = ["vtaliar@good.com"],
            subject = "Test Email",
            body = "Hi, this is a test email",
            attachments = ["some_file.txt"];

        window.plugins.GDAppKineticsPlugin.sendEmailViaGFE(to, subject, body, attachments, function() {
            defaultFail();
            done();
        }, function() {
            done();
        });

    });

    it('Check sendEmailViaGFE() method - negative case, one of files in attachments is non-existant', function(done) {
        var to = ["vtaliar@good.com"],
            subject = "Test Email",
            body = "Hi, this is a test email",
            attachments = ["file.txt", "some_file.txt"];

        window.plugins.GDAppKineticsPlugin.sendEmailViaGFE(to, subject, body, attachments, function() {
            defaultFail();
            done();
        }, function() {
            done();
        });

    });

    /**
     * NOTE: getServiceProvidersFor check for apps installed on device. So we're now just checking case for empty service id and version.
     * Because we can not be sure about what app will be installed when test are runned, this is the only possible case checked.
     * All other logic is tested with native unit tests.
     */

    it('Check getServiceProvidersFor() method positive case', function(done) {
        expect(window.plugins.GDAppKineticsPlugin.getServiceProvidersFor).toBeDefined();

        var success = function(result) {
                expect(result).toBeDefined();

                expect(result.length).toBe(0);
                done();
            },
            fail = function(error) {
                expect("getGDAppDetails").toBe("working and not returning " + error);
                done();
            };

        window.plugins.GDAppKineticsPlugin.getServiceProvidersFor("", "", success, fail);

    });

    //                         ============== TODO =================
    //                         |          Add tests for:           |
    //                         | - callAppKineticsService();       |
    //                         | - retreiveFiles();				   |
    //                         | - setReceiveAttachmentsFUnction().|
    //                         =====================================
});
