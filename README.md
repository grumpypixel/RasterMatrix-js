# RasterMatrix-js

This raster matrix emerged from to the need to visualize cells while working on a Cellular Automaton for JavaScript.

## How to use

Creating a RasterMatrix is straight-forward. The following code creates an instance of RasterMatrix with a raster size of 32x32, where each raster cell has a size of 16x16 pixels and a padding of 1 (spacing between cells).
<pre>
const config = {
  width: 32,
  height: 32,
  pixelSize: { x: 16, y: 16 },
  margin: { x: 0, y: 0 },
  padding: { x: 1, y: 1 },
  topLeftOffset: { x: 0, y: 0 }
}
const rasterMatrix = new RasterMatrix(config);
</pre>

Centering the RasterMatrix within the canvas (or any arbitrary rectangle) works as follows.
<pre>
rasterMatrix.centerInRect({ x: 0, y :0, width: canvas.width, height: canvas.height });
</pre>

Clearing the RasterMatrix before rendering each frame.
<pre>
// This line clears all raster cells with the value 'null'.
// Raster cells with a value of null are omitted during rendering.
rasterMatrix.clear();
</pre>
or:
<pre>
// Whereas this clears or presets all raster cells with the color black:
rasterMatrix.clear('#000');
</pre>

Setting a cell at a specific position to the color red.
<pre>
rasterMatrix.setPixel(3, 5, '#f00');
</pre>

Setting a block of 4x2 pixels at the top-left position 0,0. Blocks will be clamped accordingly if they do not fit the size of the raster.
<pre>
const x = 0;
const y = 0;
const width = 4;
const height = 2;
const colors = [
    '#f00', '#0f0', '#00f', '#fff',
    '#0ff', '#f0f', '#ff0', '#888',
];
rasterMatrix.setPixelBlock(x, y, width, height, colors);
</pre>

Rendering the RasterMatrix.
<pre>
const canvas = getCanvas();
const context = canvas.getContext('2d');
// [...] Set pixels. Do your worst.
rasterMatrix.render(context);
</pre>

Happy coding!
