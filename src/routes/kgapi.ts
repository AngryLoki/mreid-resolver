const entitiesApi = 'https://kgsearch.googleapis.com/v1/entities:search';
const apiKey = import.meta.env.VITE_KG_API_KEY as string;

// Maps log active users from https://en.wikipedia.org/wiki/List_of_Wikipedias
export const allLanguages: Array<{code: string; name: string; score: number}> = [
	{code: 'ar', name: 'Arabic', score: 3},
	{code: 'bg', name: 'Bulgarian', score: 2},
	{code: 'bn', name: 'Bengali', score: 3},
	{code: 'ca', name: 'Catalan', score: 3},
	{code: 'cs', name: 'Czech', score: 3},
	{code: 'da', name: 'Danish', score: 2},
	{code: 'de', name: 'German', score: 4},
	{code: 'el', name: 'Greek', score: 3},
	{code: 'en', name: 'English', score: 5},
	{code: 'es', name: 'Spanish', score: 4},
	{code: 'eu', name: 'Basque', score: 2},
	{code: 'fa', name: 'Persian', score: 3},
	{code: 'fi', name: 'Finnish', score: 3},
	{code: 'fr', name: 'French', score: 4},
	{code: 'ga', name: 'Irish', score: 1},
	{code: 'gl', name: 'Galician', score: 2},
	{code: 'hi', name: 'Hindi', score: 3},
	{code: 'hr', name: 'Croatian', score: 2},
	{code: 'hu', name: 'Hungarian', score: 3},
	{code: 'hy', name: 'Armenian', score: 2},
	{code: 'id', name: 'Indonesian', score: 3},
	{code: 'is', name: 'Icelandic', score: 2},
	{code: 'it', name: 'Italian', score: 3},
	{code: 'iw', name: 'Hebrew', score: 3},
	{code: 'ja', name: 'Japanese', score: 4},
	{code: 'km', name: 'Khmer', score: 1},
	{code: 'ko', name: 'Korean', score: 3},
	{code: 'lo', name: 'Lao', score: 1},
	{code: 'lt', name: 'Lithuanian', score: 2},
	{code: 'lv', name: 'Latvian', score: 2},
	{code: 'nl', name: 'Dutch', score: 3},
	{code: 'no', name: 'Norwegian', score: 3},
	{code: 'pl', name: 'Polish', score: 3},
	{code: 'pt', name: 'Portuguese', score: 4},
	{code: 'ro', name: 'Romanian', score: 2},
	{code: 'ru', name: 'Russian', score: 4},
	{code: 'sk', name: 'Slovak', score: 2},
	{code: 'sl', name: 'Slovene', score: 2},
	{code: 'sq', name: 'Albanian', score: 2},
	{code: 'sr', name: 'Serbian', score: 2},
	{code: 'sv', name: 'Swedish', score: 3},
	{code: 'th', name: 'Thai', score: 2},
	{code: 'tr', name: 'Turkish', score: 3},
	{code: 'uk', name: 'Ukrainian', score: 3},
	{code: 'vi', name: 'Vietnamese', score: 3},
	{code: 'zh', name: 'Chinese', score: 3},
];

export const allLanguageCodes = allLanguages
	.sort((left, right) => {
		if (left.score < right.score) {
			return 1;
		}

		if (left.score > right.score) {
			return -1;
		}

		if (left.name > right.name) {
			return 1;
		}

		if (left.name < right.name) {
			return -1;
		}

		return 0;
	})
	.map(element => element.code);

