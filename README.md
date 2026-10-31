# relay-status

Source for [relay.shadowcrawler.dev](https://relay.shadowcrawler.dev): Relay's status page and Buffer sign-in callback.

- `site/` is published to GitHub Pages by `.github/workflows/pages.yml`.
- `site/status.json` is updated by Relay's CI after each build.
- `site/oauth/callback.html` forwards an OAuth result to the Relay app on `127.0.0.1`. It keeps no data and loads no third-party code.

Run the tests with `node --test test/forward.test.js`.
