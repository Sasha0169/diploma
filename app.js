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
app.use(express.json());

app.listen(3000, () => {
    console.log(`Сервер запущен на http://localhost:3000`);
  });


  app.get("/", (req, res) => {
    getDepartureCities().then(cities => {
      getRoutes().then(routes => {
        getShips().then(ships => {
          res.render("index", {cities: cities, routes: routes, ships: ships})
        }
        )
      })
      });
  });

  app.get("/getData", (req, res) => {
    getDepartureCities().then(cities => {
      getRoutes().then(routes => {
        getShips().then(ships => {
          console.log({cities: cities, routes: routes, ships: ships})
          res.json({cities: cities, routes: routes, ships: ships})
        }
        )
      })
      });
  });

  app.post("/getCruises", (req, res) => {
    console.log(req.body);
    getCruises(req.body).then(result => res.json(result));
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
    //   email: "sdkll@gmail.ru",
    //   phoneNumber: "73493293935",
    //   documentData: {
    //     type:"pasport",
    //     passport_series: "4509",
    //     passport_number: "123456",
    //     issue_date: "2010-07-20",
    //     issued_by: "Отделение УФМС России по г. Москве"
    //   }
    // })
    // registerCustomer({
    //   firstName: "Александр",
    //   lastName: "Иванов",
    //   middleName: "Иваныч",
    //   birthDate: "23-07-2000",
    //   gender: "Мужской",
    //   citizenship: "Россия",
    //   email: "sdkll@gmail.ru",
    //   phoneNumber: "73493293935",
    //   documentData: {
    //     type:"pasport",
    //     passport_series: "4509",
    //     passport_number: "123456",
    //     issue_date: "2010-07-20",
    //     issued_by: "Отделение УФМС России по г. Москве"
    //   }
    // })
    // createOrder({
    //   cruiseId: 3,
    //   orderInformation: [{
    //     ticketId: 2,
    //     passengers: [
    //       {
    //         firstName: "Александр",
    //         lastName: "Иванов",
    //         middleName: "Иваныч",
    //         birthDate: "23-07-2000",
    //         gender: "Мужской",
    //         citizenship: "Россия",
    //         email: "sdkll@gmail.ru",
    //         phoneNumber: "73493293935",
    //         documentData: {
    //           type:"pasport",
    //           passport_series: "4509",
    //           passport_number: "123456",
    //           issue_date: "2010-07-20",
    //           issued_by: "Отделение УФМС России по г. Москве"
    //         }},
    //         {firstName: "Александр",
    //           lastName: "Иванов",
    //           middleName: "Иваныч",
    //           birthDate: "23-07-2000",
    //           gender: "Мужской",
    //           citizenship: "Россия",
    //           email: "sdkll@gmail.ru",
    //           phoneNumber: "73493293935",
    //           documentData: {
    //             type:"pasport",
    //             passport_series: "4509",
    //             passport_number: "123456",
    //             issue_date: "2010-07-20",
    //             issued_by: "Отделение УФМС России по г. Москве"
    //           }}
    //     ]
    //   },{ticketId: 3,
    //     passengers: [
    //       {
    //         firstName: "Александр",
    //         lastName: "Иванов",
    //         middleName: "Иваныч",
    //         birthDate: "23-07-2000",
    //         gender: "Мужской",
    //         citizenship: "Россия",
    //         email: "sdkll@gmail.ru",
    //         phoneNumber: "73493293935",
    //         documentData: {
    //           type:"pasport",
    //           passport_series: "4509",
    //           passport_number: "123456",
    //           issue_date: "2010-07-20",
    //           issued_by: "Отделение УФМС России по г. Москве"
    //         }}
    //     ]}],
    //   customer: {
    //     userId: 10,
    //     firstName: "Александр",
    //     lastName: "Иванов",
    //     middleName: "Иваныч",
    //     birthDate: "23-07-2000",
    //     gender: "Мужской",
    //     citizenship: "Россия",
    //     email: "sdkll@gmail.ru",
    //     phoneNumber: "73493293935",
    //     documentData: {
    //       type:"pasport",
    //       passport_series: "4509",
    //       passport_number: "123456",
    //       issue_date: "2010-07-20",
    //       issued_by: "Отделение УФМС России по г. Москве"
    //     }
    //   }
    // })
  })
  .catch(err => console.error('❌ Ошибка подключения к PostgreSQL:', err));

app.use(express.json());


app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public."Users"');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера');
    }
});

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

async function registerCustomer(personalData){
  let query1 = `
  INSERT INTO public.customers( last_name, first_name, middle_name, birth_date, phone_number, email, gender, citizenship, document_data)
  VALUES ('${personalData.lastName}', '${personalData.firstName}', '${personalData.middleName}', '${personalData.birthDate}', '${personalData.phoneNumber}', '${personalData.email}', '${personalData.gender}', '${personalData.citizenship}', '${JSON.stringify(personalData.documentData)}')`
  await pool.query(query1);
}

async function registerUser(personalData){
  if(checkingEmailAndPhone(personalData.email, personalData.phoneNumber)){
    let result = await argon2.hash(personalData.password);
    let query1 = `
    INSERT INTO public.customers( last_name, first_name, middle_name, birth_date, phone_number, email, gender, citizenship, document_data)
    VALUES ('${personalData.lastName}', '${personalData.firstName}', '${personalData.middleName}', '${personalData.birthDate}', '${personalData.phoneNumber}', '${personalData.email}', '${personalData.gender}', '${personalData.citizenship}', '${JSON.stringify(personalData.documentData)}')
    RETURNING customer_id;`
    let result1 = await pool.query(query1);
    result1 = result1.rows[0].customer_id;
    let query = `
    INSERT INTO public.users( last_name, first_name, middle_name, birth_date, phone_number, email, password_hash, gender, citizenship, customer_id)
    VALUES ('${personalData.lastName}', '${personalData.firstName}', '${personalData.middleName}', '${personalData.birthDate}', '${personalData.phoneNumber}', '${personalData.email}', '${result}', '${personalData.gender}', '${personalData.citizenship}', '${result1}');`
    await pool.query(query);
    return true;
  }
  else
    return false;
}

