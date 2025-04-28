const fs = require("fs");
// import fetch from 'node-fetch';
// var sql = require("mssql/msnodesqlv8");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
// const fetch = require('node-fetch');

app.use(express.static("css"));
app.use(express.static("images"));
app.use(express.static("fonts"));
app.use(express.static("scripts"));
app.use(express.static("html"));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.json());

app.listen(3000, () => {
  console.log(`Сервер запущен на http://localhost:3000`);
});

app.get("/", (req, res) => {
  getDepartureCities().then((cities) => {
    getRoutes().then((routes) => {
      getShips().then((ships) => {
        getCruises().then((cruises) =>
          res.render("index", {
            cities: cities,
            routes: routes,
            ships: ships,
            cruises: cruises,
          })
        );
      });
    });
  });
});

app.get("/getData", (req, res) => {
  getDepartureCities().then((cities) => {
    getRoutes().then((routes) => {
      getShips().then((ships) => {
        res.json({ cities: cities, routes: routes, ships: ships });
      });
    });
  });
});

app.post("/getCruises", (req, res) => {
  console.log(req.body);
  getCruises(req.body).then((result) => res.json(result));
});

//   app.get("/cruise", (req, res) => {
//     res.render("cruise page", {});
// });

// app.post("/cruise", (req, res) => {
//   console.log(req.body);
//   getCruise(req.body.value).then(a=>res.render("cruise page", a));

// });

app.get("/cruise/:id", (req, res) => {
  const cruiseId = req.params.id;
  getCruise(cruiseId)
    .then((data) => {
      console.log(data.decks[0].cabins[0].prices);
      res.render("cruise page", data);
    })
    .catch((err) => {
      res.status(500).send("Ошибка при получении данных круиза");
    });
});

app.post("/login", (req, res) => {
  console.log(req.body);
  authenticationByEmail(req.body).then((user) => {
    const token = jwt.sign({ userId: user.user_id }, "secret-key", {
      expiresIn: "1h",
    });
    res.json({ success: true, token });
  });
});

app.get("/booking-form", (req, res) => {
  res.render("booking form", {});
});

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres", // Ваш пользователь PostgreSQL
  host: "localhost", // Хост базы данных (или IP-адрес)
  database: "MorTur", // Имя базы данных
  password: "010669s", // Пароль пользователя
  port: 5432, // Порт PostgreSQL (по умолчанию 5432)
});

