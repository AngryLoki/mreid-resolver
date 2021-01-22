<script type="ts">
    import { Spinner } from "sveltestrap";
    import CopyClipboard from "./CopyClipboard.svelte";
    import Footer from "./Footer.svelte";

    import {
        allLanguages,
        queryEntitiesApi,
        formatLinkText,
        getWikidataItemsForLinks,
filterExistingMreids,
    } from "./common";
    import type { SearchOptions } from "./common";

    export let searchOptions: SearchOptions;

    const allLanguageCodes = allLanguages
        .sort((left, right) => {
            if (left.score < right.score) return 1;
            if (left.score > right.score) return -1;

            if (left.name > right.name) return 1;
            if (left.name < right.name) return -1;
            return 0;
        })
        .map((el) => el.code);

    type LocalString = { lang: string; text: string };
    type SearchItem = {
        id: string;
        name?: LocalString;
        description?: LocalString;
        detailedDescription?: LocalString;
        url?: string;
        wikipedia?: string;
        score: number;
    };

    let searchResults: Promise<SearchItem[]> = undefined;

    type QuickStatement = { qid: string; prop: string; value: string };
    type WikidataResults = {
        wikilinksToWikidata: Record<string, Set<string>>;
        newStatements: QuickStatement[];
    };
    let wikidataResults: Promise<WikidataResults> = undefined;

    $: searchResults = search(searchOptions);
    $: wikidataResults = fetchWikidata(searchResults);

    async function search({
        query,
        languages,
        types,
        withWikipedia,
        withWikidata,
    }) {
        const languageCodes = languages?.length
            ? languages.map((el: any) => el.value)
            : allLanguageCodes;
        const typeCodes = types?.length
            ? types.map((el: any) => el.value)
            : undefined;

        const raw_items = await queryEntitiesApi({
            query: query,
            limit: 500,
            languages: languageCodes,
            types: typeCodes,
        });

        let items: SearchItem[] = [];

        for (const item of raw_items) {
            const id = item.id;

            let names = {};
            for (const { language, value } of item.name) {
                names[language] = value;
            }
            const nameLang = languageCodes.find((el: string) => el in names);
            const name: LocalString = nameLang
                ? { lang: nameLang, text: names[nameLang] }
                : undefined;

            let descriptions = {};
            for (const { language, value } of item.description) {
                descriptions[language] = value;
            }
            const descriptionLang = languageCodes.find(
                (el: string) => el in descriptions
            );
            let description: LocalString = descriptionLang
                ? {
                      lang: descriptionLang,
                      text: descriptions[descriptionLang],
                  }
                : undefined;

            if (!description && item.type?.length) {
                description = {
                    lang: "en",
                    text: item.type.filter((el) => el != "Thing").join(", "),
                };
            }

            let articles = {};
            for (const {
                inLanguage,
                articleBody,
                url,
            } of item.detailedDescription) {
                articles[inLanguage] = { articleBody, url };
            }
            const articleLang = languageCodes.find(
                (el: string) => el in articles
            );
            const article = articles[articleLang];
            const detailedDescription: LocalString = article
                ? { lang: articleLang, text: article.articleBody }
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

        if (withWikidata && items.length) {
            const wdMreids = await filterExistingMreids(items.map((el) => el.id));
            items = items.filter((el) => wdMreids.has(el.id));
        }

        return items;
    }

    async function fetchWikidata(itemsPromise: Promise<SearchItem[]>) {
        const items = await itemsPromise;
        const wikilinks = items.map((el) => el.wikipedia).filter((el) => !!el);
        const wikidataItems = await getWikidataItemsForLinks(wikilinks);

        const wdWikilinks = new Set(wikidataItems.map((el) => el.article));
        const notMapped = wikilinks.filter((el) => !wdWikilinks.has(el));
        if (notMapped.length) {
            console.warn(`Not mapped ${notMapped.length} links:`, notMapped.join('\n'));
        }

        let wikilinksToWikidata: Record<string, Set<string>> = {};
        for (const item of wikidataItems) {
            if (!(item.article in wikilinksToWikidata)) {
                wikilinksToWikidata[item.article] = new Set([item.item]);
            } else {
                wikilinksToWikidata[item.article].add(item.item);
            }
        }

        // calculate missing statements
        const wikidataItemsMreids: Record<string, Set<string>> = {};
        for (const item of wikidataItems) {
            if (item.mreid) {
                if (!(item.item in wikilinksToWikidata)) {
                    wikidataItemsMreids[item.item] = new Set([item.mreid]);
                } else {
                    wikidataItemsMreids[item.item].add(item.mreid);
                }
            } else {
                wikidataItemsMreids[item.item] = new Set();
            }
        }

        let newStatements: QuickStatement[] = [];

        for (const item of items) {
            if (item.wikipedia && wikilinksToWikidata[item.wikipedia]) {
                for (const wikidataUri of wikilinksToWikidata[item.wikipedia]) {
                    if (
                        wikidataItemsMreids[wikidataUri] &&
                        !wikidataItemsMreids[wikidataUri].has(item.id)
                    ) {
                        const qid = wikidataUri.match(
                            /^http:\/\/www\.wikidata\.org\/entity\/(.+)$/
                        )?.[1];
                        if (!qid) {
                            console.warn(
                                `Unable to extract qid from url: ${wikidataUri}`
                            );
                            continue;
                        }
                        const prop = item.id.startsWith("/m/")
                            ? "P646"
                            : "P2671";
                        newStatements.push({ qid, prop, value: item.id });
                    }
                }
            }
        }

        // enforce unique constraint
        const insertableMreids = new Set(newStatements.map((el) => el.value));
        const existingMreids = await filterExistingMreids([...insertableMreids]);
        newStatements = newStatements.filter(el => !existingMreids.has(el.value))

        return { wikilinksToWikidata, newStatements };
    }

    const copy = (text: string) => {
        const app = new CopyClipboard({
            target: document.getElementById("clipboard"),
            props: { name: text },
        });
        app.$destroy();
    };

    function quickStatementsLink(statements: QuickStatement[]) {
        const edits = statements
            .map((el) => `${el.qid}|${el.prop}|"${el.value}"`)
            .join("||");
        return (
            "https://quickstatements.toolforge.org/#/v1=" +
            encodeURIComponent(edits)
        );
    }
</script>

<style>
    #search-table {
        background: #fff;
    }
    .search-headline {
        display: flex;
        align-items: center;
        margin-bottom: 0;
    }
