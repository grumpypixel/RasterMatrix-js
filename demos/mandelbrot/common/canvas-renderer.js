/* canvas-renderer.js */

class CanvasRenderer {
	static drawText(context, x, y, text, color, align, font) {
		context.font = font || "16px Verdana";
		context.fillStyle = color || "#888";
		context.textAlign = align || "center";
		context.fillText(text, x, y);
	}
}
