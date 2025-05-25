
fetch('/checkAuth', {
    method: 'GET',
    credentials: 'include', 
  })
  .then(res => res.json())
  .then(data => {
    if (data.authenticated) {
        getUserName();
        refreshCart();
        buttonForEntrance.removeEventListener("click", buttonForEntranceForUnauthorizedUser)
        buttonForEntrance.addEventListener("pointerenter", buttonForEntranceForAuthorizedUser)
        buttonForEntrance.addEventListener("pointerleave", closeMenuForUser)
    } 
    else{
        refreshCartForUnauthorizedUser();
        
    }
  });
// let openPanel;
let interactionContainer;
let descendants_of_objects = ["navigation-panel__column", "navigation-panel__title", "navigation-panel__option", "navigation-panel__wrap-for-content", "categories-navigation__link"];
let elements = document.getElementsByClassName('categories-navigation__option');
let panels = document.getElementsByClassName('navigation-panel');
for(let i = 0, a = 0; i<4; i++)
{
    elements[i].panelForOpen = panels[i];
    elements[i].addEventListener("pointerenter", openNavigationPanel);
    elements[i].addEventListener("pointerleave", scheduleClosePanel);
    panels[i].addEventListener("pointerleave", scheduleClosePanel);
    panels[i].addEventListener("pointerenter", cancelClosePanel);
}

let navigationPanel = null;
let closeTimeout = null;

// Функция показа панели
function openNavigationPanel(event) {
  const panel = event.currentTarget.panelForOpen;

  // Отмена отложенного закрытия
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }

  // Если уже открыта нужная панель — ничего не делать
  if (navigationPanel === panel && panel.style.display === "flex") return;

  // Закрываем предыдущую
  if (navigationPanel && navigationPanel !== panel) {
    navigationPanel.style.display = "none";
  }

  // Показываем новую панель
  panel.style.display = "flex";
  panel.animate([
    { transform: "translateY(-100%)", opacity: 0 },
    { transform: "translateY(0)", opacity: 1 }
  ], {
    duration: 600,
    easing: "ease-out"
  });

  navigationPanel = panel;
}

// Функция отложенного скрытия
function scheduleClosePanel() {
  if (closeTimeout) clearTimeout(closeTimeout);

  closeTimeout = setTimeout(() => {
    if (navigationPanel) {
      navigationPanel.animate([
        { transform: "translateY(0)", opacity: 1 },
        { transform: "translateY(-100%)", opacity: 0 }
      ], {
        duration: 600,
        easing: "ease-out"
      }).finished.then(() => {
        if (navigationPanel) {
          navigationPanel.style.display = "none";
          navigationPanel = null;
        }
      });
    }
  }, 300); // задержка 300 мс
}

// Отмена закрытия при повторном наведении
function cancelClosePanel() {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }
}

function viewMenuNavigation()
{
    document.getElementsByClassName('transparent-background-with-navigation-menu')[0].style.display='flex';
    document.body.style.overflow = 'hidden';
};

function closeMenuNavigation()
{
    document.getElementsByClassName('transparent-background-with-navigation-menu')[0].style.display ='none';
    document.body.style.overflow = 'scroll';
}

// let buttons = Array.from(document.getElementsByClassName("cruise-card__button"));
// buttons.forEach(a=>a.addEventListener("click", openCruisePage))

// function openCruisePage(a){
//     window.open("http://localhost:3000/cruise", "_blank");
// }



let inputForEmail = document.getElementsByClassName("entrance-panel__input-for-section")[0];
let inputForPassword = document.getElementsByClassName("entrance-panel__input-for-section")[1];
let entrancePanel = document.getElementsByClassName("wrap-for-entrance-panel")[0];
// let buttonForEntrance = entrancePanel.getElementsByClassName("btn")[0];

// buttonForEntrance.addEventListener("click", function(e){
//     e.preventDefault();
//     fetch("http://localhost:3000/login", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json" 
//           },
//         body: JSON.stringify({email: inputForEmail.value, password: inputForPassword.value})
//     })
//     .then(response => response.json())
//     .then(data => {
//         localStorage.setItem("token", data.token);
//         console.log(data.token);
//   })   
//   .catch(error => console.error("Ошибка:", error));
// })

