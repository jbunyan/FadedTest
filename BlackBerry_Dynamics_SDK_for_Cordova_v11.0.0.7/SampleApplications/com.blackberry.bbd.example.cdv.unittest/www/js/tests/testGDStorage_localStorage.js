/*
 * (c) 2019 BlackBerry Limited. All rights reserved.
 * 
 * GDStorage plugin unit tests. Local storage functionality
 */
describe('GDStorage plugin - local storage', function () {

    it('Check localStorage plugin installation', function () {
        expect(window).toBeDefined();
        expect(window.plugins).toBeDefined();
        expect(localStorage).toBeDefined();
    });

    var key1 = 'firstName';
    var key2 = 'lastName';
    var key3 = 'age';

    var value1 = 'Harry';
    var value2 = "Potter";
    var value3 = "18";

    describe('localStorage clear storage', function () {
        localStorage.clear();

        it('Check localStorage clear storage', function () {
            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            var result1 = localStorage.getItem(key1);
            var result2 = localStorage.getItem(key2);
            var result3 = localStorage.getItem(key3);

            expect(result1).toBe(value1);
            expect(result2).toBe(value2);
            expect(result3).toBe(value3);

            localStorage.clear();

            result1 = localStorage.getItem(key1);
            result2 = localStorage.getItem(key2);
            result3 = localStorage.getItem(key3);

            expect(result1).toBeNull();
            expect(result2).toBeNull();
            expect(result3).toBeNull();
        });
    });

    describe('localStorage key', function () {
        localStorage.clear();

        it('Check localStorage key positive cases', function () {
            var result1 = localStorage.key(0);
            var result2 = localStorage.key(1);
            var result3 = localStorage.key(2);

            expect(result1).toBeNull();
            expect(result2).toBeNull();
            expect(result3).toBeNull();

            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            var result1 = localStorage.key(0);
            var result2 = localStorage.key(1);
            var result3 = localStorage.key(2);

            expect(result1).toBe(key1);
            expect(result2).toBe(key2);
            expect(result3).toBe(key3);

            localStorage.clear();
        });

        it('Check localStorage key null index', function () {
            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            var result = localStorage.key(null);

            expect(result).toBeNull();

            localStorage.clear();
        });

        it('Check localStorage key undefined index', function () {
            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            var result = localStorage.key(undefined);

            expect(result).toBeNull();

            localStorage.clear();
        });

        it('Check localStorage key invalid(out of range) indexes', function () {
            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            var result1 = localStorage.key(-1);
            var result2 = localStorage.key(10);
            var result3 = localStorage.key(200);

            expect(result1).toBeNull();
            expect(result2).toBeNull();
            expect(result3).toBeNull();

            localStorage.clear();
        });
    })

    describe('localStorage removeItem', function () {
        localStorage.clear();

        it('Check localStorage simple remove', function () {
            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            var result1 = localStorage.getItem(key1);
            var result2 = localStorage.getItem(key2);
            var result3 = localStorage.getItem(key3);

            expect(result1).toBe(value1);
            expect(result2).toBe(value2);
            expect(result3).toBe(value3);

            localStorage.removeItem(key2);

            result1 = localStorage.getItem(key1);
            result2 = localStorage.getItem(key2);
            result3 = localStorage.getItem(key3);

            expect(result1).toBe(value1);
            expect(result2).toBeNull();
            expect(result3).toBe(value3);

            localStorage.removeItem(key3);

            result1 = localStorage.getItem(key1);
            result2 = localStorage.getItem(key2);
            result3 = localStorage.getItem(key3);

            expect(result1).toBe(value1);
            expect(result2).toBeNull();
            expect(result3).toBeNull();

            localStorage.clear();
        });

        it('Check localStorage remove null item', function () {
            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            var result1 = localStorage.getItem(key1);
            var result2 = localStorage.getItem(key2);
            var result3 = localStorage.getItem(key3);

            expect(result1).toBe(value1);
            expect(result2).toBe(value2);
            expect(result3).toBe(value3);

            localStorage.removeItem(null);

            result1 = localStorage.getItem(key1);
            result2 = localStorage.getItem(key2);
            result3 = localStorage.getItem(key3);

            expect(result1).toBe(value1);
            expect(result2).toBe(value2);
            expect(result3).toBe(value3);

            localStorage.clear();
        });

        it('Check localStorage remove undefined item', function () {
            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            var result1 = localStorage.getItem(key1);
            var result2 = localStorage.getItem(key2);
            var result3 = localStorage.getItem(key3);

            expect(result1).toBe(value1);
            expect(result2).toBe(value2);
            expect(result3).toBe(value3);

            localStorage.removeItem(undefined);

            result1 = localStorage.getItem(key1);
            result2 = localStorage.getItem(key2);
            result3 = localStorage.getItem(key3);

            expect(result1).toBe(value1);
            expect(result2).toBe(value2);
            expect(result3).toBe(value3);

            localStorage.clear();
        });

        it('Check localStorage remove not existing item', function () {
            var invalidKey = "some_invalid_key";

            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            var result1 = localStorage.getItem(key1);
            var result2 = localStorage.getItem(key2);
            var result3 = localStorage.getItem(key3);
            var result4 = localStorage.getItem(invalidKey);

            expect(result1).toBe(value1);
            expect(result2).toBe(value2);
            expect(result3).toBe(value3);
            expect(result4).toBeNull();

            localStorage.removeItem(invalidKey);

            result1 = localStorage.getItem(key1);
            result2 = localStorage.getItem(key2);
            result3 = localStorage.getItem(key3);
            result4 = localStorage.getItem(invalidKey);

            expect(result1).toBe(value1);
            expect(result2).toBe(value2);
            expect(result3).toBe(value3);
            expect(result4).toBeNull();

            localStorage.clear();
        });
    });

    describe('localStorage setItem and getItem', function () {
        localStorage.clear();

        it('localStorage getItem empty storage', function () {
            var result = localStorage.getItem(key1);

            expect(result).toBeNull();

            localStorage.clear();
        });

        it('localStorage setItem and getItem positive cases', function () {
            var result1 = localStorage.getItem(key1);
            var result2 = localStorage.getItem(key2);
            var result3 = localStorage.getItem(key3);

            expect(result1).toBeNull();
            expect(result2).toBeNull();
            expect(result3).toBeNull();

            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            result1 = localStorage.getItem(key1);
            result2 = localStorage.getItem(key2);
            result3 = localStorage.getItem(key3);

            expect(result1).toBe(value1);
            expect(result2).toBe(value2);
            expect(result3).toBe(value3);

            localStorage.clear();
        });

        it('localStorage setItem null key', function () {
            localStorage.setItem(null, value1);

            //DESNOTE ovovch: Just checking if it won't crash.
            expect(true).toBe(true);

            var result = localStorage.getItem(null);

            expect(result).toBe(value1);

            localStorage.clear();
        });

        it('localStorage setItem undefined key', function () {
            localStorage.setItem(undefined, value1);

            //DESNOTE ovovch: Just checking if it won't crash.
            expect(true).toBe(true);

            var result = localStorage.getItem(undefined);

            expect(result).toBe(value1);

            localStorage.clear();
        });

        it('localStorage getItem null key', function () {
            var result = localStorage.getItem(null);

            expect(result).toBeNull();

            localStorage.clear();
        });

        it('localStorage getItem undefined key', function () {
            var result = localStorage.getItem(undefined);

            expect(result).toBeNull();

            localStorage.clear();
        });

        it('localStorage getItem and setItem null value', function () {
            var result = localStorage.getItem(key1);

            expect(result).toBeNull();

            localStorage.setItem(key1, null);

            result = localStorage.getItem(key1);

            expect(result).toBe('null');

            localStorage.clear();
        });

        it('localStorage getItem and setItem undefined value', function () {
            var result = localStorage.getItem(key1);

            expect(result).toBeNull();

            localStorage.setItem(key1, undefined);

            result = localStorage.getItem(key1);

            expect(result).toBe(typeof undefined);

            localStorage.clear();
        });

        it('localStorage setItem and getItem override the exactly same key', function () {
            localStorage.setItem(key1, value1);
            localStorage.setItem(key1, value2);
            localStorage.setItem(key1, value3);

            var result = localStorage.getItem(key1);

            expect(result).toBe(value3);

            localStorage.clear();
        });

        it('localStorage getItem no such key case', function () {
            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            var result1 = localStorage.getItem(key1);
            var result2 = localStorage.getItem('some_invalid_key');
            var result3 = localStorage.getItem(key3);

            expect(result1).toBe(value1);
            expect(result2).toBeNull(12);
            expect(result3).toBe(value3);

            localStorage.clear();
        });
    });

    describe('localStorage length', function() {
        it('localStorage length when storage is empty', function() {
            var result = localStorage.getLength();

            expect(result).toBe(0);
        });

        it('localStorage length check positive case', function() {
            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            var result = localStorage.getLength();

            expect(result).toBe(3);

            localStorage.clear();
        });

        it('localStorage length when removing items', function() {
            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            var length = localStorage.getLength();

            expect(length).toBe(3);

            localStorage.removeItem(key3);
            localStorage.removeItem(key2);

            var result = localStorage.getLength();

            expect(result).toBe(1);

            localStorage.clear();
        });

        it('localStorage length when removing same item several times', function() {
            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            var length = localStorage.getLength();

            expect(length).toBe(3);

            localStorage.removeItem(key3);
            localStorage.removeItem(key3);
            localStorage.removeItem(key3);

            var result = localStorage.getLength();

            expect(result).toBe(2);

            localStorage.clear();
        });

        it('localStorage length after clearing storage', function() {
            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);
            localStorage.setItem(key3, value3);

            var length = localStorage.getLength();

            expect(length).toBe(3);

            localStorage.clear();

            var result = localStorage.getLength();

            expect(result).toBe(0);
        });
    });

});
