import {filterExistingMreids, getWikidataItemsForLinks} from './wdapi';
import {queryEntitiesApi, allLanguageCodes} from './kgapi';

type LangString = {lang: string; text: string};

export type SearchItem = {
	id: string;
	name?: LangString;
	description?: LangString;
	detailedDescription?: LangString;
	url?: string;
	wikipedia?: string;
	score: number;
};

export type SearchOptions = {
	query: string;
	languages?: Array<{value: string; label: string}>;
	types?: Array<{value: string; label: string}>;
	withWikipedia: boolean;
	withWikidata: boolean;
};

export const search = async ({
	query, languages, types, withWikipedia, withWikidata,
}: SearchOptions) => {
	const languageCodes: string[] = languages?.length
		? languages.map(element => element.value)
		: allLanguageCodes;
	const typeCodes: string[] | undefined = types?.length
		? types.map(element => element.value)
		: undefined;

	const rawItems = await queryEntitiesApi({
		query,
		limit: 500,
		languages: languageCodes,
		types: typeCodes,
	});

	const items: SearchItem[] = [];

	for (const item of rawItems) {
		const id = item.id;

		const names: Record<string, string> = {};
		for (const {language, value} of item.name) {
			names[language] = value;
		}

		const nameLang = languageCodes.find((element: string) => element in names);
		const name: LangString | undefined = nameLang
			? {lang: nameLang, text: names[nameLang]}
			: undefined;

		const descriptions: Record<string, string> = {};
		for (const {language, value} of item.description) {
			descriptions[language] = value;
		}

		const descriptionLang = languageCodes.find(
			(element: string) => element in descriptions,
		);
		let description: LangString | undefined = descriptionLang
			? {
				lang: descriptionLang,
				text: descriptions[descriptionLang],
			}
			: undefined;

		if (!description && item.type?.length) {
			description = {
				lang: 'en',
				text: item.type.filter(element => element !== 'Thing').join(', '),
			};
		}

		const articles: Record<
		string, {
			articleBody: string;
			url: string;
		}
		> = {};

		for (const {
			inLanguage, articleBody, url,
		} of item.detailedDescription) {
			articles[inLanguage] = {articleBody, url};
		}

		const articleLang = languageCodes.find(
			(element: string) => element in articles,
		)!;
		const article = articles[articleLang];
		const detailedDescription: LangString | undefined = article
			? {lang: articleLang, text: article.articleBody}
			: undefined;
		const wikipedia = article?.url;
		const url = item.url;
		const score = item.resultScore;

		if (!withWikipedia || (withWikipedia && wikipedia)) {
			items.push({
				id,
				name,
				description,
				detailedDescription,
				url,
				wikipedia,
				score,
			});
		}
	}

	if (withWikidata && items.length > 0) {
		const wdMreids = await filterExistingMreids(
			items.map(element => element.id),
		);
		return items.filter(element => wdMreids.has(element.id));
	}

	return items;
};

export type QuickStatement = {qid: string; prop: string; value: string};

export const fetchWikidata = async (itemsPromise: Promise<SearchItem[]>) => {
	const items = await itemsPromise;
	const wikilinks = items
		.map(element => element.wikipedia)
		.filter(Boolean) as string[];
	const wikidataItems = await getWikidataItemsForLinks(wikilinks);

	const wdWikilinks = new Set(wikidataItems.map(element => element.article));
	const notMapped = wikilinks.filter(element => !wdWikilinks.has(element));
	if (notMapped.length > 0) {
		console.warn(
			`Not mapped ${notMapped.length} links:`,
			notMapped.join('\n'),
		);
	}

	const wikilinksToWikidata: Record<string, Set<string>> = {};
	for (const item of wikidataItems) {
		if (item.article in wikilinksToWikidata) {
			wikilinksToWikidata[item.article].add(item.item);
		} else {
			wikilinksToWikidata[item.article] = new Set([item.item]);
		}
	}

	// Calculate missing statements
	const wikidataItemsMreids: Record<string, Set<string>> = {};
	for (const item of wikidataItems) {
		if (item.mreid) {
			if (item.item in wikilinksToWikidata) {
				wikidataItemsMreids[item.item].add(item.mreid);
			} else {
				wikidataItemsMreids[item.item] = new Set([item.mreid]);
			}
		} else {
			wikidataItemsMreids[item.item] = new Set();
		}
	}

	let newStatements: QuickStatement[] = [];

	for (const item of items) {
		if (item.wikipedia && wikilinksToWikidata[item.wikipedia]) {
			for (const wikidataUri of wikilinksToWikidata[item.wikipedia]) {
				if (wikidataItemsMreids[wikidataUri]
                    && !wikidataItemsMreids[wikidataUri].has(item.id)) {
					const qid = (/^http:\/\/www\.wikidata\.org\/entity\/(.+)$/.exec(wikidataUri))?.[1];
					// eslint-disable-next-line max-depth
					if (!qid) {
						console.warn(
							`Unable to extract qid from url: ${wikidataUri}`,
						);
						continue;
					}

					const prop = item.id.startsWith('/m/')
						? 'P646'
						: 'P2671';
					newStatements.push({qid, prop, value: item.id});
				}
			}
		}
	}

	// Enforce unique constraint
	const insertableMreids = new Set(newStatements.map(element => element.value));
	const existingMreids = await filterExistingMreids([
		...insertableMreids,
	]);
	newStatements = newStatements.filter(
		element => !existingMreids.has(element.value),
	);

	return {wikilinksToWikidata, newStatements};
};