pool
  .connect()
  .then(() => {
    console.log("✅ Успешное подключение к PostgreSQL");
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
  .catch((err) => console.error("❌ Ошибка подключения к PostgreSQL:", err));

app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public."Users"');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

async function getCruise(cruiseID) {
  try {
    let query = `
      SELECT *, (end_date - start_date) AS duration_days
      FROM public."cruises"
      WHERE cruise_id=${cruiseID}
     `;
    let additionalQuery;
    let routesId = [];
    let endOfQuery = "";
    query += endOfQuery;
    const result = await pool.query(query);
    let cruise = result.rows[0];
    cruise.ship_name = await getShipName(cruise.ship_id);
    cruise.shipDescription = await getShortShipDescription(cruise.ship_id);
    cruise.start_date = formatDateInfo(cruise.start_date);
    cruise.end_date = formatDateInfo(cruise.end_date);
    cruise.duration_days = cruise.duration_days.days;
    for (let i = 0; i < cruise.day_by_day_info.length; i++) {
      cruise.day_by_day_info[i].cities.forEach((element) => {
        element.arrival_time = getTimeFromDate(element.arrival_time);
        element.departure_time = getTimeFromDate(element.departure_time);
        element.stop_time = convertTimeToRussianFormat(element.stop_time);
        console.log(element.arrival_time);
      });
      cruise.day_by_day_info[i].date = formatDate(
        cruise.day_by_day_info[i].date
      );
    }
    cruise.decks = await getDecksInformation(cruise.ship_id);
    for (let i = 0; i < cruise.decks.length; i++) {
      cruise.decks[i].cabins = await getCabinsInformation(cruise.ship_id, cruise.decks[i].deck_id);
      for (let j = 0; j < cruise.decks[i].cabins.length; j++) {
        cruise.decks[i].cabins[j].tickets = await getTicketsInformation(cruise.cruise_id, cruise.decks[i].cabins[j].cabin_id);
        let count = 0;
        for (let k = 0; k< cruise.decks[i].cabins[j].tickets.length; k++){
          if(cruise.decks[i].cabins[j].tickets[k].status == "free"){
            count += 1;
          }
        }
        cruise.decks[i].cabins[j].numberOfFreeTickets = count;
      }
    }
    // cruise.tickets = await getTicketsInformation(cruise.cruise_id);
    // cruise.cabins = await getCabinsInformation(cruise.ship_id);
    const response = await fetch("https://api.github.com/repos/Sasha0169/diploma/contents/images/photos/cruises/11/gallery", {
      headers: {
        'Authorization': ''
      }
    });
    const data = await response.json();
    cruise.numberOfPhotos = data.length;
    return cruise;
  } catch (error) {
    console.error(error);
  }
}
// 01gd4545df
// scfe@mail.ru

async function getDecksInformation(shipId){
  let query1 = `
    SELECT deck_id, deck_scheme, deck_name, deck_scheme
	  FROM public.decks
	  WHERE ship_id=${shipId};`;
  let result1 = await pool.query(query1);
  return result1.rows;
}

async function getCabinsInformation(shipId, deckId){
  let query1 = `
    SELECT cabin_id, deck_id, cabin_description, cabin_name, total_count, cabin_numbers, single_occupancy, capacity
	  FROM public.cabins
	  WHERE ship_id=${shipId} AND deck_id=${deckId};`;
  let result1 = await pool.query(query1);
  return result1.rows;
}

async function getTicketsInformation(cruiseId, cabinId){
  let query1 = `
    SELECT place, prices, status
	  FROM public.tickets
	  WHERE cruise_id=${cruiseId} AND cabin_id=${cabinId};`;
  let result1 = await pool.query(query1);
  // console.log(result1.rows)
  return result1.rows;
}

function formatDateInfo(date) {
  const day = date.getDate();
  const weekday = date
    .toLocaleString("ru-RU", { weekday: "short" })
    .slice(0, 2);
  const month = date
    .toLocaleString("ru-RU", { month: "short" })
    .substring(0, 3);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;
  const year = date.getFullYear();

  return {
    day,
    weekday,
    month,
    time,
    year,
  };
}

function formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const daysOfWeek = [
    "воскресенье",
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота",
  ];
  const weekday = daysOfWeek[date.getDay()];

  return {
    date: `${day}.${month}.${year}`,
    weekday,
  };
}

function getTimeFromDate(dateString) {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function convertTimeToRussianFormat(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (minutes === 0) {
    return `${hours}ч`;
  }
  return `${hours}ч ${minutes}м`;
}

async function registerCustomer(personalData) {
  let query1 = `
  INSERT INTO public.customers( last_name, first_name, middle_name, birth_date, phone_number, email, gender, citizenship, document_data)
  VALUES ('${personalData.lastName}', '${personalData.firstName}', '${
    personalData.middleName
  }', '${personalData.birthDate}', '${personalData.phoneNumber}', '${
    personalData.email
  }', '${personalData.gender}', '${
    personalData.citizenship
  }', '${JSON.stringify(personalData.documentData)}')`;
  await pool.query(query1);
}

async function registerUser(personalData) {
  if (checkingEmailAndPhone(personalData.email, personalData.phoneNumber)) {
    let result = await argon2.hash(personalData.password);
    let query1 = `
    INSERT INTO public.customers( last_name, first_name, middle_name, birth_date, phone_number, email, gender, citizenship, document_data)
    VALUES ('${personalData.lastName}', '${personalData.firstName}', '${
      personalData.middleName
    }', '${personalData.birthDate}', '${personalData.phoneNumber}', '${
      personalData.email
    }', '${personalData.gender}', '${
      personalData.citizenship
    }', '${JSON.stringify(personalData.documentData)}')
    RETURNING customer_id;`;
    let result1 = await pool.query(query1);
    result1 = result1.rows[0].customer_id;
    let query = `
    INSERT INTO public.users( last_name, first_name, middle_name, birth_date, phone_number, email, password_hash, gender, citizenship, customer_id)
    VALUES ('${personalData.lastName}', '${personalData.firstName}', '${personalData.middleName}', '${personalData.birthDate}', '${personalData.phoneNumber}', '${personalData.email}', '${result}', '${personalData.gender}', '${personalData.citizenship}', '${result1}');`;
    await pool.query(query);
    return true;
  } else return false;
}

async function getUserOrders(userId) {
  let query1 = `
    SELECT order_id, user_id, people_count, payment_amount, booking_date, payment_status, additional_services
	  FROM public.orders
	  WHERE user_id=${userId};`;
  let result1 = await pool.query(query1);
  return result1.rows;
}

async function getInfoAboutUser(userId) {
  let query1 = `
    SELECT *
	  FROM public.users
	  WHERE user_id=${userId};`;
  let result1 = await pool.query(query1);
  return result1.rows[0];
}

async function getDepartureCities() {
  let query1 = `
    SELECT *
	  FROM public.cities;`;
  let result1 = await pool.query(query1);
  return result1.rows;
}

async function getRoutes() {
  let query = `
    SELECT *
	  FROM public.routes;`;
  let result = await pool.query(query);
  return result.rows;
}

async function getShips() {
  let query = `
    SELECT ship_name, ship_id
	  FROM public.ships;`;
  let result = await pool.query(query);
  return result.rows;
}

async function getShipName(shipId) {
  let query = `
    SELECT ship_name
	  FROM public.ships
    WHERE ship_id=${shipId}`;
  let result = await pool.query(query);
  return result.rows[0].ship_name;
}

async function getShortShipDescription(shipId) {
  let query = `
    SELECT ship_description
	  FROM public.ships
    WHERE ship_id=${shipId}`;
  let result = await pool.query(query);
  return result.rows[0].ship_description.shortDescription;
}

async function changingUserData(changedData, userId) {}

async function createOrder(bookingInformation) {}

async function checkingEmailAndPhone(email, phoneNumber) {
  let query = `
  SELECT user_id
	FROM public.users
	WHERE email='${email}' OR phone_number='${phoneNumber}';`;
  const result = await pool.query(query);
  if (result.rows == 0) return true;
  else return false;
}

async function authenticationByEmail(data) {
  let query = `
  SELECT user_id, last_name, first_name, password_hash
	FROM public.users
	WHERE email='${data.email}'`;
  const result = await pool.query(query);
  if (result.rows.length == 0) {
    return new Error();
  }
  let result2 = await argon2.verify(
    result.rows[0].password_hash,
    data.password
  );
  if (result2) return result.rows[0];
  else return new Error();
}

async function authenticationByPhoneNumber(phoneNumber, password) {
  let query = `
  SELECT client_id, last_name, first_name, password_hash
	FROM public.clients
	WHERE phone_number='${phoneNumber}'`;
  const result = await pool.query(query);
  if (result.rows.length == 0) {
    return false;
  }
  let result2 = await argon2.verify(result.rows[0].password_hash, password);
  if (result2) return true;
  else return false;
}

async function getCruises(params = {}) {
  try {
    let query = `
        SELECT cruise_id, cruise_name, route_points, start_date, end_date, (end_date - start_date) AS duration_days, ship_id, minimum_price, minimum_discounted_price 
        FROM public."cruises"
       `;
    let additionalQuery;
    let routesId = [];
    let endOfQuery = "";

    let placeOfDeparture =
      params.departureCity == undefined ? undefined : params.departureCity;
    let routes = params.routes == undefined ? undefined : params.routes;
    let date = params.date == undefined ? undefined : params.date;
    let numberOfDay =
      params.numberOfDay == undefined ? undefined : params.numberOfDay;
    let ships = params.ships == undefined ? undefined : params.ships;
    let type =
      params.typeOfCruise == undefined ? undefined : params.typeOfCruise;

    if (placeOfDeparture != undefined)
      // endOfQuery += ` WHERE departure_location::jsonb @> \'{"port": {"city": "${placeOfDeparture}"}}\'`;
      endOfQuery += ` WHERE departure_city_id = \'${placeOfDeparture}\'`;

    if (type != undefined) {
      endOfQuery += endOfQuery != "" ? " AND " : " WHERE ";
      endOfQuery += `cruise_type = '${type}'`;
    }

    console.log(routes);
    if (routes != [] && routes != undefined) {
      let stringOfRoutesId = routes.join(", ");
      endOfQuery += endOfQuery != "" ? " AND " : " WHERE ";
      endOfQuery += `route_id IN (${stringOfRoutesId})`;
    }

    if (date != [] && date != undefined) {
      console.log(date);
      startDate = convertDateFormat(date[0]);
      endDate = convertDateFormat(date[1]);
      endOfQuery += endOfQuery != "" ? " AND " : " WHERE ";
      endOfQuery += `start_date BETWEEN '${startDate}' AND '${endDate}'`;
    }

    if (numberOfDay != [] && numberOfDay != undefined) {
      numberOfDay = numberOfDay.map((a) => {
        if (a == "1") return ["1", "4"];
        if (a == "2") return ["5", "7"];
        if (a == "3") return ["8", "10"];
        if (a == "4") return ["11", "14"];
        if (a == "3") return ["15", "365"];
      });
      endOfQuery += endOfQuery != "" ? " AND " : " WHERE ";
      for (let i = 0; i < numberOfDay.length; i++) {
        if (i >= 1) endOfQuery += " OR ";
        endOfQuery += `((end_date - start_date) BETWEEN INTERVAL '${numberOfDay[i][0]} days' AND INTERVAL '${numberOfDay[i][1]} days')`;
      }
    }

    console.log(ships);
    if (ships != [] && ships != undefined) {
      // ships = ships.map(liner=> `\'${liner}\'`);
      // let stringOfLiners = ships.join(", ");
      // additionalQuery =   `
      //   SELECT ship_id
      //   FROM public.ships
      //   WHERE ship_name IN (${stringOfShips});`;
      // shipsId = await pool.query(additionalQuery);
      // shipsId = shipsId.rows.map(shipId=> `${shipId.ship_id}`)
      let stringOfShipsID = ships.join(", ");
      endOfQuery += endOfQuery != "" ? " AND " : " WHERE ";
      endOfQuery += `ship_id IN (${stringOfShipsID})`;
    }

    if (type != "" && type != undefined) {
      endOfQuery += endOfQuery != "" ? " AND " : " WHERE ";
      endOfQuery += `cruise_type = '${type}'`;
    }

    query += endOfQuery;
    console.log(query);
    const result = await pool.query(query);
    let cruises = result.rows;
    for (let i = 0; i < cruises.length; i++) {
      cruises[i].ship_name = await getShipName(cruises[i].ship_id);
      cruises[i].start_date = formatDateInfo(cruises[i].start_date);
      cruises[i].end_date = formatDateInfo(cruises[i].end_date);
      cruises[i].duration_days = cruises[i].duration_days.days;
    }

    return cruises;
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
  const [day, month, year] = dateStr.split(".");
  return `${year}-${month}-${day}`;
}
