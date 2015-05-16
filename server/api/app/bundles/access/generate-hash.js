/**
 * generate-hash.js
 * @author Antoine De Gieter
 * @copyright Net Production Köbe & Co
 * @digest Generates a hexadecimal hash
 */

module.exports = {
    generateHash: function (length) {
        if (!length)
            var length = 40;

        var hash = "";
        var chars = "0123456789abcdef";
        var rnd, index;
        for (var i = 0; i < length; i++) {
            index = Math.floor(Math.random() * chars.length);
            rnd = chars[index];
            hash += rnd;
        };
        return hash;
    }
}