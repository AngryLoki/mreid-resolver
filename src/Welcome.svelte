<script lang="ts">
    import { Jumbotron } from "sveltestrap";
</script>

<Jumbotron>
    <h1 class="display-4">Machine-Readable Entity IDs resolver</h1>
    <p class="lead">
        A simple UI on top of
        <a href="https://developers.google.com/knowledge-graph">
            Google Knowledge Graph Search API
        </a>
        for showing Freebase and Google Knowledge Graph entries.
    </p>
    <p class="mb-1">Some entity examples:</p>
    <ul>
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
</Jumbotron>