export const allTypes = [
	{value: 'Action', label: 'Action'},
	{value: 'AdministrativeArea', label: 'Administrative area'},
	{value: 'Airline', label: 'Airline'},
	{value: 'Airport', label: 'Airport'},
	{value: 'AmusementPark', label: 'Amusement park'},
	{value: 'Article', label: 'Article'},
	{value: 'BarOrPub', label: 'Bar or pub'},
	{value: 'Blog', label: 'Blog'},
	{value: 'BlogPosting', label: 'Blog posting'},
	{value: 'BodyOfWater', label: 'Body of water'},
	{value: 'Book', label: 'Book'},
	{value: 'BookSeries', label: 'Book series'},
	{value: 'Brand', label: 'Brand'},
	{value: 'Bridge', label: 'Bridge'},
	{value: 'BroadcastChannel', label: 'Broadcast channel'},
	{value: 'BroadcastService', label: 'Broadcast service'},
	{value: 'BusStation', label: 'Bus station'},
	{value: 'CableOrSatelliteProvider', label: 'Cable or satellite provider'},
	{value: 'Car', label: 'Car'},
	{value: 'Cemetery', label: 'Cemetery'},
	{value: 'City', label: 'City'},
	{value: 'CivicStructure', label: 'Civic structure'},
	{value: 'CollegeOrUniversity', label: 'College or university'},
	{value: 'Continent', label: 'Continent'},
	{value: 'Corporation', label: 'Corporation'},
	{value: 'Country', label: 'Country'},
	{value: 'CreativeWork', label: 'Creative work'},
	{value: 'DefenceEstablishment', label: 'Defence establishment'},
	{value: 'Diet', label: 'Diet'},
	{value: 'EducationalOrganization', label: 'Educational organization'},
	{value: 'Event', label: 'Event'},
	{value: 'Game', label: 'Game'},
	{value: 'GovernmentOrganization', label: 'Government organization'},
	{value: 'GovernmentPermit', label: 'Government permit'},
	{value: 'GovernmentService', label: 'Government service'},
	{value: 'Hospital', label: 'Hospital'},
	{value: 'ImageObject', label: 'Image object'},
	{value: 'ItemList', label: 'Item list'},
	{value: 'InsuranceAgency', label: 'Insurance agency'},
	{value: 'LakeBodyOfWater', label: 'Lake body of water'},
	{value: 'LandmarksOrHistoricalBuildings', label: 'Landmarks or historical buildings'},
	{value: 'LocalBusiness', label: 'Local business'},
	{value: 'LodgingBusiness', label: 'Lodging business'},
	{value: 'MediaObject', label: 'Media object'},
	{value: 'MobileApplication', label: 'Mobile application'},
	{value: 'Movie', label: 'Movie'},
	{value: 'MovieSeries', label: 'Movie series'},
	{value: 'MovieTheater', label: 'Movie theater'},
	{value: 'Museum', label: 'Museum'},
	{value: 'MusicAlbum', label: 'Music album'},
	{value: 'MusicComposition', label: 'Music composition'},
	{value: 'MusicGroup', label: 'Music group'},
	{value: 'MusicRecording', label: 'Music recording'},
	{value: 'MusicRelease', label: 'Music release'},
	{value: 'MusicVenue', label: 'Music venue'},
	{value: 'Organization', label: 'Organization'},
	{value: 'Periodical', label: 'Periodical'},
	{value: 'Person', label: 'Person'},
	{value: 'Place', label: 'Place'},
	{value: 'PlaceOfWorship', label: 'Place of worship'},
	{value: 'PostalAddress', label: 'Postal address'},
	{value: 'Product', label: 'Product'},
	{value: 'ProductModel', label: 'Product model'},
	{value: 'ProgramMembership', label: 'Program membership'},
	{value: 'RadioEpisode', label: 'Radio episode'},
	{value: 'RadioSeries', label: 'Radio series'},
	{value: 'RadioStation', label: 'Radio station'},
	{value: 'Recipe', label: 'Recipe'},
	{value: 'Restaurant', label: 'Restaurant'},
	{value: 'RiverBodyOfWater', label: 'River body of water'},
	{value: 'ScholarlyArticle', label: 'Scholarly article'},
	{value: 'School', label: 'School'},
	{value: 'SingleFamilyResidence', label: 'Single family residence'},
	{value: 'SoftwareApplication', label: 'Software application'},
	{value: 'SoftwareSourceCode', label: 'Software source code'},
	{value: 'SportsOrganization', label: 'Sports organization'},
	{value: 'SportsTeam', label: 'Sports team'},
	{value: 'StadiumOrArena', label: 'Stadium or arena'},
	{value: 'TelevisionChannel', label: 'Television channel'},
	{value: 'TheaterGroup', label: 'Theater group'},
	{value: 'Thing', label: 'Thing'},
	{value: 'TouristAttraction', label: 'Tourist attraction'},
	{value: 'TVEpisode', label: 'TV episode'},
	{value: 'TVSeason', label: 'TV season'},
	{value: 'TVSeries', label: 'TV series'},
	{value: 'VideoGame', label: 'Video game'},
	{value: 'VideoGameSeries', label: 'Video game series'},
	{value: 'VisualArtwork', label: 'Visual artwork'},
	{value: 'WebSite', label: 'Website'},
	{value: 'Winery', label: 'Winery'},
	{value: 'Zoo', label: 'Zoo'},
];

const cleanup = (line: string) => {
	if (!line || !line.includes('&')) {
		return line;
	}

	return line
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&apos;/g, '\'')
		.replace(/&quot;/g, '"');
};

type EntitySearchResult = {
	id: string;
	type: string[];
	name: Array<{language: string; value: string}>;
	description: Array<{language: string; value: string}>;
	detailedDescription: Array<{inLanguage: string; articleBody: string; license: string; url: string}>;
	resultScore: number;
	url?: string;
	image?: {contentUrl: string; url: string; license: string};
};

type QueryEntitiesApiOptions = {
	query?: string;
	ids?: string[];
	languages?: string[];
	types?: string[];
	limit?: number;
};

