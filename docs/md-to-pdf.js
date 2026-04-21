/**
 * Script para exportar archivos Markdown a PDF
 * Uso: node docs/md-to-pdf.js [archivo.md] [archivo2.md ...]
 * Sin argumentos exporta VERSION.md y USUARIO.md
 */
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { marked } = require("marked");

const DOCS_DIR = __dirname;

// Configuracion de estilos
const STYLES = {
	page: { margin: 50, size: "A4" },
	h1: { fontSize: 20, font: "Helvetica-Bold", spacing: 14 },
	h2: { fontSize: 16, font: "Helvetica-Bold", spacing: 12 },
	h3: { fontSize: 13, font: "Helvetica-Bold", spacing: 10 },
	h4: { fontSize: 11, font: "Helvetica-Bold", spacing: 8 },
	p: { fontSize: 10, font: "Helvetica", spacing: 6 },
	strong: { font: "Helvetica-Bold" },
	code: { font: "Courier", fontSize: 9 },
	li: { fontSize: 10, font: "Helvetica", spacing: 4 },
	hr: { spacing: 10 },
	table: { fontSize: 9, font: "Helvetica", headerFont: "Helvetica-Bold", cellPadding: 5, rowHeight: 18 },
};

function stripHtml(text) {
	return text
		.replace(/<[^>]+>/g, "")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
}

function renderTable(doc, token) {
	const { cellPadding, rowHeight, fontSize, font, headerFont } = STYLES.table;
	const pageWidth = doc.page.width - STYLES.page.margin * 2;

	const headers = token.header.map((h) => stripHtml(marked.parseInline(h.text || h.tokens?.map((t) => t.raw).join("") || "")));
	const rows = token.rows.map((row) => row.map((cell) => stripHtml(marked.parseInline(cell.text || cell.tokens?.map((t) => t.raw).join("") || ""))));

	const colCount = headers.length;
	const colWidth = pageWidth / colCount;

	// Header
	let y = doc.y;
	doc.font(headerFont).fontSize(fontSize);
	doc.rect(STYLES.page.margin, y, pageWidth, rowHeight).fill("#e0e0e0").stroke("#cccccc");
	doc.fill("#000000");
	headers.forEach((h, i) => {
		doc.text(h, STYLES.page.margin + i * colWidth + cellPadding, y + 4, {
			width: colWidth - cellPadding * 2,
			height: rowHeight,
			ellipsis: true,
		});
	});
	y += rowHeight;

	// Rows
	doc.font(font).fontSize(fontSize);
	rows.forEach((row, ri) => {
		if (y + rowHeight > doc.page.height - STYLES.page.margin) {
			doc.addPage();
			y = STYLES.page.margin;
		}
		const bg = ri % 2 === 0 ? "#ffffff" : "#f5f5f5";
		doc.rect(STYLES.page.margin, y, pageWidth, rowHeight).fill(bg).stroke("#cccccc");
		doc.fill("#000000");
		row.forEach((cell, i) => {
			doc.text(cell, STYLES.page.margin + i * colWidth + cellPadding, y + 4, {
				width: colWidth - cellPadding * 2,
				height: rowHeight,
				ellipsis: true,
			});
		});
		y += rowHeight;
	});

	doc.y = y + 8;
	doc.x = STYLES.page.margin;
}

function renderCodeBlock(doc, text) {
	const lines = text.replace(/\n$/, "").split("\n");
	const lineHeight = 12;
	const blockHeight = lines.length * lineHeight + 16;
	const pageWidth = doc.page.width - STYLES.page.margin * 2;

	if (doc.y + blockHeight > doc.page.height - STYLES.page.margin) {
		doc.addPage();
	}

	const startY = doc.y;
	doc.rect(STYLES.page.margin, startY, pageWidth, blockHeight).fill("#f4f4f4").stroke("#dddddd");
	doc.fill("#000000").font(STYLES.code.font).fontSize(STYLES.code.fontSize);

	lines.forEach((line, i) => {
		doc.text(line, STYLES.page.margin + 8, startY + 8 + i * lineHeight, {
			width: pageWidth - 16,
		});
	});

	doc.y = startY + blockHeight + 8;
	doc.x = STYLES.page.margin;
}

