const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Simple CRC32 implementation for PNG chunks
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    for (let j = 0; j < 8; j++) {
      let bit = (byte ^ crc) & 1;
      crc = (crc >>> 1) ^ (bit ? 0xEDB88320 : 0);
      byte >>>= 1;
    }
  }
  return (crc ^ -1) >>> 0;
}

function createPng(width, height, r = 0, g = 102, b = 204, a = 255) {
  const header = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrType = Buffer.from('IHDR');
  const ihdrCrcBuf = Buffer.alloc(4);
  ihdrCrcBuf.writeUInt32BE(crc32(Buffer.concat([ihdrType, ihdrData])), 0);
  const ihdrLen = Buffer.alloc(4);
  ihdrLen.writeUInt32BE(13, 0);
  const ihdrChunk = Buffer.concat([ihdrLen, ihdrType, ihdrData, ihdrCrcBuf]);

  // Raw image pixels
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter type 0
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // IDAT
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatType = Buffer.from('IDAT');
  const idatLen = Buffer.alloc(4);
  idatLen.writeUInt32BE(compressed.length, 0);
  const idatCrcBuf = Buffer.alloc(4);
  idatCrcBuf.writeUInt32BE(crc32(Buffer.concat([idatType, compressed])), 0);
  const idatChunk = Buffer.concat([idatLen, idatType, compressed, idatCrcBuf]);

  // IEND
  const iendType = Buffer.from('IEND');
  const iendLen = Buffer.alloc(4);
  const iendCrcBuf = Buffer.alloc(4);
  iendCrcBuf.writeUInt32BE(crc32(iendType), 0);
  const iendChunk = Buffer.concat([iendLen, iendType, iendCrcBuf]);

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

function createIco(pngBuf, width, height) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry[0] = width >= 256 ? 0 : width;
  entry[1] = height >= 256 ? 0 : height;
  entry[2] = 0;
  entry[3] = 0;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuf.length, 8);
  entry.writeUInt32LE(22, 12);

  return Buffer.concat([header, entry, pngBuf]);
}

function createIcns(png256, png128) {
  const ic08Header = Buffer.alloc(8);
  ic08Header.write('ic08', 0);
  ic08Header.writeUInt32BE(png256.length + 8, 4);
  const ic08Chunk = Buffer.concat([ic08Header, png256]);

  const ic07Header = Buffer.alloc(8);
  ic07Header.write('ic07', 0);
  ic07Header.writeUInt32BE(png128.length + 8, 4);
  const ic07Chunk = Buffer.concat([ic07Header, png128]);

  const totalLen = 8 + ic08Chunk.length + ic07Chunk.length;
  const mainHeader = Buffer.alloc(8);
  mainHeader.write('icns', 0);
  mainHeader.writeUInt32BE(totalLen, 4);

  return Buffer.concat([mainHeader, ic08Chunk, ic07Chunk]);
}

function main() {
  const iconsDir = __dirname;
  const png32 = createPng(32, 32);
  const png128 = createPng(128, 128);
  const png256 = createPng(256, 256);
  const ico = createIco(png32, 32, 32);
  const icns = createIcns(png256, png128);

  fs.writeFileSync(path.join(iconsDir, '32x32.png'), png32);
  fs.writeFileSync(path.join(iconsDir, '128x128.png'), png128);
  fs.writeFileSync(path.join(iconsDir, '128x128@2x.png'), png256);
  fs.writeFileSync(path.join(iconsDir, 'icon.ico'), ico);
  fs.writeFileSync(path.join(iconsDir, 'icon.icns'), icns);

  console.log('Successfully generated all placeholder icons!');
}

main();
