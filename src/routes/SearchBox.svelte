<script lang="ts">
    import queryString from "query-string";
    import Select from "svelte-select";
    import { parseTopicId } from "./google-news";

    import { allLanguages, allTypes } from "./kgapi";
    import type { SearchOptions } from "./search";

    export let searchOptions: SearchOptions;

    function search() {
        let q = searchOptions.query;

        const maybeTopic = parseTopicId(q);

        if (maybeTopic) {
            q = maybeTopic;
        }

        const kgmid_re =
            "^/m/0[0-9a-z_]{2,6}|/m/01[0123][0-9a-z_]{5}|/g/1[0-9a-np-z][0-9a-np-z_]{6,8}$";
        if (q.match(kgmid_re)) {
            window.location.hash = "#" + q;
            return;
        }

        let qs: any = { q };
        if (searchOptions.withWikipedia) {
            qs.wp = "1";
        }
        if (searchOptions.withWikidata) {
            qs.wd = "1";
        }
        if (searchOptions.languages?.length) {
            qs.lang = searchOptions.languages.map((el) => el.value);
        }
        if (searchOptions.types?.length) {
            qs.type = searchOptions.types.map((el) => el.value);
        }

        let req = queryString.stringifyUrl({ url: "/search", query: qs });
        window.location.hash = "#" + req;
    }

    const searchLanguagesDropdownItems = allLanguages
        .sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        })
        .map(({ code, name }) => {
            return { value: code, label: name };
        });
</script>

<form on:submit|preventDefault={search}>
    <div class="flex flex-wrap mt-4">
        <div class="flex-none logo">
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a href="#">
                <span class="logo-mreid">MREID</span><br /><span
                    class="logo-resolver">resolver</span
                >
            </a>
        </div>
        <div class="relative flex-grow max-w-full flex-1 pl-4">
            <div class="relative flex items-stretch w-full">
                <!-- svelte-ignore a11y-autofocus -->
                <input
                    class="block appearance-none w-full py-1.5 px-3 text-base leading-normal bg-white text-gray-800 border border-gray-200 border-r-0 rounded-l
                    focus:outline-none focus:ring focus:ring-blue-600/40"
                    bind:value={searchOptions.query}
                    placeholder="Search..."
                    autocapitalize="off"
                    autocomplete="off"
                    autocorrect="off"
                    spellcheck="false"
                    autofocus
                />
                <button
                    class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded-r py-1 px-3 leading-normal no-underline 
                    bg-blue-600 text-white hover:bg-blue-600
                    focus:outline-none focus:ring focus:ring-blue-600/40
                    disabled:opacity-60"
                    type="submit"
                    disabled={!searchOptions.query}
                >
                    🔍
                </button>
            </div>
        </div>
    </div>
    <div
        class="my-2 md:mx-1 md:px-3 flex flex-wrap gap-2 md:gap-4 items-center"
    >
        <div class="col-md-auto form-check form-check-inline">
            <label class="text-gray-700 py-1 mb-0 text-sm">
                <input
                    class="mr-1"
                    type="checkbox"
                    bind:checked={searchOptions.withWikipedia}
                />With Wikipedia
            </label>
        </div>
        <div class="col-md-auto form-check form-check-inline text-sm">
            <label class="text-gray-700 py-1 mb-0 leading-normal">
                <input
                    class="mr-1"
                    type="checkbox"
                    bind:checked={searchOptions.withWikidata}
                />With Wikidata
            </label>
        </div>
        <div class="col-md-auto list-inline-item dropdown-select">
            <Select
                showChevron={true}
                clearable={false}
                multiple={true}
                class="form-control form-control-sm"
                placeholder="Any language"
                items={searchLanguagesDropdownItems}
                bind:value={searchOptions.languages}
            />
        </div>
        <div class="col-md-auto list-inline-item dropdown-select">
            <Select
                showChevron={true}
                clearable={false}
                multiple={true}
                class="form-control form-control-sm"
                placeholder="Any type"
                items={allTypes}
                bind:value={searchOptions.types}
            />
        </div>
    </div>
</form>

<style>
    .dropdown-select {
        --multi-select-input-margin: 0;
        --height: 29px;
        --chevron-height: 29px;
        --border: 1px solid #ced4da;
        --border-radius: 4px;
        --multi-select-padding: 0 0 0 6px;
        --multi-item-height: 23px;
        --border: 1px solid rgb(229, 231, 235);
    }

    .form-check {
        -moz-user-select: none;
        user-select: none;
    }

    .logo {
        -moz-user-select: none;
        user-select: none;
        line-height: 19px;
        text-align: center;
    }

    .logo a {
        color: #212529;
    }

    .logo-mreid {
        font-weight: 900;
    }

    .logo-resolver {
        font-weight: 700;
    }
</style>
