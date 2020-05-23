module.exports = (Sentiment) => {
    const analyzer = {
        getSentiment: (sentence) => {
            const sentiment = new Sentiment();
            return sentiment.analyze(sentence);
        }
    };

    return analyzer;
}