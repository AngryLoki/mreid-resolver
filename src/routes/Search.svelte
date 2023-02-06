<script lang="ts">
    import CopyClipboard from "./CopyClipboard.svelte";
    import Footer from "./Footer.svelte";
    import Spinner from "./Spinner.svelte";

    import { formatLinkText, quickStatementsLink } from "./utils";
    import {
        fetchWikidata,
        search,
        type QuickStatement,
        type SearchItem,
        type SearchOptions,
    } from "./search";

    export let searchOptions: SearchOptions;

    let searchResults: Promise<SearchItem[]>;

    type WikidataResults = {
        wikilinksToWikidata: Record<string, Set<string>>;
        newStatements: QuickStatement[];
    };
    let wikidataResults: Promise<WikidataResults>;

    $: searchResults = search(searchOptions);
    $: wikidataResults = fetchWikidata(searchResults);

    const copy = (text: string) => {
        const app = new CopyClipboard({
            target: document.getElementById("clipboard") as Element,
            props: { name: text },
        });
        app.$destroy();
    };
</script>

<div class="p-4 bg-white rounded text-sm text-gray-800">
    {#await searchResults}
        <Spinner />
    {:then items}
        <div class="text-xs mb-2 text-gray-700 md:float-right">
            {#if items.length == 500}
                Found more than 500 results
            {:else if items.length > 1}
                Found
                {items.length}
                results
            {:else if items.length == 1}
                Found 1 result
            {:else}There are no results for {searchOptions.query}{/if}

            {#await wikidataResults}
                <Spinner />
            {:then { newStatements }}
                {#if newStatements.length}
                    and
                    <a
                        href={quickStatementsLink(newStatements)}
                        target="_blank"
                        rel="noreferrer"
                        title="Open in QuickStatements"
                    >
                        {newStatements.length}
                        new statement{newStatements.length != 1 ? "s" : ""}
                        <img
                            class="inline"
                            src="qs.png"
                            alt="QuickStatements"
                        />
                    </a>
                {:else}and 0 new statements{/if}
            {/await}
        </div>

        {#each items as item}
            <div class="mb-3">
                <div class="flex items-center space-x-2">
                    <h6 class="text-lg" lang={item.name?.lang || "en"}>
                        <a href="#{item.id}">
                            {item.name?.text || "<unnamed>"}
                        </a>
                    </h6>

                    <button
                        class="inline-block align-middle text-center border font-normal whitespace-no-wrap rounded leading-normal no-underline bg-gray-100 hover:bg-gray-200  text-gray-700 py-0 px-2"
                        title="Copy to clipboard"
                        on:click={() => copy(item.id)}
                    >
                        <small class="text-nowrap">{item.id} 📋</small>
                    </button>
                    <a
                        class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded leading-normal no-underline bg-gray-100 hover:bg-gray-200  text-gray-700 py-0 px-1 ml-1"
                        title="Search in Google"
                        href={`https://www.google.com/search?kgmid=${
                            item.id
                        }&hl=${item.name?.lang || "en"}&gl=US`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        🔍
                    </a>
                    {#if item.url}
                        <a
                            class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded leading-normal no-underline bg-gray-100 hover:bg-gray-200  text-gray-700 py-0 px-1 ml-1"
                            title="The official website URL of the entity"
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            🌐
                        </a>
                    {/if}

                    {#if item.description}
                        <div
                            class="ml-1 text-gray-500 whitespace-no-wrap"
                            lang={item.description.lang}
                        >
                            {item.description.text}
                        </div>
                    {/if}

                    <div class="ml-4 text-gray-500">
                        score:
                        {+Math.log(item.score).toFixed(2)}
                    </div>
                </div>
                <div>
                    {#if item.detailedDescription}
                        <span lang={item.detailedDescription.lang}>
                            {item.detailedDescription.text}
                        </span>
                    {/if}
                    {#if item.wikipedia}
                        <small class="whitespace-no-wrap">
                            <a href={item.wikipedia}>
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
        <p class="text-red-600">{error.message}</p>
    {/await}
</div>