function renderInlineText(doc, text, baseStyle) {
	// Render text with bold segments
	const parts = text.split(/(\*\*[^*]+\*\*)/g);
	parts.forEach((part) => {
		if (part.startsWith("**") && part.endsWith("**")) {
			doc.font(STYLES.strong.font).text(part.slice(2, -2), { continued: true });
			doc.font(baseStyle.font);
		} else if (part.startsWith("`") && part.endsWith("`")) {
			doc.font(STYLES.code.font).text(part.slice(1, -1), { continued: true });
			doc.font(baseStyle.font);
		} else {
			doc.text(part, { continued: true });
		}
	});
	doc.text("", { continued: false }); // line break
}

function convertMdToPdf(inputFile, outputFile) {
	const markdown = fs.readFileSync(inputFile, "utf-8");
	const tokens = marked.lexer(markdown);

	const doc = new PDFDocument({
		size: STYLES.page.size,
		margin: STYLES.page.margin,
		bufferPages: true,
	});
	const stream = fs.createWriteStream(outputFile);
	doc.pipe(stream);

	tokens.forEach((token) => {
		// Check page break needed
		if (doc.y > doc.page.height - STYLES.page.margin - 40) {
			doc.addPage();
		}

		switch (token.type) {
			case "heading": {
				const style = STYLES[`h${token.depth}`] || STYLES.h4;
				doc.moveDown(0.5);
				doc.font(style.font).fontSize(style.fontSize);
				doc.text(stripHtml(token.text));
				doc.moveDown(0.3);
				break;
			}
			case "paragraph": {
				const style = STYLES.p;
				doc.font(style.font).fontSize(style.fontSize);
				const cleaned = stripHtml(token.text);
				renderInlineText(doc, cleaned, style);
				doc.moveDown(0.3);
				break;
			}
			case "list": {
				const style = STYLES.li;
				doc.font(style.font).fontSize(style.fontSize);
				token.items.forEach((item) => {
					const bullet = token.ordered ? `${item.index || "•"}.` : "•";
					const text = stripHtml(item.text);
					doc.text(`  ${bullet} ${text}`, { indent: 10 });
				});
				doc.moveDown(0.3);
				break;
			}
			case "table": {
				renderTable(doc, token);
				break;
			}
			case "code": {
				renderCodeBlock(doc, token.text);
				break;
			}
			case "hr": {
				doc.moveDown(0.3);
				const y = doc.y;
				doc.moveTo(STYLES.page.margin, y).lineTo(doc.page.width - STYLES.page.margin, y).stroke("#cccccc");
				doc.moveDown(0.5);
				break;
			}
			case "space": {
				doc.moveDown(0.2);
				break;
			}
		}
	});

	doc.end();
	return new Promise((resolve, reject) => {
		stream.on("finish", () => resolve(outputFile));
		stream.on("error", reject);
	});
}

async function main() {
	let files = process.argv.slice(2);

	if (files.length === 0) {
		files = ["VERSION.md", "USUARIO.md"];
	}

	for (const file of files) {
		const inputPath = path.isAbsolute(file) ? file : path.join(DOCS_DIR, file);
		const outputPath = inputPath.replace(/\.md$/i, ".pdf");

		if (!fs.existsSync(inputPath)) {
			console.error(`No se encontro: ${inputPath}`);
			continue;
		}

		try {
			const result = await convertMdToPdf(inputPath, outputPath);
			console.log(`PDF generado: ${result}`);
		} catch (err) {
			console.error(`Error generando ${outputPath}:`, err.message);
		}
	}
}

main();
