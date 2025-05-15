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
        e.preventDefault();
    let button = e.currentTarget;
    
    let lowerPart = button.lowerPart;
    if(lowerPart.style.display == "none"||lowerPart.style.display == "")
        lowerPart.style.display = "flex";
    else
        lowerPart.style.display = "none";
})})

// let tickets = Array.from(document.getElementsByClassName("wrap-for-panel-for-booking"));
// tickets.forEach(ticket => ticket.addEventListener("click", function (e){

// }))
let wrapForPanelForBooking = document.getElementsByClassName("wrap-for-panel-for-booking")[0];

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
            let stringOfPhotos=``;
            for (let i = 0; i < data.numberOfPhotos; i++) {
                stringOfPhotos+=`
                    <div class="carousel-item" data-bs-interval="1000">
                        <img src="https://raw.githubusercontent.com/Sasha0169/diploma/master/images/photos/cabins/${data.cabin_id}/gallery/${i+1}.jpg" class="d-block w-100" alt="...">
                    </div>`;
            }
            let pan = "";
            for (let i = 0; i < data.capacity; i++) {
                let a = '';
                for (let j = 0; j < data.prices.length; j++) {
                    let cat ="";
                    if(data.prices[j].category=="pensioner")
                        cat = "Пенсионный"
                    if(data.prices[j].category=="adult")
                        cat = "Взрослый"
                    if(data.prices[j].category=="child")
                        cat = "Детский"
                    a += `                 
                        <label class="list-group-item" >
                            <input class="form-check-input me-1" type="radio" name="listGroupRadio${i}" price="${data.prices[j].discounted_price == ''?data.prices[j].base_price:data.prices[j].discounted_price}" value="${data.prices[j].category}" ${j==0?"checked":""}>
                            Тариф ${cat} - ${data.prices[j].discounted_price} (${data.prices[j].base_price})
                        </label>`
                    
                }
                
                pan += `<div class="panel-for-booking__wrap-for-rate-of-passenger">
                        <span class="panel-for-booking__passenger-number">
                            Пассажир ${i+1}
                        </span>
                        <button class="form-for-search__button-for-selecting">
                            <span class="form-for-button__placeholder-for-button">Куда</span>
                            <div class="form-for-button__arrow-for-button"></div>
                        </button>
                        <div class="form-for-button__the-selection-panel">
                            <div class="list-group">
                                ${a}
                            </div>
                        </div>
                    </div>`
                
            }
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
                        <div class="carousel-item active" data-bs-interval="1000">
                            <img src="https://raw.githubusercontent.com/Sasha0169/diploma/master/images/photos/cabins/${data.cabin_id}/main.jpg" class="d-block w-100" alt="...">
                        </div>
                        ${stringOfPhotos}
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
                <div class="panel-for-booking__wrap-for-close-button">
                    <svg class="panel-for-booking__close-button" viewBox="0 0 311 311.09867" xmlns="http://www.w3.org/2000/svg">
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
                    ${pan}
                </div>
                <div class="panel-for-booking__wrap-for-button-and-total">
                    <div class="panel-for-booking__total">Итого: 0</div>
                    <button class="panel-for-booking__button">
                        Добавить в карзину
                    </button>
                </div>
            </div>
        </div>`
        let addToCartButton = wrapForPanelForBooking.getElementsByClassName("panel-for-booking__button")[0];
        addToCartButton.value = data.ticket_id;
        addToCartButton.addEventListener("click", addTicketCart)

        let closeButton = wrapForPanelForBooking.getElementsByClassName("panel-for-booking__close-button")[0];
        closeButton.addEventListener("click", function(e){
            wrapForPanelForBooking.style.display = "none";
        })

    


        let buttonsForSelection = wrapForPanelForBooking.getElementsByClassName("form-for-search__button-for-selecting");
        buttonsForSelection = Array.from(buttonsForSelection);
        let openPanel;
        buttonsForSelection.forEach((a)=>{
            a.value = "adult"
            a.getElementsByClassName("form-for-button__placeholder-for-button")[0].textContent = a.nextElementSibling.querySelectorAll(".list-group-item:has(input[type='radio'][checked])")[0].textContent;
            a.addEventListener("click",(e)=>{
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
        let radios = a.parentElement.querySelectorAll(".form-check-input[type=radio]");
        radios.forEach((b, index)=>{b.addEventListener("change",(e)=>{
            let radioButton = e.currentTarget;
            let button = radioButton.closest(".panel-for-booking__wrap-for-rate-of-passenger").getElementsByClassName("form-for-search__button-for-selecting")[0];
            button.value = radioButton.value;
            button.price = radioButton.getAttribute("price");
            let label = button.getElementsByClassName("form-for-button__placeholder-for-button")[0];
            label.textContent = radioButton.parentElement.textContent;
            let total = wrapForPanelForBooking.getElementsByClassName("panel-for-booking__total")[0];
            let sum = 0;
            buttonsForSelection.forEach(c => sum += Number(c.price));
            total.textContent = `Итого: ${sum}`;
        })
        if (index == 0){
            b.checked = true;
            b.dispatchEvent(new Event('change', { bubbles: true }));
        }
        })
        });
        })   
        .catch(error => console.error("Ошибка:", error));
}))
const cart = document.getElementsByClassName("cart")[0];
const closeCartButton = document.getElementsByClassName("cart__close-button")[0];
closeCartButton.addEventListener("click", function(e){
    cart.style.display = "none";
})


function checkCabinsExist(){
    const arrayCabins = cart.getElementsByClassName("cart__cabin");
    if(arrayCabins.length==0){
        const body = cart.getElementsByClassName("cart__body")[0];
        const buttonForBook = cart.getElementsByClassName("cart__checkout")[0];
        body.innerHTML = `<span class="cart__empty-cart-message">
            Ваша корзина пуста
        </span>`;
        body.style.justifyContent="center";        
        buttonForBook.style.display = "none";
    }
}

function addTicketCart(e){
    e.preventDefault;
    const ticketId = wrapForPanelForBooking.getElementsByClassName("panel-for-booking__button")[0].value;
    const values = [];
    const selectedButtons = Array.from(wrapForPanelForBooking.getElementsByClassName("form-for-search__button-for-selecting"));
    selectedButtons.forEach((button, index)=>{
        values[index] = button.value;
    })
    console.log(values, ticketId)
    fetch("http://localhost:3000/addTicketCart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
          },
        body: JSON.stringify({ticketId: ticketId, values: values})
    })
    .then(response => {
        if (!response.ok) {
        // Пробрасываем ошибку, чтобы попасть в .catch
        return response.json().then(err => {
          throw new Error(err.error || "Ошибка авторизации");
        });
      }
      return response.json();
        })
    .then(data => {
        refreshCart();
    }).catch((error)=>alert("Войдите в аккаунт"))
}

// function refreshCart(){
//     fetch("http://localhost:3000/cart", {
//         method: "get",
//         headers: {
//             "Content-Type": "application/json" 
//           }
//     })
//     .then(response => response.json())
//     .then(data => {
//         const cartBody = cart.getElementsByClassName("cart__body")[0];
//         const stringRoutePoints = data.routePoints.join(" &mdash; ");
//         let stringTickets = "";
//         data.tickets.forEach((ticket)=>{
//             let stringTourists;
//             ticket[1].forEach((tourist, index)=>{
//                 let cat;
//                 if(tourist[0]=="pensioner")
//                     cat = "Пенсионный"
//                 if(tourist[0]=="adult")
//                     cat = "Взрослый"
//                 if(tourist[0]=="child")
//                     cat = "Детский"
//                 stringTourists += `<div class="cart__wrap-for-tourist">
//                             <span class="cart__tourist-number">
//                                 Турист ${index+1}
//                             </span>
//                             <div class="cart__name-of-tariff">
//                                 ${cat} тариф
//                             </div>
//                             <div class="cart__ticket-price">
//                                 ${tourist[1]} &#8381;
//                             </div>
//                         </div>`
//             })
//             stringTickets += `<div class="cart__cabin" value="${ticket[0]}">
//                     <div class="cart__wrap-for-cabin-name">
//                         <span class="cart__number-of-cabin-and-cabin-name">
//                             Каюта №323 - Двухместная
//                         </span>
//                         <span class="cart__desk-name">
//                             2-я палуба
//                         </span>
//                     </div>
//                     <div class="cart__wrap-for-tourists">
//                         ${stringTourists}
//                     </div>
                    
