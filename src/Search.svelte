<script type="ts">
    import { Spinner } from "sveltestrap";
    import CopyClipboard from "./CopyClipboard.svelte";
    import Footer from "./Footer.svelte";

    import {
        allLanguages,
        queryEntitiesApi,
        formatLinkText,
        queryWikidata,
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

    $: searchResults = search(searchOptions);

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
            const mreids = items.map((el) => el.id);
            const gIds = mreids.filter((el) => el.startsWith("/g/"));
            const mIds = mreids.filter((el) => el.startsWith("/m/"));

            let queryParts: string[] = [];

            if (gIds.length) {
                queryParts.push(
                    `{VALUES ?id {${gIds
                        .map((el) => `"${el}"`)
                        .join(" ")}} ?item wdt:P2671 ?id}`
                );
            }

            if (mIds.length) {
                queryParts.push(
                    `{VALUES ?id {${mIds
                        .map((el) => `"${el}"`)
                        .join(" ")}} ?item wdt:P646 ?id}`
                );
            }

            let query: string;
            if (queryParts.length == 2) {
                query = `SELECT ?id WHERE {${queryParts[0]} UNION ${queryParts[1]}}`;
            } else {
                query = `SELECT ?id WHERE ${queryParts[0]}`;
            }
            const wdItems = await queryWikidata(query);
            const wdMreids = new Set(wdItems.map((el) => el.id.value));
            items = items.filter((el) => wdMreids.has(el.id));
        }

        return items;
    }

    const copy = (text: string) => {
        const app = new CopyClipboard({
            target: document.getElementById("clipboard"),
            props: { name: text },
        });
        app.$destroy();
    };
</script>

<style>
    .stats {
        float: right;
    }

    .search-headline {
        display: flex;
        align-items: center;
        margin-bottom: 0;
    }
</style>

<div>
    {#await searchResults}
        <Spinner />
    {:then items}
        <div class="small mb-2 text-muted stats">
            {#if items.length == 500}
                Found more than 500 results
            {:else if items.length > 1}
                Found
                {items.length}
                results
            {:else if items.length == 1}
                Found 1 result
            {:else}There are no results for {searchOptions.query}{/if}
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
                        <small> {item.id} 📋</small>
                    </button>
                    <a
                        class="btn btn-light mark text-muted py-0 px-1 ml-2"
                        title="Search in Google"
                        href={`https://www.google.com/search?kgmid=${item.id}&hl=${item.name?.lang || 'en'}&gl=US`}>
                        <small>🔍</small>
                    </a>
                    {#if item.url}
                        <a
                            class="btn btn-light mark text-muted py-0 px-1 ml-2"
                            title="The official website URL of the entity"
                            href={item.url}>
                            <small>🌐</small>
                        </a>
                    {/if}

                    {#if item.description}
                        <small
                            class="ml-2 text-muted"
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
                            <a href={item.wikipedia}>&rarr;
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
