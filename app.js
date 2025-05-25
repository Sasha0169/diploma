const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

app.use(express.static("css"));
app.use(express.static("images"));
app.use(express.static("fonts"));
app.use(express.static("scripts"));
app.use(express.static("html"));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5500', 
  credentials: true
}));

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

app.get("/ships", (req, res) => {
  res.render("ships", {})
});

app.get("/orders", (req, res) => {
  res.render("orders", {})
});

app.get("/ship", (req, res) => {
  getShip('6').then((ship)=>{console.log(ship); res.render("ship", {ship: ship})})
});

app.get("/personal", (req, res) => {
  res.render("personal", {})
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

app.post("/cruises", (req, res) => {
  getCruises(req.body).then((result) => res.json(result));
});

app.post("/getSchemes", (req, res) => {
  console.log(req.body)
})

app.post("/getInfoAboutPlace", (req, res) => {
  getInfoAboutPlace(req.body.numberOfTicket).then((result)=>res.json(result));
});

app.get("/checkAuth", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    res.json({ authenticated: true });
  } catch (err) {
    res.json({ authenticated: false });
  }
});


app.get("/cruise/:id", (req, res) => {
  const cruiseId = req.params.id;
  getCruise(cruiseId)
    .then((data) => {
      res.render("cruise page", data);
    })
    .catch((err) => {
      res.status(500).send("Ошибка при получении данных круиза");
    });
});

let SECRET = "secret-key"

app.post("/login", (req, res) => {
  console.log(req.body);
  authenticationByEmail(req.body).then((user) => {
    console.log(user)
    const token = jwt.sign( user , SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      maxAge: 1000*60*60*24
    });
    res.json({authenticated: true})
  }).catch((err)=>res.status(401).json({ error: "Not authenticated" }));
});

app.post("/getUserName", authMiddleware, (req, res) => {
  const token = req.cookies.token;
  getUserName(token).then(result=>res.json(result));
});

app.post("/addTicketCart", authMiddleware, (req, res) => {
  console.log(req.body)
  const token = req.cookies.token;
  const userId = getUserIdByToken(token);
  const data = {userId: userId, ticketId: req.body.ticketId, values: req.body.values};
  addTicketCart(data);
  res.json({});
});

app.get("/cart", authMiddleware, (req, res) => {
  console.log(req.body)
  const token = req.cookies.token;
  const userId = getUserIdByToken(token);
  getCart(userId).then((result)=>res.json(result))
});

app.delete("/cart/:ticketId", authMiddleware, (req, res) => {
  console.log(req.body)
  const ticketId = req.params.ticketId;
  const token = req.cookies.token;
  const userId = getUserIdByToken(token);
  deleteTicketFromCart(userId, ticketId)
});


function getUserIdByToken(token){
  return jwt.verify(token, SECRET).user_id;
}

function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  console.log(token)
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  console.log(1)
  try {
    const user = jwt.verify(token, SECRET);
    console.log(2)
    console.log(user);
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
}

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

app.get('/protected', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, SECRET);
    res.send({ message: 'Access granted', user });
  } catch {
    res.status(403).send({ error: 'Invalid token' });
  }
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const code = generateAccessCode();

  // Здесь сохранить пользователя с кодом в БД или временно в памяти

  try {
    await sendVerificationEmail(email, code);
    res.json({ message: 'Код отправлен на почту' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка отправки письма' });
  }
});

function generateAccessCode() {
  return Math.floor(100000 + Math.random() * 900000); 
}

async function sendVerificationEmail(email, code) {
  let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: 'info.mortur@gmail.com',
      pass: 'fjcp dguh ijev rsdp' // не обычный пароль, а App Password от Gmail
    }
  });

  let mailOptions = {
    from: '"MorTur" info.mortur@gmail.com',
    to: email,
    subject: 'Код подтверждения регистрации',
    text: `Ваш код подтверждения: ${code}`,
    html: `<b>Ваш код подтверждения: ${code}</b>`
  };

  await transporter.sendMail(mailOptions);
}

// "fjcp dguh ijev rsdp"

