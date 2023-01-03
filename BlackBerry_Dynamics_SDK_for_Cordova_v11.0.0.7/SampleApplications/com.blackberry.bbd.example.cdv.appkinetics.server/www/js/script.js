/**
 * (c) 2019 BlackBerry Limited. All rights reserved.
 *
 * We use Backbone.js for event-driven development in JavaScript.
 */

var AppKinetics = {};

AppKinetics.Constants = {

    /* file transfer service name which is used for transfering files between applications */
    FILE_TRANSFER_SERVICE_NAME: "com.good.gdservice.transfer-file",

    /* file transfer service version which is used for transfering files between applications */
    FILE_TRANSFER_SERVICE_VERSION: "1.0.0.0"
};

AppKinetics.receivedFile = {};

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

/*bool helper variable in order to handle the resume event*/
AppKinetics.resumed = false;

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

/* method which creates file reader for appropriate file that displays file entry, file location and file metadata */
AppKinetics.createFileReader = function() {
    var currentFile = AppKinetics.receivedFile.file,
        fileData = AppKinetics.receivedFile.content,
        metadata = AppKinetics.receivedFile.metadata,
        onlyFileName = currentFile.name.substring(0, currentFile.name.indexOf(".")),
        readerWrapper = $("#file-readers"),
        readerTemplate = $("#file-reader").html(),
        readerWithID = $(readerTemplate).attr("id", "reader-for-" + onlyFileName),
        readerTitle = readerWithID.find("div.reader-title").html('Content for file "' + currentFile.name + '":'),
        readerBody = readerWithID.find("div.reader-body"),
        readerFooter = readerWithID.find("div.reader-footer");

    readerBody.html(fileData);
    readerBody.attr('id', 'reader-content');
    readerFooter.html('File size: ' + fileData.length + ' symbols, file metadata: ' + metadata.modificationTime + '.');

    readerWrapper.html(readerWithID);
};

/* method which removes file reader for appropriate file */
AppKinetics.removeFileReader = function(file) {
    var onlyFileName = file.substring(0, file.indexOf("."));

    $("#reader-for-" + onlyFileName).remove();
};

/* handler for device ready event */
AppKinetics.deviceReady = function() {

    $(document).on('click', '#confirm-btn', AppKinetics.resetToDefault);

    AppKinetics.listenTo(AppKinetics, 'noReceivedFiles', _.bind(this.onPause, this));

    AppKinetics.listenTo(AppKinetics, 'fileSystemReady', _.bind(this.getRecievedFile, this));

    AppKinetics.listenTo(AppKinetics, 'fileReady', _.bind(this.readFile, this));

    AppKinetics.listenTo(AppKinetics, 'fileReaderReady', _.bind(this.getFileMetadata, this));

    AppKinetics.listenTo(AppKinetics, 'fileMetadataReady', _.bind(this.createFileReader, this));

    AppKinetics.listenTo(AppKinetics, 'resetToDefault', _.bind(this.resetToDefault, this));

    document.addEventListener("resume", AppKinetics.onResume);
    document.addEventListener("pause", AppKinetics.onPause);

    $('#content').show();

    AppKinetics.checkReceivedFiles();
};

AppKinetics.onResume = function() {
    console.log("onResume:" + AppKinetics.resumed)
    if (!AppKinetics.resumed) {
        AppKinetics.resumed = true;
        AppKinetics.checkReceivedFiles();
    }
};

AppKinetics.onPause = function() {
    console.log("onPause");
    AppKinetics.resumed = false;
};

/* reset page view to default */
AppKinetics.resetToDefault = function() {
    $('#file-readers').html("");
    $("#received-files").hide();
    $('#waits-header').show();
    $("#confirm-btn").hide();
    AppKinetics.receivedFile = {};
};

AppKinetics.showRecievedFilesDetails = function(message, content, filesCount) {
    $('#received-result').text(message);
    $('#received-location').text(content);
    $('#file-count').text(filesCount);
    $('#received-files').show();
    $("#confirm-btn").show();
    $('#waits-header').hide();
};

