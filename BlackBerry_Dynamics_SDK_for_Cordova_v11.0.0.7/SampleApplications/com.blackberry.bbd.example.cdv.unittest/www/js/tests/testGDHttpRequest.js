/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 * 
 * GDHttpRequest plugin unit tests.
 */
var errorMessageRequestFileSystem = "no response from requestFileSystem",
    defaultFail = function(error) {
        expect(true).toBe(false);
    };

describe('GDHttpRequest plugin:', function() {

    var data_json_url = "http://httpbin.org/get?key=value&one=two";

    var gdccOnError = function(response) {
        expect(false).toBe(true);
    };

    var gdFileSystem;

    beforeEach(function(done) {
        requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            gdFileSystem = fileSystem;
            done();
        }, null);
    });

    afterEach(function() {
        gdFileSystem = null;
    });

    it('Check GDHttpRequest plugin installation', function() {
        expect(window).toBeDefined();
        expect(window.plugins).toBeDefined();
        expect(window.plugins.GDHttpRequest).toBeDefined();
        expect(window.plugins.GDCacheController).toBeDefined();
    });

    it('GDHttpRequest createRequest; default timeout', function() {
        var method = "GET",
            url = data_json_url,
            timeout = null,
            isAsync = false,
            user = null,
            password = null,
            auth = null,
            aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

        expect(aRequest).toBeDefined();
        expect(aRequest.method).toBe(method);
        expect(aRequest.url).toBe(url);
        expect(aRequest.timeout).toBe(-1);
        expect(aRequest.isAsync).toBe(isAsync);
        expect(aRequest.user).toBe(user);
        expect(aRequest.password).toBe(password);
        expect(aRequest.auth).toBe(auth);
        expect(aRequest.isIncremental).toBe(false);
    });

    it('GDHttpRequest createRequest; with timeout and incremental', function() {
        var method = "GET",
            url = data_json_url,
            timeout = 30,
            isAsync = false,
            user = null,
            password = null,
            auth = null,
            isIncremental = true,
            aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth, null, isIncremental);

        expect(aRequest).toBeDefined();
        expect(aRequest.method).toBe(method);
        expect(aRequest.url).toBe(url);
        expect(aRequest.timeout).toBe(timeout);
        expect(aRequest.isAsync).toBe(isAsync);
        expect(aRequest.user).toBe(user);
        expect(aRequest.password).toBe(password);
        expect(aRequest.auth).toBe(auth);
        expect(aRequest.isIncremental).toBe(isIncremental);
    });

    it('GDHttpRequest_Properties clearCookies', function() {
        var url = data_json_url,
            aRequest = window.plugins.GDHttpRequest.createRequest("GET", url, null, false, null, null, null);

        expect(aRequest.cookieState).toBeNull();

        aRequest.clearCookies(false);
        expect(aRequest.cookieState).toBe("memory");

        aRequest.clearCookies(true);
        expect(aRequest.cookieState).toBe("persistent");
    });

    it('GDHttpRequest_Properties enableHttpProxy', function() {
        var url = data_json_url,
            aRequest = window.plugins.GDHttpRequest.createRequest("GET", url, null, false, null, null, null),
            host = "some_host.com",
            port = 8080,
            user = "some_user",
            password = "some_pwd",
            auth = null;
        aRequest.enableHttpProxy(host, port, user, password, auth);

        expect(aRequest.host).toBe(host);
        expect(aRequest.port).toBe(port);
        expect(aRequest.proxyUser).toBe(user);
        expect(aRequest.proxyPassword).toBe(password);
        expect(aRequest.proxyAuth).toBe(auth);
    });


    it('GDHttpRequest_Properties disableHttpProxy', function() {
        var url = data_json_url,
            aRequest = window.plugins.GDHttpRequest.createRequest("GET", url, null, false, null, null, null),
            host = "some_host.com",
            port = 8080,
            user = "some_user",
            password = "some_pwd",
            auth = null;

        aRequest.enableHttpProxy(host, port, user, password, auth);
        aRequest.disableHttpProxy();
        expect(aRequest.host).toBe(null);
        expect(aRequest.port).toBe(-1);
        expect(aRequest.proxyUser).toBe(null);
        expect(aRequest.proxyPassword).toBe(null);
        expect(aRequest.proxyAuth).toBe(null);
    });

    it('GDHttpRequest_Properties addRequestHeader', function() {
        var url = data_json_url,
            aRequest = window.plugins.GDHttpRequest.createRequest("GET", url, null, false, null, null, null),
            headerName = "customHeader",
            headerValue = "customValue";

        expect(aRequest.sendOptions.RequestHeaders).toBeNull();

        aRequest.addRequestHeader(headerName, headerValue);
        expect(aRequest.sendOptions.RequestHeaders[headerName]).toBe(headerValue);
    });

    it('GDHttpRequest_Properties clearRequestHeaders', function() {
        var url = data_json_url;
        var aRequest = window.plugins.GDHttpRequest.createRequest("GET", url, null, false, null, null, null);

        var headerName = "customHeader",
            headerValue = "customValue";
        aRequest.addRequestHeader(headerName, headerValue);
        aRequest.clearRequestHeaders();
        expect(aRequest.sendOptions.RequestHeaders).toBeNull();
    });

    it('GDHttpRequest_Properties addPostParameter', function() {
        var url = "https://httpbin.org/get";
        var aRequest = window.plugins.GDHttpRequest.createRequest("GET", url, null, false, null, null, null);

        var postName = "someName",
            postValue = "some value";
        expect(aRequest.sendOptions.PostParameters).toBeNull();

        aRequest.addPostParameter(postName, postValue);
        expect(aRequest.sendOptions.PostParameters[0][postName]).toBe(postValue);
    });

    it('GDHttpRequest_Properties clearPostParameters', function() {
        var url = "https://httpbin.org/get";
        var aRequest = window.plugins.GDHttpRequest.createRequest("GET", url, null, false, null, null, null);

        var postName = "someName",
            postValue = "some value";
            
        aRequest.addPostParameter(postName, postValue);
        aRequest.clearPostParameters();
        expect(aRequest.sendOptions.PostParameters).toBeNull();
    });

    it('GDCacheController clearCredentialsForMethod: HTTPBasic', function(done) {
        var method = "HTTPBasic";

        window.plugins.GDCacheController.clearCredentialsForMethod(method, function(response) {
            expect(true).toBe(true);
            done();
        }, function(response) {
            expect(false).toBe(true);
            done();
        });
    });

    it('GDCacheController clearCredentialsForMethod: Default', function(done) {
        var method = "Default";

        window.plugins.GDCacheController.clearCredentialsForMethod(method, function(response) {
            expect(true).toBe(true);
            done();
        }, function(response) {
            expect(false).toBe(true);
            done();
        });
    });

    it('GDCacheController clearCredentialsForMethod: HTTPDigest', function(done) {
        var method = "HTTPDigest";

        window.plugins.GDCacheController.clearCredentialsForMethod(method, function(response) {
            expect(true).toBe(true);
            done();
        }, function(response) {
            expect(false).toBe(true);
            done();
        });
    });

    it('GDCacheController clearCredentialsForMethod: NTLM', function(done) {
        var method = "NTLM";

        window.plugins.GDCacheController.clearCredentialsForMethod(method, function(response) {
            expect(true).toBe(true);
            done();
        }, function(response) {
            expect(false).toBe(true);
            done();
        });
    });

    it('GDCacheController clearCredentialsForMethod: Negotiate', function(done) {
        var method = "Negotiate";

        window.plugins.GDCacheController.clearCredentialsForMethod(method, function(response) {
            expect(true).toBe(true);
            done();
        }, function(response) {
            expect(false).toBe(true);
            done();
        });
    });

    it('GDCacheController clearCredentialsForMethod: All', function(done) {
        var method = "All";

        window.plugins.GDCacheController.clearCredentialsForMethod(method, function(response) {
            expect(true).toBe(true);
            done();
        }, function(response) {
            expect(false).toBe(true);
            done();
        });
    });

    it('GDCacheController kerberosAllowDelegation: true', function(done) {
        window.plugins.GDCacheController.kerberosAllowDelegation(true, function(response) {
            expect(true).toBe(true);
            done();
        }, function(response) {});
    });

    it('GDCacheController kerberosAllowDelegation: true', function(done) {
        window.plugins.GDCacheController.kerberosAllowDelegation(false, function(response) {
            expect(true).toBe(true);
            done();
        }, function(response) {});
    });

    it('GDHttpRequest send GET', function(done) {
        var method = "GET";
        url = data_json_url;
        timeout = 30;
        isAsync = false;
        user = null;
        password = null;
        auth = null;
        aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

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
                done();
            },
            function() {}
        );
    });

    it('GDHttpRequest send body POST', function(done) {
        var method = "POST",
            url = "https://httpbin.org/post",
            timeout = 30,
            isAsync = true,
            user = null,
            password = null,
            auth = null,
            aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

        aRequest.addHttpBody("name = kent");

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
                done();
            },
            function() {}
        );
    });

    it('GDHttpRequest send POST with JSON encoded body', function(done) {
        var method = "POST",
            url = "https://httpbin.org/post",
            timeout = 30,
            isAsync = true,
            user = null,
            password = null,
            auth = null,
            requestBodyArray = [
                {
                    user: 'username'
                },
                {
                    comment: 'body %20 body'
                }
            ],
            aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

        aRequest.addRequestHeader("Content-type", "application/json");
        aRequest.addHttpBody(JSON.stringify(requestBodyArray));

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

                try {
                    var responseBody = JSON.parse(responseObj.responseText),
                    responseArray = responseBody.json;

                    expect(JSON.stringify(requestBodyArray)).toBe(JSON.stringify(responseArray));
                } catch(JSONException) {
                    console.error(JSONException);
                    expect("Failed to parse responseText to object").toBeFalsy();
                }
                

                done();
            },
            function() {}
        );
    });

    it('GDHttpRequest multiple requests', function(done) {
        var method = "GET",
            url = data_json_url,
            timeout = 30,
            isAsync = true,
            user = null,
            password = null,
            auth = null,
            responsesCount = 0,
            aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

        aRequest.send(
            function(response) {
                var responseObj1 = window.plugins.GDHttpRequest.parseHttpResponse(response);
                var response = {
                    "one": "two",
                    "key": "value"
                };
                responseObj1 = JSON.parse(responseObj1.responseText);
                for (var i in responseObj1.args) {
                    expect(responseObj1.args[i]).toBe(response[i]);
                }
                responsesCount = responsesCount + 1;
                if (responsesCount == 3) {
                    done();
                }
            },
            function() {}
        );

        var method = "GET",
            url = "http://httpbin.org/get?one=two&key=value",
            timeout = 30,
            isAsync = true,
            user = null,
            password = null,
            auth = null,
            aRequest2 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

        aRequest2.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                var response = {
                    "one": "two",
                    "key": "value"
                };
                responseObj = JSON.parse(responseObj.responseText);
                for (var i in responseObj.args) {
                    expect(responseObj.args[i]).toBe(response[i]);
                }

                responsesCount = responsesCount + 1;
                if (responsesCount == 3) {
                    done();
                }
            },
            function() {}
        );

        var method = "GET",
            url = "http://httpbin.org/get?insert-key-here=insert-value-here&key=value",
            timeout = 30,
            isAsync = true,
            user = null,
            password = null,
            auth = null,
            aRequest3 = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

        aRequest3.send(
            function(response) {
                var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
                var response = {
                    "insert-key-here": "insert-value-here",
                    "key": "value"
                };
                responseObj = JSON.parse(responseObj.responseText);
                for (var i in responseObj.args) {
                    expect(responseObj.args[i]).toBe(response[i]);
                }

                responsesCount = responsesCount + 1;
                if (responsesCount == 3) {
                    done();
                }
            },
            function() {}
        );

    });

});
