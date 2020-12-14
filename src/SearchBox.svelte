<script type="ts">
    import {
        Input,
        Label,
        InputGroup,
        Button,
        InputGroupAddon,
        Col,
        Row,
    } from "sveltestrap";
    import { stringifyUrl } from "query-string";
    import Select from "svelte-select";

    import { allLanguages, allTypes } from "./common";
    import type { SearchOptions } from "./common";

    export let searchOptions: SearchOptions;

    function search() {
        let qs: any = { q: searchOptions.query };
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

        let req = stringifyUrl({ url: "/search", query: qs });
        window.location.assign("#" + req);
    }

    const search_languages_dropdown_items = allLanguages
        .sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        })
        .map(({ code, name }) => {
            return { value: code, label: name };
        });
</script>

<style>
    .dropdown-select {
        --multiItemHeight: 23px;
        --multiItemMargin: 3px 5px 0 0;
        --multiItemPadding: 0 6px 0 8px;

        --multiClearTop: 6px;
        --multiClearWidth: 12px;
        --multiClearHeight: 12px;

        --height: 29px;
        --indicatorTop: 2px;
        --indicatorRight: 4px;
        --border: 1px solid #ced4da;
        --borderRadius: 15px;
        --multiSelectPadding: 0 30px 0 3px;
        --inputLeft: 9px;
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

<form on:submit|preventDefault={search}>
    <Row class="mt-3 form-row">
        <div class="col-sm-auto logo">
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a href={window.location.href.split('#')[0]}><span
                    class="logo-mreid">MREID</span><br /><span
                    class="logo-resolver">resolver</span></a>
        </div>
        <Col>
            <InputGroup>
                <Input
                    bind:value={searchOptions.query}
                    placeholder="Search..." />
                <InputGroupAddon addonType="append">
                    <Button
                        type="submit"
                        color="primary"
                        disabled={!searchOptions.query}>
                        🔍
                    </Button>
                </InputGroupAddon>
            </InputGroup>
        </Col>
    </Row>
    <Row class="mt-2 mb-3 form-row list-inline">
        <div class="col-md-auto list-inline-item form-check form-check-inline">
            <Label check size="sm">
                <Input
                    type="checkbox"
                    bind:checked={searchOptions.withWikipedia} />With Wikipedia
            </Label>
        </div>
        <div class="col-md-auto list-inline-item form-check form-check-inline">
            <Label check size="sm">
                <Input
                    type="checkbox"
                    bind:checked={searchOptions.withWikidata} />With Wikidata
            </Label>
        </div>
        <div class="col-md-auto list-inline-item dropdown-select">
            <Select
                showChevron={true}
                showIndicator={true}
                isClearable={false}
                isMulti={true}
                containerClasses="form-control form-control-sm"
                placeholder="Any language"
                listPlacement="bottom"
                items={search_languages_dropdown_items}
                bind:selectedValue={searchOptions.languages} />
        </div>
        <div class="col-md-auto list-inline-item dropdown-select">
            <Select
                showChevron={true}
                showIndicator={true}
                isClearable={false}
                isMulti={true}
                containerClasses="form-control form-control-sm"
                placeholder="Any type"
                listPlacement="bottom"
                items={allTypes}
                bind:selectedValue={searchOptions.types} />
        </div>
    </Row>
</form>