/* method which observes if files were sent to our application, if so, it displays information about received files in alert window, and propose to send files to other application otherwise */
AppKinetics.checkReceivedFiles = function() {
    var errorCallbackNoFilesSent,
        fileTransferService = AppKinetics.Constants.FILE_TRANSFER_SERVICE_NAME,
        fileTransferVersion = AppKinetics.Constants.FILE_TRANSFER_SERVICE_VERSION;

    errorCallbackNoFilesSent = function(error) {
        var message = "There are no files sent to the destination application. Please select a file and send to the other application to test AppKinetics.",
            title = "There are no files sent",
            confirmCallback = function(button) {
                $('#content').css('display', 'block');
                AppKinetics.trigger('noReceivedFiles');
            };

        setTimeout(function() {
            window.plugins.GDAppKineticsPlugin.readyToProvideService(fileTransferService, fileTransferVersion,
                function(result) {
                    if (result.toString() == "OK") {
                        confirmCallback();
                    } else {
                        var filesCount = result.attachments.length,
                            details = result.attachments[0],
                            receivedFiles = 'Received ' + filesCount + ' file(s)';

                        AppKinetics.receivedFile.path = details;
                        AppKinetics.getFileSystem();

                        AppKinetics.showRecievedFilesDetails('File was successfully received: ', details, receivedFiles);
                    }
                },
                function() {
                    confirmCallback();
                });
        }, 1000);
    };

    setTimeout(function() {
        window.plugins.GDAppKineticsPlugin.retrieveFiles(function(result) {
            var filesCount = result.length,
                receivedFiles = 'Received ' + filesCount + ' file(s)';

            AppKinetics.receivedFile.path = result[0];
            AppKinetics.getFileSystem();

            AppKinetics.showRecievedFilesDetails('File was successfully received: ', result[0], receivedFiles);
        }, errorCallbackNoFilesSent);
    }, 1000);

};

/* method wich gets the content of received file */
AppKinetics.readFile = function() {
    var successCallback = function(reader) {
        AppKinetics.receivedFile.content = reader.target.result;
        AppKinetics.trigger('fileReaderReady');
    }

    AppKinetics.receivedFile.file.file(function(file) {
        var fileReader = new FileReader();
        fileReader.onloadend = successCallback;
        fileReader.readAsText(file);
    }, function(error) {
        alert("ERROR: " + JSON.stringify(error));
    });
}

/* method which access to secure file system */
AppKinetics.getFileSystem = function() {
    var successCallbackToGetFileSystem = function(fileSystem) {
            AppKinetics.secureFileSystem = fileSystem;
            AppKinetics.trigger('fileSystemReady');
        },
        errorCallback = function(error) {
            alert("ERROR: " + JSON.stringify(error));
        };

    window.requestFileSystem(LocalFileSystem.APPKINETICS, 0, successCallbackToGetFileSystem, errorCallback);
};


/* method which created files in "Files" directory */
AppKinetics.getRecievedFile = function() {
    var errorCallback = function(error) {
            alert("ERROR: " + JSON.stringify(error));
        },

        successCallbackToCreateFile = function(file) {
            AppKinetics.receivedFile.file = file;
            AppKinetics.trigger('fileReady');
        };

    AppKinetics.secureFileSystem.root.getFile(AppKinetics.receivedFile.path, {
            create: false,
            exclusive: false
        },
        successCallbackToCreateFile,
        errorCallback);

};

/* method which gets metadata for each created file */
AppKinetics.getFileMetadata = function() {
    var successCallbackToGetFileMetadata = function(metadata) {
            AppKinetics.receivedFile.metadata = metadata;
            AppKinetics.trigger('fileMetadataReady');
        },
        errorCallback = function(error) {
            alert("ERROR: " + JSON.stringify(error));
        };

    AppKinetics.receivedFile.file.getMetadata(successCallbackToGetFileMetadata, null);
};
