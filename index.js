const express = require('express');
const app = express();
const morgan = require('morgan');
const cors=require('cors')
app.use(cors({
    origin: '*',
}))
app.use(express.static('dist'))
let data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.use(express.json());

morgan.token('body', (request, response) => {
    return JSON.stringify(request.body);
});

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = data.find(person => person.id === id);
    if (!person) {
        return response.status(404).end();
    } else {
        return response.json(person);
    }
});

app.get('/info', (request, response) => {
    let date = new Date();
    response.send('<p>Phonebook has info for ' + data.length + ' people</p><p>' + date + '</p>');
});

app.get('/api/persons', (request, response) => {
    response.json(data);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    data = data.filter(person => person.id !== id);
    response.status(204).end();
});

const getId = () => {
    let maxId = (data.length > 0) ? Math.max(...data.map(person => Number(person.id))) : 0;
    return String(maxId + 1);
};

app.post('/api/persons/', (request, response) => {
    const body = request.body;
    const duplicate = data.some(data => data.name === body.name);
    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'content missing' });
    }
    if (duplicate) {
        return response.status(400).json({ error: 'name must be unique' });
    }
    const person = {
        'id': getId(),
        'name': body.name,
        'number': body.number
    };
    data = data.concat(person);
    response.json(person);
});
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });


