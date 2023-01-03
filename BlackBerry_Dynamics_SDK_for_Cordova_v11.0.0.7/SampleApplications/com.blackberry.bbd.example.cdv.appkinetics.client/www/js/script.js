/**
 * (c) 2021 BlackBerry Limited. All rights reserved.
 *
 * For easy working with asynchronus JavaScript we're using Async.js.
 * Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript.
 * As API basicly is based on callbacks, we need Async.js to deal with it.
 * We can use async.series: we can run an array of functions in series, each one running once the previous function has completed.
 * We're using async.parallel: we can run an array of functions in parallel, without waiting until the previous function has completed.
 *
 * We use Backbone.js for event-driven development in JavaScript.
 */

var AppKinetics = {};

AppKinetics.Constants = {

    /* array of applications that we can send files to */
    SERVER_APPLICATIONS: [{
        applicationID: "com.blackberry.bbd.example.cdv.appkinetics.server",
        applicationName: "AppKinetics Server",
        applicationAddress: "com.blackberry.bbd.example.cdv.appkinetics.server",
        applicationVersion: "1.0.0.0"
    }],

    /* array of methods that can be used for sending files to other application */
    METHODS_TO_SEND_FILES: [{
        methodName: "callAppKineticsService",
        methodValue: "callAppKineticsService"
    }, {
        methodName: "sendFileToApp",
        methodValue: "sendFileToApp"
    }],

    /* file transfer service name which is used for transfering files between applications */
    FILE_TRANSFER_SERVICE_NAME: "com.good.gdservice.transfer-file",

    /* file transfer service version which is used for transfering files between applications */
    FILE_TRANSFER_SERVICE_VERSION: "1.0.0.0",

    /* name of directory which will contain files that can be sent to other application */
    DIRECTORY_NAME: "Files",

    /* array of files that can be sent to other application */
    FILE_NAMES: ["firstFile.txt", "secondFile.txt", "thirdFile.txt"]

};

/* secure file system which will store new directory and files that can be sent to other application */
AppKinetics.secureFileSystem = null;

/* new directory in secure file system */
AppKinetics.newDirectory = null;

/* array of files in secure file system with such properties as fileName, fullPath, metadata etc. */
AppKinetics.files = null;

/* array of files (file names) that are selected for sending to other application */
AppKinetics.filesToBeSent = [];

/* count of files that are selected for sending */
AppKinetics.checkedFilesCount = 0;

/* bool variable which is set to "true" if files are ready to be sent to other application and set to "false" otherwise */
AppKinetics.canSendFiles = false;

/* current selected application to send files to */
AppKinetics.appToSendFiles = AppKinetics.Constants.SERVER_APPLICATIONS[0].applicationID;

/* confirmed application to send files to  */
AppKinetics.confirmedAppToSendFiles = AppKinetics.appToSendFiles;

/* current selected method which will be used to send files to other application */
AppKinetics.methodToSendFiles = AppKinetics.Constants.METHODS_TO_SEND_FILES[0].methodValue;

/* attaching Backbone events to AppKinetics object */
_.extend(AppKinetics, Backbone.Events);

/* method which is called when we select application to send files to */
AppKinetics.onSelectApplication = function() {
    AppKinetics.appToSendFiles = this.value;
};

/* method which is called when we select method for sending files to other application */
AppKinetics.onSelectMethod = function() {
    AppKinetics.methodToSendFiles = this.value;
};

