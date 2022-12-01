module.exports = {
    getImageData: function (name, size) {
        var dataSrcset = '';
        var imageSizes = [400, 800, 1200, 1600, 2400];
        if (size < 2400) {
            imageSizes.push(size);
        }
        imageSizes.sort(function (a, b) {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });

        var arrayName = /(.+)(\.)(.+)/g.exec(name);
        var rexName = /(.*)\/(.+)([.])(.+)/g.exec(name);

        for (var i = 1; i < imageSizes.length; i++) {

            if (imageSizes[i] <= size) {
                if (i < (imageSizes.length - 1)) {
                    dataSrcset += arrayName[1] + '-' + imageSizes[i] + '.' + arrayName[3] + ' ' + imageSizes[i] + 'w, ';
                } else {
                    dataSrcset += arrayName[1] + '-' + imageSizes[i] + '.' + arrayName[3] + ' ' + imageSizes[i] + 'w';
                }
            }
        }

        return {
            placeHolder: arrayName[1] + '-' + imageSizes[0] + '.' + arrayName[3],
            dataSrcSet: dataSrcset,
            alt: rexName[2],
            size: imageSizes[0]
        }
    }
}