</style>

<div id="search-table" class="p-3 rounded">
    {#await searchResults}
        <Spinner />
    {:then items}
        <div class="small mb-2 text-muted float-md-right">
            {#if items.length == 500}
                Found more than 500 results
            {:else if items.length > 1}
                Found
                {items.length}
                results
            {:else if items.length == 1}
                Found 1 result
            {:else}There are no results for {searchOptions.query}{/if}
            {#if getWikidataItemsForLinks.length > 0}
                {#await wikidataResults}
                    <Spinner size="sm" />
                {:then { newStatements }}
                    {#if newStatements.length}
                        and
                        <a
                            href={quickStatementsLink(newStatements)}
                            target="blank"
                            title="Open in QuickStatements">
                            {newStatements.length}
                            new statement{newStatements.length != 1 ? 's' : ''}
                            <img
                                style="margin-bottom: 5px;"
                                src="qs.png"
                                alt="QuickStatements" />
                        </a>
                    {:else}and 0 new statements{/if}
                {/await}
            {/if}
        </div>

        {#each items as item}
            <div class="mb-3">
                <div class="search-headline">
                    <h6
                        class="mb-0 list-inline-item"
                        lang={item.name?.lang || 'en'}>
                        <a href="#{item.id}">
                            {item.name?.text || '<unnamed>'}
                        </a>
                    </h6>

                    <button
                        class="btn btn-light mark text-muted py-0 px-2"
                        title="Copy to clipboard"
                        on:click={() => copy(item.id)}>
                        <small class="text-nowrap">{item.id} 📋</small>
                    </button>
                    <a
                        class="btn btn-light mark text-muted py-0 px-1 ml-1"
                        title="Search in Google"
                        href={`https://www.google.com/search?kgmid=${item.id}&hl=${item.name?.lang || 'en'}&gl=US`}>
                        <small>🔍</small>
                    </a>
                    {#if item.url}
                        <a
                            class="btn btn-light mark text-muted py-0 px-1 ml-1"
                            title="The official website URL of the entity"
                            href={item.url}>
                            <small>🌐</small>
                        </a>
                    {/if}

                    {#if item.description}
                        <small
                            class="ml-1 text-muted text-nowrap"
                            lang={item.description.lang}>
                            {item.description.text}
                        </small>
                    {/if}

                    <small class="ml-4 text-muted">
                        score:
                        {+Math.log(item.score).toFixed(2)}</small>
                </div>
                <div>
                    {#if item.detailedDescription}
                        <span lang={item.detailedDescription.lang}>
                            {item.detailedDescription.text}
                        </span>
                    {/if}
                    {#if item.wikipedia}
                        <small class="text-nowrap">
                            <a href={item.wikipedia}>→
                                {formatLinkText(item.wikipedia)}
                            </a>
                        </small>
                    {/if}
                </div>
            </div>
        {/each}
        <Footer />
        <div id="clipboard" />
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
</div>
