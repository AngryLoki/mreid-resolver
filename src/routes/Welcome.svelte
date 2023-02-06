<div
    class="py-6 px-4 md:py-12 md:px-8 mb-12 bg-white rounded text-neutral-800 text-sm"
>
    <h1 class="font-light text-4xl mb-4 text-neutral-600">
        Machine-Readable Entity IDs resolver
    </h1>
    <p class="text-lg font-light mb-4">
        A simple UI on top of
        <a
            href="https://developers.google.com/knowledge-graph"
            target="_blank"
            rel="noreferrer"
        >
            Google Knowledge Graph Search API
        </a>
        for showing Freebase and Google Knowledge Graph entries.
    </p>
    <p class="mb-1">How to search:</p>
    <ul class="mb-2 list-disc list-inside ml-4">
        <li>
            <a href="#/search?q=The%20Beatles">Search by text</a>
        </li>
        <li>
            <a href="#/search?q=Q1299">Search by Wikidata ID</a>
        </li>
        <li>
            <a href="#/search?q=b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d">
                Search by MusicBrainz ID
            </a>
        </li>
        <li>
            <a href="#/search?q=0000 0001 2170 7484">Search by ISNI</a>
        </li>
        <li>
            <a href="#/search?q=https://www.allmusic.com/artist/mn0000754032">
                Search by link to Allmusic
            </a>
        </li>
        <li>
            <a href="#/search?q=https://www.imdb.com/name/nm1397313/">
                Search by link to IMDB
            </a>
        </li>
    </ul>

    <p class="mb-4">
        Also you can enter <code>/m/...</code> code,
        <code>/g/...</code> code or Google News topic ID (for example
        <code> CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3M1Y3pFU0FtVnVLQUFQAQ </code>
        or the whole
        <code>https://news.google.com/topics/</code>
        link) directly in the searchbox.
    </p>

    <p class="mb-1">Some entity examples:</p>
    <ul class="mb-4 list-disc list-inside ml-4">
        <li><a href="#/m/0282x">Douglas Adams</a>, English author</li>
        <li><a href="#/m/082db">Wolfgang Amadeus Mozart</a>, composer</li>
        <li><a href="#/m/0dzlbx">Iron Man</a>, film (2008)</li>
        <li><a href="#/m/015zfz">Airbus</a>, aerospace company</li>
        <li><a href="#/m/05qtj">Paris</a>, capital of France</li>
        <li>
            <a href="#/g/11h7dqtc4b">木下浩</a>
            &mdash; example of entry without translation
        </li>
        <li>
            <a href="#/m/010qx6n8">Savannah Stevenson</a>, singer &mdash;
            example of Freebase entry missing in Freebase dump
        </li>
    </ul>
    <p class="mb-1">
        The source code under <a
            href="https://github.com/AngryLoki/mreid-resolver/blob/master/LICENSE"
            target="_blank"
            rel="noreferrer"
        >
            MIT Licence
        </a>
        is available on
        <a
            href="https://github.com/AngryLoki/mreid-resolver"
            target="_blank"
            rel="noreferrer"
        >
            GitHub</a
        >. Please
        <a
            href="https://github.com/AngryLoki/mreid-resolver/issues"
            rel="noreferrer"
            target="_blank"
        >
            report bugs there</a
        >.
    </p>
</div>

<style lang="postcss">
    code {
        @apply text-rose-800 bg-gray-100 rounded-sm;
    }
</style>
