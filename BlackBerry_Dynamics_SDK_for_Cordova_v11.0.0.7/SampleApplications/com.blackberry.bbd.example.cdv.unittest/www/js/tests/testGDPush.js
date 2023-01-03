/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 *
 * GDPush plugin functional tests
 */
describe('GDPush plugin', function() {
    var isAndroid = cordova.platformId === 'android';
    var expectedStatus = 200;
    var expectedStatusText = null;
    var expectedResponseHeader = null;
    var expectedResponseHeader402 = null;

    var nocAppServer = 'gdmdc.good.com'; // default NOC App Server Address: gdmc.good.com
    if (env && env.NOC_APP_SERVER) {
        nocAppServer = env.NOC_APP_SERVER;
    }

    if (isAndroid) {
        expectedStatusText = "200 OK";
        expectedResponseHeader = "X-Good-GNP-Code:100 OK";
        expectedResponseHeader402 = "X-Good-GNP-Code:402 Invalid Token"
    }
    else {
        // for iOS
        expectedStatusText = "200 No Error";
        expectedResponseHeader = "\"X-Good-GNP-Code\" = \"100 OK\"";
        expectedResponseHeader402 = "\"X-Good-GNP-Code\" = \"402 Invalid Token\"";
    }

    var originalTimeout;

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('Check GDPush plugin installation', function() {
        expect(window).toBeDefined();
        expect(window.plugins).toBeDefined();
        expect(window.plugins.GDPushChannel).toBeDefined();
    });

    describe('GDPushChannel functionality', function() {
        it('Check GDPushChannel constructor', function() {
            var gdPushChannel = new window.plugins.GDPushChannel(function(result) { });

            expect(gdPushChannel instanceof window.plugins.GDPushChannel).toBe(true);
            expect(gdPushChannel.onChannelResponse instanceof Function).toBe(true);
        });

        it('Check GDPushChannel constructor with empty value', function() {
            var gdPushChannel = new window.plugins.GDPushChannel();

            expect(gdPushChannel instanceof window.plugins.GDPushChannel).toBe(true);
            expect(gdPushChannel.onChannelResponse).toBeNull();
        });

        it('Check GDPushChannel constructor with "null" value', function() {
            var gdPushChannel = new window.plugins.GDPushChannel(null);

            expect(gdPushChannel instanceof window.plugins.GDPushChannel).toBe(true);
            expect(gdPushChannel.onChannelResponse).toBeNull();
        });

        it('Check GDPushChannel API', function() {
            var isAvailableAllGDPushChannelMethods = true;
            var GDPushChannelAPI = [];
            var GDPushChannelMethodsMock = [
                "open",
                "close",
                "parseChannelResponse",
                "isAvailable"
            ];

            for (key in window.plugins.GDPushChannel.prototype) {
                GDPushChannelAPI.push(key);
            }

            for (var i = 0; i < GDPushChannelMethodsMock.length; i++) {
                if (GDPushChannelAPI.indexOf(GDPushChannelMethodsMock[i]) === -1) {
                    isAvailableAllGDPushChannelMethods = false;
                    break;
                }
            }

            expect(isAvailableAllGDPushChannelMethods).toBe(true);
        });

        it('Check GDPushChannel isAvailable: valid status', function(done) {
            var gdPushChannel = new window.plugins.GDPushChannel();

            gdPushChannel.isAvailable(function(result) {
                var isValidStatus = result === "true" || result === "false";
                expect(isValidStatus).toBe(true);
                done();
            });
        });

        it('Check GDPushChannel open, parseChannelResponse', function(done) {
            var gdPushChannel = new window.plugins.GDPushChannel(handleResponse);
            gdPushChannel.open();

            function handleResponse(response) {
                expect(response).toBeDefined();
                expect(typeof response).toBe("string");
                expect(response).toContain("channelID");

                var channelResponse = gdPushChannel.parseChannelResponse(response);
                expect(typeof channelResponse).toBe("object");
                expect(channelResponse.channelID).toBeDefined();
                expect(channelResponse.channelID).toContain("gdpush");
                expect(channelResponse.responseData).toBeDefined();
                expect(channelResponse.responseData).toContain("app.gdpush");
                expect(channelResponse.responseType).toBeDefined();
                expect(channelResponse.responseType).toBe("open");

                done();
            };
        });

        it('Check GDPushChannel open, parseChannelResponse, isAvailable = "true"', function(done) {
            var gdPushChannel = new window.plugins.GDPushChannel(handleResponse);
            gdPushChannel.open();

            function handleResponse(response) {
                expect(response).toBeDefined();

                var channelResponse = gdPushChannel.parseChannelResponse(response);
                expect(channelResponse.responseType).toBeDefined();
                expect(channelResponse.responseType).toBe("open");

                gdPushChannel.isAvailable(function(result) {
                    expect(result).toBe("true");
                    done();
                });
            }
        });

        it('Check GDPushChannel open, parseChannelResponse, close', function(done) {
            var gdPushChannel = new window.plugins.GDPushChannel(handleResponse);
            gdPushChannel.open();

            function handleResponse(response) {
                expect(response).toBeDefined();
                expect(typeof response).toBe("string");
                expect(response).toContain("channelID");

                var channelResponse = gdPushChannel.parseChannelResponse(response);
                expect(typeof channelResponse).toBe("object");
                expect(channelResponse.channelID).toBeDefined();
                expect(channelResponse.channelID).toContain("gdpush");
                expect(channelResponse.responseData).toBeDefined();
                expect(channelResponse.responseType).toBeDefined();

                switch (channelResponse.responseType) {
                    case "open":
                        expect(channelResponse.responseData).toContain("app.gdpush");
                        gdPushChannel.close(channelResponse.channelID);
                        break;
                    case "message":
                        expect("message").toBe("shouldn\'t happen: ", channelResponse.responseData);
                        done();
                        break;
                    case "error":
                        expect("error").toBe("shouldn\'t happen: ", channelResponse.responseData);
                        done();
                        break;
                    case "close":
                        done();
                        break;
                    case "pingFail":
                        expect("pingFail").toBe("pingFail shouldn\'t happen");
                        done();
                        break;
                    default:
                        break;
                }

            };
        });

        it('Check GDPushChannel close with invalid channel ID', function(done) {
            var isErrorExpected = false;
            var terminateTest = false;
            var savedChannelID = null;
            var bogusID = "some_bogus_channel_id";

            var channel = new window.plugins.GDPushChannel(handleResponse)
            channel.open();

            function handleResponse(response) {
                try {
                    var channelResponse = channel.parseChannelResponse(response);

                    switch (channelResponse.responseType) {
                        case "open":
                            savedChannelID = channelResponse.channelID;
                            isErrorExpected = true;
                            channel.close(bogusID);
                            break;
                        case "error":
                            if (isErrorExpected) {
                                isErrorExpected = false;
                                terminateTest = true;
                                channel.close(savedChannelID);
                            } else {
                                expect("error").toBe("shouldn\'t happen: ", channelResponse.responseData);
                                done();
                            }
                            break;
                        case "close":
                            if (terminateTest) {
                                expect(channelResponse.channelID).toBe(savedChannelID);
                                done();
                            } else {
                                expect("close").toBe("event shouldn\'t happen 2nd time");
                                done();
                            }
                            break;
                        default:
                            expect(channelResponse.responseType).toBe("shouldn\'t happen");
                            done();
                            break;
                    }
                } catch (e) {
                    expect("parseChannelResponse").toBe("exception during " +
                    "parseChannelResponse shouldn\'t happen: " + e);
                }
            };
        });

        it('Check GDPushChannel open, ping NOC with valid tocken', function(done) {
            var gdPushChannel = new window.plugins.GDPushChannel(handleResponse);
            gdPushChannel.open();

            function handleResponse(response) {
                expect(response).toBeDefined();
                expect(typeof response).toBe("string");

                try {
                    var channelResponse = gdPushChannel.parseChannelResponse(response);
                    expect(typeof channelResponse).toBe("object");
                    var responseType = channelResponse.responseType;
                    var responseData = channelResponse.responseData;

                    switch (responseType) {
                        case "open":
                            var method = "GET",
                            url = "https://" + nocAppServer + "/GNP1.0?method=checkToken",
                            timeout = 30,
                            isAsync = false,
                            user = null,
                            password = null,
                            auth = null,
                            aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

                            aRequest.addRequestHeader("X-Host-Override", nocAppServer + ":443");
                            aRequest.addRequestHeader("X-Good-GNP-Token", responseData);

                            aRequest.send(
                                function(response) {
                                    var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);

                                    expect(responseObj.headers).toContain(expectedResponseHeader);
                                    expect(responseObj.status).toBe(expectedStatus);
                                    expect(responseObj.statusText).toContain(expectedStatusText);
                                    done();
                                },
                                function(err) {
                                    expect(err).toBe(" shouldn\'t happen: " + responseData);
                                    done();
                                }
                            );
                            break;
                        default:
                            expect(responseType).toBe(" shouldn\'t happen: " + responseData);
                            done();
                            break;
                    }
                } catch (e) {
                    expect("parseChannelResponse").toBe("exception during " +
                        "parseChannelResponse shouldn\'t happen: " + e);
                }
            };
        });

        it('Check GDPushChannel notification message from server', function(done) {
            var testMessagePayload = 'This is a test notification payload';
            var openedChannelId;

            var gdPushChannel = new window.plugins.GDPushChannel(handleResponse);
            gdPushChannel.open();

            function handleResponse(response) {
                expect(response).toBeDefined();
                expect(typeof response).toBe("string");

                try {
                    var channelResponse = gdPushChannel.parseChannelResponse(response);
                    expect(typeof channelResponse).toBe("object");
                    var responseType = channelResponse.responseType;
                    var channelId = channelResponse.channelID;
                    var responseData = channelResponse.responseData;

                    switch (responseType) {
                        case "open":
                            openedChannelId = channelId;
                            var method = "POST",
                            url = "https://" + nocAppServer + "/GNP1.0?method=notify",
                            timeout = 30,
                            isAsync = false,
                            user = null,
                            password = null,
                            auth = null,
                            aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

                            aRequest.addRequestHeader("X-Host-Override", nocAppServer + ":443");
                            aRequest.addRequestHeader("X-Good-GNP-Token", responseData);
                            aRequest.addRequestHeader("Content-Type", "text/plain; charset=utf-8");

                            aRequest.addHttpBody(testMessagePayload);
                            aRequest.send(
                                function(response) {
                                    var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);

                                    expect(responseObj.headers).toContain(expectedResponseHeader);
                                    expect(responseObj.status).toBe(expectedStatus);
                                    expect(responseObj.statusText).toContain(expectedStatusText);
                                    done();
                                },
                                function(err) {
                                    expect(err).toBe(" shouldn\'t happen: " + responseData);
                                    done();
                                }
                            );
                            break;
                        case "message":
                            expect(channelId).toBe(openedChannelId);
                            // DEVNOTE: Message payload received from NOC
                            // for some reason can contain \u0000 at the end of the original one
                            var responseData = responseData.replace("\u0000", "");
                            expect(responseData).toBe(testMessagePayload);

                            gdPushChannel.close(channelId);
                            break;
                        case "close":
                            done();
                            break;
                        default:
                            expect(responseType).toBe(" shouldn\'t happen: " + responseData);
                            done();
                            break;
                    }
                } catch (e) {
                    expect("parseChannelResponse").toBe("exception during " +
                        "parseChannelResponse shouldn\'t happen: " + e);
                }
            };
        });

        it('Check GDPushChannel multiple notification messages from server', function(done) {
            var gdPushChannel = new window.plugins.GDPushChannel(handleResponse);
            var channelToken;
            var openedChannelId;
            var messagesNumber = 10;
            var messagesCounter = 0;
            var currentMessagePayload = "This is a test notification payload:" + " #" + messagesCounter;

            gdPushChannel.open();

            function handleResponse(response) {
                expect(response).toBeDefined();
                expect(typeof response).toBe("string");

                try {
                    var channelResponse = gdPushChannel.parseChannelResponse(response);
                    expect(typeof channelResponse).toBe("object");
                    var responseType = channelResponse.responseType;
                    var channelId = channelResponse.channelID;
                    var responseData = channelResponse.responseData;

                    switch (responseType) {
                        case "open":
                            openedChannelId = channelId;
                            channelToken = responseData;

                            sendNotificationMessage(currentMessagePayload);
                            break;
                        case "message":
                            expect(channelId).toBe(openedChannelId);
                            // DEVNOTE: Message payload received from NOC
                            // for some reason can contain \u0000 at the end of the original one
                            var responseData = responseData.replace("\u0000", "");
                            expect(responseData).toBe(currentMessagePayload);

                            messagesCounter++;
                            if (messagesCounter === messagesNumber) {
                                gdPushChannel.close(channelId);
                            } else {
                                currentMessagePayload = currentMessagePayload + " #" + messagesCounter;
                                sendNotificationMessage(currentMessagePayload);
                            }
                            break;
                        case "close":
                            done();
                            break;
                        default:
                            expect(responseType).toBe(" shouldn\'t happen: " + responseData);
                            done();
                            break;
                    }
                } catch (e) {
                    expect("parseChannelResponse").toBe("exception during " +
                        "parseChannelResponse shouldn\'t happen: " + e);
                }
            };

            function sendNotificationMessage(messagePayload){
                var method = "POST",
                url = "https://" + nocAppServer + "/GNP1.0?method=notify",
                timeout = 30,
                isAsync = false,
                user = null,
                password = null,
                auth = null,
                aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

                aRequest.addRequestHeader("X-Host-Override", nocAppServer + ":443");
                aRequest.addRequestHeader("X-Good-GNP-Token", channelToken);
                aRequest.addRequestHeader("Content-Type", "text/plain; charset=utf-8");

                aRequest.addHttpBody(messagePayload);
                aRequest.send(
                    function(response) {
                        var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);

                        expect(responseObj.headers).toContain(expectedResponseHeader);
                        expect(responseObj.status).toBe(expectedStatus);
                        expect(responseObj.statusText).toContain(expectedStatusText);

                    },
                    function(err) {
                        expect(err).toBe(" shouldn\'t happen: " + responseData);
                    }
                );
            };
        });

        it('Check GDPushChannel notification message from server to closed channel - negative case', function(done) {
            var gdPushChannel = new window.plugins.GDPushChannel(handleResponse);
            var channelToken;
            var testMessagePayload = "This is a test notification payload";

            gdPushChannel.open();

            function handleResponse(response) {
                expect(response).toBeDefined();
                expect(typeof response).toBe("string");

                try {
                    var channelResponse = gdPushChannel.parseChannelResponse(response);
                    expect(typeof channelResponse).toBe("object");
                    var responseType = channelResponse.responseType;
                    var channelId = channelResponse.channelID;
                    var responseData = channelResponse.responseData;

                    switch (responseType) {
                        case "open":
                            openedChannelId = channelId;
                            channelToken = responseData;
                            expect(channelId).toBeDefined();
                            expect(channelId).toContain("gdpush");

                            gdPushChannel.close(channelId);
                            break;
                        case "close":
                            var method = "POST",
                            url = "https://" + nocAppServer + "/GNP1.0?method=notify",
                            timeout = 30,
                            isAsync = false,
                            user = null,
                            password = null,
                            auth = null,
                            aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth);

                            aRequest.addRequestHeader("X-Host-Override", nocAppServer + ":443");
                            aRequest.addRequestHeader("X-Good-GNP-Token", channelToken);
                            aRequest.addRequestHeader("Content-Type", "text/plain; charset=utf-8");

                            aRequest.addHttpBody(testMessagePayload);
                            aRequest.send(
                                function(response) {
                                    var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);

                                    expect(responseObj.headers).toContain(expectedResponseHeader402);
                                    expect(responseObj.status).toBe(expectedStatus);
                                    expect(responseObj.statusText).toContain(expectedStatusText);
                                    done();
                                },
                                function(err) {
                                    expect(err).toBe(" shouldn\'t happen: " + responseData);
                                    done();
                                }
                            );

                            break;
                        default:
                            expect(responseType).toBe(" shouldn\'t happen: " + responseData);
                            done();
                            break;
                    }
                } catch (e) {
                    expect("parseChannelResponse").toBe("exception during " +
                        "parseChannelResponse shouldn\'t happened: " + e);
                }
            };
        });


    });

});
