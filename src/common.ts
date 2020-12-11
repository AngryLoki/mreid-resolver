// maps log active users from https://en.wikipedia.org/wiki/List_of_Wikipedias
export const allLanguages: { code: string, name: string; score: number }[] = [
    { code: "ar", name: "Arabic", score: 3 },
    { code: "bg", name: "Bulgarian", score: 2 },
    { code: "bn", name: "Bengali", score: 3 },
    { code: "ca", name: "Catalan", score: 3 },
    { code: "cs", name: "Czech", score: 3 },
    { code: "da", name: "Danish", score: 2 },
    { code: "de", name: "German", score: 4 },
    { code: "el", name: "Greek", score: 3 },
    { code: "en", name: "English", score: 5 },
    { code: "es", name: "Spanish", score: 4 },
    { code: "eu", name: "Basque", score: 2 },
    { code: "fa", name: "Persian", score: 3 },
    { code: "fi", name: "Finnish", score: 3 },
    { code: "fr", name: "French", score: 4 },
    { code: "ga", name: "Irish", score: 1 },
    { code: "gl", name: "Galician", score: 2 },
    { code: "hi", name: "Hindi", score: 3 },
    { code: "hr", name: "Croatian", score: 2 },
    { code: "hu", name: "Hungarian", score: 3 },
    { code: "hy", name: "Armenian", score: 2 },
    { code: "id", name: "Indonesian", score: 3 },
    { code: "is", name: "Icelandic", score: 2 },
    { code: "it", name: "Italian", score: 3 },
    { code: "ja", name: "Japanese", score: 4 },
    { code: "km", name: "Khmer", score: 1 },
    { code: "ko", name: "Korean", score: 3 },
    { code: "lo", name: "Lao", score: 1 },
    { code: "lt", name: "Lithuanian", score: 2 },
    { code: "lv", name: "Latvian", score: 2 },
    { code: "nl", name: "Dutch", score: 3 },
    { code: "no", name: "Norwegian", score: 3 },
    { code: "pl", name: "Polish", score: 3 },
    { code: "pt", name: "Portuguese", score: 4 },
    { code: "ro", name: "Romanian", score: 2 },
    { code: "ru", name: "Russian", score: 4 },
    { code: "sk", name: "Slovak", score: 2 },
    { code: "sl", name: "Slovene", score: 2 },
    { code: "sq", name: "Albanian", score: 2 },
    { code: "sr", name: "Serbian", score: 2 },
    { code: "sv", name: "Swedish", score: 3 },
    { code: "th", name: "Thai", score: 2 },
    { code: "tr", name: "Turkish", score: 3 },
    { code: "uk", name: "Ukrainian", score: 3 },
    { code: "vi", name: "Vietnamese", score: 3 },
    { code: "zh", name: "Chinese", score: 3 },
];

export const allTypes = [
    { value: "AdministrativeArea", label: "Administrative area" },
    { value: "Airline", label: "Airline" },
    { value: "Airport", label: "Airport" },
    { value: "Book", label: "Book" },
    { value: "BookSeries", label: "Book series" },
    { value: "Corporation", label: "Corporation" },
    { value: "CreativeWork", label: "Creative work" },
    { value: "EducationalOrganization", label: "Educational organization" },
    { value: "Event", label: "Event" },
    { value: "GovernmentOrganization", label: "Government organization" },
    { value: "LocalBusiness", label: "Local business" },
    { value: "Movie", label: "Movie" },
    { value: "MovieSeries", label: "Movie series" },
    { value: "Museum", label: "Museum" },
    { value: "MusicAlbum", label: "Music album" },
    { value: "MusicComposition", label: "Music composition" },
    { value: "MusicGroup", label: "Music group" },
    { value: "MusicRecording", label: "Music recording" },
    { value: "Organization", label: "Organization" },
    { value: "Periodical", label: "Periodical" },
    { value: "Person", label: "Person" },
    { value: "Place", label: "Place" },
    { value: "ProductModel", label: "Product model" },
    { value: "SoftwareApplication", label: "Software application" },
    { value: "SportsTeam", label: "Sports team" },
    { value: "TouristAttraction", label: "TouristAttraction" },
    { value: "TVEpisode", label: "TV episode" },
    { value: "TVSeries", label: "TV series" },
    { value: "VideoGame", label: "Video game" },
    { value: "VideoGameSeries", label: "Video game series" },
    { value: "WebSite", label: "Website" },
];


const entities_api = "https://kgsearch.googleapis.com/v1/entities:search";
const api_key = "AIzaSyDedmywSA52Henk7ZEtF2DojvLL9JLbFvU";

