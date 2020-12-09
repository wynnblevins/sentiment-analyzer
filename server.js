const Sentiment = require('sentiment');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');
const commons = require('@market-predictor/market-predictor-commons');

require('dotenv').config()

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

var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient(),
    consumer = new Consumer(
        client,
        [
            { topic: 'chatter', partition: 0 }
        ],
        {
            autoCommit: false
        }
    );
consumer.on('message', function (message) {
	const sentimentResult = sentimentService.getSentiment(message);
	
	commons.SentimentRecord.create({ 
		id: sentimentResult.id,
		text: sentimentResult.text,
		score: sentimentResult.sentiment_score 
	})
});


if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve('build/')));
}

// ==== Starting Server =====
app.listen(PORT, () => {
	console.log(`App listening on PORT: ${PORT}`)
});