function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function thresholdHsl(pixels, lower, upper) {
    var d = pixels.data;
    var createTest = function(lower, upper) {
        return lower <= upper
        ? function(v) { return lower <= v && v <= upper; }
            : function(v) { return lower <= v || v <= upper; };
    }
    var h = createTest(lower[0], upper[0]);
    var s = createTest(lower[1], upper[1]);
    var l = createTest(lower[2], upper[2]);

    for (var i = 0; i < d.length; i += 4) {
        var hsl = rgbToHsl(d[i], d[i + 1], d[i + 2]);
        if (!h(hsl[0]) || !s(hsl[1]) || !l(hsl[2])) {
            d[i + 3] = 0;
        }
    }
}

var img = new Image();

img.onload = function() {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    thresholdHsl(pixels, [0, 0.12, 0], [1, 1, 1]);
    ctx.putImageData(pixels, 0, 0);
};

img.src = 'alizee2.jpg';