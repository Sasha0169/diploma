let cities;
let ships;
let routes;
fetch("http://localhost:3000/getData")
  .then(response => response.json()) // Парсим JSON
  .then(data => {
    cities = new Map(data.cities.map(city => [city.city_id, city.name]));
    routes = new Map(data.routes.map(route => [route.route_id, route.name]));
    ships = new Map(data.ships.map(ship => [ship.ship_id, ship.ship_name]));
  })   
  .catch(error => console.error("Ошибка:", error));

  let buttonsForSelection = document.getElementsByClassName("form-for-search__button-for-selecting");
buttonsForSelection = Array.from(buttonsForSelection);
let openPanel;
buttonsForSelection.forEach((a, index)=>{a.addEventListener("click",(e)=>{
    e.preventDefault();
    if(openPanel!=undefined && openPanel != e.currentTarget.nextElementSibling){
        openPanel.style.display="";
    }
    openPanel = e.currentTarget.nextElementSibling;
    if(openPanel.style.display == ""){
        openPanel.style.display = "flex";
    }
    else
        openPanel.style.display = "";

})
a.values = [];
switch(index){
    case 0:
        a.placeholder = "Откуда";
        break;
    case 1: 
        a.placeholder = "Куда";
        a.appointment = "routes";
        break;
    case 2: 
        a.placeholder = "Как долго";
        a.appointment = "duration"
        break;
    case 3: 
        a.placeholder = "На чем";
        a.appointment = "ships";
        break;
    default:
        break;
}});



let radios = document.querySelectorAll(".form-check-input[type=radio]");
radios.forEach((a)=>a.addEventListener("change",(e)=>{
    let radioButton = e.currentTarget;
    let button = radioButton.closest(".form-for-search__wrap-for-button").getElementsByClassName("form-for-search__button-for-selecting")[0];
    button.values = Number(e.currentTarget.value)
    
    let label = button.getElementsByClassName("form-for-button__placeholder-for-button")[0];
    if(button.values == 0)
        label.textContent = button.placeholder;
    else
        label.textContent = cities.get(Number(button.values))
}))

let numbersOfDays = [[1, "1 - 4 дня"], [2, "5 - 7 дней"], [3, "8 - 10 дней"], [4, "11 - 14 дней"], [5, "более 14 дней"]];
numbersOfDays = new Map(numbersOfDays);
let wraps = Array.from(document.getElementsByClassName("form-for-search__wrap-for-button-and-panel"));
for(let i=1; i<wraps.length; i++){
    let checkboxes = wraps[i].querySelectorAll(".form-check-input[type=checkbox]");
    checkboxes.forEach((a)=>a.addEventListener("change",(e)=>{
    let checkbox = e.currentTarget;
    let button = checkbox.closest(".form-for-search__wrap-for-button").getElementsByClassName("form-for-search__button-for-selecting")[0];
    let label = button.getElementsByClassName("form-for-button__placeholder-for-button")[0];
    if(checkbox.checked){
        button.values.push(checkbox.value);
    }
    else{
        let index = button.values.findIndex((a)=>a==checkbox.value)
        button.values.splice(index,1);
    }
    let map;
    switch(button.appointment){
        case "routes":
            map = routes;
            break;
        case "duration":
            map = numbersOfDays;
            break;
        case "ships":
            map = ships;
            break;
        default:
            break;
    }
    if(button.values.length > 1)
        label.textContent = map.get(Number(button.values[0])) + ",...";
    else if(button.values.length == 1)
        label.textContent = map.get(Number(button.values[0]));
    else 
        label.textContent = button.placeholder;
}))}

let selectedType = "Речной";

let buttonsForChangeType = Array.from(document.getElementsByClassName("form-for-search__button-to-switch-type"));
buttonsForChangeType[0].secondButton = buttonsForChangeType[1];
buttonsForChangeType[0].value="Речной";
buttonsForChangeType[1].secondButton = buttonsForChangeType[0];
buttonsForChangeType[1].value="Морской";
buttonsForChangeType.forEach(a => a.addEventListener("click", function (e) {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = "#0094DA";
    e.currentTarget.secondButton.style.backgroundColor = "#74c1fc";
    selectedType = e.currentTarget.value;
}))

let buttonForSearch = document.getElementsByClassName("form-for-button__button")[0];
buttonForSearch.addEventListener("click", function(e){
    e.preventDefault();
    let searchParameters = {
        typeOfCruise: selectedType,
        departureCity: buttonsForSelection[0].values.length == 0?undefined:buttonsForSelection[0].values,
        routes: buttonsForSelection[1].values.length == 0?undefined:buttonsForSelection[1].values,
        date: document.getElementsByClassName("form-for-search__datepicker")[0].value != ""? document.getElementsByClassName("form-for-search__datepicker")[0].value.split(" - "):undefined,
        numberOfDay: buttonsForSelection[2].values.length == 0?undefined:buttonsForSelection[2].values,
        ships: buttonsForSelection[3].values.length == 0?undefined:buttonsForSelection[3].values
    }
    fetch("http://localhost:3000/cruises", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
          },
        body: JSON.stringify(searchParameters)
    })
    .then(response => response.json()) // Парсим JSON
    .then(data => {
        renderCruises(data);
        let cruiseCards = Array.from(document.getElementsByClassName("cruise-card"));
        cruiseCards.forEach(cruiseCard=>{
          let buttonCruiseCard = cruiseCard.getElementsByClassName("cruise-card__button")[0];
          let name = cruiseCard.getElementsByClassName("cruise-card__name")[0];
          let image = cruiseCard.getElementsByClassName("cruise-card__image")[0];
          // buttonCruiseCard.value = "3";
        buttonCruiseCard.addEventListener("click", addLinkToCruise);
        name.addEventListener("click", addLinkToCruise);
        image.addEventListener("click", addLinkToCruise);
      })
    })   
  .catch(error => console.error("Ошибка:", error));
})