function cleanup(str: string) {
    if (!str || !str.includes("&")) {
        return str;
    }
    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"');
}

export type SearchOptions = {
    query: string;
    languages: { value: string; label: string }[];
    types: { value: string; label: string }[];
    withWikipedia: boolean;
    withWikidata: boolean;
};

type EntitySearchResult = {
    id: string;
    type: string[];
    name: { language: string, value: string }[];
    description: { language: string, value: string }[];
    detailedDescription: { inLanguage: string, articleBody: string, license: string, url: string }[];
    resultScore: number;
    url?: string;
    image?: { contentUrl: string, url: string, license: string };
};

export async function queryEntitiesApi(
    { query, ids, languages, types, limit }: { query?: string, ids?: string[], languages?: string[], types?: string[], limit?: number }
) {
    let params = [["key", api_key]];
    if (query?.length) {
        params.push(["query", query])
    }
    if (ids?.length) {
        params.push(...ids.map(el => ["ids", el]))
    }
    if (languages?.length) {
        params.push(...languages.map(el => ["languages", el]))
    }
    if (types?.length) {
        params.push(...types.map(el => ["types", el]))
    }
    if (limit) {
        params.push(["limit", limit.toString()])
    }

    const response = await fetch(entities_api + "?" + new URLSearchParams(params).toString());
    if (!response.ok) {
        throw new Error("Internal error, examine the console output");
    }
    const response_body = await response.json();
    const item_list: { result: any; resultScore: number }[] =
        response_body["itemListElement"];
    if (item_list.length == 0) {
        return [];
    }

    let out: EntitySearchResult[] = [];

    const defaultLanguage = languages?.length ? languages[0] : "en";

    for (const item of item_list) {
        const result = item.result;
        const id = result['@id'].split(":")[1];
        const type = result['@type'] || [];

        let name: { language: string, value: string }[] = [];
        if (result.name) {
            if (Array.isArray(result.name)) {
                name = result.name.map((el: any) => {
                    return { language: el['@language'], value: cleanup(el['@value']) };
                });
            } else {
                name = [{ language: defaultLanguage, value: cleanup(result.name) }]
            }
        }

        let description: { language: string, value: string }[] = [];
        if (result.description) {
            if (Array.isArray(result.description)) {
                description = result.description.map((el: any) => {
                    return { language: el['@language'], value: cleanup(el['@value']) };
                });
            } else {
                description = [{ language: defaultLanguage, value: cleanup(result.description) }]
            }
        }

        let detailedDescription: { inLanguage: string, articleBody: string, license: string, url: string }[] = [];
        if (result.detailedDescription) {
            if (Array.isArray(result.detailedDescription)) {
                detailedDescription = result.detailedDescription.map((el: any) => {
                    return {
                        inLanguage: el.inLanguage,
                        articleBody: cleanup(el.articleBody),
                        license: el.license,
                        url: el.url
                    };
                });
            } else {
                detailedDescription = [{
                    inLanguage: defaultLanguage,
                    articleBody: cleanup(result.detailedDescription.articleBody),
                    license: result.detailedDescription.license,
                    url: result.detailedDescription.url
                }]
            }
        }

        const resultScore = item.resultScore;
        const url = result.url;
        const image = result.image;

        out.push({ id, type, name, description, detailedDescription, resultScore, image, url });
    }

    return out;
}

export function formatLinkText(url: string) {
    url = decodeURI(url);
    let match = url.match(
        /^https:\/\/([^.]+)\.wikipedia\.org\/wiki\/(.+)$/
    );
    if (match) {
        const lang = match[1];
        const name = decodeURIComponent(match[2]).replace("_", " ");
        return `${lang}:${name}`;
    }

    match = url.match(
        /^https:\/\/zh\.wikipedia\.org\/(zh-cn|zh-tw)\/(.+)$/
    );
    if (match) {
        const lang = match[1];
        const name = decodeURIComponent(match[2]).replace("_", " ");
        return `${lang}:${name}`;
    }

    return url;
}

export async function queryWikidata(query: string) {
    const sparql = 'https://query.wikidata.org/sparql';

    const response = await fetch(sparql, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/sparql-results+json',
        },
        body: new URLSearchParams({ query: query }).toString()
    });

    if (!response.ok) {
        throw new Error("Internal error, examine the console output");
    }
    const response_body = await response.json();
    const bindings: Record<string, { type: string, value: string }>[] = response_body["results"]["bindings"];
    return bindings;
}