export const queryEntitiesApi = async ({query, ids, languages, types, limit}: QueryEntitiesApiOptions) => {
	const parameters = [['key', apiKey]];
	if (query?.length) {
		parameters.push(['query', query]);
	}

	if (ids?.length) {
		parameters.push(...ids.map(element => ['ids', element]));
	}

	if (languages?.length) {
		parameters.push(...languages.map(element => ['languages', element]));
	}

	if (types?.length) {
		parameters.push(...types.map(element => ['types', element]));
	}

	if (limit) {
		parameters.push(['limit', limit.toString()]);
	}

	const response = await fetch(entitiesApi + '?' + new URLSearchParams(parameters).toString());
	if (!response.ok) {
		throw new Error('Internal error, examine the console output');
	}

	const responseBody = await response.json() as Record<string, any>;
	const itemList = responseBody.itemListElement as Array<{result: Record<string, any>; resultScore: number}>;
	if (itemList.length === 0) {
		return [];
	}

	const out: EntitySearchResult[] = [];

	const defaultLanguage = languages?.length ? languages[0] : 'en';

	for (const {result, resultScore} of itemList) {
		const id = (result['@id'] as string).split(':')[1];
		const type = (result['@type'] as string[]) || [];

		let name: Array<{language: string; value: string}> = [];
		if (result.name) {
			name = Array.isArray(result.name)
				? result.name.map(
					(element: any) => ({
						language: element['@language'] as string,
						value: cleanup(element['@value']),
					}),
				)
				: [{language: defaultLanguage, value: cleanup(result.name)}];
		}

		let description: Array<{language: string; value: string}> = [];
		if (result.description) {
			description = Array.isArray(result.description)
				? result.description.map((element: any) => ({
					language: element['@language'] as string,
					value: cleanup(element['@value']),
				}))
				: [{language: defaultLanguage, value: cleanup(result.description)}];
		}

		let detailedDescription: Array<{inLanguage: string; articleBody: string; license: string; url: string}> = [];
		if (result.detailedDescription) {
			if (Array.isArray(result.detailedDescription)) {
				detailedDescription = result.detailedDescription.map((element: any) => ({
					inLanguage: element.inLanguage as string,
					articleBody: cleanup(element.articleBody),
					license: element.license as string,
					url: (element.url as string).replace(/'/g, '%27'),
				}));
			} else {
				detailedDescription = [{
					inLanguage: defaultLanguage,
					articleBody: cleanup(result.detailedDescription.articleBody),
					license: result.detailedDescription.license as string,
					url: (result.detailedDescription.url as string).replace(/'/g, '%27'),
				}];
			}
		}

		const url = result.url as string;
		const image = result.image as {contentUrl: string; url: string; license: string};

		out.push({id, type, name, description, detailedDescription, resultScore, image, url});
	}

	return out;
};

export type LangData = {
	name?: string;
	description?: string;
	detailedDescription?: {
		text: string;
		license: string;
		url: string;
	};
};

export type ItemContent = {
	kgid: string;
	type: string[];
	image?: {src: string; url: string};
	url?: string;
	itemData: Map<string, LangData>;
};

export const loadContent = async (kgid: string): Promise<ItemContent | undefined> => {
	const itemList = await queryEntitiesApi({
		ids: [kgid],
		limit: 1,
		languages: allLanguages.map(element => element.code),
	});
	if (itemList.length === 0) {
		return;
	}

	const item = itemList[0];

	const itemData: Record<string, LangData> = {};

	for (const name of item.name) {
		const language = name.language;
		if (!(language in itemData)) {
			itemData[language] = {};
		}

		itemData[language].name = name.value;
	}

	for (const {language, value} of item.description) {
		if (!(language in itemData)) {
			itemData[language] = {};
		}

		itemData[language].description = value;
	}

	for (const detailedDescription of item.detailedDescription) {
		const language = detailedDescription.inLanguage;
		if (!(language in itemData)) {
			itemData[language] = {};
		}

		itemData[language].detailedDescription = {
			text: detailedDescription.articleBody,
			license: detailedDescription.license,
			url: detailedDescription.url,
		};
	}

	const image = item.image
		? {src: item.image.contentUrl, url: item.image.url}
		: undefined;

	const langScores: Record<string, number> = Object.fromEntries(allLanguages.map(
		x => [x.code, x.score],
	));

	const sortedItems = new Map(
		Object.entries(itemData).sort((a, b) => {
			// Prefer items with detailed description
			const detA = Boolean(a[1].detailedDescription);
			const detB = Boolean(b[1].detailedDescription);
			if (detA > detB) {
				return -1;
			}

			if (detA < detB) {
				return 1;
			}

			// Prefer items with higher language rank
			const langA = a[0].split('-')[0];
			const langB = b[0].split('-')[0];
			const rankA = langScores[langA] || 0;
			const rankB = langScores[langB] || 0;
			if (rankA > rankB) {
				return -1;
			}

			if (rankA < rankB) {
				return 1;
			}

			// Sort by key
			if (a[0] > b[0]) {
				return 1;
			}

			if (a[0] < b[0]) {
				return -1;
			}

			return 0;
		}),
	);

	const type = item.type.sort();

	return {
		kgid: item.id,
		type,
		image,
		url: item.url,
		itemData: sortedItems,
	};
};
