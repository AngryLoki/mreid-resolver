<script lang="ts">
    import CopyClipboard from "./CopyClipboard.svelte";
    import Footer from "./Footer.svelte";
    import { formatLinkText, gNewsLink, gTrendsLink } from "./utils";
    import GoogleSearch from "./GoogleSearch.svelte";
    import Spinner from "./Spinner.svelte";
    import { loadContent, type ItemContent } from "./kgapi";

    export let kgid: string;
    let mainLang: string;

    let content: ItemContent | undefined;
    let loading = true;
    let error: string | undefined;

    const update = async (kgid: string) => {
        loading = true;
        error = undefined;
        try {
            content = await loadContent(kgid);
            if (content) {
                for (const key of content.itemData.keys()) {
                    mainLang = key;
                    break;
                }
            }
        } catch (e: unknown) {
            error = e as string;
        }
        loading = false;
    };

    $: update(kgid);

    const copy = () => {
        const app = new CopyClipboard({
            target: document.getElementById("clipboard") as Element,
            props: { name: kgid },
        });
        app.$destroy();
    };
</script>

<div class="md:flex gap-2 text-sm text-neutral-600">
    <div class="md:w-3/5 rounded-sm bg-white px-4 py-3">
        <div class="flex flex-wrap mb-2">
            <div
                class="relative flex-grow max-w-full flex-1 sm:flex-grow sm:flex-1"
            >
                {#if content?.image}
                    <a href={content.image.url} target="_blank">
                        <img
                            src={content.image.src}
                            alt={kgid}
                            class="max-w-full h-auto border border-gray-200 rounded p-1 float-right"
                        />
                    </a>
                {/if}

                <h3 class="font-medium text-2xl leading-8 text-neutral-800">
                    Entry
                    <tt>{kgid}</tt>
                    <button
                        type="button"
                        class="inline-block align-middle text-center border font-normal whitespace-no-wrap rounded no-underline bg-gray-100 text-gray-800 hover:bg-gray-200 py-1 px-2 leading-tight text-xs "
                        title="Copy to clipboard"
                        on:click={copy}
                    >
                        📋
                    </button>
                </h3>

                <div class="flex flex-wrap my-1">
                    <div class="mt-2 pr-4 w-1/3 text-neutral-800">
                        Search in Google:
                    </div>
                    <div class="mt-2 pl-4 w-2/3">
                        <ul class="space-x-1">
                            <li class="inline-block">
                                <a
                                    target="_blank"
                                    href={"https://www.google.com/search?kgmid=" +
                                        kgid +
                                        "&hl=en&gl=US"}>US</a
                                >
                            </li>
                            <li class="inline-block">
                                <a
                                    target="_blank"
                                    href={"https://www.google.com/search?kgmid=" +
                                        kgid +
                                        "&hl=en&gl=IN"}>IN</a
                                >
                            </li>
                            <li class="inline-block">
                                <a
                                    target="_blank"
                                    href={"https://www.google.com/search?kgmid=" +
                                        kgid +
                                        "&hl=en&gl=ID"}>ID</a
                                >
                            </li>
                            <li class="inline-block">
                                <a
                                    target="_blank"
                                    href={"https://www.google.com/search?kgmid=" +
                                        kgid +
                                        "&hl=en&gl=KR"}>KR</a
                                >
                            </li>
                        </ul>
                    </div>

                    <div class="mt-2 pr-4 w-1/3 text-neutral-800">
                        Google Trends:
                    </div>
                    <div class="mt-2 pl-4 w-2/3">
                        <ul class="space-x-1">
                            <li class="inline-block">
                                <a target="_blank" href={gTrendsLink(kgid)}>
                                    Worldwide
                                </a>
                            </li>
                            <li class="inline-block">
                                <a
                                    target="_blank"
                                    href={gTrendsLink(kgid, "US")}
                                >
                                    US
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="mt-2 pr-4 w-1/3 text-neutral-800">
                        Google News:
                    </div>
                    <div class="mt-2 pl-4 w-2/3">
                        <ul class="space-x-1">
                            <li class="inline-block">
                                <a target="_blank" href={gNewsLink(kgid, "en")}>
                                    English
                                </a>
                            </li>
                        </ul>
                    </div>

                    {#if content?.type}
                        <div class="mt-2 pr-4 w-1/3 text-neutral-800">
                            schema.org types:
                        </div>
                        <div class="mt-2 pl-4 w-2/3">
                            <ul class="space-x-1">
                                {#each content.type as type, i}
                                    <li class="inline-block">
                                        <a
                                            target="_blank"
                                            href={"https://schema.org/" + type}
                                        >
                                            {type}
                                        </a>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/if}

                    {#if content?.url}
                        <div class="mt-2 pr-4 w-1/3 text-neutral-800">
                            Official website:
                        </div>
                        <div class="mt-2 pl-4 w-2/3">
                            <a target="_blank" href={content.url}>
                                {content.url}
                            </a>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        {#if loading}
            <Spinner />
        {:else if error}
            <div
                class="relative px-3 py-3 mb-4 border rounded bg-orange-200 border-orange-300 text-orange-800"
                role="alert"
            >
                {error}
            </div>
        {:else if !content}
            <div
                class="relative px-3 py-3 mb-4 border rounded bg-orange-200 border-orange-300 text-orange-800"
                role="alert"
            >
                No data returned from
                <a
                    target="_blank"
                    href="https://developers.google.com/knowledge-graph/reference/rest/v1"
                >
                    entities.search
                </a>
                method. Some data might be available in
                <a
                    target="_blank"
                    href={"https://www.google.com/search?kgmid=" +
                        kgid +
                        "&hl=en"}>Google</a
                >.
            </div>
        {:else}
            <small class="text-gray-700">
                Note: some links to Google Search may not work.
            </small>

            <table class="w-full max-w-full mb-4 bg-transparent">
                <tbody>
                    {#each [...content.itemData] as [lang, item]}
                        <tr {lang}>
                            <td class="border-t p-1 align-top border-zinc-200">
                                <a
                                    target="_blank"
                                    class:font-bold={lang == "en"}
                                    href={"https://www.google.com/search?kgmid=" +
                                        kgid +
                                        "&hl=" +
                                        lang}>{lang}</a
                                >
                            </td>
                            <td class="border-t p-1 align-top border-zinc-200">
                                {item.name || ""}
                            </td>
                            <td class="border-t p-1 align-top border-zinc-200">
                                {item.description || ""}
                            </td>
                            <td class="border-t p-1 align-top border-zinc-200">
                                {item.detailedDescription?.text || ""}
                                {#if item.detailedDescription?.url}
                                    <small class="whitespace-no-wrap">
                                        <a href={item.detailedDescription.url}
                                            >→
                                            {formatLinkText(
                                                item.detailedDescription.url
                                            )}
                                        </a></small
                                    >
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <div id="clipboard" />
        {/if}
    </div>
    <div class="md:w-2/5">
        {#if mainLang}
            <GoogleSearch {kgid} main_lang={mainLang} />
        {/if}
    </div>
</div>

{#await content then content}
    {#if content}
        <Footer />
    {/if}
{/await}
