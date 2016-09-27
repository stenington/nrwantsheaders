# nrwantsheaders
If New Relic wants headers, New Relic gets headers

## Quick Start

1. [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
2. Set `NEW_RELIC_KEY_1` and `NEW_RELIC_APP_ID_1` to the API key and app id where you want deployments reported.
3. Find the value of `WEBHOOK_PATH_1` in the Heroku app config. Optionally change it if you'd like.
3. Point a [Heroku deploy hook](https://devcenter.heroku.com/articles/deploy-hooks#http-post-hook) from your Heroku app to `http://your-app.herokuapp.com/your-webhook-path`
4. Repeat steps 2 and 3 with `*_2` instead of `*_1` for all three config variables for each app you want reporting deployments.
5. Watch your app logs to see incoming Heroku deployment POSTs and outgoing New Relic API requests/responses.
