/*
 * (c) 2019 BlackBerry Limited. All rights reserved.
 * 
 * GDHttpRequest plugin unit tests.
 */
var errorMessageRequestFileSystem = "no response from requestFileSystem",
    defaultFail = function(error) {
        expect(true).toBe(false);
    };

describe('GDHttpRequest plugin:', function() {

    var data_json_url = "http://gdadex.gdext.qagood.com/data.txt";
    var poster_url = "http://www.posttestserver.com/";

    var gdccOnError = function(response) {
        expect(false).toBe(true);
    };

    var gdFileSystem,
        originalTimeout;

    beforeEach(function(done) {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

        requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            gdFileSystem = fileSystem;
            done();
        }, null);
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;

        gdFileSystem = null;
    });

    it('Check GDHttpRequest plugin installation', function() {
        expect(window).toBeDefined();
        expect(window.plugins).toBeDefined();
        expect(window.plugins.GDHttpRequest).toBeDefined();
        expect(window.plugins.GDCacheController).toBeDefined();
    });

    /*Check send HttpBody*/
    it("POST Asynchronous with HttpBody", function(done) {
        var method = "POST";
        var url = "http://gmaiis02.gma.sw.rim.net:8075/asp/test.aspx?second=true";
        var timeout = 30;
        var isAsync = true;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);
        aRequest.addHttpBody("fname=myuser&lname=mypass");

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(responseObj.headers).toBeDefined();
                expect(responseObj.headers).not.toBeNull();
                expect(responseObj.status).toBeDefined();
                expect(responseObj.status).not.toBeNull();
                expect(responseObj.statusText).toBeDefined();
                expect(responseObj.statusText).not.toBeNull();
                expect(responseObj.responseText).toBeDefined();
                expect(responseObj.responseText).not.toBeNull();
                expect(responseObj.responseState).toBeDefined();
                expect(responseObj.responseState).not.toBeNull();
                expect(responseObj.status).toBe(200);
                expect(responseObj.responseText.indexOf("fname = myuser<br>lname = mypass") > 0).toBe(true);

                done();
            },
            function() { }
        );

    });

    /*Check send HttpBody*/
    it("POST Synchronous with HttpBody", function(done) {
        var method = "POST";
        var url = "http://gmaiis02.gma.sw.rim.net:8075/asp/test.aspx?second=true";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);
        aRequest.addHttpBody("fname=myuser&lname=mypass");

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(responseObj.headers).toBeDefined();
                expect(responseObj.headers).not.toBeNull();
                expect(responseObj.status).toBeDefined();
                expect(responseObj.status).not.toBeNull();
                expect(responseObj.statusText).toBeDefined();
                expect(responseObj.statusText).not.toBeNull();
                expect(responseObj.responseText).toBeDefined();
                expect(responseObj.responseText).not.toBeNull();
                expect(responseObj.responseState).toBeDefined();
                expect(responseObj.responseState).not.toBeNull();
                expect(responseObj.status).toBe(200);
                expect(responseObj.responseText.indexOf("fname = myuser<br>lname = mypass") > 0).toBe(true);

                done();
            },
            function() { }
        );

    });

    it('GDHttpRequest, GET Synchronous', function(done) {
        var method = "GET";
        var url = "http://gmaiis02.gma.sw.rim.net:8075/asp/test.aspx?second=true";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);

                done();
            },
            function() { }
        );

    });

    it('GDHttpRequest, GET Asynchronous', function(done) {
        var method = "GET";
        var url = "http://gmaiis02.gma.sw.rim.net:8075/asp/test.aspx?second=true";
        var timeout = 30;
        var isAsync = true;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);

                done();
            },
            function() { }
        );

    });


    it("HEAD Synchronous", function(done) {
        var method = "HEAD";
        var url = "http://gmaiis02.gma.sw.rim.net:8075/asp/test.aspx?second=true";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);
                expect(responseObj.responseText.length).toBe(0);

                done();
            },
            function() { }
        );

    });

    it("HEAD Asynchronous", function(done) {
        var method = "HEAD";
        var url = "http://gmaiis02.gma.sw.rim.net:8075/asp/test.aspx?second=true";
        var timeout = 30;
        var isAsync = true;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);
                expect(responseObj.responseText.length).toBe(0);

                done();
            },
            function() { }
        );

    });

    it("OPTIONS Synchronous", function(done) {
        var method = "OPTIONS";
        var url = "http://gmaiis02.gma.sw.rim.net:8075/asp/test.aspx?second=true";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);
                expect(responseObj.headers.indexOf("Allow") != -1).toBeTruthy();

                done();
            },
            function() { }
        );

    });

    it("OPTIONS Asynchronous", function(done) {
        var method = "OPTIONS";
        var url = "http://gmaiis02.gma.sw.rim.net:8075/asp/test.aspx?second=true";
        var timeout = 30;
        var isAsync = true;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);
                expect(responseObj.headers.indexOf("Allow") != -1).toBeTruthy();

                done();
            },
            function() { }
        );

    });

    it("TRACE Synchronous", function(done) {
        var method = "TRACE";
        var url = "http://gmaiis02.gma.sw.rim.net:8075/*";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(501); // Not implemented

                done();
            },
            function() { }
        );

    });

    it("TRACE Asynchronous", function(done) {
        var method = "TRACE";
        var url = "http://gmaiis02.gma.sw.rim.net:8075/*";
        var timeout = 30;
        var isAsync = true;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(501); // Not implemented

                done();
            },
            function() { }
        );

    });

    // it("DELETE Synchronous", function(done) {
    //     var method = "POST";
    //     var url = "http://gmaiis03.gma.sw.rim.net:8082/ntlm.htm";
    //     var timeout = 30;
    //     var isAsync = true;
    //     var user = "goodadmin";
    //     var password = "password";
    //     var auth = "NTLM";
    //     var authenticationDomain = "gma";
    //     var fileName = "afile.txt"; // This file is included as a resource in the xcode project.
    //     var fileSize = 3841;

    //     var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth, authenticationDomain);
    //     aRequest.disablePeerVerification = true;

    //     aRequest.sendFile(fileName,
    //         function(response) {
    //             var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
    //             verifyResponseObj(responseObj);
    //             var isCorrectStatus = responseObj.status == 204 || responseObj.status == 201;
    //             expect(isCorrectStatus).toBeTruthy();
    //             console.log(JSON.stringify(responseObj));

    //             method = "DELETE";
    //             isAsync = false;
    //             var deleteRequst = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth, authenticationDomain);
    //             deleteRequst.send(
    //                 function(response) {
    //                     var responseObjDel = window.plugins.GDHttpRequest.parseHttpResponse(response);
    //                     verifyResponseObj(responseObjDel);
    //                     var isCorrectStatus = responseObjDel.status == 200 || responseObjDel.status == 404;
    //                     expect(isCorrectStatus).toBeTruthy();

    //                     done();
    //                 },
    //                 function() {}
    //             );
    //         },
    //         function() {}
    //     );

    // });

    // it("DELETE Asynchronous", function(done) {
    //     var method = "PUT";
    //     var url = "http://GD-Dev-UK1.gd.qagood.com:8080/afile.txt";
    //     var timeout = 30;
    //     var isAsync = true;
    //     var user = "gdadmin";
    //     var password = "gdadmin";
    //     var auth = "NTLM";
    //     var authenticationDomain = "gd";
    //     var fileName = "afile.txt"; // This file is included as a resource in the xcode project.
    //     var fileSize = 3841;

    //     var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth, authenticationDomain);

    //     aRequest.sendFile(fileName,
    //         function(response) {
    //             var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
    //             verifyResponseObj(responseObj);
    //             var isCorrectStatus = responseObj.status == 204 || responseObj.status == 201;
    //             expect(isCorrectStatus).toBeTruthy();

    //             method = "DELETE";
    //             var deleteRequst = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth, authenticationDomain);
    //             deleteRequst.send(
    //                 function(response) {
    //                     var responseObjDel = window.plugins.GDHttpRequest.parseHttpResponse(response);
    //                     verifyResponseObj(responseObjDel);
    //                     var isCorrectStatus = responseObjDel.status == 200 || responseObjDel.status == 404;
    //                     expect(isCorrectStatus).toBeTruthy();

    //                     done();
    //                 },
    //                 function() {}
    //             );
    //         },
    //         function() {}
    //     );

    // });


    it("POST Synchronous; with PostParams", function(done) {
        var method = "POST";
        var url = "http://gmaiis02.gma.sw.rim.net:8075/asp/test.aspx?second=true";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        aRequest.addPostParameter("fuser", "myuser");
        aRequest.addPostParameter("lname", "mypass");

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);
                expect(responseObj.responseText.indexOf("fuser = myuser<br>lname = mypass") > 0).toBe(true);

                done();
            },
            function() { }
        );

    });

    it("POST Synchronous; with Header Expect100", function(done) {
        var method = "POST";
        var url = "http://gmaiis02.gma.sw.rim.net:8075/asp/test.aspx?second=true";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);
        aRequest.addRequestHeader("Expect", "100-continue");
        aRequest.addPostParameter("fuser", "myuser");
        aRequest.addPostParameter("lname", "mypass");

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);
                expect(responseObj.responseText.indexOf("fuser = myuser<br>lname = mypass") > 0).toBe(true);

                done();
            },
            function() { }
        );

    });

    it("POST Asynchronous; with Header Expect100", function(done) {
        var method = "POST";
        var url = "http://gmaiis02.gma.sw.rim.net:8075/asp/test.aspx?second=true";
        var timeout = 30;
        var isAsync = true;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);
        aRequest.addRequestHeader("Expect", "100-continue");
        aRequest.addPostParameter("fuser", "myuser");
        aRequest.addPostParameter("lname", "mypass");

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);
                expect(responseObj.responseText.indexOf("fuser = myuser<br>lname = mypass") > 0).toBe(true);

                done();
            },
            function() { }
        );

    });

    // it("PUT Synchronous sendFile", function(done) {
    //     var method = "PUT";
    //     var url = "http://GD-Dev-UK1.gd.qagood.com:8080/afile.txt";
    //     var timeout = 30;
    //     var isAsync = false;
    //     var user = "gdadmin";
    //     var password = "gdadmin";
    //     var auth = "NTLM";
    //     var authenticationDomain = "gd";
    //     var fileName = "afile.txt";
    //     var fileSize = 3841;

    //     var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth, authenticationDomain);

    //     aRequest.sendFile(fileName,
    //         function(response) {
    //             var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
    //             verifyResponseObj(responseObj);
    //             var isCorrectStatus = responseObj.status == 204 || responseObj.status == 201;
    //             expect(isCorrectStatus).toBeTruthy();
    //             done();
    //         },
    //         function() {}
    //     );

    // });

    // it("PUT Asynchronous sendFile", function(done) {
    //     var method = "PUT";
    //     var url = "http://GD-Dev-UK1.gd.qagood.com:8080/afile.txt";
    //     var timeout = 30;
    //     var isAsync = true;
    //     var user = "gdadmin";
    //     var password = "gdadmin";
    //     var auth = "NTLM";
    //     var authenticationDomain = "gd";
    //     var fileName = "afile.txt";
    //     var fileSize = 3841;

    //     var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth, authenticationDomain);

    //     aRequest.sendFile(fileName,
    //         function(response) {
    //             var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
    //             verifyResponseObj(responseObj);
    //             var isCorrectStatus = responseObj.status == 204 || responseObj.status == 201;
    //             expect(isCorrectStatus).toBeTruthy();
    //             done();
    //         },
    //         function() {}
    //     );

    // });

    it("GET disableFollowLocation = false", function(done) {
        var method = "GET";
        var url = "http://gmaiis04.gma.sw.rim.net:8092/";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);
                expect(responseObj.responseText.indexOf("apple.com") != -1).toBeTruthy();

                done();
            },
            function() { }
        );

    });

    it("GET disableFollowLocation = true", function(done) {
        var method = "GET";
        var url = "https://httpbin.org/redirect-to?url=http%3A%2F%2Fexample.com%2F";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);
        aRequest.disableFollowLocation = true;

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(302);

                done();
            },
            function() { }
        );

    });

    it("GET disablePeerVerification = false", function(done) {
        var method = "GET";
        var url = "https://gd-dev-uk1.gd.sw.rim.net/index.html";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        aRequest.send(
            function() { },
            function(error) {
                expect(error.indexOf("The certificate for this server is invalid.") > -1).toBeTruthy();
                done();
            }
        );

    });

    it("GET disablePeerVerification = true", function(done) {
        var method = "GET";
        var url = "https://gd-dev-uk1.gd.sw.rim.net/index.html";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);
        aRequest.disablePeerVerification = true;

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);

                done();
            },
            function(error) {

            }
        );

    });

    // it("GET disableHostVerification = false", function(done) {
    //     var method = "GET";
    //     var url = "https://dh.tlsfun.de/";
    //     var timeout = 30;
    //     var isAsync = false;
    //     var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

    //     aRequest.send(
    //         function(response) {
    //             var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
    //             verifyResponseObj(responseObj);
    //             console.log(responseObj.status);
    //         },
    //         function(error) {
    //             expect(error.indexOf("The certificate for this server is invalid.") > -1).toBeTruthy();
    //             done();
    //         }
    //     );

    // });

    // it("GET disableHostVerification = true", function(done) {
    //     var method = "GET";
    //     var url = "https://gmaiis01.gma.sw.rim.net/";
    //     var timeout = 30;
    //     var isAsync = false;
    //     var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);
    //     aRequest.disableHostVerification = true;

    //     aRequest.send(
    //         function(response) {
    //             var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
    //             verifyResponseObj(responseObj);
    //             expect(responseObj.status).toBe(200);

    //             done();
    //         },
    //         function() {}
    //     );

    // });


    it("Authhentication check default", function(done) {
        var method = "GET";
        var url = "http://gmaiis02.gma.sw.rim.net:8081/basic.htm";
        var timeout = 30;
        var isAsync = false;
        var user = "goodadmin";
        var password = "password";
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);

                done();
            },
            function(error) {

            }
        );

    });


    it("Authhentication BASIC", function(done) {
        var method = "GET";
        var url = "http://gmaiis02.gma.sw.rim.net:8081/basic.htm";
        var timeout = 30;
        var isAsync = false;
        var user = "goodadmin";
        var password = "password";
        var authentication = "BASIC";
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, authentication);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);

                done();
            },
            function(error) {

            }
        );

    });

    it("Authhentication DIGEST", function(done) {
        var method = "GET";
        var url = "http://gmaiis01.gma.sw.rim.net:8003/";
        var timeout = 30;
        var isAsync = false;
        var user = "goodadmin";
        var password = "password";
        var authentication = "DIGEST";
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, authentication);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);

                done();
            },
            function(error) {

            }
        );

    });

    it("Authhentication NTLM", function(done) {
        var method = "GET";
        var url = "http://gmaiis03.gma.sw.rim.net:8083/ntlm.htm";
        var timeout = 30;
        var isAsync = false;
        var user = "goodadmin";
        var password = "password";
        var authentication = "NTLM";
        var authenticationDomain = "gma";
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, authentication, authenticationDomain);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);

                done();
            },
            function(error) {

            }
        );

    });

    it("Proxy http Authhentication NTLM; wrong user and password", function(done) {
        var method = "GET";
        var url = "http://www.google.com";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        var proxyHost = "bbsproxy3.bbs.testnet.rim.net";
        var proxyPort = 8080;
        var proxyUser = "wrong_user";
        var proxyPassword = "wrong_password";
        var proxyAuth = "NTLM";
        var proxyAuthenticationDomain = "gd";
        aRequest.enableHttpProxy(proxyHost, proxyPort, proxyUser, proxyPassword, proxyAuth, proxyAuthenticationDomain);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(responseObj.status).toBe(407);

                done();
            },
            function() { }
        );

    });

    it("Proxy http Authhentication NTLM", function(done) {
        var method = "GET";
        var url = "http://httpbin.org/get";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        var proxyHost = "bbsproxy3.bbs.testnet.rim.net";
        var proxyPort = 8080;
        var proxyUser = "proxyuser";
        var proxyPassword = "password";
        var proxyAuth = "NTLM";
        var proxyAuthenticationDomain = "bbsproxy";
        aRequest.enableHttpProxy(proxyHost, proxyPort, proxyUser, proxyPassword, proxyAuth, proxyAuthenticationDomain);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);

                done();
            },
            function(error) {

            }
        );

    });

    it("Proxy https Authhentication NTLM", function(done) {
        var method = "GET";
        var url = "https://www.google.com:443";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        var proxyHost = "bbsproxy3.bbs.testnet.rim.net";
        var proxyPort = 8080;
        var proxyUser = "proxyuser";
        var proxyPassword = "password";
        var proxyAuth = "NTLM";
        var proxyAuthenticationDomain = "gd";
        aRequest.enableHttpProxy(proxyHost, proxyPort, proxyUser, proxyPassword, proxyAuth, proxyAuthenticationDomain);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(responseObj.headers).toBeDefined();
                expect(responseObj.headers).not.toBeNull();
                expect(responseObj.status).toBeDefined();
                expect(responseObj.status).not.toBeNull();
                expect(responseObj.statusText).toBeDefined();
                expect(responseObj.statusText).not.toBeNull();
                expect(responseObj.responseText).toBeDefined();
                expect(responseObj.responseText).not.toBeNull();
                expect(responseObj.responseState).toBeDefined();
                expect(responseObj.responseState).not.toBeNull();
                expect(responseObj.status).toBe(200);

                done();
            },
            function(error) {

            }
        );

    });


    it("Proxy http Authhentication DIGEST; wrong user and password", function(done) {
        var method = "GET";
        var url = "http://httpbin.org/get";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        var proxyHost = "bbsproxy3.bbs.testnet.rim.net";
        var proxyPort = 8080;
        var proxyUser = "wrong_user";
        var proxyPassword = "wrong_password";
        var proxyAuth = "DIGEST";
        var proxyAuthenticationDomain = "gd";
        aRequest.enableHttpProxy(proxyHost, proxyPort, proxyUser, proxyPassword, proxyAuth, proxyAuthenticationDomain);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(responseObj.status).toBe(407);

                done();
            },
            function(error) {
                console.log(error)
            }
        );

    });

    it("Proxy http Authhentication DIGEST", function(done) {
        var method = "GET";
        var url = "http://httpbin.org/get";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        var proxyHost = "GD-Dev-UK3.gd.sw.rim.net";
        var proxyPort = 3128;
        var proxyUser = "digest_user";
        var proxyPassword = "digest_password";
        var proxyAuth = "DIGEST";
        aRequest.enableHttpProxy(proxyHost, proxyPort, proxyUser, proxyPassword, proxyAuth);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);

                done();
            },
            function(error) {

            }
        );

    });

    it("Proxy https Authhentication DIGEST", function(done) {
        var method = "GET";
        var url = "https://www.google.com";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        var proxyHost = "GD-Dev-UK3.gd.sw.rim.net";
        var proxyPort = 3128;
        var proxyUser = "digest_user";
        var proxyPassword = "digest_password";
        var proxyAuth = "DIGEST";
        aRequest.enableHttpProxy(proxyHost, proxyPort, proxyUser, proxyPassword, proxyAuth);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(responseObj.headers).toBeDefined();
                expect(responseObj.headers).not.toBeNull();
                expect(responseObj.status).toBeDefined();
                expect(responseObj.status).not.toBeNull();
                expect(responseObj.statusText).toBeDefined();
                expect(responseObj.statusText).not.toBeNull();
                expect(responseObj.responseText).toBeDefined();
                expect(responseObj.responseText).not.toBeNull();
                expect(responseObj.responseState).toBeDefined();
                expect(responseObj.responseState).not.toBeNull();
                expect(responseObj.status).toBe(200);

                done();
            },
            function(error) {

            }
        );

    });

    it("Proxy http Authhentication BASIC; wrong user and password", function(done) {
        var method = "GET";
        var url = "http://httpbin.org/get";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        var proxyHost = "PRX01SQUID2.prx01.sw.rim.net";
        var proxyPort = 3128;
        var proxyUser = "wrong_user";
        var proxyPassword = "wrong_password";
        var proxyAuth = "BASIC";
        var proxyAuthenticationDomain = "gd";
        aRequest.enableHttpProxy(proxyHost, proxyPort, proxyUser, proxyPassword, proxyAuth, proxyAuthenticationDomain);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(responseObj.status).toBe(407);

                done();
            },
            function(error) {

            }
        );

    });

    it("Proxy http Authhentication BASIC", function(done) {
        var method = "GET";
        var url = "http://httpbin.org/get";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        var proxyHost = "PRX01SQUID2.prx01.sw.rim.net";
        var proxyPort = 3128;
        var proxyUser = "basicuser";
        var proxyPassword = "password";
        var proxyAuth = "BASIC";
        aRequest.enableHttpProxy(proxyHost, proxyPort, proxyUser, proxyPassword, proxyAuth);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);

                done();
            },
            function(error) {

            }
        );

    });

    it("Proxy http request with path", function(done) {
        var method = "GET";
        var url = "http://httpbin.org/get";
        var timeout = 30;
        var isAsync = false;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync);

        var proxyHost = "gd-lviv04.gd.sw.rim.net";
        var proxyPort = 3128;
        aRequest.enableHttpProxy(proxyHost, proxyPort);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                verifyResponseObj(responseObj);
                expect(responseObj.status).toBe(200);

                var respObj = JSON.parse(responseObj.responseText);
                expect(respObj.url == "http://httpbin.org/get").toBe(true);

                done();
            },
            function(error) {

            }
        );

    });


    it('Abort: 1 request', function(done) {
        var method = "GET";
        var url = "http://www.artcubesoftware.com/bigger.html";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                expect(true).toBe(true);
                done();
            }
        );

        setTimeout(function() {
            aRequest.abort();
        }, 300);

    });


    it('Abort: 2 requests - first request aborted, second no', function(done) {
        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        var callbackksCount = 0;

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 2) {
                    done();
                }
            }
        );
        var aRequest2 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest2.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(responseObj).toBeDefined();
                expect(responseObj.headers).toBeDefined();
                expect(responseObj.status).toBeDefined();
                expect(responseObj.status).toBe(200);
                expect(responseObj.statusText).toBeDefined();
                expect(responseObj.responseText).toBeDefined();
                expect(responseObj.responseState).toBeDefined();
                callbackksCount += 1;
                if (callbackksCount == 2) {
                    done();
                }
            },
            function() {
                expect(true).toBe(false);
            }
        );

        setTimeout(function() {
            aRequest.abort();
        }, 50);

    });

    it('Abort: 2 requests - both aborted', function(done) {
        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        var callbackksCount = 0;

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 2) {
                    done();
                }
            }
        );
        var aRequest2 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest2.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 2) {
                    done();
                }
            }
        );

        setTimeout(function() {
            aRequest.abort();
            aRequest2.abort();
        }, 50);

    });

    it('Abort: 3 requests - all aborted', function(done) {
        var callbackksCount = 0;
        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 3) {
                    done();
                }
            }
        );
        var aRequest2 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest2.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 3) {
                    done();
                }
            }
        );
        var aRequest3 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest3.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 3) {
                    done();
                }
            }
        );

        setTimeout(function() {
            aRequest.abort();
            aRequest2.abort();
            aRequest3.abort();
        }, 50);

    });

    it('Abort: 3 requests - first aborted, rest no', function(done) {
        var callbackksCount = 0;
        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 3) {
                    done();
                }
            }
        );
        var aRequest2 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest2.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(responseObj).toBeDefined();
                expect(responseObj.headers).toBeDefined();
                expect(responseObj.status).toBeDefined();
                expect(responseObj.status).toBe(200);
                expect(responseObj.statusText).toBeDefined();
                expect(responseObj.responseText).toBeDefined();
                expect(responseObj.responseState).toBeDefined();
                callbackksCount += 1;
                if (callbackksCount == 3) {
                    done();
                }
            },
            function(error) {
                expect(true).toBe(false);
            }
        );
        var aRequest3 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest3.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(responseObj).toBeDefined();
                expect(responseObj.headers).toBeDefined();
                expect(responseObj.status).toBeDefined();
                expect(responseObj.status).toBe(200);
                expect(responseObj.statusText).toBeDefined();
                expect(responseObj.responseText).toBeDefined();
                expect(responseObj.responseState).toBeDefined();
                callbackksCount += 1;
                if (callbackksCount == 3) {
                    done();
                }
            },
            function(error) {
                expect(true).toBe(false);
            }
        );

        setTimeout(function() {
            aRequest.abort();
        }, 50);

    });

    it('Abort: 3 requests - two first aborted, last no', function(done) {
        var callbackksCount = 0;
        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 3) {
                    done();
                }
            }
        );
        var aRequest2 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest2.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 3) {
                    done();
                }
            }
        );
        var aRequest3 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest3.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(responseObj).toBeDefined();
                expect(responseObj.headers).toBeDefined();
                expect(responseObj.status).toBeDefined();
                expect(responseObj.status).toBe(200);
                expect(responseObj.statusText).toBeDefined();
                expect(responseObj.responseText).toBeDefined();
                expect(responseObj.responseState).toBeDefined();
                callbackksCount += 1;
                if (callbackksCount == 3) {
                    done();
                }
            },
            function(error) {
                expect(true).toBe(false);
            }
        );

        setTimeout(function() {
            aRequest.abort();
            aRequest2.abort();
        }, 50);

    });

    it('Abort: 4 requests - all aborted', function(done) {
        var callbackksCount = 0;
        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 4) {
                    done();
                }
            }
        );
        var aRequest2 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest2.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 4) {
                    done();
                }
            }
        );
        var aRequest3 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest3.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 4) {
                    done();
                }
            }
        );
        var aRequest4 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest4.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 4) {
                    done();
                }
            }
        );

        setTimeout(function() {
            aRequest.abort();
            aRequest2.abort();
            aRequest3.abort();
            aRequest4.abort();
        }, 50);

    });

    it('Abort: 4 requests - first two aborted, last two no', function(done) {
        var callbackksCount = 0;
        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 4) {
                    done();
                }
            }
        );
        var aRequest2 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest2.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 4) {
                    done();
                }
            }
        );
        var aRequest3 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest3.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(responseObj).toBeDefined();
                expect(responseObj.headers).toBeDefined();
                expect(responseObj.status).toBeDefined();
                expect(responseObj.status).toBe(200);
                expect(responseObj.statusText).toBeDefined();
                expect(responseObj.responseText).toBeDefined();
                expect(responseObj.responseState).toBeDefined();
                callbackksCount += 1;
                if (callbackksCount == 4) {
                    done();
                }
            },
            function(error) {
                expect(true).toBe(false);
            }
        );
        var aRequest4 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest4.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(responseObj).toBeDefined();
                expect(responseObj.headers).toBeDefined();
                expect(responseObj.status).toBeDefined();
                expect(responseObj.status).toBe(200);
                expect(responseObj.statusText).toBeDefined();
                expect(responseObj.responseText).toBeDefined();
                expect(responseObj.responseState).toBeDefined();
                callbackksCount += 1;
                if (callbackksCount == 4) {
                    done();
                }
            },
            function(error) {
                expect(true).toBe(false);
            }
        );

        setTimeout(function() {
            aRequest.abort();
            aRequest2.abort();
        }, 50);

    });

    it('Abort: 5 requests - all aborted', function(done) {
        var callbackksCount = 0;
        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 5) {
                    done();
                }
            }
        );
        var aRequest2 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest2.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 5) {
                    done();
                }
            }
        );
        var aRequest3 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest3.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 5) {
                    done();
                }
            }
        );
        var aRequest4 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest4.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 5) {
                    done();
                }
            }
        );
        var aRequest5 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest5.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 5) {
                    done();
                }
            }
        );

        setTimeout(function() {
            aRequest.abort();
            aRequest2.abort();
            aRequest3.abort();
            aRequest4.abort();
            aRequest5.abort();
        }, 50);

    });

    it('Abort: 6 requests - all aborted', function(done) {
        var callbackksCount = 0;
        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 6) {
                    done();
                }
            }
        );
        var aRequest2 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest2.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 6) {
                    done();
                }
            }
        );
        var aRequest3 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest3.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 6) {
                    done();
                }
            }
        );
        var aRequest4 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest4.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 6) {
                    done();
                }
            }
        );
        var aRequest5 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest5.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 6) {
                    done();
                }
            }
        );
        var aRequest6 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest6.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                expect(true).toBe(false);
            },
            function(error) {
                callbackksCount += 1;
                if (callbackksCount == 6) {
                    done();
                }
            }
        );

        setTimeout(function() {
            aRequest.abort();
            aRequest2.abort();
            aRequest3.abort();
            aRequest4.abort();
            aRequest5.abort();
            aRequest6.abort();
        }, 10);

    });

    it('GDHttpRequest multiple asynchronous requests', function(done) {
        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var responsesCount = 0;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                var response = {
                    "one": "two",
                    "key": "value"
                };
                responseObj = JSON.parse(responseObj.responseText);
                for (var i in responseObj) {
                    expect(responseObj[i]).toBe(response[i]);
                }

                responsesCount = responsesCount + 1;
                if (responsesCount == 5) {
                    done();
                }
            },
            function() { }
        );

        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest2 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest2.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                var response = {
                    "one": "two",
                    "key": "value"
                };
                responseObj = JSON.parse(responseObj.responseText);
                for (var i in responseObj) {
                    expect(responseObj[i]).toBe(response[i]);
                }

                responsesCount = responsesCount + 1;
                if (responsesCount == 5) {
                    done();
                }
            },
            function() {

            }
        );

        var method = "GET";
        var url = "http://echo.jsontest.com/insert-key-here/insert-value-here/key/value";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest3 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest3.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                var response = {
                    "insert-key-here": "insert-value-here",
                    "key": "value"
                };
                responseObj = JSON.parse(responseObj.responseText);
                for (var i in responseObj) {
                    expect(responseObj[i]).toBe(response[i]);
                }

                responsesCount = responsesCount + 1;
                if (responsesCount == 5) {
                    done();
                }
            },
            function() { }
        );

        var method = "GET";
        var url = "http://echo.jsontest.com/insert-key-here/insert-value-here/key/value";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest4 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest4.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                var response = {
                    "insert-key-here": "insert-value-here",
                    "key": "value"
                };
                responseObj = JSON.parse(responseObj.responseText);
                for (var i in responseObj) {
                    expect(responseObj[i]).toBe(response[i]);
                }

                responsesCount = responsesCount + 1;
                if (responsesCount == 5) {
                    done();
                }
            },
            function() { }
        );

        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = true;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest5 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest5.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                var response = {
                    "one": "two",
                    "key": "value"
                };
                responseObj = JSON.parse(responseObj.responseText);
                for (var i in responseObj) {
                    expect(responseObj[i]).toBe(response[i]);
                }

                responsesCount = responsesCount + 1;
                if (responsesCount == 5) {
                    done();
                }
            },
            function() {

            }
        );

    });

    it('GDHttpRequest multiple synchronous requests', function(done) {
        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = false;
        var user = null;
        var password = null;
        var auth = null;
        var responsesCount = 0;
        var aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest.send(
            function(response) {
                expect(responsesCount).toBe(0);
                responsesCount = responsesCount + 1;
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                var response = {
                    "one": "two",
                    "key": "value"
                };
                responseObj = JSON.parse(responseObj.responseText);
                for (var i in responseObj) {
                    expect(responseObj[i]).toBe(response[i]);
                }
            },
            function() { }
        );

        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = false;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest2 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest2.send(
            function(response) {
                expect(responsesCount).toBe(1);
                responsesCount = responsesCount + 1;
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                var response = {
                    "one": "two",
                    "key": "value"
                };
                responseObj = JSON.parse(responseObj.responseText);
                for (var i in responseObj) {
                    expect(responseObj[i]).toBe(response[i]);
                }
            },
            function() {

            }
        );

        var method = "GET";
        var url = "http://echo.jsontest.com/insert-key-here/insert-value-here/key/value";
        var timeout = 30;
        var isAsync = false;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest3 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest3.send(
            function(response) {
                expect(responsesCount).toBe(2);
                responsesCount = responsesCount + 1;
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                var response = {
                    "insert-key-here": "insert-value-here",
                    "key": "value"
                };
                responseObj = JSON.parse(responseObj.responseText);
                for (var i in responseObj) {
                    expect(responseObj[i]).toBe(response[i]);
                }
            },
            function() { }
        );

        var method = "GET";
        var url = "http://echo.jsontest.com/insert-key-here/insert-value-here/key/value";
        var timeout = 30;
        var isAsync = false;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest4 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest4.send(
            function(response) {
                expect(responsesCount).toBe(3);
                responsesCount = responsesCount + 1;
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                var response = {
                    "insert-key-here": "insert-value-here",
                    "key": "value"
                };
                responseObj = JSON.parse(responseObj.responseText);
                for (var i in responseObj) {
                    expect(responseObj[i]).toBe(response[i]);
                }
            },
            function() { }
        );

        var method = "GET";
        var url = "http://echo.jsontest.com/key/value/one/two";
        var timeout = 30;
        var isAsync = false;
        var user = null;
        var password = null;
        var auth = null;
        var aRequest5 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);
        aRequest5.send(
            function(response) {
                expect(responsesCount).toBe(4);
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                var response = {
                    "one": "two",
                    "key": "value"
                };
                responseObj = JSON.parse(responseObj.responseText);
                for (var i in responseObj) {
                    expect(responseObj[i]).toBe(response[i]);
                }
                done();
            },
            function() {

            }
        );

    });

    function verifyResponseObj(responseObj) {
        expect(responseObj.headers).toBeDefined();
        expect(responseObj.headers).not.toBeNull();
        expect(responseObj.status).toBeDefined();
        expect(responseObj.status).not.toBeNull();
        expect(responseObj.statusText).toBeDefined();
        expect(responseObj.statusText).not.toBeNull();
        expect(responseObj.responseText).toBeDefined();
        expect(responseObj.responseText).not.toBeNull();
        expect(responseObj.responseState).toBeDefined();
        expect(responseObj.responseState).not.toBeNull();
    }

});
