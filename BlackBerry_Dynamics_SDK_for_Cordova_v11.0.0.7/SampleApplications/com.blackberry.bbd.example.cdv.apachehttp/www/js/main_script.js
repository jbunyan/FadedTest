/**
 * (c) 2021 BlackBerry Limited. All rights reserved.
 *
 * @fileOverview ApacheHTTP sample application for BlackBerry Dynamics.
 *
 * @description ApacheHTTP sample application uses BlackBerry Dynamics (BBD) Plugin APIs such as HTTPRequest
 *
 * @version 1.0
 */

var APP = {

    buttonActions: {
        uploadLogs: function() {
            var confirmMessage = confirm('Do you want to upload logs?');

            if (confirmMessage) {
                requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                    fileSystem.uploadLogs(function() {
                        alert('Log upload UI to BlackBerry Dynamics support was successfully shown');
                    }, APP.errors.cantUploadLogs);

                }, APP.errors.filesystem);
            }
        },
        sendRequest: function() {
            var url = $('#sync-request-url').val(),
                isAsync = $('#async').is(":checked"),
                requests = [],
                requestCount,
                responseContainer = $('.http-response'),
                credentialsContainer = $('#credentials'),
                userName = $('#sync-user-name').val() || '',
                userPassword = $('#sync-user-password').val() || '';
            userDomain = $('#sync-user-domain').val() || '';

            responseContainer.html("<p><b>Response: </b></p>").hide();

            if (!url) {
                alert('You need to enter URL');
                return;
            }

            if (isAsync) {
                requestCount = $('#request-count').val();
            } else {
                requestCount = 1;
            }

            for (var i = 0; i < requestCount; i++) {

                requests[i] = (function(index) {
                    var request = window.plugins.GDHttpRequest.createRequest("GET", url, 30,
                        isAsync, userName, userPassword, authType, userDomain);

                    request.disablePeerVerification = $('#peer-verification').is(":checked");
                    request.disableHostVerification = $('#hostname-verification').is(":checked");

                    request.send(function(response) {
                        var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);

                        if (isAuthRequired(responseObj)) {
                            authType = getAuthType(responseObj);
                            APP.clearCredentials();
                            credentialsContainer.show();
                            if (authType == "Basic") {
                                $("#user-domain-group").hide();
                            } else {
                                $("#user-domain-group").show();
                            }
                        } else {
                            credentialsContainer.hide();
                            authType = "";
                        }

                        responseTemplate = createResponseTemplate(responseObj, ++index);
                        responseContainer.show().append(responseTemplate);
                    }, APP.errors.noResponse);
                })(i);
            }
        },
        sendFile: function() {
            requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                var gdFileSystem = fileSystem,
                    filePath = $('#get-file-from-folder').val(),
                    $fakeFile = $('#fakefile'),
                    createFakeFile = $fakeFile.is(':checked'),
                    options = { create: false, exclusive: false };

                if (filePath && createFakeFile) {
                    alert('Please choose "type file path" or "create fake file"')
                    return;
                }

                if (!filePath && !createFakeFile) {
                    if (confirm('You didn\'t specify file path and didn\'t checked "create fake file". Do you want to use fake file to test functionality?')) {
                        createFakeFile = true;
                        $fakeFile.attr("checked", true).checkboxradio("refresh");
                    } else {
                        return;
                    }
                }

                if (createFakeFile) {
                    filePath = '/some_file.txt';
                    options.create = true;
                } else if (filePath[0] != '/') {
                    filePath = '/' + filePath;
                }

                gdFileSystem.root.getFile(filePath, options, function(file) {
                    APP.trigger('fileReady', file, createFakeFile);
                }, APP.errors.noFile);
            }, APP.errors.filesystem);
        }
    },
    errors: {
        filesystem: function() {
            alert('Can\'t access filesystem');
        },
        cantSaveLogs: function() {
            alert('Logs can\'t be saved to local file system');
        },
        cantUploadLogs: function() {
            alert('Logs can\'t be uploaded');
        },
        noResponse: function() {
            alert('There is no response from request');
        },
        noFile: function() {
            alert('There is no such file');
        }
    }
};

APP.clearCredentials = function() {
    [
        $('#sync-user-name'),
        $('#sync-user-password'),
        $('#sync-user-domain')
    ].forEach(function(field) {
        field.val('');
    })
}

APP.additionalFileOperation = function(file, isFakeFile) {
    if (isFakeFile) {
        file.createWriter(function(writer) {
            writer.onwriteend = function() {
                APP.trigger('getFileMetaData', file);
            };

            writer.write('File writer wrote this text');

        }, null);
    } else {
        APP.trigger('getFileMetaData', file);
    }
};

