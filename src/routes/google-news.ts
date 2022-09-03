import {encode as encode_varint_ex} from 'varint';

// eslint-disable-next-line @typescript-eslint/naming-convention
const VARINT = 0x0;
// eslint-disable-next-line @typescript-eslint/naming-convention
const LENGTH_DELIMITED = 0x2;

function asField(field_number: number, wire_type: number, value: Uint8Array) {
	// eslint-disable-next-line no-bitwise
	return new Uint8Array([(field_number << 3) | wire_type, ...value]);
}

function asString(x: Uint8Array) {
	return new Uint8Array([x.length, ...x]);
}

function asVarint(int: number) {
	return new Uint8Array(encode_varint_ex(int));
}

export function encodeBase64Nopad(bytes: Uint8Array) {
	const u8 = new Uint8Array(bytes);
	const decoder = new TextDecoder('utf8');
	const b64encoded = btoa(decoder.decode(u8));
	return b64encoded.replace(/=+$/, '');
}

export function buildTopicId(mreid: string, lang: string) {
	const enc = new TextEncoder();

	const entityMeta = new Uint8Array([
		...asField(1, LENGTH_DELIMITED, asString(enc.encode(mreid))),
		...asField(2, LENGTH_DELIMITED, asString(enc.encode(lang))),
	]);

	const entity = new Uint8Array([
		...asField(1, VARINT, asVarint(16)),
		...asField(2, LENGTH_DELIMITED, asString(entityMeta)),
		...asField(5, VARINT, asVarint(0)),
	]);

	const entityB64 = encodeBase64Nopad(entity);

	const topicMeta = new Uint8Array([
		...asField(1, VARINT, asVarint(10)),
		...asField(4, LENGTH_DELIMITED, asString(enc.encode(entityB64))),
		...asField(10, VARINT, asVarint(1)),
	]);

	const topic = new Uint8Array([
		...asField(1, VARINT, asVarint(0)),
		...asField(5, LENGTH_DELIMITED, asString(topicMeta)),
	]);

	return encodeBase64Nopad(topic);
}