document.getElementsByClassName("entrance-panel__button")[0].addEventListener("click", function(e){
    e.preventDefault();
    let email = document.getElementsByClassName("form-control entrance-panel__input-for-section")[0].value;
    let password = document.getElementsByClassName("form-control entrance-panel__input-for-section")[1].value;
    console.log({email: email, password: password});
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json" 
        },
      body: JSON.stringify({email: email, password: password})
  })
  .then(response => {
    if (!response.ok) {
    // Пробрасываем ошибку, чтобы попасть в .catch
    return response.json().then(err => {
      throw new Error(err.error || "Ошибка авторизации");
    });
  }
  return response.json();
    }) // Парсим JSON
  .then(data => {
    getUserName();
    entrancePanel.style.display = "none";
    buttonForEntrance.removeEventListener("click", buttonForEntranceForUnauthorizedUser)
    buttonForEntrance.addEventListener("pointerenter", buttonForEntranceForAuthorizedUser)
    buttonForEntrance.addEventListener("pointerleave",closeMenuForUser)
})   
.catch(error => alert("Неправильный логин или пароль"));
  })

  async function getUserName(){
    fetch("http://localhost:3000/getUserName", {
      method: "POST",
      headers: {
        credentials: 'include',
          "Content-Type": "application/json" 
        },
      body: JSON.stringify({})
  })
  .then(response => response.json()) // Парсим JSON
  .then(data => {
    console.log(data)
    document.getElementsByClassName("entrance__text")[0].textContent=`${data.last_name} ${data.first_name}`;
    
  })   
  .catch(error => console.error("Ошибка:", error));
  }



  const buttonForEntrance = document.getElementsByClassName("entrance__text")[0];
  buttonForEntrance.addEventListener("click", function(e){
    e.preventDefault()
    document.getElementsByClassName("wrap-for-entrance-panel")[0].style.display ="flex";
  })


  function refreshCartForUnauthorizedUser(){
    const cart = document.getElementsByClassName("cart")[0];
    const body = cart.getElementsByClassName("cart__body")[0];
    const buttonForBook = cart.getElementsByClassName("cart__checkout")[0];
    body.innerHTML = `<span class="cart__empty-cart-message">
        Войдите в аккаунт
    </span>`;
    body.style.justifyContent="center";        
    buttonForBook.style.display = "none";
  }

  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  function refreshCart(){
    fetch("http://localhost:3000/cart", {
        method: "get",
        headers: {
            "Content-Type": "application/json" 
          }
    })
    .then(response => response.json())
    .then(data => {
        if(isEmptyObject(data)){
            checkCabinsExist();
            return;
        }
        const cartBody = cart.getElementsByClassName("cart__body")[0];
        const stringRoutePoints = data.routePoints.join(" &mdash; ");
        let stringTickets = "";
        data.tickets.forEach((ticket)=>{
            let stringTourists = "";
            ticket.selectedTariffsWithPrice.forEach((tourist, index)=>{
                let cat;
                if(tourist.tariff=="pensioner")
                    cat = "Пенсионный"
                if(tourist.tariff=="adult")
                    cat = "Взрослый"
                if(tourist.tariff=="child")
                    cat = "Детский"
                stringTourists += `
                        <div class="cart__wrap-for-tourist">
                            <span class="cart__tourist-number">
                                Турист ${index+1}
                            </span>
                            <div class="cart__name-of-tariff">
                                ${cat} тариф
                            </div>
                            <div class="cart__ticket-price">
                                ${tourist.price} &#8381;
                            </div>
                        </div>`
            })
            stringTickets += `<div class="cart__cabin" ticketId="${ticket.ticketId}">
                    <div class="cart__wrap-for-cabin-name">
                        <span class="cart__number-of-cabin-and-cabin-name">
                            Каюта №${ticket.place} - ${ticket.infoAboutCabin.cabinName}
                        </span>
                        <span class="cart__desk-name">
                            ${ticket.infoAboutDeck.deckName}
                        </span>
                    </div>
                    <div class="cart__wrap-for-tourists">
                        ${stringTourists}
                    </div>
                    
                    <div class="cart__wrap-for-total-for-cabin">
                        <span class="cart__label-for-total">Итого</span>
                        <span class="cart__total-for-cabin">400 000 &#8381;</span>
                    </div>
    
                    <div class="cart__wrap-for-buttons">
                        <div class="cart__delete-button">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20"
                                viewBox="0,0,256,256" style="fill:#FFFFFF;">
                                <g fill="#000000" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                                    stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                                    font-family="none" font-weight="none" font-size="none" text-anchor="none"
                                    style="mix-blend-mode: normal">
                                    <g transform="scale(5.12,5.12)">
                                        <path
                                            d="M42,5h-10v-2c0,-1.65234 -1.34766,-3 -3,-3h-8c-1.65234,0 -3,1.34766 -3,3v2h-10c-0.55078,0 -1,0.44922 -1,1c0,0.55078 0.44922,1 1,1h1.08594l3.60938,40.51563c0.125,1.39063 1.30859,2.48438 2.69531,2.48438h19.21484c1.38672,0 2.57031,-1.09375 2.69531,-2.48437l3.61328,-40.51562h1.08594c0.55469,0 1,-0.44922 1,-1c0,-0.55078 -0.44531,-1 -1,-1zM20,44c0,0.55469 -0.44922,1 -1,1c-0.55078,0 -1,-0.44531 -1,-1v-33c0,-0.55078 0.44922,-1 1,-1c0.55078,0 1,0.44922 1,1zM20,3c0,-0.55078 0.44922,-1 1,-1h8c0.55078,0 1,0.44922 1,1v2h-10zM26,44c0,0.55469 -0.44922,1 -1,1c-0.55078,0 -1,-0.44531 -1,-1v-33c0,-0.55078 0.44922,-1 1,-1c0.55078,0 1,0.44922 1,1zM32,44c0,0.55469 -0.44531,1 -1,1c-0.55469,0 -1,-0.44531 -1,-1v-33c0,-0.55078 0.44531,-1 1,-1c0.55469,0 1,0.44922 1,1z">
                                        </path>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div class="cart__edit-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px"
                                viewBox="0 0 490.584 490.584" style="enable-background:new 0 0 490.584 490.584;"
                                xml:space="preserve">
                                <g>
                                    <g>
                                        <path
                                            d="M100.911,419.404l123.8-51c3.1-2.1,6.2-4.2,8.3-6.2l203.9-248.6c6.2-9.4,5.2-21.8-3.1-29.1l-96.8-80.1 c-8-5.9-20.3-6.8-28.1,3.1l-204.9,248.5c-2.1,3.1-3.1,6.2-4.2,9.4l-26,132.1C72.511,420.104,90.611,424.004,100.911,419.404z M326.611,49.004l65.5,54.1l-177.7,217.1l-64.9-53.7L326.611,49.004z M133.411,306.904l44.4,36.8l-57.2,23.6L133.411,306.904z" />
                                        <path
                                            d="M469.111,448.504h-349.5c0,0-72.5,3.4-75.2-15.2c0-1-1.8-5.6,7.6-17c7.3-9.4,6.2-21.8-2.1-29.1 c-9.4-7.3-21.8-6.2-29.1,2.1c-19.8,23.9-25,44.7-15.6,63.5c25.5,47.5,111.3,36.3,115.4,37.3h348.5c11.4,0,20.8-9.4,20.8-20.8 C490.011,457.804,480.611,448.504,469.111,448.504z" />
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
    
                </div>`
        })
        cartBody.innerHTML = `
            <div class="cart__wrap-for-information">
                <a class="cart__cruise-name" href="/cruise/${data.cruiseId}">${data.cruiseName}</a>
                <div class="cart__information-about-cruise">
                    <span class="cart__direction-of-cruise">${stringRoutePoints}</span>
                    <div class="cart__wrap-for-date-and-time">
                        <div class="cart__first-date-and-time">
                            <span class="cart__date">
                                ${data.startDate.day} ${data.startDate.month} ${data.startDate.year}
                            </span>
                            <span class="cart__day-of-week-and-time">
                                ${data.startDate.weekday}, ${data.startDate.time}
                            </span>
                        </div>
                        <div class="cart__wrap-for-number-of-days">
                            <div class="cart__arrow">

                            </div>
                            <span class="cart__number-of-days">
                                ${data.durationDays} дней
                            </span>
                        </div>
                        <div class="cart__second-date-and-time">
                            <span class="cart__date">
                                ${data.endDate.day} ${data.endDate.month} ${data.endDate.year}
                            </span>
                            <span class="cart__day-of-week-and-time">
                                ${data.endDate.weekday}, ${data.endDate.time}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cart__wrap-for-cabins">
                ${stringTickets}
            </div>
            <div class="cart__wrap-for-total">
                <span class="cart__label-for-total">Итого</span>
                <span class="cart__total">${data.total}</span>
            </div>`;
            const deleteCabinButtons = Array.from(cart.getElementsByClassName("cart__delete-button"));
            deleteCabinButtons.forEach(button => button.addEventListener("click", function(e){
                
                const cabin = e.currentTarget.closest('.cart__cabin');
                const ticketId = cabin.getAttribute("ticketId");
                cabin.remove();
                deleteTicketFromCart(ticketId);
                checkCabinsExist();
            }))
    }).catch((error)=>console.log(error))
}

