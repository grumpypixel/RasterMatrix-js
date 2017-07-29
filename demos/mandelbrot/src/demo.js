/* demo.js */

const rasterWidth = 256;
const rasterHeight = 256;
const pixelSize = 2;
const padding = 1;

let rasterMatrix = null;
let fractal = null;

window.onload = function() {
	const canvas = getCanvas();
	canvas.style.backgroundColor = 'rgba(64, 64, 96, 128)';

	rasterMatrix = createRasterMatrix(rasterWidth, rasterHeight);
	rasterMatrix.centerInRect({ x: 0, y :0, width: canvas.width, height: canvas.height });

	fractal = { maxIterations: 50, iterations: 0, sign: 1 };

	window.requestAnimationFrame(updateFrame);
}

function createRasterMatrix(width, height) {
	const config = {
		width: width,
		height: height,
		pixelSize: { x: pixelSize, y: pixelSize },
		margin: { x: 0, y: 0 },
		padding: { x: padding, y: padding },
		topLeftOffset: { x: 0, y: 0 },
	}
	return new RasterMatrix(config);
}

function updateFrame() {
	let canvas = getCanvas();
	let context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);

	rasterMatrix.clear();
	calculateMandelbrot();
	rasterMatrix.render(context, null);

	updateIterations();

	CanvasRenderer.drawText(context, 10, 25, fractal.iterations, '#ff0', 'left', 'bold 20px Courier');

	window.requestAnimationFrame(updateFrame);
}

function getCanvas() {
	return document.getElementById('canvas');
}

function calculateMandelbrot() {
	const r2 = 4.0;
	const max = fractal.iterations;
	const width = rasterMatrix.getWidth();
	const height = rasterMatrix.getHeight();
	for (let yi = 0; yi < height; ++yi) {
		for (let xi = 0; xi < width; ++xi) {
			const re = (xi - width * 0.5) * r2 / width;
			const im = (yi - height * 0.5) * r2 / width;

			let x = 0.0;
			let y = 0.0;
			let iter = 0;

			while (iter < max && x * x + y * y < r2) {
				const xt = x * x - y * y + re;
				y = 2 * x * y + im;
				x = xt;
				iter += 1;
			}
			const color = iter < max ? 'hsl(' + (iter / max * 256.0) + ', 100%, ' + (25 + (iter / max * 100 / 2)) + '%)' : '#000';
			rasterMatrix.setPixel(xi, yi, color);
		}
	}
}

function updateIterations() {
	fractal.iterations = Math.min(fractal.iterations + fractal.sign, fractal.maxIterations);
	if (fractal.iterations === fractal.maxIterations || fractal.iterations === 0) {
		fractal.sign = -fractal.sign;
	}
}