buttonForSearch.click();

function addLinkToCruise(e){
  e.preventDefault();
  let element = e.currentTarget;
  let value = element.closest(".cruise-card").cruiseId;
  window.open(`http://localhost:3000/cruise/${value}`, "_blank");
}


function createCruiseCard(cruise) {
    const card = document.createElement('div');
    card.classList.add('cruise-card');
  
    card.innerHTML = `
      <div class="cruise-card__wrap-for-image">
        <img class="cruise-card__image" src="https://raw.githubusercontent.com/Sasha0169/diploma/master/images/photos/cruises/${cruise.cruise_id}/main.jpg" alt="">
      </div>
      <div class="cruise-card__wrap-for-information">
        <span target="_blank" class="cruise-card__name">${cruise.cruise_name}</span>
        <div class="cruise-card__wrap-for-date-and-name-of-liner">
          <div class="cruise-card__wrap-for-date-and-time">
            <div class="cruise-card__first-date-and-time">
              <span class="cruise-card__date">
                ${cruise.start_date.day} ${cruise.start_date.month} ${cruise.start_date.year}
              </span>
              <span class="cruise-card__day-of-week-and-time">
                ${cruise.start_date.weekday}, ${cruise.start_date.time}
              </span>
            </div>
            <div class="cruise-card__wrap-for-number-of-days">
              <div class="cruise-card__arrow">
            
              </div>
              <span class="cruise-card__number-of-days">
                ${cruise.duration_days} дней
              </span>
            </div>
            <div class="cruise-card__second-date-and-time">
              <span class="cruise-card__date">
                ${cruise.end_date.day} ${cruise.end_date.month} ${cruise.end_date.year}
              </span>
              <span class="cruise-card__day-of-week-and-time">
                ${cruise.end_date.weekday}, ${cruise.end_date.time}
              </span>
            </div>
          </div>
          <div class="cruise-card__wrap-for-name-of-liner">
            <img class="cruise-card__liner-icon" src="/443890.png">
            <span href="" class="cruise-card__name-of-liner">${cruise.ship_name}</span>
          </div>
        </div>
        <div class="cruise-card__direction">
          ${cruise.route_points.join(' &mdash; ')}
        </div>
      </div>
      <div class="cruise-card__wrap-for-price-and-button">
        <div class="cruise-card__prices">
          <span class="cruise-card__new-price">
            от ${cruise.minimum_discounted_price} &#8381;/чел
          </span>
          <span class="cruise-card__old-price">
            ${cruise.minimum_price} &#8381;
          </span>
        </div>
        <div class="cruise-card__wrap-for-remains">
          <span class="cruise-card__remains">
            Осталось 40 мест!
          </span>
        </div>
        <button class="cruise-card__button"">
          Выбрать
        </button>
      </div>
    `;
    
    return card;
  }
  
  function renderCruises(cruises) {
    const container = document.querySelector('.wrap-for-cruise-cards'); // Где будем добавлять карточки
    cruises.forEach(cruise => {
      let cruiseCard = createCruiseCard(cruise);
      container.appendChild(cruiseCard); // Добавляем карточку в контейнер
      let buttonCruiseCard = cruiseCard.getElementsByClassName("cruise-card__button")[0];
      cruiseCard.cruiseId = cruise.cruise_id;
      
    });
  }

//   document.getElementsByClassName("entrance-panel__button")[0].addEventListener("click", function(e){
//     e.preventDefault();
//     let email = document.getElementsByClassName("form-control entrance-panel__input-for-section")[0].value;
//     let password = document.getElementsByClassName("form-control entrance-panel__input-for-section")[1].value;
//     console.log({email: email, password: password});
//     fetch("http://localhost:3000/login", {
//       method: "POST",
//       headers: {
//           "Content-Type": "application/json" 
//         },
//       body: JSON.stringify({email: email, password: password})
//   })
//   .then(response => response.json()) // Парсим JSON
//   .then(data => {
//       console.log(data);
//       getUserName();
// })   
// .catch(error => console.error("Ошибка:", error));
//   })

//   async function getUserName(){
//     fetch("http://localhost:3000/getUserName", {
//       method: "POST",
//       headers: {
//         credentials: 'include',
//           "Content-Type": "application/json" 
//         },
//       body: JSON.stringify({})
//   })
//   .then(response => response.json()) // Парсим JSON
//   .then(data => {
//     console.log(data)
//     document.getElementsByClassName("entrance__text")[0].textContent=`${data.last_name} ${data.first_name}`;
//   })   
//   .catch(error => console.error("Ошибка:", error));
//   }