APP.getFileMetaData = function(file) {
    file.file(function(fileInfo) {
        APP.trigger('sendFile', file.nativeURL);
    }, null);
};

APP.sendFile = function(path) {
    var method = $('input[name="request-method"]:checked').data('method'),
        url = $('#server-request-url').val(),
        request;
    if (!url.length) {
        alert('Please type URL');
        return;
    }

    request = window.plugins.GDHttpRequest.createRequest(method, url, 30, false, null, null, null);

    request.sendFile(path, function(response) {
        var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
        alert('Response is ' + responseObj.headers);
    }, APP.errors.noResponse);
};

APP.createRequestCountSelect = function() {
    var isAsync = $('#async').is(":checked"),
        selectWrapper = $('.select-wrapper');

    if (isAsync) {
        selectWrapper.show();
    } else {
        selectWrapper.hide();
    }
};

APP.deviceReady = function() {
    APP.$body = $('body');
    APP.$content = $('.main-content');
    APP.$title = $('.ui-header h1');

    APP.loadPage('about-page');

    $('body').on('click', '.page-button', _.bind(APP.loadPage, APP));

    $('body').on('click', '.action-button', _.bind(APP.invokeAction, APP));

    $('body').on('change', '#async', _.bind(APP.createRequestCountSelect, APP));

    APP.listenTo(APP, 'fileReady', _.bind(APP.additionalFileOperation, APP));

    APP.listenTo(APP, 'getFileMetaData', _.bind(APP.getFileMetaData, APP));

    APP.listenTo(APP, 'sendFile', _.bind(APP.sendFile, APP));
};

APP.invokeAction = function(e) {
    var action = $(e.currentTarget).data('action');
    APP.buttonActions[action].apply(this);
};

APP.loadPage = function(pageToLoad) {
    var page,
        applicationTitle = $('header h1'),
        backButton = $('#back-btn');

    if (_.isString(pageToLoad)) {
        page = pageToLoad;
    } else {
        var el = $(pageToLoad.currentTarget);
        page = el.data('page');
    }

    if (page) {
        if (page == 'sync-page' || page == 'upload-page') {
            applicationTitle.css('padding-right', '44px');
            backButton.css('display', 'block');

        } else {
            applicationTitle.css('padding-right', '0');
            backButton.css('display', 'none');
        }

        var pageTemplate = $('#' + page);
        APP.$content.html(pageTemplate.html());
        APP.$content.trigger('create');
        APP.$content.trigger('create');
        APP.$body.removeClass().addClass(page);
        APP.$title.html(pageTemplate.data('title'));
    }
};

var authType = ""

function isAuthRequired(responseObj) {
    return responseObj.status.valueOf() == "401"
}

function getAuthType(responseObj) {

    if (responseObj.headers.indexOf("Negotiate") >= 0) {
        return "Negotiate"
    } else if (responseObj.headers.indexOf("NTLM") >= 0) {
        return "NTLM"
    } else if (responseObj.headers.indexOf("Basic") >= 0) {
        return "Basic"
    } else {
        return ""
    }

}

function parseUri(str) {
    var o = parseUri.options,
        m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
};

function createResponseTemplate(httpResponse, index) {

    var parent = document.createElement("div");
    parent.className = 'response-detail';

    parent.innerHTML = '<h1>' + index + ' REQUEST:' + '</h1>';

    if (httpResponse.status === 0) {
        parent.innerHTML += '<h4 id="status-' + index + '">No response. Status code: 0.</h4>';

        return parent
    }
    var headers = document.createElement("div"),
        response = JSON.parse(httpResponse.responseData),
        status = '<h4 id="status-' + index + '">Status: ' + response.statusText + '</h4>';

    headers.innerHTML = '<h4>Response headers:</h4>';

    response.headers.split('\n').forEach(function(header) {
        var keyValuePair = header.split('=').join(':'),
            headerResult = '<h4 class="response-header">' + keyValuePair + '</h4>';

        headers.innerHTML += headerResult + '<br>';
    });

    parent.innerHTML += status + headers.innerHTML;

    return parent;
};

parseUri.options = {
    strictMode: false,
    key: [
        "source", "protocol", "authority", "userInfo", "user", "password", "host",
        "port", "relative", "path", "directory", "file", "query", "anchor"
    ],
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};

document.addEventListener("deviceready", function() {
    $(function() {
        _.extend(APP, Backbone.Events);
        APP.deviceReady();
    });
}, false);