pool
  .connect()
  .then(() => {
    console.log("✅ Успешное подключение к PostgreSQL");
    // sendVerificationEmail("sasha0169s@mail.ru", "010101");
    // addTicketCart({ticketId: 45, values:["child", "adult"], userId: 3});
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

const TOKEN = ""

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
    const response = await fetch("https://api.github.com/repos/Sasha0169/diploma/contents/images/photos/cruises/11/gallery", {
      headers: {
        'Authorization': TOKEN
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

async function getInfoAboutPlace(ticketId){
  let query1 = `
    SELECT prices, cabin_id, place, ticket_id
	  FROM public.tickets
	  WHERE ticket_id=${ticketId};`;
  let result1 = await pool.query(query1);
  let query2 = `
  SELECT cabin_description, cabin_name, single_occupancy, capacity
	  FROM public.cabins
	  WHERE cabin_id=${result1.rows[0].cabin_id};`;
    let result2 = await pool.query(query2);
    result2.rows[0].prices = result1.rows[0].prices;
    result2.rows[0].place = result1.rows[0].place;
    result2.rows[0].cabin_id = result1.rows[0].cabin_id;
    result2.rows[0].ticket_id = ticketId;
    const response = await fetch(`https://api.github.com/repos/Sasha0169/diploma/contents/images/photos/cabins/${result1.rows[0].cabin_id}/gallery`, {
      headers: {
        'Authorization': TOKEN
      }
    });
    const result3 = await response.json();
    result2.rows[0].numberOfPhotos = result3.length;
  return result2.rows[0];
}

async function getUserName(token){
  const user = jwt.verify(token, SECRET);
  return {first_name: user.first_name, last_name: user.last_name};
}

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
    SELECT cabin_id, deck_id, cabin_description, cabin_name, cabin_numbers
	  FROM public.cabins
	  WHERE ship_id=${shipId} AND deck_id=${deckId};`;
  let result1 = await pool.query(query1);
  return result1.rows;
}

async function getTicketsInformation(cruiseId, cabinId){
  let query1 = `
    SELECT place, prices, status, ticket_id
	  FROM public.tickets
	  WHERE cruise_id=${cruiseId} AND cabin_id=${cabinId};`;
  let result1 = await pool.query(query1);
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

async function getShip(shipId){
  let query = `
    SELECT *
	  FROM public.ships
    WHERE ship_id=${shipId}`;
  let result = await pool.query(query);
  const ship = result.rows[0];
  
  ship.decks = await getDecksInformation(ship.ship_id);
  for (let i = 0; i < ship.decks.length; i++) {
    ship.decks[i].cabins = await getCabinsInformation(ship.ship_id, ship.decks[i].deck_id);
  }
  console.log(ship);
  return ship;
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
  delete result.rows[0].password_hash;
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
      endOfQuery += ` WHERE departure_city_id = \'${placeOfDeparture}\'`;

    if (type != undefined) {
      endOfQuery += endOfQuery != "" ? " AND " : " WHERE ";
      endOfQuery += `cruise_type = '${type}'`;
    }

    if (routes != [] && routes != undefined) {
      let stringOfRoutesId = routes.join(", ");
      endOfQuery += endOfQuery != "" ? " AND " : " WHERE ";
      endOfQuery += `route_id IN (${stringOfRoutesId})`;
    }

    if (date != [] && date != undefined) {
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

    if (ships != [] && ships != undefined) {
      let stringOfShipsID = ships.join(", ");
      endOfQuery += endOfQuery != "" ? " AND " : " WHERE ";
      endOfQuery += `ship_id IN (${stringOfShipsID})`;
    }

    if (type != "" && type != undefined) {
      endOfQuery += endOfQuery != "" ? " AND " : " WHERE ";
      endOfQuery += `cruise_type = '${type}'`;
    }

    query += endOfQuery;
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

async function addTicketCart(data){
  const query1 = `
  SELECT cart
	FROM public.users
	WHERE user_id='${data.userId}'`;
  const result1 = await pool.query(query1);
  const query2 = `
  SELECT cruise_id
	FROM public.tickets
	WHERE ticket_id='${data.ticketId}'`;
  const result2 = await pool.query(query2);
  console.log(result1.rows[0].cart);
  console.log(result2.rows[0].cruise_id);
  console.log(result1.rows[0].cart?.cruise_id);
  if(result1.rows[0].cart == null || result1.rows[0].cart.cruise_id != result2.rows[0].cruise_id)
  {
    console.log("Вариант 1")
    let text = "";
    data.values.forEach((value, index)=>{
      text += `"${value}"${index==data.values.length-1?"":","}`
    })
    console.log(text);
    const query3 = `
    UPDATE users
    SET cart = '{
      "cruise_id": ${result2.rows[0].cruise_id},
      "tickets": [
        {
          "ticket_id": ${data.ticketId},
          "selected_tariffs": [${text}]
        }
      ]
    }'::jsonb
    WHERE user_id = '${data.userId}';`;
  const result3 = await pool.query(query3);
    return;
  }
  console.log("Вариант 2");
  let map = new Map();
  result1.rows[0].cart.tickets.forEach((ticket)=> map.set(Number(ticket.ticket_id), ticket.selected_tariffs))
  console.log(map);
  map.set(Number(data.ticketId), data.values)
  console.log(map);
  let text = "";
  let array = Array.from(map);
  array.forEach((value, index) => {
    let text1 = "";
    value[1].forEach((value2, index)=>{
      text1 += `"${value2}"${index==value[1].length-1?"":","}`
    })
    text += `
      {
        "ticket_id": ${value[0]},
        "selected_tariffs": [${text1}]
      }${index==array.length-1?"":","}`
  })
  const query3 = `
    UPDATE users
    SET cart = '{
      "cruise_id": ${result2.rows[0].cruise_id},
      "tickets": [
        ${text}
      ]
    }'::jsonb
    WHERE user_id = '${data.userId}';`;
    console.log(query3);
  const result3 = await pool.query(query3);
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

async function getCart(userId){
  let result={};
  const query1 = `
  SELECT cart
	FROM public.users
	WHERE user_id='${userId}'`;
  const result1 = await pool.query(query1);
  console.log(result1.rows[0])
  if(isEmptyObject(result1.rows[0].cart))
    return{};
  console.log(result1.rows[0])
  const result2 = await getInfoAboutCruiseForCart(result1.rows[0].cart.cruise_id)
  console.log(result2)
  let tickets = [];
  const cart = result1.rows[0].cart;
  for (const ticket of cart.tickets) {
    const infoAboutTicket = await getInfoAboutTicketForCart(ticket.ticket_id, ticket.selected_tariffs);
    tickets.push(infoAboutTicket);
  }
  const total = getTotalForCart(tickets);
  result = {tickets, 
            cruiseName: result2.cruise_name,
            routePoints: result2.route_points,
            startDate: formatDateInfo(result2.start_date),
            endDate: formatDateInfo(result2.end_date),
            durationDays: result2.duration_days.days,
            cruiseId: cart.cruise_id,
            total
          }
  console.log(result.tickets)
  return result;
}

async function getInfoAboutCruiseForCart(cruiseId) {
  const query1 = `
  SELECT cruise_name, route_points, start_date, end_date, (end_date - start_date) AS duration_days
	FROM public.cruises
	WHERE cruise_id='${cruiseId}'`;
  const result1 = await pool.query(query1);
  return result1.rows[0];
}

async function getInfoAboutTicketForCart(ticketId, arrayOfTariffs){
  const query1 = `
  SELECT prices, cabin_id, place
	FROM public.tickets
	WHERE ticket_id='${ticketId}'`;
  const result1 = await pool.query(query1);
  const prices= new Map();
  result1.rows[0].prices.forEach((price)=>{
    let realPrice
    if(price.discounted_price!=undefined)
      realPrice = price.discounted_price;
    else
      realPrice = price.base_price;
    prices.set(price.category, realPrice)
  })
  console.log(prices)
  let selectedTariffsWithPrice = [];
  arrayOfTariffs.forEach((tariff)=>{
    selectedTariffsWithPrice.push({tariff, price: prices.get(tariff)})
  })
  const infoAboutCabin = await getInfoAboutCabinForCart(result1.rows[0].cabin_id);
  const infoAboutDeck = await getInfoAboutDeckForCart(infoAboutCabin.deckId);
  delete infoAboutCabin.deckId;
  const result = {
    ticketId,
    place: result1.rows[0].place,
    selectedTariffsWithPrice,
    infoAboutCabin,
    infoAboutDeck
  }
  return result
}

async function getInfoAboutCabinForCart(cabinId){
  const query1 = `
  SELECT cabin_name, deck_id
	FROM public.cabins
	WHERE cabin_id='${cabinId}'`;
  const result1 = await pool.query(query1);
  const result = {
    cabinName: result1.rows[0].cabin_name,
    deckId: result1.rows[0].deck_id,
    cabinId
  }
  return result;
}

async function getInfoAboutDeckForCart(deckId){
  const query1 = `
  SELECT deck_name, deck_id
	FROM public.decks
	WHERE deck_id='${deckId}'`;
  const result1 = await pool.query(query1);
  const result = {
    deckName: result1.rows[0].deck_name,
    deckId: result1.rows[0].deck_id,
  }
  return result;
}

async function deleteTicketFromCart(userId, ticketId){
  const query1 = `
  SELECT cart
	FROM public.users
	WHERE user_id='${userId}'`;
  const result1 = await pool.query(query1);
  const cart = result1.rows[0].cart;
  console.log(cart);
  let tickets = cart.tickets;
  console.log(ticketId, tickets[0].ticket_id)
  tickets = tickets.filter(item => item.ticket_id != ticketId);
  if(tickets.length == 0)
  {
    const query2 = `
    UPDATE users
    SET cart = '{}'
    WHERE user_id = ${userId};`;
    await pool.query(query2);
    return;
  }
  let textForTickets = "";
  tickets.forEach((ticket, index)=> {
    let textForTariffs= "";
    ticket.selected_tariffs.forEach((tariff, index)=>{
      textForTariffs += `"${tariff}"${index==ticket.selected_tariffs.length-1?"":","}`
    })
    textForTickets += `{
      "ticket_id": ${ticket.ticket_id},
      "selected_tariffs": [${textForTariffs}]
    }${index==tickets.length-1?"":","}`
  })

  const query3 = `
  UPDATE users
  SET cart = '{
  "cruise_id": ${cart.cruise_id},
  "tickets": [
    ${textForTickets}
  ]
  }'::jsonb
  WHERE user_id = ${userId};`;
  console.log(query3);
  await pool.query(query3);
}

function getTotalForCart(tickets){
  let sum = 0;
  for(let i =0;i<tickets.length;i++){
    for(let j = 0; j<tickets[i].selectedTariffsWithPrice.length; j++){
      sum += Number(tickets[i].selectedTariffsWithPrice[j].price);
    }
  }
  console.log("sum ",sum);
  return sum;
}