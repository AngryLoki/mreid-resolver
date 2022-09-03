export const queryWikidata = async (query: string) => {
	const sparql = 'https://query.wikidata.org/sparql';

	const response = await fetch(sparql, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			Accept: 'application/sparql-results+json',
		},
		body: new URLSearchParams({query}).toString(),
	});

	if (!response.ok) {
		throw new Error('Internal error, examine the console output');
	}

	const responseBody = await response.json() as {results: {bindings: Array<Record<string, {type: string; value: string}>>}};
	return responseBody.results.bindings;
};

export const getWikidataItemsForLinks = async (links: string[]) => {
	if (links.length === 0) {
		return [];
	}

	const articles = links.map(element => '<' + element + '>').join(' ');
	const query = `SELECT DISTINCT ?article ?item ?mreid WHERE {
        VALUES ?article {${articles}} .
        ?article schema:about ?item .
        OPTIONAL { ?item wdt:P646|wdt:P2671 ?mreid }
        # MINUS { ?item wdt:P31 wd:Q4167410 }
      }`;
	const results = await queryWikidata(query);
	return results.map(({article, item, mreid}) => ({article: article.value, item: item.value, mreid: mreid?.value}));
};

export const filterExistingMreids = async (mreids: string[]) => {
	if (mreids.length === 0) {
		return new Set();
	}

	const gIds = mreids.filter(element => element.startsWith('/g/'));
	const mIds = mreids.filter(element => element.startsWith('/m/'));

	const queryParts: string[] = [];

	if (gIds.length > 0) {
		queryParts.push(
			`{VALUES ?id {${gIds
				.map(element => `"${element}"`)
				.join(' ')}} ?item wdt:P2671 ?id}`,
		);
	}

	if (mIds.length > 0) {
		queryParts.push(
			`{VALUES ?id {${mIds
				.map(element => `"${element}"`)
				.join(' ')}} ?item wdt:P646 ?id}`,
		);
	}

	const query = queryParts.length === 2 ? `SELECT ?id WHERE {${queryParts[0]} UNION ${queryParts[1]}}` : `SELECT ?id WHERE ${queryParts[0]}`;

	const wdItems = await queryWikidata(query);
	return new Set(wdItems.map(element => element.id.value));
};
