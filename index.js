#!/usr/bin/env node

const http = require('http');
const readline = require('readline');
const myAPIKey = process.env.myAPIKey;
require('dotenv').config();

function getWeather() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Введите название города: ', (city) => {
    const url = `http://api.weatherstack.com/current?access_key=${myAPIKey}&query=${city}`;

    http
      .get(url, (res) => {
        const { statusCode } = res;
        if (statusCode !== 200) {
          console.log(`statusCode: ${statusCode}`);
          return;
        }
        res.setEncoding('utf-8');
        let rowData = '';
        res.on('data', (chunk) => (rowData += chunk));
        res.on('end', () => {
          let parseDate = JSON.parse(rowData);
          const temperature = parseDate.current.temperature;
          console.log(`Город: ${parseDate.location.name}`);
          console.log(`Температура: ${temperature} градусов`);
        });
      })
      .on('error', (err) => {
        console.error('Произошла ошибка: ', err);
      });
    rl.close();
  });
}

getWeather();
