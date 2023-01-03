/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 *
 * XMLHttpRequest plugin unit tests.
 */
describe('XMLHttpRequest plugin:', function() {

    it('Check XMLHttpRequest plugin installation', function() {
        expect(window).toBeDefined();
        expect(window.XMLHttpRequest).toBeDefined();
    });

    describe('native XMLHttpRequest for local resources', function() {
        it('XMLHttpRequest open: positive case - path to file like https:///appassets.androidplatform.net/assets/', function(done) {
            var method = "GET",
                // DEVNOTE: after migration to GDWebView protocol is matched to "https://" instead of "file://" on Android
                // with href like "https://appassets.androidplatform.net/assets/www/index-android.html"
                url = window.location.origin + "/assets/www/img/logo.png"; // file:///android_asset/www/img/logo.png

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;
                var expectedStatusText = "OK";

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);
                    expect(xhr.statusText).toBeDefined();
                    expect(xhr.statusText).toBe(expectedStatusText);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest open: positive case - path to file like /android_asset/', function(done) {
            var method = "GET",
                url = "/android_asset/www/img/logo.png";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;
                var expectedStatusText = "OK";

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);
                    expect(xhr.statusText).toBeDefined();
                    expect(xhr.statusText).toBe(expectedStatusText);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest open: positive case - path to file relatively to "www" folder', function(done) {
            var method = "GET",
                url = "img/logo.png";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;
                var expectedStatusText = "OK";

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);
                    expect(xhr.statusText).toBeDefined();
                    expect(xhr.statusText).toBe(expectedStatusText);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: positive case - path to file relatively to "www" folder, responseType - blob', function(done) {
            var method = "GET",
                url = "img/blackberry-logo.jpg";

            var xhr = new XMLHttpRequest(),
                expectedResponseType = 'blob',
                expectedStatus = 200,
                expectedStatusText = "OK",
                expectedFileSize = 939424,
                expectedMimeType = "image/jpeg";

            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);
            xhr.responseType = expectedResponseType;

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.response instanceof Blob).toBeTruthy();
                    expect(xhr.response.size).toBe(expectedFileSize);
                    expect(xhr.response.type).toBe(expectedMimeType);
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);
                    expect(xhr.statusText).toBeDefined();
                    expect(xhr.statusText).toBe(expectedStatusText);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest abort: before calling SEND method', function(done) {
            var method = "GET",
                url = window.location.origin + "/assets/www/img/blackberry-logo.jpg"; // file:///android_asset/www/img/blackberry-logo.jpg;

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onabort = function() {
                expect(xhr.readyState).toBe(4);
                expect(xhr.status).toBe(0);

                done();
            };

            xhr.send();
            xhr.abort();
        });

        it('XMLHttpRequest send: GET async, without parameters', function(done) {
            var method = "GET",
                url = window.location.origin + "/assets/www/img/blackberry-logo.jpg"; // file:///android_asset/www/img/blackberry-logo.jpg

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onload = function() {

                var expectedStatus = 200,
                    expectedStatusText = "OK";

                expect(xhr.response).toBeDefined();
                expect(xhr.status).toBeDefined();
                expect(xhr.status).toBe(expectedStatus);
                expect(xhr.statusText).toBeDefined();
                expect(xhr.statusText).toBe(expectedStatusText);

                done();
            };

            xhr.send();
        });

        it('XMLHttpRequest send: GET sync, with null as parameter', function(done) {
            var method = "GET",
                url = window.location.origin + "/assets/www/img/logo.png"; // file:///android_asset/www/img/logo.png

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200,
                    expectedStatusText = "OK";

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);
                    expect(xhr.statusText).toBeDefined();
                    expect(xhr.statusText).toBe(expectedStatusText);

                    done();
                }
            };

            xhr.send(null);
        });

        it('XMLHttpRequest send: with timeout, local resource', function(done) {
            var method = "GET",
                url = window.location.origin + "/assets/www/img/blackberry-logo.jpg"; // file:///android_asset/www/img/blackberry-logo.jpg

            var xhr = new XMLHttpRequest(),
                expectedResponseType = 'blob',
                expectedStatus = 0,
                expectedStatusText = "";
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);
            xhr.responseType = expectedResponseType;

            expect(xhr.readyState).toBe(1);

            xhr.timeout = 1;

            xhr.ontimeout = function() {
                expect(xhr.readyState).toBe(4);
                expect(xhr.status).toBeDefined();
                expect(xhr.status).toBe(expectedStatus);
                expect(xhr.statusText).toBeDefined();
                expect(xhr.statusText).toBe(expectedStatusText);
                expect(xhr.responseType).toBeDefined();
                expect(xhr.responseType).toBe(expectedResponseType);

                done();
            };

            xhr.send();
        });

        it('XMLHttpRequest GET text file', function(done) {
            var method = "GET",
                url = window.location.origin + "/assets/www/files/document.txt"; // file:///android_asset/www/files/document.txt

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);
            xhr.responseType = 'text';

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;
                var expectedStatusText = "OK";

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBe("Hello World!!!");
                    expect(xhr.responseText).toBe("Hello World!!!");
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);
                    expect(xhr.statusText).toBeDefined();
                    expect(xhr.statusText).toBe(expectedStatusText);
                    expect(xhr.responseType).toBe("text");

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest GET json file', function(done) {
            var method = "GET",
                url = window.location.origin + "/assets/www/files/test.json"; // file:///android_asset/www/files/test.json

            var expectedResponseObj = {
                "ApplicationID": "com.blackberry.bbd.example.cdv.unittest",
                "applicationName": "UnitTest",
                "description": "Demonstrates how to use all APIs supported in this version of the Cordova Plugin release.",
                "version": "1.0.0"
            }

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);
            xhr.responseType = 'json';

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;
                var expectedStatusText = "OK";

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);
                    expect(xhr.statusText).toBeDefined();
                    expect(xhr.statusText).toBe(expectedStatusText);
                    expect(xhr.responseType).toBe("json");
                    expect(xhr.response.ApplicationID).toBe(expectedResponseObj.ApplicationID);
                    expect(xhr.response.applicationName).toBe(expectedResponseObj.applicationName);
                    expect(xhr.response.description).toBe(expectedResponseObj.description);
                    expect(xhr.response.version).toBe(expectedResponseObj.version);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest GET html file', function(done) {
            var method = "GET",
                url = window.location.origin + "/assets/www/files/test.html"; // file:///android_asset/www/files/test.html

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);
            xhr.responseType = 'document';

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;
                var expectedStatusText = "OK";

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);
                    expect(xhr.statusText).toBeDefined();
                    expect(xhr.statusText).toBe(expectedStatusText);
                    expect(xhr.responseType).toBe("document");
                    expect(xhr.responseXML.title).toBe("Hello World");

                    done();
                }
            };

            xhr.send();
        });
    });

    describe('XMLHttpRequest open', function() {
        it('XMLHttpRequest open: negative case - no parameters', function(done) {
            try {
                var xhr = new XMLHttpRequest();
                xhr.open();
            } catch (e) {
                expect(e).toBeDefined();
                expect(e.message).toContain("Failed to execute 'open' on 'XMLHttpRequest': 2 arguments required, but only 0 present.");

                done();
            }
        });

        it('XMLHttpRequest open: negative case - one parameter', function(done) {
            var method = "GET";

            try {
                var xhr = new XMLHttpRequest();
                xhr.open(method);
            } catch (e) {
                expect(e).toBeDefined();
                expect(e.message).toContain("Failed to execute 'open' on 'XMLHttpRequest': 2 arguments required, but only 1 present.");

                done();
            }
        });

        it('XMLHttpRequest open: positive case - two required parameters METHOD and URL', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            done();
        });

        it('XMLHttpRequest open: positive case - two required parameters METHOD and URL, one optional parameter ASYNC', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";
            var async = false;

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, async);

            expect(xhr.readyState).toBe(1);

            done();
        });

        it('XMLHttpRequest open: positive case - two required parameters METHOD and URL, two optional parameters ASYNC and USER', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";
            var async = false;
            var user = "gdadmin";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, async, user);

            expect(xhr.readyState).toBe(1);

            done();
        });

        it('XMLHttpRequest open: positive case - two required parameters METHOD and URL, three optional parameters ASYNC, USER and PASSWORD', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";
            var async = false;
            var user = "gdadmin";
            var password = "gdadmin"

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, async, user, password);

            expect(xhr.readyState).toBe(1);

            done();
        });
    });

    describe('XMLHttpRequest setRequestHeader', function() {
        it('XMLHttpRequest setRequestHeader: negative case - no parameters', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";

            try {
                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);
                xhr.open(method, url);
                xhr.setRequestHeader();
            } catch (e) {
                expect(e).toBeDefined();
                expect(e.message).toContain("Failed to execute 'setRequestHeader' on 'XMLHttpRequest': 2 arguments required, but only 0 present.");

                done();
            }
        });

        it('XMLHttpRequest setRequestHeader: negative case - one parameter', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";
            var headerName = "Connection";

            try {
                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);
                xhr.open(method, url);
                xhr.setRequestHeader(headerName);
            } catch (e) {
                expect(e).toBeDefined();
                expect(e.message).toContain("Failed to execute 'setRequestHeader' on 'XMLHttpRequest': 2 arguments required, but only 1 present.");

                done();
            }
        });

        it('XMLHttpRequest setRequestHeader: positive case - add one request header', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";
            var headerName = "Content-type";
            var headerValue = "application/json; charset=utf-8";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            xhr.setRequestHeader(headerName, headerValue);

            expect(xhr.readyState).toBe(1);

            done();
        });

        it('XMLHttpRequest setRequestHeader: positive case - add two request headers', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";
            var headerName1 = "Content-type";
            var headerValue1 = "application/json; charset=utf-8";
            var headerName2 = "Connection";
            var headerValue2 = "close";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            xhr.setRequestHeader(headerName1, headerValue1);
            xhr.setRequestHeader(headerName2, headerValue2);

            expect(xhr.readyState).toBe(1);

            done();
        });

        it('XMLHttpRequest setRequestHeader: positive case - add two request headers with same name and different values', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";
            var headerName1 = "Content-type";
            var headerValue1 = "application/json";
            var headerName2 = "Content-type";
            var headerValue2 = "charset=utf-8";
            var headerName3 = "Connection";
            var headerValue3 = "close";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            xhr.setRequestHeader(headerName1, headerValue1);
            xhr.setRequestHeader(headerName2, headerValue2);
            xhr.setRequestHeader(headerName3, headerValue3);

            expect(xhr.readyState).toBe(1);

            done();
        });
    });

    describe('XMLHttpRequest FormData.append', function() {
        it('XMLHttpRequest FormData.append: negative case - no parameters', function(done) {
            try {
                var formData = new FormData();
                expect(formData).toBeDefined();
                expect(formData.append).toBeDefined();

                formData.append();
            } catch (e) {
                expect(e).toBeDefined();
                expect(e.message).toContain("Failed to execute 'append' on 'FormData': 2 arguments required, but only 0 present.");

                done();
            }
        });

        it('XMLHttpRequest FormData.append: negative case - one parameter', function(done) {
            try {
                var formData = new FormData();
                expect(formData).toBeDefined();
                expect(formData.append).toBeDefined();

                formData.append("key");
            } catch (e) {
                expect(e).toBeDefined();
                expect(e.message).toContain("Failed to execute 'append' on 'FormData': 2 arguments required, but only 1 present.");

                done();
            }
        });

        it('XMLHttpRequest FormData.append: positive case', function(done) {
            var formData = new FormData();
            expect(formData).toBeDefined();
            expect(formData.append).toBeDefined();

            formData.append("key", "value");

            done();
        });

    });

    describe('XMLHttpRequest send', function() {
        var originalTimeout;

        beforeEach(function() {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        });

        afterEach(function() {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        it('XMLHttpRequest send: negative case - call send method before open method', function(done) {
            try {
                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);
                xhr.send();
            } catch (e) {
                expect(e).toBeDefined();
                expect(e.message).toContain("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");

                done();
            }
        });

        it('XMLHttpRequest send: GET async, on default port', function(done) {
            var method = "GET";
            var url = "http://httpbin.org:80/get";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: GET async, on secured port', function(done) {
            var method = "GET";
            var url = "https://httpbin.org:443/get";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: POST async, on secured port', function(done) {
            var method = "POST";
            var url = "https://httpbin.org:443/post";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: POST sync, on secured port', function(done) {
            var method = "POST";
            var url = "https://httpbin.org:443/post";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, false);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: GET sync, on secured port, other server', function(done) {
            var method = "GET";
            var url = "https://httpbin.org:443/get";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, false);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: GET async, without parameters', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: GET sync, with null as parameter', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, false);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send(null);
        });

        it('XMLHttpRequest send: GET sync', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, false);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: POST sync', function(done) {
            var method = "POST";
            var url = "https://httpbin.org/post";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, false);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: POST async', function(done) {
            var method = "POST";
            var url = "https://httpbin.org/post";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, true);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: PUT sync', function(done) {
            var method = "PUT";
            var url = "https://httpbin.org/put";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, false);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: PUT async', function(done) {
            var method = "PUT";
            var url = "https://httpbin.org/put";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, true);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: PATCH sync', function(done) {
            var method = "PATCH",
                url = "https://httpbin.org/patch";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, false);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: PATCH async', function(done) {
            var method = "PATCH",
                url = "https://httpbin.org/patch";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, true);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: PATCH with string data as parameter and response type JSON', function(done) {
            var method = "PATCH",
                url = "https://httpbin.org/patch",
                responseType = "json",
                dataString = "test string",
                contentTypeHeader = 'content-type',
                contentTypeValue = 'text/plain';

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, true);
            xhr.responseType = responseType;

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);
                    expect(xhr.responseType).toBe(responseType);
                    expect(typeof xhr.response).toBe("object");
                    expect(xhr.response.data).toBe(dataString);

                    done();
                }
            };

            xhr.setRequestHeader(contentTypeHeader, contentTypeValue);
            xhr.send(dataString);
        });

        it('XMLHttpRequest send: PATCH with blob data as parameter and response type JSON', function(done) {
            var method = "PATCH",
                url = "https://httpbin.org/patch",
                responseType = "json",
                dataString = "test string",
                blob = new Blob([dataString], {
                    type: 'text/plain'
                });

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, true);
            xhr.responseType = responseType;

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);
                    expect(xhr.responseType).toBe(responseType);
                    expect(typeof xhr.response).toBe("object");

                    done();
                }
            };

            xhr.send(blob);
        });

        it('XMLHttpRequest send: PATCH with arraybuffer as parameter and response type JSON', function(done) {
            var method = "PATCH",
                responseType = "json",
                url = "https://httpbin.org/patch";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            xhr.responseType = responseType;

            expect(xhr.readyState).toBe(1);

            var arrayBuffer = new ArrayBuffer(1024);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);
                    expect(xhr.responseType).toBe(responseType);
                    expect(typeof xhr.response).toBe("object");

                    done();
                }
            };

            xhr.send(arrayBuffer);
        });

        it('XMLHttpRequest send: PATCH with file, upload callbacks', function(done) {
            var method = "PATCH",
                url = "https://httpbin.org/patch",
                options = { create: true, exclusive: false },
                gdFileSystem;

            jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

            requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                fileSystem.root.getFile("/aFile.txt", options, function(fileEntry) {
                    fileEntry.createWriter(function(writer) {
                        writer.seek(writer.length);

                        writer.onwriteend = function() {
                            fileEntry.file(function(file) {
                                var reader = new FileReader();

                                reader.onloadend = function(evt) {
                                    var xhr = new XMLHttpRequest();
                                    expect(xhr.readyState).toBe(0);
                                    xhr.open(method, url);

                                    expect(xhr.readyState).toBe(1);

                                    var fileName = "fileName=";
                                    var str = "";

                                    for (var i = 0; i < 100; i++) {
                                        str += evt.target.result;
                                    }

                                    // DEVNOTE: Currently, BBWebView does not support upload callbacks.
                                    // actually, upload.onload, upload.onprogress, upload.onprogress and upload.onloadend are not work.
                                    xhr.upload.onloadstart = function(e) {
                                        expect(e).toBeDefined();
                                        expect(e.type).toBe("loadstart");
                                        expect(e.target).toBe(xhr.upload);
                                        if (e.lengthComputable) {
                                            var intLoaded = parseInt(e.loaded, 10),
                                            intTotal = parseInt(e.total, 10);
                                            expect(intLoaded < intTotal).toBeTruthy();
                                        }
                                    }

                                    xhr.upload.onload = function(e) {
                                        expect(e).toBeDefined();
                                        expect(e.type).toBe("load");
                                        expect(e.target).toBe(xhr.upload);
                                        expect(e.lengthComputable).toBeTruthy();
                                        expect(e.total).toBeDefined();
                                        expect(e.loaded).toBeDefined();
                                        expect(e.total).toBe(e.loaded);
                                    }

                                    xhr.upload.onprogress = function(e) {
                                        expect(e).toBeDefined();
                                        expect(e.type).toBe("progress");
                                        expect(e.target).toBe(xhr.upload);
                                        expect(e.lengthComputable).toBeTruthy();
                                        expect(e.total).toBeDefined();
                                        expect(e.loaded).toBeDefined();
                                        var intTotal = parseInt(e.total, 10),
                                            intLoaded = parseInt(e.loaded, 10);

                                        if (intLoaded < intTotal) {
                                            expect("progress event works as expected").toBeTruthy();
                                        } else {
                                            // handle last call of onprogress event
                                            // file is already uploaded
                                            expect(e.loaded).toBe(e.total);
                                        }
                                    }

                                    xhr.upload.onloadend = function(e) {
                                        expect(e).toBeDefined();
                                        expect(e.type).toBe("loadend");
                                        expect(e.target).toBe(xhr.upload);
                                        expect(e.lengthComputable).toBeTruthy();
                                        expect(e.total).toBeDefined();
                                        expect(e.loaded).toBeDefined();
                                        expect(e.total).toBe(e.loaded);
                                    }

                                    xhr.onreadystatechange = function() {
                                        var expectedStatus = 200;

                                        if (xhr.readyState == 4) {
                                            expect(xhr.response).toBeDefined();
                                            expect(xhr.responseText).toBeDefined();
                                            expect(xhr.status).toBeDefined();
                                            expect(xhr.status).toBe(expectedStatus);

                                            fileEntry.remove();
                                            done();
                                        }
                                    };

                                    xhr.send(fileName + str);
                                };

                                reader.readAsText(file);
                            }, null);
                        };

                        var textToWrite = (function() {
                            var str = 'Text'
                            for (i = 0; i < 8; i++) {
                                str += str;
                            }
                            return str;
                        })();

                        writer.write(textToWrite);
                    }, null);
                }, null);
            }, null);
        });

        it('XMLHttpRequest send: PATCH with formdata as parameter, 3 parameters + file', function(done) {
            var method = "PATCH",
                url = "https://httpbin.org/patch",
                options = { create: true, exclusive: false },
                gdFileSystem;

            jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

            requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                fileSystem.root.getFile("/aFile.txt", options, function(fileEntry) {
                    fileEntry.createWriter(function(writer) {
                        writer.seek(writer.length);

                        writer.onwriteend = function() {
                            fileEntry.file(function(file) {
                                var reader = new FileReader();

                                reader.onloadend = function(evt) {
                                    var xhr = new XMLHttpRequest();
                                    expect(xhr.readyState).toBe(0);
                                    xhr.open(method, url);

                                    expect(xhr.readyState).toBe(1);

                                    var formData = new FormData();
                                    formData.append("parameter1", "value1");
                                    formData.append("parameter2", "value2");
                                    formData.append("parameter3", "value3");
                                    formData.append("file", fileEntry.fullPath);

                                    xhr.onreadystatechange = function() {
                                        var expectedStatus = 200;

                                        if (xhr.readyState == 4) {
                                            expect(xhr.response).toBeDefined();
                                            expect(xhr.responseText).toBeDefined();
                                            expect(xhr.status).toBeDefined();
                                            expect(xhr.status).toBe(expectedStatus);

                                            fileEntry.remove();
                                            done();
                                        }
                                    };

                                    xhr.send(formData);
                                };

                                reader.readAsText(file);
                            }, null);
                        };

                        var str = "";
                        for (var i = 0; i < 100; i++) {
                            str += "Text";
                        }

                        writer.write(str);
                    }, null);
                }, null);
            }, null);
        });

        it('XMLHttpRequest send: DELETE sync', function(done) {
            var method = "DELETE";
            var url = "http://httpbin.org/delete";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, false);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: DELETE async', function(done) {
            var method = "DELETE";
            var url = "http://httpbin.org/delete";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, true);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: HEAD sync', function(done) {
            var method = "HEAD";
            var url = "http://httpbin.org/get?one=two&key=value";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, false);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: HEAD async', function(done) {
            var method = "HEAD";
            var url = "http://httpbin.org/get?one=two&key=value";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, true);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: OPTIONS sync', function(done) {
            var method = "OPTIONS";
            var url = "http://httpbin.org/";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, false);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: OPTIONS async', function(done) {
            var method = "OPTIONS";
            var url = "http://httpbin.org/";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, true);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: with formdata as parameter, 3 parameters + file', function(done) {
            var method = "POST";
            var url = "https://httpbin.org/post";
            var options = { create: true, exclusive: false };
            var gdFileSystem;

            requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                fileSystem.root.getFile("/aFile.txt", options, function(fileEntry) {
                    fileEntry.createWriter(function(writer) {
                        writer.seek(writer.length);

                        writer.onwriteend = function() {
                            fileEntry.file(function(file) {
                                var reader = new FileReader();

                                reader.onloadend = function(evt) {
                                    var xhr = new XMLHttpRequest();
                                    expect(xhr.readyState).toBe(0);
                                    xhr.open(method, url);

                                    expect(xhr.readyState).toBe(1);

                                    var formData = new FormData();
                                    formData.append("parameter1", "value1");
                                    formData.append("parameter2", "value2");
                                    formData.append("parameter3", "value3");
                                    formData.append("file", fileEntry.fullPath);

                                    xhr.onreadystatechange = function() {
                                        var expectedStatus = 200;

                                        if (xhr.readyState == 4) {
                                            expect(xhr.response).toBeDefined();
                                            expect(xhr.responseText).toBeDefined();
                                            expect(xhr.status).toBeDefined();
                                            expect(xhr.status).toBe(expectedStatus);

                                            fileEntry.remove();
                                            done();
                                        }
                                    };

                                    xhr.send(formData);
                                };

                                reader.readAsText(file);
                            }, null);
                        };

                        var str = "";
                        for (var i = 0; i < 1000; i++) {
                            str += "Text";
                        }

                        writer.write(str);
                    }, null);
                }, null);
            }, null);
        });

        it('XMLHttpRequest send: with arraybuffer as parameter', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            var arrayBuffer = new ArrayBuffer(128);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send(arrayBuffer);
        });

        it('XMLHttpRequest send: GET async, with domstring as parameter', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            var params = "?somevariable=someValue&anothervariable=anotherValue";

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send(params);
        });

        it('XMLHttpRequest send: POST async, with domstring as parameter, Content-Type: application/x-www-form-urlencoded', function(done) {
            var method = "POST";
            var url = "https://httpbin.org/post";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            var params = "somevariable=someValue&anothervariable=anotherValue";

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        });

        it('XMLHttpRequest send: POST async, with domstring as parameter, Content-Type: text/plain', function(done) {
            var method = "POST";
            var url = "https://httpbin.org/post";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            var params = "somevariable=someValue\nanothervariable=anotherValue";

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.setRequestHeader("Content-Type", "text/plain");
            xhr.send(params);
        });

        it('XMLHttpRequest send: POST async, with domstring as parameter, Content-Type: multipart/form-data', function(done) {
            var method = "POST";
            var url = "https://httpbin.org/post";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            var params = 'boundary=---------------------------314911788813839\n\n' +
                '-----------------------------314911788813839\n' +
                'Content-Disposition: form-data; name="fileName"\n\n' +
                'Text\n-----------------------------314911788813839';

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.setRequestHeader("Content-Type", "multipart/form-data");
            xhr.send(params);
        });

        it('XMLHttpRequest send: PUT with file, upload callbacks', function(done) {
            var method = "PUT";
            var url = "https://httpbin.org/put";
            var options = { create: true, exclusive: false };
            var gdFileSystem;

            requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                fileSystem.root.getFile("/aFile.txt", options, function(fileEntry) {
                    fileEntry.createWriter(function(writer) {
                        writer.seek(writer.length);

                        writer.onwriteend = function() {
                            fileEntry.file(function(file) {
                                var reader = new FileReader();

                                reader.onloadend = function(evt) {
                                    var xhr = new XMLHttpRequest();
                                    expect(xhr.readyState).toBe(0);
                                    xhr.open(method, url);

                                    expect(xhr.readyState).toBe(1);

                                    var fileName = "fileName=";
                                    var str = "";

                                    for (var i = 0; i < 1000; i++) {
                                        str += evt.target.result;
                                    }

                                    // DEVNOTE: Currently, BBWebView does not support upload callbacks.
                                    // actually, upload.onload, upload.onprogress, upload.onprogress and upload.onloadend are not work.
                                    xhr.upload.onloadstart = function(e) {
                                        expect(e).toBeDefined();
                                        expect(e.type).toBe("loadstart");
                                        expect(e.target).toBe(xhr.upload);
                                        if (e.lengthComputable) {
                                            var intLoaded = parseInt(e.loaded, 10),
                                            intTotal = parseInt(e.total, 10);
                                            expect(intLoaded < intTotal).toBeTruthy();
                                        }
                                    }

                                    xhr.upload.onload = function(e) {
                                        expect(e).toBeDefined();
                                        expect(e.type).toBe("load");
                                        expect(e.target).toBe(xhr.upload);
                                        expect(e.lengthComputable).toBeTruthy();
                                        expect(e.total).toBeDefined();
                                        expect(e.loaded).toBeDefined();
                                        expect(e.total).toBe(e.loaded);
                                    }

                                    xhr.upload.onprogress = function(e) {
                                        expect(e).toBeDefined();
                                        expect(e.type).toBe("progress");
                                        expect(e.target).toBe(xhr.upload);
                                        expect(e.lengthComputable).toBeTruthy();
                                        expect(e.total).toBeDefined();
                                        expect(e.loaded).toBeDefined();
                                        var intTotal = parseInt(e.total, 10),
                                            intLoaded = parseInt(e.loaded, 10);

                                        if (intLoaded < intTotal) {
                                            expect("progress event works as expected").toBeTruthy();
                                        } else {
                                            // handle last call of onprogress event
                                            // file is already uploaded
                                            expect(e.loaded).toBe(e.total);
                                        }
                                    }

                                    xhr.upload.onloadend = function(e) {
                                        expect(e).toBeDefined();
                                        expect(e.type).toBe("loadend");
                                        expect(e.target).toBe(xhr.upload);
                                        expect(e.lengthComputable).toBeTruthy();
                                        expect(e.total).toBeDefined();
                                        expect(e.loaded).toBeDefined();
                                        expect(e.total).toBe(e.loaded);
                                    }

                                    // this code should be implemented in a separate unit tests after GD-29876
                                    xhr.upload.ontimeout = function(e) {
                                        expect(e).toBeDefined();
                                        expect(e.type).toBe("timeout");
                                    }

                                    xhr.upload.onabort = function(e) {
                                        expect(e).toBeDefined();
                                        expect(e.type).toBe("abort");
                                    }

                                    xhr.upload.onerror = function(e) {
                                        expect(e).toBeDefined();
                                        expect(e.type).toBe("error");
                                    }

                                    xhr.onreadystatechange = function() {
                                        var expectedStatus = 200;

                                        if (xhr.readyState == 4) {
                                            expect(xhr.response).toBeDefined();
                                            expect(xhr.responseText).toBeDefined();
                                            expect(xhr.status).toBeDefined();
                                            expect(xhr.status).toBe(expectedStatus);

                                            fileEntry.remove();
                                            done();
                                        }
                                    };

                                    xhr.send(fileName + str);
                                };

                                reader.readAsText(file);
                            }, null);
                        };

                        var textToWrite = (function() {
                            var str = 'Text'
                            for (i = 0; i < 8; i++) {
                                str += str;
                            }
                            return str;
                        })();

                        writer.write(textToWrite);
                    }, null);
                }, null);
            }, null);
        });

        // TODO: enable this test after authentication is implemented
        xit('XMLHttpRequest send: GET async, withCredentials=true, valid credentials', function(done) {
            var method = "GET",
                url = "http://httpbin.org/basic-auth/user/password";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, true, "user", "password");

            expect(xhr.readyState).toBe(1);

            xhr.withCredentials = true;

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest send: GET async, withCredentials=true, invalid credentials', function(done) {
            var method = "GET",
                url = "http://httpbin.org/basic-auth/user/password";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, true, "userrrr", "pass");

            expect(xhr.readyState).toBe(1);

            xhr.withCredentials = true;

            xhr.onreadystatechange = function() {
                var expectedStatus = 401;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        // TODO: enable this test after authentication is implemented
        xit('XMLHttpRequest send: POST async, withCredentials=true, valid credentials set in open method', function(done) {
            var method = "GET",
                url = "http://httpbin.org/basic-auth/user/password";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, true, "user", "password");

            expect(xhr.readyState).toBe(1);

            xhr.withCredentials = true;

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        // TODO: enable this test after authentication is implemented
        xit('XMLHttpRequest send: GET async, withCredentials=false, valid credentials set in open method', function(done) {
            var method = "GET",
                url = "http://httpbin.org/basic-auth/user/password";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url, true, "user", "password");

            expect(xhr.readyState).toBe(1);

            xhr.withCredentials = false;

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);
                    expect(xhr.responseText).toBeDefined();

                    done();
                }
            };

            xhr.send();
        });

    });

    describe('XMLHttpRequest responseURL attribute', function() {
        it('should be present on the XMLHttpRequest object', function(done) {
            var method = "GET",
                url = "https://www.httpbin.org/get";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === xhr.DONE) {
                    expect(xhr.status).toBe(200);
                    expect(xhr.responseURL).toBeDefined();
                    expect(xhr.responseURL).toBe(url);
                    done();
                }
            };

            xhr.send();
        });

        it('should be equal to the last server URL in the redirection chain', function(done) {
            var method = "GET",
                redirectionUrl = "https://httpbin.org/get",
                url = "https://httpbingo.org/redirect-to?url=";
            url += redirectionUrl;

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                if (xhr.readyState == xhr.DONE) {
                    expect(xhr.status).toBe(200);
                    expect(xhr.responseURL).toBe(redirectionUrl);
                    done();
                }
            };

            xhr.send();
        })
    })

    describe('XMLHttpRequest getResponseHeader', function() {
        it('XMLHttpRequest getResponseHeader: negative case - no parameter', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    try {
                        xhr.getResponseHeader();
                    } catch (e) {
                        expect(e).toBeDefined();
                        expect(e.message).toContain("Failed to execute 'getResponseHeader' on " +
                            "'XMLHttpRequest': 1 argument required, but only 0 present.");

                        done();
                    }
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest getResponseHeader: positive case', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    var headerName = "Content-Type";
                    var headerValue = xhr.getResponseHeader(headerName);
                    var expectedHeaderValue = "application/json";

                    expect(headerValue).toBeDefined();
                    expect(headerValue.includes(expectedHeaderValue)).toBeTruthy();

                    done();
                }
            };

            xhr.send();
        });
    });

    describe('XMLHttpRequest getAllResponseHeaders', function() {
        it('XMLHttpRequest getAllResponseHeaders: positive case', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    var headerValue = xhr.getAllResponseHeaders();

                    expect(headerValue).toBeDefined();

                    done();
                }
            };

            xhr.send();
        });
    });

    describe('XMLHttpRequest overrideMimeType', function() {
        it('XMLHttpRequest overrideMimeType: negative case - no parameter', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            try {
                xhr.overrideMimeType();
            } catch (e) {
                expect(e).toBeDefined();
                expect(e.message).toContain("Failed to execute 'overrideMimeType' on " +
                    "'XMLHttpRequest': 1 argument required, but only 0 present.");

                done();
            }
        });

        it('XMLHttpRequest overrideMimeType: positive case', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";

            var xhr = new XMLHttpRequest();
            var mimeType = "text/json";
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.overrideMimeType(mimeType);

            done();
        });
    });

    describe('XMLHttpRequest responseType', function() {
        it('XMLHttpRequest responseType: empty string, responseXML', function(done) {
            var method = "GET";
            var url = "https://www.w3schools.com/xml/note.xml";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(typeof xhr.response).toBe("string");
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);
                    expect(xhr.getResponseHeader("Content-Type")).toBe("text/xml");
                    expect(xhr.responseXML).toBeDefined();
                    expect(xhr.responseXML).not.toBe(null);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest responseType: text, responseXML', function(done) {
            var method = "GET";
            var url = "https://www.w3schools.com/xml/note.xml";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.responseType = "text";

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(typeof xhr.response).toBe("string");
                    expect(xhr.responseText).toBeDefined();
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest responseType: json', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.responseType = "json";

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(typeof xhr.response).toBe("object");
                    expect(xhr.response.args["one"]).toBe("two");
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest responseType: document', function(done) {
            var method = "GET";
            var url = "https://www.w3schools.com/xml/note.xml";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.responseType = "document";

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    expect(xhr.response).toBeDefined();
                    expect(xhr.response instanceof Document).toBe(true);
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);
                    expect(xhr.responseXML).toBeDefined();
                    expect(xhr.responseXML).not.toBe(null);

                    done();
                }
            };

            xhr.send();
        });

        it('XMLHttpRequest responseType: blob', function(done) {
            var method = "GET";
            var url = "https://via.placeholder.com/720";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);

            xhr.responseType = "blob";

            xhr.onreadystatechange = function() {
                var expectedStatus = 200;

                if (xhr.readyState == 4) {
                    var expectedSize = parseInt(xhr.getResponseHeader('Content-Length'), 10),
                        expectedType = xhr.getResponseHeader('Content-Type');
                    expect(xhr.response).toBeDefined();
                    expect(xhr.response instanceof Blob).toBe(true);
                    expect(xhr.response.size).toBe(expectedSize);
                    expect(xhr.response.type).toBe(expectedType);
                    expect(xhr.status).toBeDefined();
                    expect(xhr.status).toBe(expectedStatus);

                    done();
                }
            };

            xhr.send();
        });
    });

    describe('XMLHttpRequest abort', function() {
        it('XMLHttpRequest abort: before calling SEND method', function(done) {
            var method = "GET";
            var url = "http://httpbin.org/get?one=two&key=value";

            var xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);
            expect(xhr.abort).toBeDefined();

            xhr.abort();

            expect(xhr.readyState).toBe(1);

            done();
        });
    });

    describe('XMLHttpRequest addEventListener method:', function() {
        it('should be defined on the XMLHttpRequest instance', function(done) {
            var method = "GET",
                url = "http://httpbin.org/get?one=two&key=value",
                xhr = new XMLHttpRequest();
            expect(xhr.readyState).toBe(0);
            xhr.open(method, url);

            expect(xhr.readyState).toBe(1);
            expect(xhr.addEventListener).toBeDefined();
            expect(typeof xhr.addEventListener).toBe('function');
            done();
        });

        describe('abort event:', function() {
            it('shouldn\'t be triggerd before sending the request', function(done) {
                var method = "GET",
                    url = "http://httpbin.org/get?one=two&key=value";

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);
                xhr.open(method, url);

                expect(xhr.readyState).toBe(1);

                xhr.addEventListener('abort', function(event) {
                    expect(true).toBeFalsy();
                })


                expect(xhr.readyState).toBe(1);

                xhr.abort();

                setTimeout(function() {
                    done();
                }, 50);
            });

            it('shoud be triggered after sending the request', function(done) {
                var method = "GET",
                    url = "http://httpbin.org/get?one=two&key=value";

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);
                xhr.open(method, url);

                expect(xhr.readyState).toBe(1);

                xhr.addEventListener('abort', function(event) {
                    expect(event).toBeDefined();
                    expect(event.type).toBeDefined();
                    expect(event.type).toBe('abort');
                    expect(event.target).toBeDefined();
                    expect(event.target instanceof XMLHttpRequest).toBeTruthy();
                    expect(event.target.readyState).toBe(event.target.DONE);
                    expect(event.target.status).toBe(0);
                    done();
                })

                expect(xhr.readyState).toBe(1);

                xhr.send();

                xhr.abort();
            });

            it('shoud be triggered after "onabort" callback', function(done) {
                var method = "GET",
                    url = "http://httpbin.org/get?one=two&key=value";

                var xhr = new XMLHttpRequest(),
                    isOnAbortTriggered = false;
                expect(xhr.readyState).toBe(0);
                xhr.open(method, url);

                expect(xhr.readyState).toBe(1);

                xhr.addEventListener('abort', function(event) {
                    expect(event).toBeDefined();
                    expect(event.type).toBeDefined();
                    expect(event.type).toBe('abort');
                    expect(event.target).toBeDefined();
                    expect(event.target instanceof XMLHttpRequest).toBeTruthy();
                    expect(event.target.readyState).toBe(event.target.DONE);
                    expect(event.target.status).toBe(0);
                    isOnAbortTriggered = true;
                })

                xhr.onabort = function() {
                    expect(isOnAbortTriggered).toBeTruthy();
                    done();
                }

                expect(xhr.readyState).toBe(1);

                xhr.send();

                xhr.abort();
            });
        });

        describe('timeout event', function() {
            it('shouldn\'t be triggered if there is no timeout event', function(done) {
                var method = "GET",
                    url = "http://httpbin.org/get?one=two&key=value";

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);
                xhr.open(method, url);

                expect(xhr.readyState).toBe(1);

                xhr.addEventListener('timeout', function(event) {
                    expect(true).toBeFalsy();
                })
                expect(xhr.readyState).toBe(1);

                xhr.send();

                setTimeout(function() {
                    done();
                }, 1000);
            });

            it('should be triggered after timout delay', function(done) {
                var method = "GET",
                    url = "https://www.w3schools.com/xml/note.xml";

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);
                xhr.open(method, url);

                expect(xhr.readyState).toBe(1);

                xhr.addEventListener('timeout', function(event) {
                    expect(event).toBeDefined();
                    expect(event.type).toBeDefined();
                    expect(event.type).toBe('timeout');
                    expect(event.target).toBeDefined();
                    expect(event.target instanceof XMLHttpRequest).toBeTruthy();
                    expect(event.target.readyState).toBe(event.target.DONE);
                    expect(event.target.status).toBe(0);
                    done();
                });

                expect(xhr.readyState).toBe(1);

                xhr.timeout = 1;

                xhr.send();
            });

            it('should be triggered after "ontimout" callback', function(done) {
                var method = "GET",
                    url = "https://www.w3schools.com/xml/note.xml";

                var xhr = new XMLHttpRequest(),
                    isOnTimeoutTriggered = true;
                expect(xhr.readyState).toBe(0);
                xhr.open(method, url);

                expect(xhr.readyState).toBe(1);

                xhr.addEventListener('timeout', function(event) {
                    expect(isOnTimeoutTriggered).toBeTruthy();
                    expect(event).toBeDefined();
                    expect(event.type).toBeDefined();
                    expect(event.type).toBe('timeout');
                    expect(event.target).toBeDefined();
                    expect(event.target instanceof XMLHttpRequest).toBeTruthy();
                    expect(event.target.readyState).toBe(event.target.DONE);
                    expect(event.target.status).toBe(0);
                    done();
                });

                xhr.ontimout = function() {
                    isOnTimeoutTriggered = true;
                }

                expect(xhr.readyState).toBe(1);

                xhr.timeout = 1;

                xhr.send();
            });
        });

         describe('error event:', function() {
             it('should be triggered on error event', function(done) {
                 var method = "GET",
                     url = "https://some.unexisting.site/url";

                 var xhr = new XMLHttpRequest();
                 expect(xhr.readyState).toBe(0);
                 xhr.open(method, url);

                 expect(xhr.readyState).toBe(1);

                 xhr.addEventListener('error', function(event) {
                     expect(event).toBeDefined();
                     expect(event.type).toBeDefined();
                     expect(event.type).toBe('error');
                     expect(event.target).toBeDefined();
                     expect(event.target instanceof XMLHttpRequest).toBeTruthy();
                     expect(event.target.readyState).toBe(event.target.DONE);
                     expect(event.target.status).toBe(0);
                     done();
                 });

                 expect(xhr.readyState).toBe(1);

                 xhr.send();
             });

             it('should be triggered after "onerror" callback', function(done) {
                 var method = "GET",
                     url = "https://some.unexisting.site/url";

                 var xhr = new XMLHttpRequest(),
                     isOnErrorTriggered = false;
                 expect(xhr.readyState).toBe(0);
                 xhr.open(method, url);

                 expect(xhr.readyState).toBe(1);

                 xhr.addEventListener('error', function(event) {
                     isOnErrorTriggered = true;
                     expect(event).toBeDefined();
                     expect(event.type).toBeDefined();
                     expect(event.type).toBe('error');
                     expect(event.target).toBeDefined();
                     expect(event.target instanceof XMLHttpRequest).toBeTruthy();
                     expect(event.target.readyState).toBe(event.target.DONE);
                     expect(event.target.status).toBe(0);

                 });

                 xhr.onerror = function() {
                     expect(isOnErrorTriggered).toBeTruthy();
                     done();
                 }

                 expect(xhr.readyState).toBe(1);

                 xhr.send();
             });
         });

        describe('loading events:', function() {
            describe('loadstart:', function() {
                it('should be triggered on "loadstart" event', function(done) {
                    var method = "GET",
                        url = "https://www.w3schools.com/xml/note.xml";

                    var xhr = new XMLHttpRequest();
                    expect(xhr.readyState).toBe(0);
                    xhr.open(method, url);

                    expect(xhr.readyState).toBe(1);

                    xhr.addEventListener('loadstart', function(event) {
                        expect(event).toBeDefined();
                        expect(event.type).toBeDefined();
                        expect(event.type).toBe('loadstart');
                        expect(event.target).toBeDefined();
                        expect(event.target instanceof XMLHttpRequest).toBeTruthy();
                        done();
                    });

                    expect(xhr.readyState).toBe(1);

                    xhr.send();
                });

                it('should be triggered before loadend and after "onloadstart"', function(done) {
                    var method = "GET",
                        url = "https://www.w3schools.com/xml/note.xml";

                    var xhr = new XMLHttpRequest();
                    expect(xhr.readyState).toBe(0);
                    xhr.open(method, url);

                    expect(xhr.readyState).toBe(1);

                    var isLoadEndTriggered = false,
                        isOnLoadstartTriggered = false;

                    xhr.addEventListener('loadend', function(event) {
                        isLoadEndTriggered = true;
                    });

                    xhr.onloadstart = function() {
                        isOnLoadstartTriggered = true;
                    }

                    xhr.addEventListener('loadstart', function(event) {
                        expect(isLoadEndTriggered && isOnLoadstartTriggered).toBeFalsy();
                        done();
                    });

                    expect(xhr.readyState).toBe(1);

                    xhr.send();
                });
            });

            describe('progress:', function() {
                it('should be triggered on the "progress" event after the "onprogress" callback', function(done) {
                    var method = "GET",
                        url = "https://www.w3schools.com/xml/note.xml";

                    var xhr = new XMLHttpRequest();
                    expect(xhr.readyState).toBe(0);
                    xhr.open(method, url);

                    expect(xhr.readyState).toBe(1);

                    var isOnprogressTriggered = false;

                    xhr.addEventListener('progress', function(event) {
                        expect(event).toBeDefined();
                        expect(event.type).toBeDefined();
                        expect(event.type).toBe('progress');
                        expect(event.target).toBeDefined();
                        expect(event.target instanceof XMLHttpRequest).toBeTruthy();
                        expect(event.target.readyState).toBe(event.target.LOADING);
                        isOnprogressTriggered = true;
                    });

                    xhr.onprogress = function() {
                        expect(isOnprogressTriggered).toBeTruthy();
                        done();
                    }

                    expect(xhr.readyState).toBe(1);

                    xhr.send();
                });

                it('should be triggered after "loadstart" and before "loadend"', function(done) {
                    var method = "GET",
                        url = "https://www.w3schools.com/xml/note.xml";

                    var xhr = new XMLHttpRequest();
                    expect(xhr.readyState).toBe(0);
                    xhr.open(method, url);

                    expect(xhr.readyState).toBe(1);

                    var isLoadStartTriggered = false,
                        isLoadEndTriggered = false;

                    xhr.addEventListener('progress', function(event) {
                        expect(isLoadEndTriggered).toBeFalsy();
                        expect(isLoadStartTriggered).toBeTruthy();
                        done();
                    });

                    xhr.addEventListener('loadend', function(event) {
                        isLoadEndTriggered = true;
                    });

                    xhr.addEventListener('loadstart', function(event) {
                        isLoadStartTriggered = true;
                    });

                    expect(xhr.readyState).toBe(1);

                    xhr.send();
                });
            });

            describe('loadend:', function() {
                it('should be triggered on the "loadend" event and after the "onloadend" callback', function(done) {
                    var method = "GET",
                        url = "https://www.w3schools.com/xml/note.xml";

                    var xhr = new XMLHttpRequest();
                    expect(xhr.readyState).toBe(0);
                    xhr.open(method, url);

                    expect(xhr.readyState).toBe(1);

                    var isOnloadendTriggered = false;

                    xhr.addEventListener('loadend', function(event) {
                        expect(event).toBeDefined();
                        expect(event.type).toBeDefined();
                        expect(event.type).toBe('loadend');
                        expect(event.target).toBeDefined();
                        expect(event.target instanceof XMLHttpRequest).toBeTruthy();
                        expect(event.target.readyState).toBe(event.target.DONE);
                        isOnloadendTriggered = true;
                    });

                    xhr.onloadend = function() {
                        expect(isOnloadendTriggered).toBeTruthy();
                        done();
                    }

                    expect(xhr.readyState).toBe(1);

                    xhr.send();
                });

                it('should be triggered after "progress" event', function(done) {
                    var method = "GET",
                        url = "https://www.w3schools.com/xml/note.xml";

                    var xhr = new XMLHttpRequest();
                    expect(xhr.readyState).toBe(0);
                    xhr.open(method, url);

                    expect(xhr.readyState).toBe(1);

                    var isProgressTriggered = false;

                    xhr.addEventListener('loadend', function(event) {
                        expect(isProgressTriggered).toBeTruthy();
                        done();
                    });

                    xhr.addEventListener('progress', function(event) {
                        isProgressTriggered = true;
                    });

                    expect(xhr.readyState).toBe(1);

                    xhr.send();
                });
            });
        });

        describe('upload events', function() {
            var originalTimeout;

            beforeEach(function() {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
            });

            afterEach(function() {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });

            it('should have defined addEventListener method on upload object of XMLHttpRequest', function(done) {
                var method = "GET",
                    url = "http://internetsupervision.com/scripts/urlcheck/report.aspx?reportid=slowest";

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);
                xhr.open(method, url);

                expect(xhr.upload.addEventListener).toBeDefined();
                expect(typeof xhr.upload.addEventListener).toBe('function');
                done();
            });

            it('should be triggered during uploading the file', function(done) {
                var method = "PUT",
                    url = "https://httpbin.org/put",
                    options = { create: true, exclusive: false },
                    gdFileSystem;

                requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                    fileSystem.root.getFile("/aFile.txt", options, function(fileEntry) {
                        fileEntry.createWriter(function(writer) {
                            writer.seek(writer.length);

                            writer.onwriteend = function() {
                                fileEntry.file(function(file) {
                                    var reader = new FileReader();

                                    reader.onloadend = function(evt) {
                                        var xhr = new XMLHttpRequest();
                                        expect(xhr.readyState).toBe(0);
                                        xhr.open(method, url);

                                        expect(xhr.readyState).toBe(1);

                                        var fileName = "fileName=",
                                            str = "";

                                        for (var i = 0; i < 100; i++) {
                                            str += evt.target.result;
                                        }

                                        // DEVNOTE: Currently, BBWebView does not support upload callbacks.
                                        // actually, upload.onload, upload.onprogress, upload.onprogress and upload.onloadend are not work
                                        xhr.upload.addEventListener('loadstart', function(e) {
                                            expect(e).toBeDefined();
                                            expect(e.type).toBe("loadstart");
                                            expect(e.target).toBe(xhr.upload);
                                            if (e.lengthComputable) {
                                                expect(e.loaded < e.total).toBeTruthy();
                                            }
                                        });

                                        xhr.upload.addEventListener('load', function(e) {
                                            expect(e).toBeDefined();
                                            expect(e.type).toBe("load");
                                            expect(e.target).toBe(xhr.upload);
                                            expect(e.lengthComputable).toBeTruthy();
                                            expect(e.total).toBeDefined();
                                            expect(e.loaded).toBeDefined();
                                            expect(e.total).toBe(e.loaded);
                                        });

                                        xhr.upload.addEventListener('progress', function(e) {
                                            expect(e).toBeDefined();
                                            expect(e.type).toBe("progress");
                                            expect(e.target).toBe(xhr.upload);
                                            expect(e.lengthComputable).toBeTruthy();
                                            expect(e.total).toBeDefined();
                                            expect(e.loaded).toBeDefined();
                                            var intTotal = parseInt(e.total, 10),
                                                intLoaded = parseInt(e.loaded, 10);

                                            if (intLoaded < intTotal) {
                                                expect("progress event works as expected").toBeTruthy();
                                            } else {
                                                // handle last call of onprogress event
                                                // file is already uploaded
                                                expect(e.loaded).toBe(e.total);
                                            }
                                        });

                                        xhr.upload.addEventListener('loadend', function(e) {
                                            expect(e).toBeDefined();
                                            expect(e.type).toBe("loadend");
                                            expect(e.target).toBe(xhr.upload);
                                            expect(e.lengthComputable).toBeTruthy();
                                            expect(e.total).toBeDefined();
                                            expect(e.loaded).toBeDefined();
                                            expect(e.total).toBe(e.loaded);
                                        });

                                        xhr.onreadystatechange = function() {
                                            var expectedStatus = 200;

                                            if (xhr.readyState == 4) {
                                                expect(xhr.response).toBeDefined();
                                                expect(xhr.responseText).toBeDefined();
                                                expect(xhr.status).toBeDefined();
                                                expect(xhr.status).toBe(expectedStatus);

                                                fileEntry.remove();
                                                done();
                                            }
                                        };

                                        xhr.send(fileName + str);
                                    };

                                    reader.readAsText(file);
                                }, null);
                            };

                            var textToWrite = (function() {
                                var str = 'Text'
                                for (i = 0; i < 8; i++) {
                                    str += str;
                                }
                                return str;
                            })();

                            writer.write(textToWrite);
                        }, null);
                    }, null);
                }, null);
            });
        });
    });

});