/* method which is called on send button click */
AppKinetics.onSendBtnClick = function() {
    var successCallbackToSendFile = function(result) {
            console.log("Send files: " + result);
            console.log('Choosen application to send files: ' + AppKinetics.confirmedAppToSendFiles);
        },
        errorCallback = function(error) {
            alert(error);
        },
        filesCount = AppKinetics.filesToBeSent.length,
        files = AppKinetics.filesToBeSent,
        filesToSend = [],
        currentFile,
        onlyFileName,
        message,
        sendButton = $("#send-btn"),
        methodSelect = $("#select-method"),
        appURL = AppKinetics.appToSendFiles.trim() + ".sc://",
        fileTransferService = AppKinetics.Constants.FILE_TRANSFER_SERVICE_NAME,
        fileTransferVersion = AppKinetics.Constants.FILE_TRANSFER_SERVICE_VERSION;

    (function(app, files, method) {
        //window.plugins.GDAppKineticsPlugin.canLaunchAppUsingUrlScheme(appURL, function(){

        AppKinetics.confirmedAppToSendFiles = app;

        app = app.trim();
        if (app == "com.blackberry.bbd.example.cdv.appkinetics.server") {
            for (currentFile = 0; currentFile < filesCount; currentFile++) {
                onlyFileName = files[currentFile].substring(
                    files[currentFile].indexOf('/') + 1, files[currentFile].length
                );

                if (filesToSend.indexOf(files[currentFile]) == -1) {
                    filesToSend.push(files[currentFile]);
                }
            }
        } else {
            filesToSend = files;
        }

        AppKinetics.trigger('sendFiles');

        if (AppKinetics.canSendFiles) {
            if (filesToSend.length > 0) {
                if (method == "sendFileToApp") {
                    window.plugins.GDAppKineticsPlugin.sendFileToApp(
                        filesToSend[0], app, successCallbackToSendFile, errorCallback
                    );
                } else {
                    window.plugins.GDAppKineticsPlugin.callAppKineticsService(
                        app, fileTransferService, fileTransferVersion, "transferFile", {},
                        filesToSend, successCallbackToSendFile, errorCallback
                    );
                }
            } else {
                alert("File(s) sending is(are) canceled. Please secect file(s) to be sent.");
            }
        }
        //}, function(error) {
        //  alert("Application " + app + " is not installed. Please install it. Error: " + error + ".");
        //});
    }(AppKinetics.appToSendFiles, AppKinetics.filesToBeSent, AppKinetics.methodToSendFiles));

    sendButton.prop("disabled", true);
    AppKinetics.trigger('resetToDefault');
};

/* method for creating SELECT element with OPTIONS of appliations that are available for sending files to */
AppKinetics.createSelectApplicationElement = function() {
    var selectWrapper = $('#select-wrapper'),
        labelForSelect = $('<h3>Select application to send files to:</h3>'),
        selectElement = $('<div id="select-app"></div>'),
        currentApp,
        newOption;

    if (AppKinetics.Constants.SERVER_APPLICATIONS.length > 0) {

        for (currentApp = 0; currentApp < AppKinetics.Constants.SERVER_APPLICATIONS.length; currentApp++) {
            var currentApplication = AppKinetics.Constants.SERVER_APPLICATIONS[currentApp],
                appId = currentApplication.applicationID,
                appName = currentApplication.applicationName,
                radioId = appId.split('.').join('-'),
                newOption = $('<input type="radio" id="' + radioId + '" name="select-app" value="' + appId + '">'),
                newOptionLabel = $('<label for="' + radioId + '">' + appName + '</label><br>');
            selectElement.append(newOption);
            selectElement.append(newOptionLabel);
        }
        $('#no-app-error').hide();
        $('#select-wrapper').show();

        selectWrapper.append(labelForSelect);
        selectWrapper.append(selectElement);
    } else {
        $('#no-app-error').show();
    }
};

/* method for creating SELECT element with OPTIONS of methods that are available for sending files */
AppKinetics.createSelectMethodElement = function() {
    var selectWrapper = $('#select-wrapper'),
        labelForSelect = $('<h3>Select method for sending files:</h3>'),
        selectElement = $('<div id="select-method"></div>'),
        currentMethod,
        newOption;

    for (currentMethod = 0; currentMethod < AppKinetics.Constants.METHODS_TO_SEND_FILES.length; currentMethod++) {
        var currentMethodToUse = AppKinetics.Constants.METHODS_TO_SEND_FILES[currentMethod],
            methodValue = currentMethodToUse.methodValue,
            methodName = currentMethodToUse.methodName,

            newOption = $('<input type="radio" id="' + methodValue + '" name="select-method" value="' + methodValue + '">'),
            newOptionLabel = $('<label for="' + methodValue + '">' + methodName + '</label><br>');

        selectElement.append(newOption);
        selectElement.append(newOptionLabel);
    }

    selectWrapper.append(labelForSelect);
    selectWrapper.append(selectElement);
};

