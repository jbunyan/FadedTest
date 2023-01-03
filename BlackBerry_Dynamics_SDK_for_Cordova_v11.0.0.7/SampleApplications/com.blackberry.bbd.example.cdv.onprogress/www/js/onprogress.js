/**
 * (c) 2020 BlackBerry Limited. All rights reserved.
 *
 * @fileOverview OnProgress sample application for BlackBerry Dynamics.
 *
 * @description OnProgress sample application demonstrates usage of GDHTTPRequest and GDFileSystem GD's APIs.
 * @version 1.0
 */

var OnProgress = {};

_.extend(OnProgress, Backbone.Events);

OnProgress.Constants = {
    FILE_NAME: "testFile.txt",
    DIR_URL: ""
};

OnProgress.fileToUpload = null;

OnProgress.getFileToUpload = function() {

    resolveLocalFileSystemURL(OnProgress.Constants.DIR_URL, function(directoryEntry) {

        // utility object for generate text
        var utils = {
            textLine: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non elit quis justo tempor fringilla vitae ut nunc. \n',
            generateText: function(times) {
                times = times || 1;
                var content = '';

                for (var i = 0; i < times; i++) {
                    content += this.textLine;
                }

                return content;
            }
        };

        var creatingFileError = function(err) {
            alert("Error when creating file: " + JSON.stringify(err));
        };

        var writeFile = function(fileEntry, fileContent, onwriteend) {
            fileEntry.createWriter(function(fileWriter) {

                fileWriter.onwrite = onwriteend;

                fileWriter.onerror = function(e) {
                    alert("Failed file write: " + e.toString());
                };

                fileWriter.write(fileContent);
            });
        };

        // create test file in chosen directory
        var options = {
            create: true,
            exclusive: false
        };

        directoryEntry.getFile(OnProgress.Constants.FILE_NAME, options, function(fileEntry) {

            // generate 5800 hardcoded rows
            var fileContent = utils.generateText(5800);

            // write in file fileContent generated before
            writeFile(fileEntry, fileContent, function() {
                OnProgress.fileToUpload = fileEntry;
                OnProgress.trigger('fileIsGot');
            });

        }, creatingFileError);

    }, function(error) {
        alert("Error resolveLocalFileSystemURL: " + JSON.stringify(error));
    });
}

/* handler for device ready event */
OnProgress.deviceReady = function() {

    // initialize directory path from cordova.file constants available after invoking device ready event
    OnProgress.Constants.DIR_URL = cordova.file.applicationStorageDirectory;

    $(document).on('click', '#upload-btn', OnProgress.onUploadFile);

    OnProgress.listenTo(OnProgress, 'fileIsGot', _.bind(this.getFileSize, this));

    OnProgress.listenTo(OnProgress, 'fileIsReady', _.bind(this.updateUI, this));

    OnProgress.getFileToUpload();
};

OnProgress.onUploadFile = function() {
    $('h4').css('display', 'block');
    $('#bar').css('display', 'block');
    var fileTransfer = new FileTransfer(),
        uploadUrl = "http://httpbin.org/post";

    fileTransfer.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable || progressEvent.total) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            $('#bar').html(perc.toString() + '%');
        }
    };

    var fileToUploadUrl = OnProgress.Constants.DIR_URL + OnProgress.Constants.FILE_NAME;

    fileTransfer.upload(fileToUploadUrl, uploadUrl,
        function () {
            console.log("Upload completed."); // required for T001 OnProgress in Test suite: SampleApps
            alert("Upload completed.");
        },
        function (error) {
            alert("Upload error source " + error.source.toString());
        }
    );
};

OnProgress.getFileSize = function() {
    var successCallbackToGetSize = function(file) {
        OnProgress.fileToUpload.size = file.size;
        OnProgress.trigger('fileIsReady');
    },
    errorCallback = function(error) {
        alert("ERROR: " + error);
    };

    OnProgress.fileToUpload.file(successCallbackToGetSize, errorCallback);
};

OnProgress.updateUI = function() {
    var fileNameSpan = $('.file-name'),
        fileSizeSpan = $('.file-size'),
        fileSize = OnProgress.fileToUpload.size,
        fileName = OnProgress.fileToUpload.name;

    fileNameSpan.html(fileName);
    fileSizeSpan.html(fileSize + "b");
    $('.main-content').show();
};
