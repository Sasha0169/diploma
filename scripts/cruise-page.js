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

    // button.lowerPart = wrap.getElementsByClassName("cabin__lower-part")[0];
    button.addEventListener("click", openLowerPartOfCabin)})

function openLowerPartOfCabin (e){
    e.preventDefault();
    const button = e.currentTarget;
    const cabin = button.closest(".cabin");
    cabin.animate([
        { height: `${cabin.clientHeight}px`},
        { height: `${cabin.scrollHeight + 2}px`}
      ], {
        duration: 600,
        easing: "ease-out",
        fill: "forwards"
      })
    button.removeEventListener("click", openLowerPartOfCabin)
    button.addEventListener("click", closeLowerPartOfCabin)
}

function closeLowerPartOfCabin (e){
    e.preventDefault();
    const button = e.currentTarget;
    const cabin = button.closest(".cabin");
    cabin.animate([
        { height: `${cabin.clientHeight}px`},
        { height: "282px"}
      ], {
        duration: 600,
        easing: "ease-out",
        fill: "forwards"
      })
    button.removeEventListener("click", closeLowerPartOfCabin)
    button.addEventListener("click", openLowerPartOfCabin)
}

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

let routePoints = Array.from(document.getElementsByClassName("route-point__wrap-for-place"));
routePoints.forEach((routePoint)=>{
    routePoint.addEventListener("pointerenter", disclosureOfNavigationRoute)
    routePoint.addEventListener("pointerleave", closeNavigationRoute)
})

function disclosureOfNavigationRoute (event){
    const routePoint = event.currentTarget;
    const arrow = routePoint.getElementsByClassName("route-point__arrow")[0];
    routePoint.animate([
        { height: `${routePoint.clientHeight}px`},
        { height: `${routePoint.scrollHeight + 2}px`}
  ], {
    duration: 600,
    easing: "ease-out",
    fill: "forwards"
  })
  arrow.animate([
        { transform: `rotate(0deg)`},
        { transform: `rotate(90deg)`}
  ], {
    duration: 100,
    easing: "ease-out",
    fill: "forwards"
  })
}

function closeNavigationRoute (event){
    const routePoint = event.currentTarget;
    const arrow = routePoint.getElementsByClassName("route-point__arrow")[0];
    routePoint.animate([
        { height: `${routePoint.clientHeight}px`},
        { height: "170px"}
  ], {
    duration: 600,
    easing: "ease-out",
    fill: "forwards"
  })
  arrow.animate([
        { transform: `rotate(90deg)`},
        { transform: `rotate(0deg)`}
  ], {
    duration: 100,
    easing: "ease-out",
    fill: "forwards"
  })
}


