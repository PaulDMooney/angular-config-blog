const express = require('express');
const app = express()

const port = 3000;

app.get('/api/servertime', (req, res) => {
    console.log('Request made');
    res.json({servertime: new Date().toISOString()})
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
