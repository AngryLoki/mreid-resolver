<script lang="ts">
    import { Table, Col, Row, Spinner } from "sveltestrap";
    import CopyClipboard from "./CopyClipboard.svelte";
    import Footer from "./Footer.svelte";
    import { allLanguages, queryEntitiesApi, formatLinkText } from "./common";

    export let kgid: string;

    type LangData = {
        name?: string;
        description?: string;
        detailed_description?: {
            text: string;
            license: string;
            url: string;
        };
    };

    type ItemContent = {
        kgid: string;
        type: string[];
        image?: { src: string; url: string };
        url?: string;
        item_data: Map<string, LangData>;
    };

    let content: Promise<ItemContent> = undefined;

    $: content = loadContent(kgid);

    async function loadContent(kgid: string) {
        const item_list = await queryEntitiesApi({
            ids: [kgid],
            limit: 1,
            languages: allLanguages.map((el) => el.code),
        });
        if (item_list.length == 0) {
            return null;
        }

        const item = item_list[0];

        const item_data: Record<string, LangData> = {};

        for (let name of item.name) {
            let language = name.language;
            if (!(language in item_data)) {
                item_data[language] = {};
            }
            item_data[language].name = name.value;
        }

        for (let description of item.description) {
            let language = description.language;
            if (!(language in item_data)) {
                item_data[language] = {};
            }
            item_data[language].description = description.value;
        }

        for (let det_description of item.detailedDescription) {
            let language = det_description.inLanguage;
            if (!(language in item_data)) {
                item_data[language] = {};
            }
            item_data[language].detailed_description = {
                text: det_description.articleBody,
                license: det_description.license,
                url: det_description.url,
            };
        }

        let image = item.image
            ? { src: item.image.contentUrl, url: item.image.url }
            : null;

        const langScores: Record<string, number> = allLanguages.reduce(
            (a, x) => ({ ...a, [x.code]: x.score }),
            {}
        );

        const sorted_items = new Map(
            Object.entries(item_data).sort((a, b) => {
                // prefer items with detailed description
                let det_a = !!a[1].detailed_description;
                let det_b = !!b[1].detailed_description;
                if (det_a > det_b) return -1;
                if (det_a < det_b) return 1;

                // prefer items with higher language rank
                const lang_a = a[0].split("-")[0];
                const lang_b = b[0].split("-")[0];
                const rank_a = langScores[lang_a] || 0;
                const rank_b = langScores[lang_b] || 0;
                if (rank_a > rank_b) return -1;
                if (rank_a < rank_b) return 1;

                // sort by key
                if (a[0] > b[0]) return 1;
                if (a[0] < b[0]) return -1;
                return 0;
            })
        );

        const type = item.type.sort();

        const output = {
            kgid: item.id,
            type,
            image,
            url: item.url,
            item_data: sorted_items,
        };

        return output;
    }

    const copy = () => {
        const app = new CopyClipboard({
            target: document.getElementById("clipboard"),
            props: { name: kgid },
        });
        app.$destroy();
    };
</script>

<style>
</style>

<Row class="mt-3">
    <Col class="col-sm">
        {#await content then content}
            {#if content?.image}
                <a href={content.image.url}>
                    <img
                        src={content.image.src}
                        alt={kgid}
                        class="img-thumbnail rounded float-right mb-1" />
                </a>
            {/if}
        {/await}

        <h3>
            Entry
            {kgid}
            <button
                type="button"
                class="btn btn-light btn-sm"
                title="Copy to clipboard"
                on:click={copy}>📋</button>
        </h3>

        <Row class="my-3">
            <Col sm="2">Search in Google:</Col>
            <Col sm="10">
                <ul class="list-inline">
                    <li class="list-inline-item">
                        <a
                            href={'https://www.google.com/search?kgmid=' + kgid + '&hl=en&gl=US'}>US</a>
                    </li>
                    <li class="list-inline-item">
                        <a
                            href={'https://www.google.com/search?kgmid=' + kgid + '&hl=en&gl=IN'}>IN</a>
                    </li>
                    <li class="list-inline-item">
                        <a
                            href={'https://www.google.com/search?kgmid=' + kgid + '&hl=en&gl=ID'}>ID</a>
                    </li>
                    <li class="list-inline-item">
                        <a
                            href={'https://www.google.com/search?kgmid=' + kgid + '&hl=en&gl=KR'}>KR</a>
                    </li>
                </ul>
            </Col>

            <Col sm="2">Google Trends:</Col>
            <Col sm="10">
                <ul class="list-inline">
                    <li class="list-inline-item">
                        <a
                            href={`https://trends.google.com/trends/explore?q=${kgid}`}>Worldwide</a>
                    </li>
                    <li class="list-inline-item">
                        <a
                            href={`https://trends.google.com/trends/explore?q=${kgid}&geo=US`}>US</a>
                    </li>
                </ul>
            </Col>

            {#await content then content}
                {#if content.type}
                    <Col sm="2">schema.org types:</Col>
                    <Col sm="10">
                        <ul class="list-inline">
                            {#each content.type as type, i}
                                <li class="list-inline-item">
                                    <a
                                        href={'https://schema.org/' + type}>{type}</a>
                                </li>
                            {/each}
                        </ul>
                    </Col>
                {/if}

                {#if content.url}
                    <Col sm="2">Official website:</Col>
                    <Col sm="10"><a href={content.url}>{content.url}</a></Col>
                {/if}
            {/await}
        </Row>
    </Col>
</Row>

{#await content}
    <Spinner />
{:then content}
    {#if !content}
        <div class="alert alert-warning" role="alert">
            No data returned from
            <a
                href="https://developers.google.com/knowledge-graph/reference/rest/v1">entities.search</a>
            method. Some data might be available in
            <a
                href={'https://www.google.com/search?kgmid=' + kgid + '&hl=en'}>Google</a>.
        </div>
    {:else}
        <small class="text-muted">
            Note: some links to Google Search may not work.
        </small>

        <Table size="sm">
            <tbody>
                {#each [...content.item_data] as [lang, item]}
                    <tr lang={lang}>
                        <td>
                            <a
                                class:font-weight-bold={lang == 'en'}
                                href={'https://www.google.com/search?kgmid=' + kgid + '&hl=' + lang}>{lang}</a>
                        </td>
                        <td>{item.name || ''}</td>
                        <td>{item.description || ''}</td>
                        <td>
                            {item.detailed_description?.text || ''}
                            {#if item.detailed_description?.url}
                                <small class="text-nowrap">
                                    <a
                                        href={item.detailed_description.url}>&rarr;
                                        {formatLinkText(item.detailed_description.url)}
                                    </a></small>
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </Table>
        <Footer />
        <div id="clipboard" />
    {/if}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
