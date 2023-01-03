/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 *
 * BBDLauncher plugin functional tests.
 */
describe('BBDLauncher plugin', function() {
    it('should be installed and available on "window" object', function() {
        expect(window).toBeDefined();
        expect(window.launcher).toBeDefined();
    });

    it('should be an instance of Launcher', function() {
        expect(window.launcher.toString()).toBe('[object Launcher]');
        expect(window.launcher.constructor.toString()).toBe('function Launcher() { [native code] }');
    })

    it('instance methods should be hosted in "__proto__" property', function() {
        expect(window.launcher.prototype).toBeUndefined();
        expect(window.launcher.__proto__).toBeDefined();
        expect(window.launcher.__proto__ instanceof Object).toBeTruthy();
    });

    describe('method "show"', function() {
        it('should be defined and be an instance of function', function() {
            expect(window.launcher.show).toBeDefined();
            expect(window.launcher.show instanceof Function).toBeTruthy();
        });

        it('toString property value should be valid', function() {
            expect(window.launcher.show.toString).toBeDefined();
            expect(window.launcher.show.toString()).toBe('function show() { [native code] }');
        });

        it('shouldn\'t display any warnings / errors', async function() {
            spyOn(console, 'warn');
            spyOn(console, 'error');

            await window.launcher.show();

            expect(console.warn).toHaveBeenCalledTimes(0);
            expect(console.error).toHaveBeenCalledTimes(0);
        });
    });

    describe('method "hide"', function() {
        it('should be defined and be an instance of function', function() {
            expect(window.launcher.hide).toBeDefined();
            expect(window.launcher.hide instanceof Function).toBeTruthy();
        });

        it('toString property value should be valid', function() {
            expect(window.launcher.hide.toString).toBeDefined();
            expect(window.launcher.hide.toString()).toBe('function hide() { [native code] }');
        });

        it('shouldn\'t display any warnings / errors', async function() {
            spyOn(console, 'warn');
            spyOn(console, 'error');

            await window.launcher.hide();

            expect(console.warn).toHaveBeenCalledTimes(0);
            expect(console.error).toHaveBeenCalledTimes(0);
        });
    });

    if (cordova.platformId === 'ios') {
        // NOTE: "open", "close" methods are available only on iOS
        describe('method "open"', function() {
            it('should be defined and be an instance of function', function() {
                expect(window.launcher.open).toBeDefined();
                expect(window.launcher.open instanceof Function).toBeTruthy();
            });

            it('toString property value should be valid', function() {
                expect(window.launcher.open.toString).toBeDefined();
                expect(window.launcher.open.toString()).toBe('function open() { [native code] }');
            });

            it('shouldn\'t display any warnings / errors', async function() {
                spyOn(console, 'warn');
                spyOn(console, 'error');

                await window.launcher.open();

                expect(console.warn).toHaveBeenCalledTimes(0);
                expect(console.error).toHaveBeenCalledTimes(0);
            });
        });

        describe('method "close"', function() {
            it('should be defined and be an instance of function', function() {
                expect(window.launcher.close).toBeDefined();
                expect(window.launcher.close instanceof Function).toBeTruthy();
            });

            it('toString property value should be valid', function() {
                expect(window.launcher.close.toString).toBeDefined();
                expect(window.launcher.close.toString()).toBe('function close() { [native code] }');
            });

            it('shouldn\'t display any warnings / errors', async function() {
                spyOn(console, 'warn');
                spyOn(console, 'error');

                await window.launcher.close();

                expect(console.warn).toHaveBeenCalledTimes(0);
                expect(console.error).toHaveBeenCalledTimes(0);
            });
        });
    }
});
