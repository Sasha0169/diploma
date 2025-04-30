// let scheme;
// fetch("http://localhost:3000/getSchemes", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json" 
//       },
//     body: JSON.stringify({})
// })
// .then(response => response.json()) // Парсим JSON
// .then(data => {
//     console.log(data)
//     renderCruises(data);
// })   
// .catch(error => console.error("Ошибка:", error));


let buttonsForBook = Array.from(document.getElementsByClassName("cabin__button"));
buttonsForBook.forEach(button => {
    let wrap = button.closest(".cabin");
    
    button.lowerPart = wrap.getElementsByClassName("cabin__lower-part")[0];
    button.addEventListener("click", function (e){
    let button = e.currentTarget;
    
    let lowerPart = button.lowerPart;
    if(lowerPart.style.display == "none")
        lowerPart.style.display = "flex";
    else
        lowerPart.style.display = "none";
})})

// let tickets = Array.from(document.getElementsByClassName("wrap-for-panel-for-booking"));
// tickets.forEach(ticket => ticket.addEventListener("click", function (e){

// }))
let wrapForPanelForBooking = document.getElementsByClassName("wrap-for-panel-for-booking")[0];
// wrapForPanelForBooking.getElementsByClassName("close-button")[0].addEventListener("click", function(e){
//     panelForBooking.style.display = "none";
// })
let buttonsForTickets = Array.from(document.getElementsByClassName("cabin__available-place"));
buttonsForTickets.forEach(button => button.addEventListener("click", function(e){
    let numberOfTicket = e.currentTarget.getAttribute("ticket_id");
    fetch("http://localhost:3000/getInfoAboutPlace", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
              },
            body: JSON.stringify({numberOfTicket: numberOfTicket})
        })
        .then(response => response.json())
        .then(data => {
            wrapForPanelForBooking.style.display = "flex";
            wrapForPanelForBooking.innerHTML=`
        <div class="panel-for-booking">
            <div class="panel-for-booking__upper-part">
                <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0"
                            class="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                            aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                            aria-label="Slide 3"></button>
                    </div>
                    <div class="carousel-inner">
                        <div class="carousel-item active" data-bs-interval="20000">
                            <img src="/cabin.jpeg" class="d-block w-100" alt="...">
                        </div>
                        <div class="carousel-item" data-bs-interval="20000">
                            <img src="/cabin2.jpg" class="d-block w-100" alt="...">
                        </div>
                        <div class="carousel-item" data-bs-interval="20000">
                            <img src="/cabin3.jpg" class="d-block w-100" alt="...">
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                        data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Предыдущий</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                        data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Следующий</span>
                    </button>
                </div>
                <div class="panel-for-booking__wrap-for-description">
                    <div class="panel-for-booking__wrap-for-name">
                        <div class="panel-for-booking__cabin-name">
                            Каюта №${data.place} - ${data.cabin_name}
                        </div>
                        <div class="panel-for-booking__deck-name">
                            Нижняя палуба
                        </div>
                    </div>
                    <div class="panel-for-booking__description">
                        ${data.cabin_description}
                    </div>
                </div>
                <div class="panel-for-booking__close-button">
                    <svg class="close-button" viewBox="0 0 311 311.09867" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="m16.042969 311.097656c-4.09375 0-8.191407-1.554687-11.304688-4.691406-6.25-6.25-6.25-16.386719 0-22.636719l279.058594-279.058593c6.253906-6.253907 16.386719-6.253907 22.636719 0 6.25 6.25 6.25 16.382812 0 22.632812l-279.0625 279.0625c-3.136719 3.136719-7.230469 4.691406-11.328125 4.691406zm0 0" />
                        <path
                            d="m295.125 311.097656c-4.09375 0-8.191406-1.554687-11.304688-4.691406l-279.082031-279.082031c-6.25-6.253907-6.25-16.386719 0-22.636719s16.382813-6.25 22.632813 0l279.0625 279.082031c6.25 6.25 6.25 16.386719 0 22.636719-3.136719 3.136719-7.230469 4.691406-11.308594 4.691406zm0 0" />
                    </svg>
                </div>
            </div>
            <div class="panel-for-booking__lower-part">
                <div class="panel-for-booking__wrap-for-checkbox">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked>
                        <label class="form-check-label" for="flexSwitchCheckChecked">Одноместное размещение</label>
                    </div>
                </div>
                <div class="panel-for-booking__wrap-for-rate-selection">
                    <div class="panel-for-booking__wrap-for-rate-of-passenger">
                        <span class="panel-for-booking__passenger-number">
                            Пассажир 1
                        </span>
                        <button class="form-for-search__button-for-selecting">
                            <span class="form-for-button__placeholder-for-button">Куда</span>
                            <div class="form-for-button__arrow-for-button"></div>
                        </button>
                        <div class="form-for-button__the-selection-panel">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="Все" id="1">
                                    <label class="form-check-label stretched-link" for="1">Все</label>
                                </li>
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="Казань" id="2">
                                    <label class="form-check-label stretched-link" for="2">Казань</label>
                                </li>
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="Набережные челны"
                                        id="3">
                                    <label class="form-check-label stretched-link" for="3">Набережные челны</label>
                                </li>
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="4" id="4">
                                    <label class="form-check-label stretched-link" for="4">Другой город</label>
                                </li>
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="5" id="5">
                                    <label class="form-check-label stretched-link" for="5">Другой город</label>
                                </li>
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="6" id="6">
                                    <label class="form-check-label stretched-link" for="6">Другой город</label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="panel-for-booking__wrap-for-rate-of-passenger">
                        <span class="panel-for-booking__passenger-number">
                            Пассажир 1
                        </span>
                        <button class="form-for-search__button-for-selecting">
                            <span class="form-for-button__placeholder-for-button">Куда</span>
                            <div class="form-for-button__arrow-for-button"></div>
                        </button>
                        <div class="form-for-button__the-selection-panel">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="Все" id="1">
                                    <label class="form-check-label stretched-link" for="1">Все</label>
                                </li>
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="Казань" id="2">
                                    <label class="form-check-label stretched-link" for="2">Казань</label>
                                </li>
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="Набережные челны" id="3">
                                    <label class="form-check-label stretched-link" for="3">Набережные челны</label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="panel-for-booking__wrap-for-rate-of-passenger">
                        <span class="panel-for-booking__passenger-number">
                            Пассажир 1
                        </span>
                        <button class="form-for-search__button-for-selecting">
                            <span class="form-for-button__placeholder-for-button">Куда</span>
                            <div class="form-for-button__arrow-for-button"></div>
                        </button>
                        <div class="form-for-button__the-selection-panel">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="${data.prices[0].name}" id="1">
                                    <label class="form-check-label stretched-link" for="1">Все</label>
                                </li>
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="Казань" id="2">
                                    <label class="form-check-label stretched-link" for="2">Казань</label>
                                </li>
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="Набережные челны" id="3">
                                    <label class="form-check-label stretched-link" for="3">Набережные челны</label>
                                </li>
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="4" id="4">
                                    <label class="form-check-label stretched-link" for="4">Другой город</label>
                                </li>
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="5" id="5">
                                    <label class="form-check-label stretched-link" for="5">Другой город</label>
                                </li>
                                <li class="list-group-item">
                                    <input class="form-check-input me-1" type="checkbox" value="6" id="6">
                                    <label class="form-check-label stretched-link" for="6">Другой город</label>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="panel-for-booking__wrap-for-button-and-total">
                    <div class="panel-for-booking__total">Итого: 260000Р</div>
                    <button class="panel-for-booking__button">
                        Добавить в карзину
                    </button>
                </div>
            </div>

        </div>`
        })   
        .catch(error => console.error("Ошибка:", error));
}))