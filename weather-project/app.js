const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
const port = 8000;


app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post('/', (req, res) => {
        const query = req.body.cityName;
        const apiKey = "025cece007aa7f62fe9d42a9201bbbb7";
        const unit = "metric";
    
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid="+ apiKey +"&units=" + unit
    
        https.get(url, (response) => {
            console.log(response.statusCode)
    
            response.on("data", (data) => {
                const weatherData = JSON.parse(data)
                const icon = weatherData.weather[0].icon
                const iconUrl = "http://openweathermap.org/img/wn/"+ icon + "@2x.png"
    
                res.write("<p>Weather is currently " + weatherData.weather[0].description + "</p>")
                res.write("<p>The temperature in "+ query +"is currently " + weatherData.main.temp + " degrees celcius</p>")
                res.write("<img src=" + iconUrl + ">")
                res.send();
    
            })
        })
})



app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})