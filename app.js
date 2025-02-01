const fs = require("fs");
// var sql = require("mssql/msnodesqlv8");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.use(express.static("css"));
app.use(express.static("images"));
app.use(express.static("fonts"));
app.use(express.static("scripts"));
app.use(express.static("html"))
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set('views', __dirname + '/views'); 

app.listen(3000, () => {
    console.log(`Сервер запущен на http://localhost:3000`);
  });


  app.get("/", (req, res) => {
      res.render("index", {});
  });

  const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',   // Ваш пользователь PostgreSQL
  host: 'localhost',       // Хост базы данных (или IP-адрес)
  database: 'postgres', // Имя базы данных
  password: '010669s', // Пароль пользователя
  port: 5432,              // Порт PostgreSQL (по умолчанию 5432)
});

pool.connect()
  .then(() =>{ console.log('✅ Успешное подключение к PostgreSQL');
    a();
  })
  .catch(err => console.error('❌ Ошибка подключения к PostgreSQL:', err));

// module.exports = pool;

// const express = require('express');
// const pool = require('./db'); // Импортируем pool из db.js

// const app = express();
app.use(express.json()); // Для обработки JSON-запросов

// Пример запроса к БД: получение всех пользователей
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public."Users"'); // SQL-запрос
        res.json(result.rows); // Отправляем данные в JSON
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера');
    }
});

function a(){
    try {
        const result = pool.query('SELECT * FROM public."Users"'); // SQL-запрос
        console.log(result.rows);
    } catch (error) {
        console.error(error);
    }
}