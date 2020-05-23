module.exports = (app, sentimentService) => {
    app.get('/api/sentiment/:sentence', (req, res) => {
        res.send(sentimentService.getSentiment(req.params.sentence));
    });
};