async function getUserOrders(userId){
  let query1 = `
    SELECT order_id, user_id, people_count, payment_amount, booking_date, payment_status, additional_services
	  FROM public.orders
	  WHERE user_id=${userId};`
    let result1 = await pool.query(query1);
    return result1.rows;
}

async function getInfoAboutUser(userId){
  let query1 = `
    SELECT *
	  FROM public.users
	  WHERE user_id=${userId};`
    let result1 = await pool.query(query1);
    console.log(result1.rows[0])
    return result1.rows[0];
}

async function getDepartureCities() {
  let query1 = `
    SELECT *
	  FROM public.cities;`
    let result1 = await pool.query(query1);
    return result1.rows;
}

async function getRoutes() {
  let query = `
    SELECT *
	  FROM public.routes;`
    let result = await pool.query(query);
    return result.rows;
}

async function getShips() {
  let query = `
    SELECT ship_name, ship_id
	  FROM public.ships;`
    let result = await pool.query(query);
    return result.rows;
}


async function changingUserData(changedData, userId){

}

async function createOrder(bookingInformation){

}

async function checkingEmailAndPhone(email, phoneNumber){
  let query = `
  SELECT user_id
	FROM public.users
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

async function getCruises(params){
    try {
      let query = `
        SELECT cruise_id, cruise_name, route_points, start_date, end_date, (end_date - start_date) AS duration_days, ship_id 
        FROM public."cruises"
       `;
      let additionalQuery;
      let routesId=[];
      let endOfQuery='';

      let placeOfDeparture = params.departureCity;
      let routes = params.routes;
      let date = params.date;
      let numberOfDay = params.numberOfDay;
      let ships = params.ships;
      let type = params.typeOfCruise;

      if(placeOfDeparture != undefined)
        // endOfQuery += ` WHERE departure_location::jsonb @> \'{"port": {"city": "${placeOfDeparture}"}}\'`;
        endOfQuery += ` WHERE departure_city_id = \'${placeOfDeparture}\'`;

      if(type != undefined){
        endOfQuery += endOfQuery!=""? " AND ": " WHERE ";
        endOfQuery += `cruise_type = '${type}'`;
      }
        

      if(routes != []){
        // routes = routes.map(route=> `\'${route}\'`);
        // let stringOfRoutes = routes.join(", ");
        // additionalQuery =   ` 
        //   SELECT route_id 
        //   FROM public.routes  
        //   WHERE name IN (${stringOfRoutes});`;
        // routesId = await pool.query(additionalQuery); 
        // routesId = routesId.rows.map(routeId=> `${routeId.id}`)
        let stringOfRoutesId = routes.join(", ");
        endOfQuery += endOfQuery!=""? " AND ": " WHERE ";
        endOfQuery += `route_id IN (${stringOfRoutesId})`;
      }

      if(date != []){
        startDate = convertDateFormat(date[0]);
        endDate = convertDateFormat(date[1]);
        endOfQuery += endOfQuery!=""? " AND ": " WHERE ";
        endOfQuery += `start_date BETWEEN '${startDate}' AND '${endDate}'`;
      }

      if(numberOfDay != []){
        numberOfDay = numberOfDay.map(a => {
          if(a == "1")
            return ["1", "4"]
          if(a == '2')
            return ["5", "7"]
          if(a == '3')
            return ["8", "10"]
          if(a == '4')
            return ["11", "14"]
          if(a == '3')
            return ["15", "365"]
        })
        endOfQuery += endOfQuery!=""? " AND ": " WHERE ";
        for(let i = 0; i < numberOfDay.length; i++){
          if(i>=1)
            endOfQuery += " OR "
          endOfQuery += `((end_date - start_date) BETWEEN INTERVAL '${numberOfDay[i][0]} days' AND INTERVAL '${numberOfDay[i][1]} days')`;
        }
      }

      if(ships != []){
        // ships = ships.map(liner=> `\'${liner}\'`);
        // let stringOfLiners = ships.join(", ");
        // additionalQuery =   ` 
        //   SELECT ship_id 
        //   FROM public.ships  
        //   WHERE ship_name IN (${stringOfShips});`;
        // shipsId = await pool.query(additionalQuery); 
        // shipsId = shipsId.rows.map(shipId=> `${shipId.ship_id}`)
        let stringOfShipsID = ships.join(", ");
        endOfQuery += endOfQuery!=""? " AND ": " WHERE ";
        endOfQuery += `ship_id IN (${stringOfShipsID})`;
      }
      

      if(type != ''){
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

// async function createCruises(cruiseId){
//   let query = `
//         SELECT cruise_description, cruise_name, route_points, start_date, end_date, departure_location, arrival_location, ship_id, cruise_type, cruise_id, day_by_day_info, route_id
//         FROM public."cruises"
//         WHERE cruise_id = ${cruiseId}
//        `;
//        const result = await pool.query(query); 
//        console.log(result.rows);
//       let additionalQuery;
//       let routesId=[];
//       let endOfQuery='';
// }

function convertDateFormat(dateStr) {
  const [day, month, year] = dateStr.split('.');
  return `${year}-${month}-${day}`;
}