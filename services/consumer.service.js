const { Kafka } = require('kafkajs');
const Sentiment = require('sentiment');
const sentimentAnalyzer = require('./sentiment.service')(Sentiment);

const kafka = new Kafka({
    clientId: 'sentiment-analyzer',
    brokers: [
        'localhost:9092', 
      ]
  })
   
  const consumer = kafka.consumer({ groupId: 'chatter' })
   
  const runConsumer = async () => {
    // Consuming
    await consumer.connect()
    await consumer.subscribe({ topic: 'chatter', fromBeginning: true })
    
    console.log(sentimentAnalyzer);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: {
            text: message.value.toString(),
            sentimentScore: sentimentAnalyzer.getSentiment(message.value.toString())
          }
        })
      },
    })
  }
  
  module.exports = runConsumer