/**
 * (c) 2020 BlackBerry Limited. All rights reserved.
 * 
 * @fileOverview MailTo sample application for BlackBerry Dynamics.
 *
 * @description MailTo sample demonstrates how to use mailto functionality to open GFE, BlackBerry Work
 * or native mail clients and compose email with filled in information ('to', 'cc', 'bcc', 'subject',
 * 'body' and 'attachment').
 *
 * @version 1.0
 */

var MailTo = {};

MailTo.Constants = {
    FILE_NAMES: [
        "testfile.doc",
        "testfile.gif",
        "testfile.gif.zip",
        "testfile.html",
        "testfile.jpg",
        "testfile.json",
        "testfile.odt",
        "testfile.pdf",
        "testfile.xml",
        "testfile.xls",
        "testfile.txt",
        "testfile.pptx",
        "testfile.png",
        "testmaxlength.txt",
        "testfilezerobytes.json",
        "testlongtext.rtf"
    ]
};

MailTo.files = null;

MailTo.attachments = [];

MailTo.attachmentString = "";

_.extend(MailTo, Backbone.Events);

/* handler for device ready event */
MailTo.deviceReady = function() {
    $(document).on('click', '#send', MailTo.onSendMail);
    $(document).on('click', '#add-attachments', MailTo.addAttachments);
    $(document).on('change', 'input[type="checkbox"]', MailTo.onCheckboxesChange);

    MailTo.listenTo(MailTo, 'newFilesReady', _.bind(this.createAttachments, this));

    MailTo.copyFilesToSecureStorage();
};

MailTo.copyFilesToSecureStorage = function() {
    var dataDirectoryFromAppKinetics = window.plugins.GDAppKineticsPlugin.storageLocation + '/data/',
        filesCount = MailTo.Constants.FILE_NAMES.length;

    window.plugins.GDAppKineticsPlugin.copyFilesToSecureFileSystem(function(result) {
        var filesCopiedToSecureStorage = parseInt(result, 10);
        console.log('Files, succesfully copied to secure storage: ' + filesCopiedToSecureStorage);

        if (filesCopiedToSecureStorage !== filesCount) {
            alert('ERROR: mismatch of expected ' + filesCount + ' and coppied ' + filesCopiedToSecureStorage + ' files to secure storage');
        }

        var successCallbackToResolveFileSystemURL = function(dataDirectoryEntry) {
                collectCopiedFiles(dataDirectoryEntry);
            },
            errorCallback = function(error) {
                alert("ERROR to resolveLocalFileSystemURL: " + JSON.stringify(error));
            };

        resolveLocalFileSystemURL(dataDirectoryFromAppKinetics, successCallbackToResolveFileSystemURL, errorCallback);
    });

    function collectCopiedFiles(dataDirectoryEntry) {
        var dataDirectoryFileEntries = [],
            dataDirectoryReader = dataDirectoryEntry.createReader();

        dataDirectoryReader.readEntries(function(entries) {
            dataDirectoryFileEntries = entries.filter(function(entry) {
                return entry.isFile;
            });

            MailTo.files = dataDirectoryFileEntries;
            MailTo.trigger('newFilesReady');

        }, function(error) {
            alert("ERROR to readEntries: " + JSON.stringify(error));
        });
    }
};

MailTo.createAttachments = function() {
    var currentFile,
        filesCount = MailTo.files.length,
        resultHTML,
        filesWrapper = $('#attachments-wrapper'),
        templateOuter = $('#template-files-outer'),
        onlyName;

    for (currentFile = 0; currentFile < filesCount; currentFile++) {
        onlyName = MailTo.files[currentFile].name.replace(".", "-");

        MailTo.createFileTemplate("#attachments-wrapper", {
            'inputID': onlyName,
            'inputName': onlyName,
            'fileName': MailTo.files[currentFile].name,
            'isFile': MailTo.files[currentFile].isFile,
            'fullPath': MailTo.files[currentFile].fullPath
        });
    }

    resultHTML = $(templateOuter.html()).find('fieldset').append(filesWrapper.html());

    filesWrapper.html(resultHTML).trigger('create');
};

MailTo.addAttachments = function() {
    var attachmentsWrapper = $('#attachments-wrapper'),
        attachmentsDisplayStyle = attachmentsWrapper.css("display");

    if (attachmentsDisplayStyle == "none") {
        attachmentsWrapper.show();
    } else if (attachmentsDisplayStyle == "block") {
        attachmentsWrapper.hide();
    }
};

MailTo.onSendMail = function() {
    var emailInput = $('#email'),
        ccInput = $('#email-cc'),
        bccInput = $('#email-bcc'),
        subjectInput = $('#subject'),
        bodyInput = $('#body'),

        emails = normalizeEmails(emailInput.val()),

        mailtoURL = emails[0] ? new URL("mailto:" + emails[0]) : new URL("mailto:");

    emails.shift();

    var isCustomSearchParamsUsed = false;

    mailtoURL.BBDSearchParams = new BBDURLSearchParams();

    if (emails.length) {
        mailtoURL.BBDSearchParams.append('to', emails.join());
    }

    mailtoURL.BBDSearchParams.append('cc', normalizeEmails(ccInput.val()).join());
    mailtoURL.BBDSearchParams.append('bcc', normalizeEmails(bccInput.val()).join());

    mailtoURL.BBDSearchParams.append('subject', encodeURIComponent(subjectInput.val()));
    mailtoURL.BBDSearchParams.append('body', encodeURIComponent(bodyInput.val()));

    mailtoURL.BBDSearchParams.append('attachment', MailTo.attachmentString);

    window.location.href = mailtoURL.href + mailtoURL.BBDSearchParams.toString();
};

MailTo.onCheckboxesChange = function(checkBox) {
    var currentCheckbox = checkBox.target,
        currentFileName = currentCheckbox.labels[0].innerText.trim(),
        currentFileEntry = MailTo.files.find(function(file) {
            return file.name == currentFileName;
        }),
        currentFileLocation = currentFileEntry.nativeURL || false; // impossible case. Just to be safe

    if (currentCheckbox.checked) {
        MailTo.attachments.push(currentFileLocation);
    } else {
        MailTo.attachments = MailTo.attachments.filter(function(attachment) {
            return attachment != currentFileLocation;
        });
    }

    MailTo.attachmentString = MailTo.attachments.join();
};

MailTo.createFileTemplate = function(element, options) {
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

function normalizeEmails(emails) {
    return emails.trim()
        .split(',')
        .map(function(email) { return encodeURIComponent(email.trim()); });
}

function BBDURLSearchParams() {
    this.params = [];
}

BBDURLSearchParams.prototype.append = function(sKey, sValue) {
    if (typeof sKey == undefined) { throw new Error("BBDURLSearchParams#append: key should be specified.") }

    if (typeof sValue == undefined) { throw new Error("BBDURLSearchParams#append: value should be specified.") }

    this.params.push(sKey + '=' + sValue);
}

BBDURLSearchParams.prototype.toString = function() {
    return "?" + this.params.join('&');
}
