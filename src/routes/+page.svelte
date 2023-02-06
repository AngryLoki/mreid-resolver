<script lang="ts">
	import "../app.css";

	import queryString from "query-string";
	import { onMount } from "svelte";

	import Item from "./Item.svelte";
	import Welcome from "./Welcome.svelte";
	import SearchBox from "./SearchBox.svelte";
	import Search from "./Search.svelte";
	import { allLanguages, allTypes } from "./kgapi";
	import type { SearchOptions } from "./search";

	let kgid: string | undefined;

	const defaultSearchOptions: SearchOptions = {
		query: "",
		languages: undefined,
		types: undefined,
		withWikipedia: false,
		withWikidata: false,
	};

	const updatePath = (hash: string) => {
		const { url, query } = queryString.parseUrl(hash.slice(1));

		const kgmid_re = "^/m/0[0-9a-z_]{1,9}|/g/1[0-9a-z_]{1,9}$";

		if (url.match(kgmid_re)) {
			kgid = url;
		} else if (url === "/search") {
			kgid = undefined;
			const languageValues = query.lang
				? Array.isArray(query.lang)
					? (query.lang as string[])
					: [query.lang]
				: [];
			const allLanguagesMap = allLanguages.reduce(
				(a, x) => ({
					...a,
					[x.code]: { value: x.code, label: x.name },
				}),
				{}
			) as Record<string, { value: string; label: string }>;
			const languages = languageValues
				.filter((el) => el in allLanguagesMap)
				.map((el) => allLanguagesMap[el]);

			const typeValues = query.type
				? Array.isArray(query.type)
					? (query.type as string[])
					: [query.type]
				: [];
			const allTypesMap = allTypes.reduce(
				(a, x) => ({ ...a, [x.value]: x }),
				{}
			) as Record<string, { value: string; label: string }>;
			const types = typeValues
				.filter((el) => el in allTypesMap)
				.map((el) => allTypesMap[el]);

			const searchQuery =
				(Array.isArray(query.q) ? query.q[0] : query.q) ?? "";

			searchOptions = {
				query: searchQuery,
				languages: languages.length ? languages : undefined,
				types: types.length ? types : undefined,
				withWikipedia: query.wp == "1",
				withWikidata: query.wd == "1",
			};
		} else {
			kgid = undefined;
			searchOptions = structuredClone(defaultSearchOptions);
		}
	};

	let searchOptions: SearchOptions = structuredClone(defaultSearchOptions);

	onMount(() => {
		updatePath(window.location.hash);
		window.addEventListener("hashchange", () => {
			updatePath(window.location.hash);
		});
	});
</script>

<svelte:head>
	<title>MREID resolver</title>
</svelte:head>

<main
	class="container mx-auto px-4 max-w-none md:max-w-2xl lg:max-w-4xl xl:max-w-6xl"
>
	<SearchBox {searchOptions} />

	{#if kgid}
		<Item {kgid} />
	{:else if searchOptions?.query}
		<Search {searchOptions} />
	{:else}
		<Welcome />
	{/if}
</main>
