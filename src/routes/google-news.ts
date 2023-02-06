
import varint from 'varint';
import {decode as b64decode, encode as b64encode} from 'universal-base64url';

const kVarint = 0x0;
const kLengthDelimited = 0x2;

// eslint-disable-next-line no-bitwise
const asField = (fieldNumber: number, wireType: number, value: Uint8Array) => new Uint8Array([(fieldNumber << 3) | wireType, ...value]);
const asString = (x: Uint8Array) => new Uint8Array([x.length, ...x]);
const asVarint = (x: number) => new Uint8Array(varint.encode(x));

const buf64decode = (x: string) => new TextEncoder().encode(b64decode(x));
const buf64encode = (bytes: Uint8Array) => b64encode(new TextDecoder('utf8').decode(bytes));

const readField = (x: Uint8Array) => {
	if (x.length === 0) {
		throw new RangeError('boundary error');
	}

	const ftype = x[0];
	// eslint-disable-next-line no-bitwise
	const fieldNumber = ftype >> 3;
	// eslint-disable-next-line no-bitwise
	const wireType = ftype & 0b111;

	if (wireType === kVarint) {
		const value = varint.decode(x, 1);
		const length = varint.encodingLength(value);
		const remaining = x.slice(1 + length);
		return {fieldNumber, value, remaining};
	}

	if (wireType === kLengthDelimited) {
		const [value, remaining] = readString(x.slice(1));
		return {fieldNumber, value, remaining};
	}

	throw new RangeError('unknow wire type');
};

const readString = (x: Uint8Array): [Uint8Array, Uint8Array] => {
	if (x.length === 0) {
		throw new RangeError('boundary error');
	}

	const length = x[0];
	if (x.length < 1 + length) {
		throw new RangeError('boundary error');
	}

	return [x.slice(1, 1 + length), x.slice(1 + length)];
};

const parseBuffer = (buf: Uint8Array) => {
	const out = new Map<number, Uint8Array | number>();
	while (buf.length > 0) {
		const r = readField(buf);
		out.set(r.fieldNumber, r.value);
		buf = r.remaining;
	}

	return out;
};

export const buildTopicId = (mreid: string, lang: string) => {
	const enc = new TextEncoder();

	const entityMeta = new Uint8Array([
		...asField(1, kLengthDelimited, asString(enc.encode(mreid))),
		...asField(2, kLengthDelimited, asString(enc.encode(lang))),
	]);

	const entity = new Uint8Array([
		...asField(1, kVarint, asVarint(16)),
		...asField(2, kLengthDelimited, asString(entityMeta)),
		...asField(5, kVarint, asVarint(0)),
	]);

	const entityB64 = buf64encode(entity);

	const topicMeta = new Uint8Array([
		...asField(1, kVarint, asVarint(10)),
		...asField(4, kLengthDelimited, asString(enc.encode(entityB64))),
		...asField(10, kVarint, asVarint(1)),
	]);

	const topic = new Uint8Array([
		...asField(1, kVarint, asVarint(0)),
		...asField(5, kLengthDelimited, asString(topicMeta)),
	]);

	return buf64encode(topic);
};

export const parseTopicId = (topic: string) => {
	try {
		const newsRe = /^https?:\/\/news\.google\.com\/topics\/([A-Za-z\d]+).?/;
		if (newsRe.test(topic)) {
			topic = topic.replace(newsRe, '$1');
		}

		const buffer = buf64decode(topic);
		const level1 = parseBuffer(buffer);
		if (!(level1.get(5) instanceof Uint8Array)) {
			return;
		}

		const level2 = parseBuffer(level1.get(5) as Uint8Array);
		if (!(level2.get(4) instanceof Uint8Array)) {
			return;
		}

		const level2buffer = buf64decode(new TextDecoder('utf8').decode(level2.get(4) as Uint8Array));
		const level3 = parseBuffer(level2buffer);

		if (!(level3.get(2) instanceof Uint8Array)) {
			return;
		}

		const level4 = parseBuffer(level3.get(2) as Uint8Array);
		if (level4.get(1) instanceof Uint8Array) {
			return new TextDecoder().decode(level4.get(1) as Uint8Array);
		}
	} catch {
		// Pass
	}
};