/* handler for change checkbox event */
AppKinetics.onRadioChanged = function() {
    var countSPAN = $('.radio-files'),
        sendButton = $('#send-btn'),
        currentRadio = $(this),
        currentFileNativeURL,
        currentFileName,
        currentFileIndex,
        currentFileIndexToDelete,
        selectWrapper = $("#select-wrapper");

    currentFileName = currentRadio.parent().find('label div.file-name').html();
    currentFileNativeURL = AppKinetics.files.filter(function(fileEntry) {
        return fileEntry.name === currentFileName;
    })[0].nativeURL;

    if (currentRadio.is(':checked')) {
        AppKinetics.filesToBeSent[0] = currentFileNativeURL;
    } else {
        AppKinetics.filesToBeSent[0] = null;
    }

    if (currentRadio.is(':checked')) {
        AppKinetics.checkedFilesCount++;
        AppKinetics.createFileReader(currentFileName, AppKinetics.files);
    } else {
        AppKinetics.checkedFilesCount--;
        AppKinetics.removeFileReader(currentFileName);
    };

    if (AppKinetics.checkedFilesCount > 0) {
        selectWrapper.html('');
        AppKinetics.createSelectApplicationElement();
        $('input[type="radio"][value="' + AppKinetics.appToSendFiles + '"]').attr('checked', 'checked');

        AppKinetics.createSelectMethodElement();
        $('input[type="radio"][value="' + AppKinetics.methodToSendFiles + '"]').attr('checked', 'checked');

        if (AppKinetics.filesToBeSent.length > 1) { //we can only use here callAppKineticsService() method because sendFileToApp() method can send only one file
            $(selectWrapper.find('option:last')[0]).attr('disabled', 'disabled');
        } else {
            $(selectWrapper.find('option:last')[0]).removeAttr('disabled');
        }
        if (AppKinetics.Constants.SERVER_APPLICATIONS.length > 0) {
            sendButton.prop("disabled", false);
        }
        countSPAN.html(AppKinetics.checkedFilesCount);
    } else {
        selectWrapper.html("");
        sendButton.prop("disabled", true);
        countSPAN.html("");
    };

    var selectWrapperHtml = document.getElementById("select-wrapper"),
        errorBlock = document.getElementById("no-app-error");
    if(errorBlock.style.display == "none") {
        selectWrapperHtml.scrollIntoViewIfNeeded();
    } else {
        errorBlock.scrollIntoViewIfNeeded();
    }

    var sendButtonElement = document.getElementById('send-btn');
    sendButtonElement.scrollIntoViewIfNeeded();
};

/* method which creates file reader for appropriate file that displays file entry, file location and file metadata */
AppKinetics.createFileReader = function(file, filesObj) {
    var currentCheckbox = '#radio-' + file,
        onlyFileName = file.substring(0, file.indexOf(".")),
        readerWrapper = $("#file-readers"),
        readerTemplate = $("#file-reader").html(),
        readerWithID = $(readerTemplate).attr("id", "reader-for-" + onlyFileName),
        readerTitle = readerWithID.find("div.reader-title").html('Content for file "' + file + '":'),
        readerBody = readerWithID.find("div.reader-body"),
        readerFooter = readerWithID.find("div.reader-footer"),
        currentFile;

    for (currentFile = 0; currentFile < filesObj.length; currentFile++) {
        if (onlyFileName == filesObj[currentFile].name.substring(0, filesObj[currentFile].name.indexOf("."))) {
            readerBody.html(filesObj[currentFile].entry);
            readerBody.attr('id', 'reader-body-' + onlyFileName);
            readerFooter.html('File size: ' + filesObj[currentFile].length +
            ' symbols, file metadata: ' + filesObj[currentFile].metadata.modificationTime + '.');
        }
    }

    readerWrapper.html(readerWithID);
};

/* method which removes file reader for appropriate file */
AppKinetics.removeFileReader = function(file) {
    var onlyFileName = file.substring(0, file.indexOf("."));

    $("#reader-for-" + onlyFileName).remove();
};

/* handler for device ready event */
AppKinetics.deviceReady = function() {

    $(document).on('change', 'input[type="radio"][name="radio-files"]', AppKinetics.onRadioChanged);
    $(document).on('change', 'input[type="radio"][name="select-app"]', AppKinetics.onSelectApplication);
    $(document).on('change', 'input[type="radio"][name="select-method"]', AppKinetics.onSelectMethod);
    $(document).on('click', '#send-btn', AppKinetics.onSendBtnClick);

    $(document).on('click', 'input[type="radio"][name="select-method"]', function() {
        var sendBtn = document.getElementById('send-btn');

        sendBtn.scrollIntoViewIfNeeded();
    });

    AppKinetics.listenTo(AppKinetics, 'appReady', _.bind(this.getFileSystem, this));

    AppKinetics.listenTo(AppKinetics, 'fileSystemReady', _.bind(this.createNewDirectory, this));

    AppKinetics.listenTo(AppKinetics, 'newDirectoryReady', _.bind(this.createFilesInNewDidectory, this));

    AppKinetics.listenTo(AppKinetics, 'newFilesReady', _.bind(this.getFilesMetadata, this));

    AppKinetics.listenTo(AppKinetics, 'filesMetadataReady', _.bind(this.drawFilesOnUI, this));

    AppKinetics.listenTo(AppKinetics, 'sendFiles', _.bind(this.sendFiles, this));

    AppKinetics.listenTo(AppKinetics, 'resetToDefault', _.bind(this.resetToDefault, this));

    AppKinetics.getListOfAppsToSendFilesTo();

};