//                     <div class="cart__wrap-for-total-for-cabin">
//                         <span class="cart__label-for-total">Итого</span>
//                         <span class="cart__total-for-cabin">400 000 &#8381;</span>
//                     </div>
    
//                     <div class="cart__wrap-for-buttons">
//                         <div class="cart__delete-button">
//                             <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20"
//                                 viewBox="0,0,256,256" style="fill:#FFFFFF;">
//                                 <g fill="#000000" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
//                                     stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
//                                     font-family="none" font-weight="none" font-size="none" text-anchor="none"
//                                     style="mix-blend-mode: normal">
//                                     <g transform="scale(5.12,5.12)">
//                                         <path
//                                             d="M42,5h-10v-2c0,-1.65234 -1.34766,-3 -3,-3h-8c-1.65234,0 -3,1.34766 -3,3v2h-10c-0.55078,0 -1,0.44922 -1,1c0,0.55078 0.44922,1 1,1h1.08594l3.60938,40.51563c0.125,1.39063 1.30859,2.48438 2.69531,2.48438h19.21484c1.38672,0 2.57031,-1.09375 2.69531,-2.48437l3.61328,-40.51562h1.08594c0.55469,0 1,-0.44922 1,-1c0,-0.55078 -0.44531,-1 -1,-1zM20,44c0,0.55469 -0.44922,1 -1,1c-0.55078,0 -1,-0.44531 -1,-1v-33c0,-0.55078 0.44922,-1 1,-1c0.55078,0 1,0.44922 1,1zM20,3c0,-0.55078 0.44922,-1 1,-1h8c0.55078,0 1,0.44922 1,1v2h-10zM26,44c0,0.55469 -0.44922,1 -1,1c-0.55078,0 -1,-0.44531 -1,-1v-33c0,-0.55078 0.44922,-1 1,-1c0.55078,0 1,0.44922 1,1zM32,44c0,0.55469 -0.44531,1 -1,1c-0.55469,0 -1,-0.44531 -1,-1v-33c0,-0.55078 0.44531,-1 1,-1c0.55469,0 1,0.44922 1,1z">
//                                         </path>
//                                     </g>
//                                 </g>
//                             </svg>
//                         </div>
//                         <div class="cart__edit-button">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
//                                 xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px"
//                                 viewBox="0 0 490.584 490.584" style="enable-background:new 0 0 490.584 490.584;"
//                                 xml:space="preserve">
//                                 <g>
//                                     <g>
//                                         <path
//                                             d="M100.911,419.404l123.8-51c3.1-2.1,6.2-4.2,8.3-6.2l203.9-248.6c6.2-9.4,5.2-21.8-3.1-29.1l-96.8-80.1 c-8-5.9-20.3-6.8-28.1,3.1l-204.9,248.5c-2.1,3.1-3.1,6.2-4.2,9.4l-26,132.1C72.511,420.104,90.611,424.004,100.911,419.404z M326.611,49.004l65.5,54.1l-177.7,217.1l-64.9-53.7L326.611,49.004z M133.411,306.904l44.4,36.8l-57.2,23.6L133.411,306.904z" />
//                                         <path
//                                             d="M469.111,448.504h-349.5c0,0-72.5,3.4-75.2-15.2c0-1-1.8-5.6,7.6-17c7.3-9.4,6.2-21.8-2.1-29.1 c-9.4-7.3-21.8-6.2-29.1,2.1c-19.8,23.9-25,44.7-15.6,63.5c25.5,47.5,111.3,36.3,115.4,37.3h348.5c11.4,0,20.8-9.4,20.8-20.8 C490.011,457.804,480.611,448.504,469.111,448.504z" />
//                                     </g>
//                                 </g>
//                             </svg>
//                         </div>
//                     </div>
    
