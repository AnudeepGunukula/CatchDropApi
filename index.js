const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());          // middleware that converts reqbody to json


app.listen(
    PORT,
    () => { console.log(`it's live on http://localhost:${PORT}`); }
)

app.get('/', (req, res) => {

    res.status(200).send({
        name: 'johnwick',
        occupation: 'assasin'
    })

})

app.post('/', (req, res) => {

    const { name, occupation } = req.body;

    if (!req.body) {
        res.status(418).send({ message: 'this api call needs a body' });
    }

    res.status(200).send({ data: `the object is created with name:${name} and occupation:${occupation}` });
})
