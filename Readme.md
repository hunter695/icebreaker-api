# IceBreaker API

## Configuration File
- From "src/" directory of this project do:
```
$ touch config.js
```
- Get your Twitter API keys: https://apps.twitter.com/
- Inside "config.js" you should have:

```javascript
module.exports = {
	twitter: {
		consumer_key: '...',
		consumer_secret: '...',
		access_token: '...',
		access_token_secret: '...',
		timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
	},
	mongodb: {
		url: 'mongodb://localhost:27017/icebreaker',
	},
}
```

- Replace '...' with the corresponding keys.

## Install Dependencies

```
$ yarn
```

## Run Development Server
```
$ yarn start
```

Hosted at:
`http://localhost:8080`

## Initialize Database
From the root of the project directory, do:
```
$ babel-node --presets latest src/csv/load.js
```
This will load curated CSV data into two MongoDB collections:
`icebreaker_curated` and `pickuplines_curated`.