function deleteTicketFromCart(ticketId){
    fetch(`http://localhost:3000/cart/${ticketId}`, {
        method: "delete",
        headers: {
            "Content-Type": "application/json" 
          }
    })
    .then(response => response.json())
    .then(data => {})
}

  const buttonForEntrance = document.getElementsByClassName("information-and-entrance__wrap-for-entrance")[0];
  buttonForEntrance.addEventListener("click", buttonForEntranceForUnauthorizedUser)

  function buttonForEntranceForUnauthorizedUser(e){
    e.preventDefault()
    const entrancePanel = document.getElementsByClassName("wrap-for-entrance-panel")[0];
    entrancePanel.style.display ="flex";
    entrancePanel.getElementsByClassName("entrance-panel__close-button")[0].addEventListener("click",function(){
        entrancePanel.style.display = "none";
    })
  }

  function buttonForEntranceForAuthorizedUser(e) {
    e.preventDefault();
    const menu = document.getElementsByClassName("menu-for-user")[0];
    menu.style.display = "flex";
    menu.animate([
        { transform: "translateY(-100%)", opacity: 0 },
        { transform: "translateY(0)", opacity: 1 }
      ], {
        duration: 600,
        easing: "ease-out"
      }).finished.then(() => {
        if (menu) {
          menu.style.display = "flex";
        }
      });
  }
  
  function closeMenuForUser(e) {
    const menu = document.getElementsByClassName("menu-for-user")[0];
      menu.style.display = "none";

  }

const buttonForCart = document.getElementsByClassName("lower-head__wrap-for-right-element")[0];
buttonForCart.addEventListener("click", function (e){
    const cart = document.getElementsByClassName("cart")[0];
    cart.style.display = "flex";
})
  

 