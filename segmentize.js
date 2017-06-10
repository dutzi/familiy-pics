const BLOCK_SIZE = 150;

let blocks = [];
window.blocks = blocks;

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function getRowAtX(x, canvas) {
    return Math.floor(x / BLOCK_SIZE)
}

function getColumnAtY(y, canvas) {
    return Math.floor(y / BLOCK_SIZE)
}

function getRowAtScaledX(x, canvas) {
    return Math.floor(x / BLOCK_SIZE * canvas.width / canvas.clientWidth)
}

function getColumnAtScaledY(y, canvas) {
    return Math.floor(y / BLOCK_SIZE * canvas.height / canvas.clientHeight)
}

function calcColorDistance(color1, color2) {
    return Math.sqrt(
        Math.pow(color1.r - color2.r, 2) +
        Math.pow(color1.g - color2.g, 2) +
        Math.pow(color1.b - color2.b, 2)
    )
}

function getColorAtBlock(x, y, canvas) {
    let row = getRowAtX(x, canvas),
        column = getColumnAtY(y, canvas);

    return blocks[column][row]
}

function getColorAtScaledBlock(x, y, canvas) {
    let row = getRowAtScaledX(x, canvas),
        column = getColumnAtScaledY(y, canvas);

    return blocks[column][row]
}

function setColorAtBlock(x, y, canvas, value) {
    let row = getRowAtX(x, canvas),
        column = getColumnAtY(y, canvas);

    if (!blocks[column]) {
        blocks[column] = [];
    }

    blocks[column][row] = value;
}

function stringifyColor(color) {
    return `${Math.floor(color.r)}, ${Math.floor(color.g)}, ${Math.floor(color.b)}`
}

function onCanvasMouseMove(e) {
    let canvas = e.target,
        x = e.offsetX,
        y = e.offsetY,
        row = getRowAtScaledX(x, canvas),
        column = getColumnAtScaledY(y, canvas),
        color = getColorAtScaledBlock(x, y, canvas),
        firstColor = getColorAtBlock(0, 0, canvas),
        colorDist = calcColorDistance(firstColor, color);


    let tooltipData = $('.tooltip__data');
    tooltipData.innerHTML =
        `<div><b>x:</b> ${x}</div>` +
        `<div><b>y:</b> ${y}</div>` +
        `<div><b>row:</b> ${row}</div>` +
        `<div><b>column:</b> ${column}</div>` +
        `<div><b>dist:</b> ${colorDist.toFixed(2)}</div>` +
        `<div><b>color:</b> ${stringifyColor(color)}</div>`;

    let tooltipColor = $('.tooltip__color');
    tooltipColor.style.backgroundColor = `rgb(${stringifyColor(color)})`

    let tooltip = $('.tooltip');
    tooltip.style.left = event.offsetX + 10
    tooltip.style.top = event.offsetY + 10
}

function segmentize(context) {
    performance.mark('Start segmentize');

    context.getImageData
    let canvas = context.canvas;
    let width = canvas.width;
    let height = canvas.height;
    let counter = 0;
    context.lineWidth = 1;

    canvas.addEventListener('mousemove', onCanvasMouseMove);

    let prevAvgR, prevAvgG, prevAvgB, prevAvgA;

    for (let x = 0; x < width; x += BLOCK_SIZE) {
        for (let y = 0; y < height; y += BLOCK_SIZE) {
            let imageData = context.getImageData(x, y, BLOCK_SIZE, BLOCK_SIZE);
            let avgR = 0, avgG = 0, avgB = 0, avgA = 0;

            for (var i = 0; i < imageData.data.length; i += 4) {
                avgR += imageData.data[i + 0];
                avgG += imageData.data[i + 1];
                avgB += imageData.data[i + 2];
                avgA += imageData.data[i + 3];
            }

            prevAvgR = avgR = avgR / (imageData.data.length / 4);
            prevAvgG = avgG = avgG / (imageData.data.length / 4);
            prevAvgB = avgB = avgB / (imageData.data.length / 4);
            prevAvgA = avgA = avgA / (imageData.data.length / 4);

            let color = {
                r: avgR,
                g: avgG,
                b: avgB,
                a: avgA
            }
            debugger;
            setColorAtBlock(x, y, canvas, color);

            firstColor = getColorAtBlock(0, 0, canvas);

            if (calcColorDistance(firstColor, color) > 100) {
                context.strokeStyle = 'red';
            } else {
                context.strokeStyle = 'black';
            }

            context.rect(x, y, BLOCK_SIZE, BLOCK_SIZE);
            context.stroke();

        }
    }

    performance.mark('End segmentize');
    performance.measure('Segmentize', 'Start segmentize', 'End segmentize');
    console.log('done');
};

module.exports = segmentize;