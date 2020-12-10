const Sentiment = require('sentiment');
const commons = require('@market-predictor/market-predictor-commons');

require('dotenv').config()

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
	
consumer.on('error', (err) => {
	console.log(err);
	console.log('error encountered');
});	
consumer.on('message', function (message) {
	console.log('message received');
	const sentimentResult = sentimentService.getSentiment(message);
	
	commons.SentimentRecord.create({ 
		id: sentimentResult.id,
		text: sentimentResult.text,
		score: sentimentResult.sentiment_score 
	})
});