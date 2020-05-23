const Sentiment = require('sentiment');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');

// ===== Middleware ====
app.use(morgan('dev'))
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(bodyParser.json())

// ====== Error handler ====
app.use(function(err, req, res, next) {
	console.log('====== ERROR =======')
	console.error(err.stack)
	res.status(500)
});

const sentimentService = require('./services/sentiment.service')(Sentiment);
require('./controllers/sentiment.controller.js')(app, sentimentService);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve('build/')));
}

// ==== Starting Server =====
app.listen(PORT, () => {
	console.log(`App listening on PORT: ${PORT}`)
});