AppKinetics.sendFiles = function() {
    AppKinetics.canSendFiles = true;
};

/* reset page view to default */
AppKinetics.resetToDefault = function() {
    $('input[type="radio"][name="radio-files"]').removeAttr('checked');
    $('input[type="radio"][name="radio-files"]').checkboxradio('refresh');
    $('.radio-files').html("");
    $('#select-wrapper').html("");
    $('#file-readers').html("");
    $('#send-btn').prop("disabled", true);
    AppKinetics.filesToBeSent = [];
    AppKinetics.checkedFilesCount = 0;
    if (AppKinetics.Constants.SERVER_APPLICATIONS.length > 0) {
        AppKinetics.appToSendFiles = AppKinetics.Constants.SERVER_APPLICATIONS[0].applicationID;
    }
    AppKinetics.methodToSendFiles = AppKinetics.Constants.METHODS_TO_SEND_FILES[0].methodValue;
};

/* method which gets list of applications to send files to */
AppKinetics.getListOfAppsToSendFilesTo = function() {

    var successCallbackToGetListOfApps = function(apps) {
            var isNotSelfOrDuplicate = function(app) {
                    return app.applicationID != 'com.blackberry.bbd.example.cdv.appkinetics.client' &&
                    app.applicationVersion == '1.0.0.0';
                },
                json = apps,
                currentApp,
                listOfAppsLength = json.length,
                newAppObj = {};

            AppKinetics.Constants.SERVER_APPLICATIONS = json.map(function(app) {
                return {
                    applicationID: app.address,
                    applicationName: app.name,
                    applicationAddress: app.address,
                    applicationVersion: app.versionId
                }
            }).filter(isNotSelfOrDuplicate);
            if (AppKinetics.Constants.SERVER_APPLICATIONS.length > 0) {
                $('#no-app-error').hide();
                AppKinetics.appToSendFiles = AppKinetics.Constants.SERVER_APPLICATIONS[0].applicationID;
            }

            $('#content').css('display', 'block');
            AppKinetics.trigger('appReady');
        },
        errorCallback = function(error) {
            alert(error);
        },
        fileTransferService = AppKinetics.Constants.FILE_TRANSFER_SERVICE_NAME,
        fileTransferVersion = AppKinetics.Constants.FILE_TRANSFER_SERVICE_VERSION;

    window.plugins.GDAppKineticsPlugin.getServiceProvidersFor(
        fileTransferService, fileTransferVersion, successCallbackToGetListOfApps, errorCallback
    );
};

/* method which access to secure file system */
AppKinetics.getFileSystem = function() {
    var successCallbackToGetFileSystem = function(fileSystem) {
            AppKinetics.secureFileSystem = fileSystem;
            AppKinetics.trigger('fileSystemReady');
        },
        errorCallback = function(error) {
            alert("ERROR: " + error);
        };

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, successCallbackToGetFileSystem, errorCallback);
};

/* method which creates new directory with name "Files" in secure file system */
AppKinetics.createNewDirectory = function() {
    var successCallbackToCreateNewDirectory = function(directory) {
            AppKinetics.newDirectory = directory;
            AppKinetics.trigger('newDirectoryReady');
        },
        errorCallback = function(error) {
            alert("ERROR: " + error);
        };

    AppKinetics.secureFileSystem.root.getDirectory(
        AppKinetics.Constants.DIRECTORY_NAME,
        { create: true, exclusive: false },
        successCallbackToCreateNewDirectory,
        errorCallback
    );
};

