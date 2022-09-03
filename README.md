# Machine Readable Entity ID resolver

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## API keys

This repository and https://angryloki.github.io/mreid-resolver/ uses a free API key for [Google Knowledge Graph Search API](https://developers.google.com/knowledge-graph). This key is semi-public, restricted to localhost (5000/5173/5174/4173 ports) and angryloki.github.io. To create a new free key, use https://console.cloud.google.com/apis/credentials (Create Credentials -> API key).