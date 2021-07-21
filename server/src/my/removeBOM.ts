import * as isUtf8 from 'is-utf8';

function removeBomBuffer(buffer) {
    if (!Buffer.isBuffer(buffer)) {
        throw new TypeError(`Expected a Buffer, got ${typeof buffer}`);
    }

    if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF && isUtf8(buffer)) {
        return buffer.slice(3);
    }

    return buffer;
};

function stripBom(string) {
    if (typeof string !== 'string') {
        throw new TypeError(`Expected a string, got ${typeof string}`);
    }

    // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
    // conversion translates it to FEFF (UTF-16 BOM).
    if (string.charCodeAt(0) === 0xFEFF) {
        return string.slice(1);
    }

    return string;
}



export function removeBOMFromBuffer(buffer: Buffer): Buffer {
    return <Buffer>removeBomBuffer(buffer);
}

export function removeBOMFromString(line: string): string {
    return stripBom(line.trim());
}