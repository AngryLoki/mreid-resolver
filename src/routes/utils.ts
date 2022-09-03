import {buildTopicId} from './google-news';
import type {QuickStatement} from './search';

export const formatLinkText = (url: string) => {
	try {
		let match = /^https:\/\/([^.]+)\.wikipedia\.org\/wiki\/(.+)$/.exec(url);
		if (match) {
			const lang = match[1];
			const name = decodeURIComponent(match[2]).replace(/_/g, ' ');
			return `${lang}:${name}`;
		}

		match = /^https:\/\/zh\.wikipedia\.org\/(zh-cn|zh-tw)\/(.+)$/.exec(url);
		if (match) {
			const lang = match[1];
			const name = decodeURIComponent(match[2]).replace(/_/g, ' ');
			return `${lang}:${name}`;
		}
	} catch (error: unknown) {
		console.warn(`Unable to parse url ${url} - ${error as string}`);
	}

	return url;
};

export const quickStatementsLink = (statements: QuickStatement[]) => {
	const edits = statements
		.map(element => `${element.qid}|${element.prop}|"${element.value}"`)
		.join('||');
	return (
		'https://quickstatements.toolforge.org/#/v1='
		+ encodeURIComponent(edits)
	);
};

export const gNewsLink = (kgid: string, lang = 'en') =>
	`https://news.google.com/topics/${buildTopicId(
		kgid,
		lang,
	)}?hl=en-US&gl=US&ceid=US:en`;

export const gTrendsLink = (kgid: string, geo: string | undefined = undefined) => {
	let url = `https://trends.google.com/trends/explore?q=${kgid}`;
	if (geo) {
		url += `&geo=${geo}`;
	}

	return url;
};
