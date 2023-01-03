/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 *
 * BlackBerry Dynamics Cordova Media Capture plugin tests.
 */

describe('Capture (navigator.device.capture)', function () {
    var storageLocation = 'cdvfile://localhost/media/';

    it('capture.spec.1 should exist', function () {
        expect(navigator.device).toBeDefined();
        expect(navigator.device.capture).toBeDefined();
    });

    it('capture.spec.2 should have the correct properties ', function () {
        expect(navigator.device.capture.supportedAudioModes).toBeDefined();
        expect(navigator.device.capture.supportedImageModes).toBeDefined();
        expect(navigator.device.capture.supportedVideoModes).toBeDefined();
    });

    it('capture.spec.3 should contain a captureAudio function', function () {
        expect(navigator.device.capture.captureAudio).toBeDefined();
        expect(typeof navigator.device.capture.captureAudio === 'function').toBe(true);
    });

    it('capture.spec.4 should contain a captureImage function', function () {
        expect(navigator.device.capture.captureImage).toBeDefined();
        expect(typeof navigator.device.capture.captureImage === 'function').toBe(true);
    });

    it('capture.spec.5 should contain a captureVideo function', function () {
        expect(navigator.device.capture.captureVideo).toBeDefined();
        expect(typeof navigator.device.capture.captureVideo === 'function').toBe(true);
    });

    describe('CaptureAudioOptions', function () {
        it('capture.spec.6 CaptureAudioOptions constructor should exist', function () {
            var options = new CaptureAudioOptions();
            expect(options).toBeDefined();
            expect(options.limit).toBeDefined();
            expect(options.duration).toBeDefined();
        });
    });

    describe('CaptureImageOptions', function () {
        it('capture.spec.7 CaptureImageOptions constructor should exist', function () {
            var options = new CaptureImageOptions();
            expect(options).toBeDefined();
            expect(options.limit).toBeDefined();
        });
    });

    describe('CaptureVideoOptions', function () {
        it('capture.spec.8 CaptureVideoOptions constructor should exist', function () {
            var options = new CaptureVideoOptions();
            expect(options).toBeDefined();
            expect(options.limit).toBeDefined();
            expect(options.duration).toBeDefined();
        });
    });

    describe('CaptureError interface', function () {
        it('capture.spec.9 CaptureError constants should be defined', function () {
            expect(CaptureError.CAPTURE_INTERNAL_ERR).toBe(0);
            expect(CaptureError.CAPTURE_APPLICATION_BUSY).toBe(1);
            expect(CaptureError.CAPTURE_INVALID_ARGUMENT).toBe(2);
            expect(CaptureError.CAPTURE_NO_MEDIA_FILES).toBe(3);
        });

        it('capture.spec.10 CaptureError properties should exist', function () {
            var error = new CaptureError();
            expect(error).toBeDefined();
            expect(error.code).toBeDefined();
        });
    });

    describe('MediaFileData', function () {
        it('capture.spec.11 MediaFileData constructor should exist', function () {
            var fileData = new MediaFileData();
            expect(fileData).toBeDefined();
            expect(fileData.bitrate).toBeDefined();
            expect(fileData.codecs).toBeDefined();
            expect(fileData.duration).toBeDefined();
            expect(fileData.height).toBeDefined();
            expect(fileData.width).toBeDefined();
        });
    });

    describe('MediaFile', function () {
        it('capture.spec.12 MediaFile constructor should exist', function () {
            var fileData = new MediaFile();
            expect(fileData).toBeDefined();
            expect(fileData.name).toBeDefined();
            expect(fileData.type).toBeDefined();
            expect(fileData.lastModifiedDate).toBeDefined();
            expect(fileData.size).toBeDefined();
        });
    });

    describe('navigator.device.capture.storageLocation', function () {
        it('capture.spec.13 storageLocation should exist', function() {
            expect(navigator.device.capture.storageLocation).toBeDefined();
            expect(navigator.device.capture.storageLocation).toBe(storageLocation);
        });

        it('capture.spec.14 storageLocation should be resolved via resolveLocalFileSystemURL', function(done) {
            var successCallback = function(dirEntry) {
                expect(dirEntry.isFile).toBe(false);
                expect(dirEntry.isDirectory).toBe(true);
                expect(dirEntry.name).not.toBe(null);
                expect(dirEntry.fullPath).toBe('/');
                expect(dirEntry.filesystem.name).toBe('media');
                expect(dirEntry.filesystem.root.fullPath).toBe('/');
                expect(dirEntry.filesystem.root.name).toBe('/');
                expect(dirEntry.filesystem.root.isFile).toBe(false);
                expect(dirEntry.filesystem.root.isDirectory).toBe(true);
                done();
            };

            var errorCallback = function(err) {
                expect(true).toBe(false);
                done();
            };

            resolveLocalFileSystemURL(navigator.device.capture.storageLocation, successCallback, errorCallback);
        });

        it('capture.spec.15 storageLocation should be resolved via resolveLocalFileSystemURI', function(done) {
            var successCallback = function(dirEntry) {
                expect(dirEntry.isFile).toBe(false);
                expect(dirEntry.isDirectory).toBe(true);
                expect(dirEntry.name).not.toBe(null);
                expect(dirEntry.fullPath).toBe('/');
                expect(dirEntry.filesystem.name).toBe('media');
                expect(dirEntry.filesystem.root.fullPath).toBe('/');
                expect(dirEntry.filesystem.root.name).toBe('/');
                expect(dirEntry.filesystem.root.isFile).toBe(false);
                expect(dirEntry.filesystem.root.isDirectory).toBe(true);
                done();
            };

            var errorCallback = function(err) {
                expect(true).toBe(false);
                done();
            };

            resolveLocalFileSystemURI(navigator.device.capture.storageLocation, successCallback, errorCallback);
        });
    });

    describe('LocalFileSystem.MEDIA', function () {
        it('capture.spec.16 should resolve LocalFileSystem.MEDIA via requestFileSystem', function(done) {
            var success = function(fileSystem) {
                expect(fileSystem.name).toBe("media");
                expect(fileSystem.root.name).toBe('/');
                expect(fileSystem.root.isFile).toBe(false);
                expect(fileSystem.root.isDirectory).toBe(true);
                expect(fileSystem.root.fullPath).toBe('/');
                expect(fileSystem.root.nativeURL.includes('/Inbox/media')).toBe(true);
                done();
            };

            var fail = function(err) {
                expect(true).toBe(false);
                done();
            }

            requestFileSystem(LocalFileSystem.MEDIA, 0, success, fail);
        });

        it('capture.spec.17 should create directory reader for media folder', function(done) {
            var success = function(fileSystem) {
                var dirEntry = fileSystem.root;
                expect(dirEntry.filesystem.name).toBe("media");
                expect(dirEntry.isFile).toBe(false);
                expect(dirEntry.isDirectory).toBe(true);
                expect(dirEntry.fullPath).toBe('/');
                expect(dirEntry.nativeURL.includes('/Inbox/media')).toBe(true);

                var directoryReader = dirEntry.createReader();
                expect(directoryReader.localURL).toBe(storageLocation);
                expect(directoryReader.hasReadEntries).toBe(false);

                directoryReader.readEntries(function (entries) {
                    expect(entries.constructor === Array).toBe(true);
                    expect(entries.length).toBe(0);
                    done();
                }, fail);
            };

            var fail = function(err) {
                expect(true).toBe(false);
                done();
            }

            requestFileSystem(LocalFileSystem.MEDIA, 0, success, fail);
        });

    });
});
