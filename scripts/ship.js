fetch("http://localhost:3000/cruises", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
          },
        body: JSON.stringify({ships: [getShipIdFromUrl()]})
    })
.then(response => response.json()) 
.then(data => {
    console.log(data)
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

function getShipIdFromUrl() {
  const pathParts = window.location.pathname.split("/"); // ['', 'ship', '11']
  return pathParts[2]; // '11'
}