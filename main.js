document.querySelector('imageContainer');

const OFFSET = 20;

const $imgContainer = $('.container');
const img = $('.scannedImage')[0];

// create image canvas
const canvas = document.createElement('canvas');
canvas.classList.add('imgCanvas');
const imgWidth = canvas.width = img.width;
const imgHeight = canvas.height = img.height;
const context = canvas.getContext('2d')
context.drawImage(img, 0, 0, img.width, img.height);

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

    console.log(p[0], p[1], p[2]);

    // mark all areas showing that color

});