/* method which created files in "Files" directory */
AppKinetics.createFilesInNewDidectory = function() {
    var currentFile,
        filesCount = AppKinetics.Constants.FILE_NAMES.length,
        arrayOfFunctionsToCreateFiles = [];

    for (currentFile = 0; currentFile < filesCount; currentFile++) {

        (function(i) {
            arrayOfFunctionsToCreateFiles.push(function(collectCreatedFile) {
                var successCallbackToCreateFile,
                    errorCallback;

                errorCallback = function(error) {
                    alert("ERROR: " + error);
                };

                successCallbackToCreateFile = function(file) {
                    var writer = file.createWriter(function(writer) {
                        var fileEntry = 'This is a test data for file "' + file.name +
                            '" from location "' + file.fullPath +
                            '". This file can be sent to other application.';

                        writer.onwritestart = function() {
                            console.log('writing to secure file ' + file.name);
                        };
                        writer.onwriteend = function() {
                            localStorage.setItem(file.name, 'written');
                            file.length = writer.length;
                            file.entry = fileEntry;
                        };
                        writer.onerror = function(error) {
                            alert('Error: ' + error);
                        };

                        if (!localStorage.getItem(file.name)) {
                            writer.write(fileEntry);
                        } else {
                            file.length = fileEntry.length;
                            file.entry = fileEntry;
                        }
                    }, errorCallback);

                    collectCreatedFile(null, file);
                };

                AppKinetics.secureFileSystem.root.getFile(
                    AppKinetics.Constants.DIRECTORY_NAME + '/' + AppKinetics.Constants.FILE_NAMES[i],
                    { create: true, exclusive: false },
                    successCallbackToCreateFile,
                    errorCallback
                );
            });
        }(currentFile));

    }

    async.parallel(arrayOfFunctionsToCreateFiles,
        function(error, createdFiles) {
            AppKinetics.files = createdFiles;
            AppKinetics.trigger('newFilesReady');
        });
};

/* method which gets metadata for each created file */
AppKinetics.getFilesMetadata = function() {
    var currentFile,
        filesCount = AppKinetics.files.length,
        arrayOfFunctionsToGetFilesMetadata = [];

    for (currentFile = 0; currentFile < filesCount; currentFile++) {

        (function(i) {
            arrayOfFunctionsToGetFilesMetadata.push(function(collectFileMetadata) {
                var successCallbackToGetFileMetadata = function(metadata) {
                        AppKinetics.files[i].metadata = metadata;
                        collectFileMetadata(null, metadata);
                    },
                    errorCallback = function(error) {
                        alert("ERROR: " + error);
                    };

                AppKinetics.files[i].getMetadata(successCallbackToGetFileMetadata, null);
            });
        }(currentFile));

    }

    async.parallel(arrayOfFunctionsToGetFilesMetadata,
        function() {
            window.plugins.GDAppKineticsPlugin.copyFilesToSecureFileSystem(function(result) {
                console.log(result + " files were moved to secure storage.");
            });
            AppKinetics.trigger('filesMetadataReady');
        });
};

/* method which dispalys files on the UI */
AppKinetics.drawFilesOnUI = function() {
    var currentFile,
        filesCount = AppKinetics.files.length,
        filesTitleSPAN = $('.files-title .files-count'),
        resultHTML,
        filesWrapper = $('#files-wrapper'),
        templateOuter = $('#template-files-outer'),
        dot,
        onlyName;

    filesTitleSPAN.html(filesCount);

    for (currentFile = 0; currentFile < filesCount; currentFile++) {
        dot = AppKinetics.files[currentFile].name.indexOf(".");
        onlyName = AppKinetics.files[currentFile].name.substring(0, dot);

        AppKinetics.createFileTemplate("#files-wrapper", {
            'inputID': onlyName,
            'inputName': onlyName,
            'fileName': AppKinetics.files[currentFile].name,
            'isFile': AppKinetics.files[currentFile].isFile,
            'fullPath': AppKinetics.files[currentFile].fullPath,
            'metadata': AppKinetics.files[currentFile].metadata.modificationTime
        });
    }

    resultHTML = $(templateOuter.html()).find('fieldset').append(filesWrapper.html());
    filesWrapper.html(resultHTML).trigger('create');
};

AppKinetics.createFileTemplate = function(element, options) {
    var filesWrapper = $(element),
        templateInner = $('#template-files-inner');

    filesWrapper.append(function() {
        var result = templateInner.html();

        for (var key in options) {
            result = result.replace(new RegExp('\{\{' + key + '\}\}', 'g'), options[key]);
        }

        return result;
    });
};
