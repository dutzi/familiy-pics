const segmentize = require('./segmentize.js');

document.querySelector('imageContainer');

const OFFSET = 0;

const $imgContainer = $('.container');
const img = $('.scannedImage')[0];

// create image canvas
const canvas = document.createElement('canvas');
canvas.classList.add('imgCanvas');
const imgWidth = img.width;
const imgHeight = img.height;
canvas.width = img.width - OFFSET * 2;
canvas.height = img.height - OFFSET * 2;
const context = canvas.getContext('2d')
// debugger;
// context.drawImage(img, 0, 0, img.width, img.height);
// debugger;
context.drawImage(img,
    0, 0, img.naturalWidth, img.naturalHeight,
    0, 0, canvas.width, canvas.height)

setTimeout(() => {
    segmentize(context);
}, 1000);

// define crop area
const cropArea = $('<div>').addClass('cropArea');

// show canvas
$imgContainer.append(canvas);

// show crop area
$imgContainer.append(cropArea);

// wait for user to click on image, get color at point
$('.scannedImage').on('click', (e) => {
    // get coords
    let x = e.offsetX;
    let y = e.offsetY;

    // get color
    var p = context.getImageData(x, y, 1, 1).data;

    // console.log(p[0], p[1], p[2]);
});

function getCssVars() {
    const computedStyle = window.getComputedStyle(document.querySelector(':root'));
    function getValue(prop) {
        return computedStyle.getPropertyValue('--crop-offset').trim();
    }

    let retObj = {};

    ['crop-offset', 'crop-width', 'crop-alpha'].forEach(
        name => retObj[name] = getValue('--' + name))

    return retObj;
}

console.log(getCssVars());