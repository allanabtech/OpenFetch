import os
import struct
import zlib

def create_png(width, height, color=(0, 102, 204, 255)):
    """Generate a valid PNG image byte stream in RGBA format without third-party dependencies."""
    png_header = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    # Width (4 bytes), Height (4 bytes), Bit depth (8), Color type (6 RGBA), Compression (0), Filter (0), Interlace (0)
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    ihdr_chunk = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # Raw pixel data: each row begins with 0x00 (no filter) followed by width * 4 RGBA bytes
    r, g, b, a = color
    pixel = bytes([r, g, b, a])
    row = b'\x00' + (pixel * width)
    raw_data = row * height
    
    # IDAT chunk
    idat_compressed = zlib.compress(raw_data, 9)
    idat_crc = zlib.crc32(b'IDAT' + idat_compressed)
    idat_chunk = struct.pack('>I', len(idat_compressed)) + b'IDAT' + idat_compressed + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png_header + ihdr_chunk + idat_chunk + iend_chunk

def create_ico(png_data, width, height):
    """Generate a valid ICO file embedding PNG data."""
    # ICO Header: Reserved (2 bytes=0), Type (2 bytes=1 for Icon), Count (2 bytes=1)
    header = struct.pack('<HHH', 0, 1, 1)
    w_byte = 0 if width >= 256 else width
    h_byte = 0 if height >= 256 else height
    # Entry: Width(1), Height(1), Colors(1=0), Reserved(1=0), Planes(2=1), BPP(2=32), Size(4), Offset(4)
    offset = 6 + 16  # header size (6) + entry size (16)
    entry = struct.pack('<BBBBHHII', w_byte, h_byte, 0, 0, 1, 32, len(png_data), offset)
    return header + entry + png_data

def create_icns(png_data_256, png_data_128):
    """Generate a valid ICNS file containing PNG chunks."""
    ic08_hdr = b'ic08' + struct.pack('>I', len(png_data_256) + 8)
    ic08_chunk = ic08_hdr + png_data_256
    
    ic07_hdr = b'ic07' + struct.pack('>I', len(png_data_128) + 8)
    ic07_chunk = ic07_hdr + png_data_128
    
    total_len = 8 + len(ic08_chunk) + len(ic07_chunk)
    hdr = b'icns' + struct.pack('>I', total_len)
    return hdr + ic08_chunk + ic07_chunk

def generate_all_icons():
    icons_dir = os.path.dirname(os.path.abspath(__file__))
    
    png_32 = create_png(32, 32)
    png_128 = create_png(128, 128)
    png_256 = create_png(256, 256)
    ico = create_ico(png_32, 32, 32)
    icns = create_icns(png_256, png_128)
    
    files = {
        '32x32.png': png_32,
        '128x128.png': png_128,
        '128x128@2x.png': png_256,
        'icon.ico': ico,
        'icon.icns': icns
    }
    
    for filename, data in files.items():
        filepath = os.path.join(icons_dir, filename)
        with open(filepath, 'wb') as f:
            f.write(data)
        print(f"Generated {filename} ({len(data)} bytes)")

if __name__ == '__main__':
    generate_all_icons()