//                 </div>`
//         })
//         cartBody.innerHTML = `<a class="cart__cruise-name">${data.cruiseName}</a>
//             <div class="cart__information-about-cruise">
//                 <span class="cart__direction-of-cruise">${stringRoutePoints}</span>
//                 <div class="cart__wrap-for-date-and-time">
//                     <div class="cart__first-date-and-time">
//                         <span class="cart__date">
//                             ${data.startDate.day} ${data.startDate.month} ${data.startDate.year}
//                         </span>
//                         <span class="cart__day-of-week-and-time">
//                             ${data.startDate.weekday}, ${data.startDate.time}
//                         </span>
//                     </div>
//                     <div class="cart__wrap-for-number-of-days">
//                         <div class="cart__arrow">

//                         </div>
//                         <span class="cart__number-of-days">
//                             ${data.durationDay} дней
//                         </span>
//                     </div>
//                     <div class="cart__second-date-and-time">
//                         <span class="cart__date">
//                             ${data.endDate.day} ${data.endDate.month} ${data.endDate.year}
//                         </span>
//                         <span class="cart__day-of-week-and-time">
//                             ${data.endDate.weekday}, ${data.endDate.time}
//                         </span>
//                     </div>
//                 </div>
//             </div>
//             <div class="cart__wrap-for-cabins">
//                 ${stringTickets}
//             </div>`;
        
//     }).catch((error)=>alert("Войдите в аккаунт"))
// }

