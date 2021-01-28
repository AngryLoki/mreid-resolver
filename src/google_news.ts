import { encode as encode_varint_ex } from "varint";

const VARINT = 0x0
const LENGTH_DELIMITED = 0x2

function asField(field_num: number, wire_type: number, value: Uint8Array) {
    return new Uint8Array([(field_num << 3) | wire_type, ...value]);
}

function asString(x: Uint8Array) {
    return new Uint8Array([x.length, ...x]);
}

function asVarint(int: number) {
    return new Uint8Array(encode_varint_ex(int));
}

export function encodeBase64Nopad(bytes: Uint8Array) {
    let u8 = new Uint8Array(bytes);
    let decoder = new TextDecoder('utf8');
    let b64encoded = btoa(decoder.decode(u8));
    return b64encoded.replace(/=+$/, "");
}

export function buildTopicId(mreid: string, lang: string) {
    let enc = new TextEncoder();

    const entity_meta = new Uint8Array([
        ...asField(1, LENGTH_DELIMITED, asString(enc.encode(mreid))),
        ...asField(2, LENGTH_DELIMITED, asString(enc.encode(lang)))
    ]);

    const entity = new Uint8Array([
        ...asField(1, VARINT, asVarint(16)),
        ...asField(2, LENGTH_DELIMITED, asString(entity_meta)),
        ...asField(5, VARINT, asVarint(0))
    ])

    const entity_b64 = encodeBase64Nopad(entity);

    const topic_meta = new Uint8Array([
        ...asField(1, VARINT, asVarint(10)),
        ...asField(4, LENGTH_DELIMITED, asString(enc.encode(entity_b64))),
        ...asField(10, VARINT, asVarint(1))
    ]);

    const topic = new Uint8Array([
        ...asField(1, VARINT, asVarint(0)),
        ...asField(5, LENGTH_DELIMITED, asString(topic_meta))
    ]);

    return encodeBase64Nopad(topic);
}
