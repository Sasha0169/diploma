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

  app.get("/cruise", (req, res) => {
    res.render("cruise page", {});
});

  app.get("/booking-form", (req, res)=>{
    res.render("booking form", {})
  })

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
    getCruises("Красноярск", ["По Енисею", "По Волге"], {startDate:"21.03.2025", endDate:"30.03.2025"}, ["1 - 4", "8 - 10"], ["Максим Горький", "Бирюса (СВП)"], "Речной").then(result => console.log(result));
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

// async function getInfoAboutCruises(){
//     try {
//         const result = await pool.query('SELECT * FROM public."cabins"'); // SQL-запрос
//         console.log(result.rows);
//         // console.log(result.rows[0].arrival_location.port)
//     } catch (error) {
//         console.error(error);
//     }
// }

async function getCruise(){

}


async function getCruises(placeOfDeparture, routes, dates, numberOfDay, liners, type){
    try {
      let query = `
        SELECT cruise_id, cruise_name, route_points, start_date, end_date, (end_date - start_date) AS duration_days, ship_id 
        FROM public."cruises"
       `;
      let additionalQuery;
      let routesId=[];
      let endOfQuery='';


      if(placeOfDeparture != undefined)
        endOfQuery += ` WHERE departure_location::jsonb @> \'{"port": {"city": "${placeOfDeparture}"}}\'`;


      if(routes != undefined){
        routes = routes.map(route=> `\'${route}\'`);
        let stringOfRoutes = routes.join(", ");
        additionalQuery =   ` 
          SELECT id 
          FROM public.routes  
          WHERE name IN (${stringOfRoutes});`;
        routesId = await pool.query(additionalQuery); 
        routesId = routesId.rows.map(routeId=> `${routeId.id}`)
        let sringOfRoutesId = routesId.join(", ");
        endOfQuery += endOfQuery!=""? " AND ": " WHERE ";
        endOfQuery += `route_id IN (${sringOfRoutesId})`;
      }


      if(dates != undefined){
        let {startDate, endDate} = dates;
        startDate = convertDateFormat(startDate);
        endDate = convertDateFormat(endDate);
        endOfQuery += endOfQuery!=""? " AND ": " WHERE ";
        endOfQuery += `start_date BETWEEN '${startDate}' AND '${endDate}'`;
      }


      if(numberOfDay != undefined){
        endOfQuery += endOfQuery!=""? " AND ": " WHERE ";
        for(let i = 0; i < numberOfDay.length; i++){
          numberOfDay[i] = numberOfDay[i].split(" - ");
          if(i>=1)
            endOfQuery += " OR "
          endOfQuery += `((end_date - start_date) BETWEEN INTERVAL '${numberOfDay[i][0]} days' AND INTERVAL '${numberOfDay[i][1]} days')`;
        }
      }


      if(liners != undefined){
        liners = liners.map(liner=> `\'${liner}\'`);
        let stringOfLiners = liners.join(", ");
        additionalQuery =   ` 
          SELECT ship_id 
          FROM public.ships  
          WHERE ship_name IN (${stringOfLiners});`;
        linersId = await pool.query(additionalQuery); 
        linersId = linersId.rows.map(routeId=> `${routeId.ship_id}`)
        let stringOfLinersID = linersId.join(", ");
        endOfQuery += endOfQuery!=""? " AND ": " WHERE ";
        endOfQuery += `ship_id IN (${stringOfLinersID})`;
      }
      

      if(type != undefined){
        endOfQuery += endOfQuery!=""? " AND ": " WHERE ";
        endOfQuery += `cruise_type = '${type}'`;
      }


      query += endOfQuery;
      const result = await pool.query(query); 
      return result.rows;
    } catch (error) {
        console.error(error);
    }
}

function convertDateFormat(dateStr) {
  const [day, month, year] = dateStr.split('.');
  return `${year}-${month}-${day}`;
}