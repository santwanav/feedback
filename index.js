const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const app = express()
const port = 4000
const sqlite3 = require('sqlite3').verbose()
const { Client } = require('pg')
const client = new Client({
    host: '192.168.56.102',
    port: 5432,
    database: 'cs455',
    user: 'postgres',
    password: 'postgres'
})
client.connect()

let db = new sqlite3.Database('./feedback.db')

app.use(cors())
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('frontend'))

app.get('/results', (req,res) => {
	const text = 'SELECT q1, q2, q3, q4, suggestion from feedback';
	client.query(text, (err, response) => {
		res.json(response.rows);
	});
})

app.post('/', (req,res) => {
	errors = validate(req.body);
	if (errors.length > 0) {
		res.status(400).send(errors);
	}
	const keys = Object.keys(req.body);
	params = []
	for (let key of keys) {
		params.push(req.body[key])
	}
	const text = 'INSERT INTO feedback(q1, q2, q3, q4, suggestion) VALUES($1, $2, $3, $4, $5)'
	const values = params
	client.query(text, values, (err, res) => {
		if (err) {
			console.log(err.stack);
		}
		else {
			console.log('Success');
		}
	})
	res.send('Got a post request!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
function validate(response) {
        //const length = Array.from(data.keys()).length;
	console.log(response);
        errors = []
        for (let i = 1; i < 5; i++) {
                if (response["q"+i] === undefined || response["q"+i] > 5 || response["q"+i] < 1) {
                        errors.push("Question "+i+" has to be between 1 and 5");
                }
        }
        if (response["suggestion"].length > 500) {
                errors.push("The maximum length allowed is 500");
        }
        return errors;
}
