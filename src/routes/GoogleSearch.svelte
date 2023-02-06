<script lang="ts">
    import queryString from "query-string";

    export let kgid: string;
    export let main_lang: string;

    $: src = queryString.stringifyUrl({
        url: "https://www.google.com/search",
        query: {
            prvw: "AP1HcD1TvBAuAZZqq5dYyslxOHow",
            kgmid: kgid,
            hl: main_lang,
            gl: "US",
            q: "previewid:5a5c1869-ef41-46c2-a38d-1b2dbd3234a4",
            useragent:
                "Mozilla/5.0 (iPhone; CPU iPhone OS 11_1 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) GSA/39.0.175034278 Mobile/15B93 Safari/604.1",
            filter: "0",
            gws_rd: "cr",
            newwindow: "1",
            igu: "1",
        },
    });
</script>

<iframe
    class="rounded-sm h-full w-full border-0 min-h-[500px]"
    title="Search for {kgid} in Google"
    {src}
/>
