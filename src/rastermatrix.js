/* rastermatrix.js */

class RasterMatrix {

  constructor(config) {
    this.width = config.width
    this.height = config.height;
    this.pixelSize = { x: config.pixelSize.x, y: config.pixelSize.y }
    this.margin = config.margin ? { x: config.margin.x, y: config.margin.y } : { x: 0, y: 0 }
    this.padding = config.padding ? { x: config.padding.x, y: config.padding.y } : { x: 0, y: 0 }
    this.offset = config.topLeftOffset ? { x: config.topLeftOffset.x, y: config.topLeftOffset.y } : { x: 0, y: 0 }
    this.buffer = new Array(this.width * this.height).fill().map( () => {
      return null;
    });
  }

  clear(color = null) {
    const count = this.buffer.length;
    for (let i = 0; i < count; ++i) {
      this.buffer[i] = color;
    }
  }

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

  setPixel(x, y, color) {
    if (this.__isValidCoordinate(x, y)) {
      this.buffer[x + y * this.width] = color;
    }
  }

  setPixels(colors) {
    const count = Math.min(colors.length, this.buffer.length);
    for (let i = 0; i < count; ++i) {
      this.buffer[i] = colors[i];
    }
  }

  setPixelBlock(x, y, blockWidth, blockHeight, colors) {
    if (colors.length < blockWidth * blockHeight) return;
    if (x <= -blockWidth || x >= this.width) return;
    if (y <= -blockHeight || y >= this.height) return;

    const xs = x >= 0 ? 0 : -x;
    const ys = y >= 0 ? 0 : -y;

    let w = blockWidth;
    if (x < 0) {
      w -= xs;
    }
    if (x > this.width - blockWidth) {
      w -= (x + blockWidth - this.width);
    }
    let h = blockHeight;
    if (y < 0) {
      h -= ys;
    }
    if (y > this.height - blockHeight) {
      h -= (y + blockHeight - this.height);
    }
    if (x < 0) { x = 0; }
    if (y < 0) { y = 0; }

    let i = y * this.width + x;
    for (let yi = 0; yi < h; ++yi) {
        for (let xi = 0; xi < w; ++xi) {
          this.buffer[i + xi] = colors[(yi + ys) * blockWidth + (xi + xs)];
      }
      i += this.width;
    }
  }

  setPixelByIndex(index, color) {
    if (this.__isValidIndex(index)) {
      this.buffer[index] = color;
    }
  }

  getPixel(x, y) {
    if (this.__isValidCoordinate(x, y)) {
      return this.buffer[x + y * this.width];
    }
    return null;
  }

  getPixels() {
    return this.buffer.slice();
  }

  getPixelBlock(x, y, blockWidth, blockHeight) {
    if (x < 0 || x > this.width - blockWidth || y < 0 || y > this.height - blockHeight) {
      return [];
    }
    let colors = [];
    for (let yi = 0; yi < blockHeight; ++yi) {
      for (let xi = 0; xi < blockWidth; ++xi) {
        colors.push(this.buffer[(yi + y) * this.width + (x + xi)]);
      }
    }
    return colors;
  }

  getPixelByIndex(index) {
    if (this.__isValidIndex(index)) {
      return this.buffer[index];
    }
    return null;
  }

  getPixelBuffer() {
    return this.buffer;
  }

  render(context, customRenderFunc = null) {
    const width = this.width;
    const height = this.height;
    const offsetX = this.pixelSize.x + this.padding.x;
    const offsetY = this.pixelSize.y + this.padding.y;
    const renderFunc = customRenderFunc || this.__drawRect;
    const yy = this.offset.y + this.margin.y;
    const xx = this.offset.x + this.margin.x;
    for (let yi = 0; yi < height; ++yi) {
      const y = yy + yi * offsetY;
      for (let xi = 0; xi < width; ++xi) {
        const x = xx + xi * offsetX;
        const color = this.buffer[yi * width + xi];
        if (color !== null) {
          renderFunc(context, x, y, this.pixelSize.x, this.pixelSize.y, color);
        }
      }
    }
  }

  setOffset(offset) {
    this.offset.x = offset.x;
    this.offset.y = offset.y;
  }

  centerInRect(rect) {
    const totalSize = this.__getTotalSizeInPixels();
    const xt = Math.floor((rect.width - totalSize.x) / 2);
    const yt = Math.floor((rect.height - totalSize.y) / 2);
    this.offset.x = rect.x + xt;
    this.offset.y = rect.y + yt;
  }

  __drawRect(context, x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
  }

  __isValidCoordinate(x, y) {
    if (x < 0 || x >= this.width) return false;
    if (y < 0 || y >= this.height) return false;
    return true;
  }

  __isValidIndex(index) {
    return (index > 0 && index < this.buffer.length);
  }

  __getTotalSizeInPixels() {
    return {
      x: this.width * this.pixelSize.x + (this.width - 1) * this.padding.x + 2 * this.margin.x,
      y: this.height * this.pixelSize.y + (this.height - 1) * this.padding.y + 2 * this.margin.y,
    }
  }

  static calcMinCanvasSize(config) {
    const margin = config.margin || { x: 0, y: 0 }
    const padding = config.padding || { x: 1, y: 1 }
    const offset = config.topLeftOffset || { x: 0, y: 0 }
    return {
      width: config.width * config.pixelSize.x + (config.width - 1) * padding.x + 2 * margin.x + offset.x,
      height: config.height * config.pixelSize.y + (config.height - 1) * padding.y + 2 * margin.y + offset.y,
    }
  }
}
