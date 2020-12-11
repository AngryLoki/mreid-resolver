<script lang="ts">
	import { parseUrl } from "query-string";
	import { onMount } from "svelte";
	import Item from "./Item.svelte";
	import Welcome from "./Welcome.svelte";
	import SearchBox from "./SearchBox.svelte";
	import Search from "./Search.svelte";
	import { allLanguages, allTypes } from "./common";
	import type { SearchOptions } from "./common";

	let kgid: string = null;

	const defaultSearchOptions = {
		query: "",
		languages: undefined,
		types: undefined,
		withWikipedia: false,
		withWikidata: false,
	};

	let searchOptions: SearchOptions = defaultSearchOptions;

	onMount(() => {
		const updatePath = () => {
			const { url, query } = parseUrl(window.location.hash.slice(1));

			let kgmid_re =
				"^/m/0[0-9a-z_]{2,6}|/m/01[0123][0-9a-z_]{5}|/g/1[0-9a-np-z][0-9a-np-z_]{6,8}$";

			if (url.match(kgmid_re)) {
				kgid = url;
			} else if (url == "/search") {
				kgid = null;
				const languageValues = query.lang
					? Array.isArray(query.lang)
						? query.lang
						: [query.lang]
					: [];
				const allLanguagesMap = allLanguages.reduce(
					(a, x) => ({
						...a,
						[x.code]: { value: x.code, label: x.name },
					}),
					{}
				);
				const languages = languageValues
					.filter((el) => el in allLanguagesMap)
					.map((el) => allLanguagesMap[el]);

				const typeValues = query.type
					? Array.isArray(query.type)
						? query.type
						: [query.type]
					: [];
				const allTypesMap = allTypes.reduce(
					(a, x) => ({ ...a, [x.value]: x }),
					{}
				);
				const types = typeValues
					.filter((el) => el in allTypesMap)
					.map((el) => allTypesMap[el]);

				const searchQuery = Array.isArray(query.q)
					? query.q[0]
					: query.q;

				searchOptions = {
					query: searchQuery,
					languages: languages.length ? languages : undefined,
					types: types.length ? types : undefined,
					withWikipedia: query.wp == "1",
					withWikidata: query.wd == "1",
				};
			} else {
				kgid = null;
				searchOptions = defaultSearchOptions;
			}
		};
		updatePath();
		window.addEventListener("hashchange", updatePath, false);
	});
</script>

<style>
</style>

<main class="container">
	<SearchBox {searchOptions} />

	{#if kgid}
		<Item {kgid} />
	{:else if searchOptions?.query}
		<Search {searchOptions} />
	{:else}
		<Welcome />
	{/if}
</main>
