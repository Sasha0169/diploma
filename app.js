const fs = require("fs");
// var sql = require("mssql/msnodesqlv8");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const argon2 = require('argon2');

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
  database: 'MorTur', // Имя базы данных
  password: '010669s', // Пароль пользователя
  port: 5432,              // Порт PostgreSQL (по умолчанию 5432)
});

pool.connect()
  .then(() =>{ console.log('✅ Успешное подключение к PostgreSQL');
    // getCruises("Красноярск", ["По Енисею", "По Волге"], {startDate:"21.03.2025", endDate:"30.03.2025"}, ["1 - 4", "8 - 10"], ["Максим Горький", "Бирюса (СВП)"], "Речной").then(result => console.log(result));
    // getCruise(3).then(result => console.log(result));
    // authenticationByEmail("scfe@mail.ru", "01gd4545df").then(result=> console.log(result));
    // authenticationByPhoneNumber("79856810350", "01gd4545df").then(result=> console.log(result));
    // registerUser({password: "jaaha0169",
    //   firstName: "Александр",
    //   lastName: "Иванов",
    //   middleName: "Иваныч",
    //   birthDate: "23-07-2000",
    //   gender: "Мужской",
    //   citizenship: "Россия",
    //   email: "sdfkll@gmail.ru",
    //   phoneNumber: "73493293932"
    // })
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

async function getCruise(cruiseID){
  try {
    let query = `
      SELECT *
      FROM public."cruises"
      WHERE cruise_id=${cruiseID}
     `;
    let additionalQuery;
    let routesId=[];
    let endOfQuery='';
    query += endOfQuery;
    const result = await pool.query(query); 
    return result.rows;
  } catch (error) {
      console.error(error);
  }
}
// 01gd4545df

async function registerUser(personalData){
  if(checkingEmailAndPhone(personalData.email, personalData.phoneNumber)){
    let result = await argon2.hash(personalData.password);
    let query = `
    INSERT INTO public.clients( last_name, first_name, middle_name, birth_date, phone_number, email, password_hash, gender, citizenship, registration)
    VALUES ('${personalData.lastName}', '${personalData.firstName}', '${personalData.middleName}', '${personalData.birthDate}', '${personalData.phoneNumber}', '${personalData.email}', '${result}', '${personalData.gender}', '${personalData.citizenship}', 'true');`
    await pool.query(query);
    return true;
  }
  else
    return false;
}

async function 

async function changingUserData(changedData, userId){

}

async function checkingEmailAndPhone(email, phoneNumber){
  let query = `
  SELECT client_id
	FROM public.clients
	WHERE email='${email}' OR phone_number='${phoneNumber}';`
  const result = await pool.query(query); 
  if(result.rows==0)
    return true;
  else
    return false;
}

async function authenticationByEmail (email, password){
  let query = `
  SELECT client_id, last_name, first_name, password_hash
	FROM public.clients
	WHERE email='${email}'`
  const result = await pool.query(query); 
  if(result.rows.length==0){
    return new Error;
  }
  let result2 = await argon2.verify(result.rows[0].password_hash, password);
  if(result2)
    return true;
  else
    return new Error;
}

async function authenticationByPhoneNumber (phoneNumber, password){
  let query = `
  SELECT client_id, last_name, first_name, password_hash
	FROM public.clients
	WHERE phone_number='${phoneNumber}'`
  const result = await pool.query(query); 
  if(result.rows.length==0){
    return false;
  }
  let result2 = await argon2.verify(result.rows[0].password_hash, password);
  if(result2)
    return true;
  else
    return false;
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

async function createCruises(cruiseId){
  let query = `
        SELECT cruise_description, cruise_name, route_points, start_date, end_date, departure_location, arrival_location, ship_id, cruise_type, cruise_id, day_by_day_info, route_id
        FROM public."cruises"
        WHERE cruise_id = ${cruiseId}
       `;
       const result = await pool.query(query); 
       console.log(result.rows);
      let additionalQuery;
      let routesId=[];
      let endOfQuery='';
}

function convertDateFormat(dateStr) {
  const [day, month, year] = dateStr.split('.');
  return `${year}-${month}-${day}`;
}