
const bodyParser = require('body-parser');
const express = require('express');
const https = require('https');
const path = require('path');

const app = express();
const view = path.join(__dirname, '/public/Index.html');

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Route to serve the HTML form
app.get('/', (req, resp) => {
    resp.sendFile(view);
});

// POST route to handle weather request
app.post('/', (req, resp) => {
    const query = req.body.cityname;
    const apiKey = '120060344bef2ea2ac45bb141bfc3e3f';
    const We_Url = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + apiKey + '&units=metric';

    https.get(We_Url, (response) => {
        let data = '';

        // Accumulate the data from the API
        response.on('data', (chunk) => {
            data += chunk;
        });

        // Once all data is received
        response.on('end', () => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;

            // Send the response back to the user
            resp.write(`<h1>The temperature in ${query} is ${temp}°C</h1>`);
            resp.write(`<h2>Weather description: ${description}</h2>`);
            resp.end();
        });
    }).on('error', (err) => {
        console.error('Error fetching weather data:', err);
        resp.send('Error fetching weather data');
    });
});

// Start the server
app.listen(1000, () => {
    console.log('Server is running on port 1000');
});
