const { Kafka } = require('kafkajs')
const Sentiment = require('sentiment');
const sentimentAnalyzer = require('./services/sentiment.service')(Sentiment);

const kafka = new Kafka({
  clientId: 'sentiment-analyzer',
  brokers: [
	  'localhost:9092', 
	]
})
 
const consumer = kafka.consumer({ groupId: 'chatter' })
 
const run = async () => {
  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'chatter', fromBeginning: true })
  
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
 
run().catch(console.error)