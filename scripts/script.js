let cities;
let ships;
let routes;
fetch("http://localhost:3000/getData")
  .then(response => response.json()) // Парсим JSON
  .then(data => {
    console.log(data)
    cities = new Map(data.cities.map(city => [city.city_id, city.name]));
    routes = new Map(data.routes.map(route => [route.route_id, route.name]));
    ships = new Map(data.ships.map(ship => [ship.ship_id, ship.ship_name]));
    console.log(cities, routes, ships)
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
console.log(numbersOfDays)
let wraps = Array.from(document.getElementsByClassName("form-for-search__wrap-for-button-and-panel"));
for(let i=1; i<wraps.length; i++){
    console.log(wraps[i])
    let checkboxes = wraps[i].querySelectorAll(".form-check-input[type=checkbox]");
    checkboxes.forEach((a)=>a.addEventListener("change",(e)=>{
    let checkbox = e.currentTarget;
    let button = checkbox.closest(".form-for-search__wrap-for-button").getElementsByClassName("form-for-search__button-for-selecting")[0];
    console.log(button.values)
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

let open_panel;
let interaction_container;
let descendants_of_objects = ["navigation-panel__column", "navigation-panel__title", "navigation-panel__option", "navigation-panel__wrap-for-content", "categories-navigation__link"];
let elements = document.getElementsByClassName('categories-navigation__option');
let panels = document.getElementsByClassName('navigation-panel');
for(let i = 0, a = 0; i<4; i++)
{
    elements[i].onmouseover= open_navigation_panel;
    elements[i].panel_for_open = panels[a];
    elements[i].onmouseout = close_navigation_panel;
    elements[i].panel_for_open.onmouseout = close_navigation_panel;
    a++;
}

function open_navigation_panel(event)
{
    if(open_panel!=undefined)
        if(open_panel != event.currentTarget.panel_for_open)
        {
            for(let i = 0; i<panels.length; i++)
            {
                panels[i].style.display = "none";
            }
        }
    event.currentTarget.panel_for_open.style.display = "flex";
    open_panel = event.currentTarget.panel_for_open;
    interaction_container = event.currentTarget;
}

function close_navigation_panel(event)
{
    let isAnotherObject=true;
    let relatedTarget = event.relatedTarget;
    if(relatedTarget==null||open_panel==undefined)
    return;
    for(let a of descendants_of_objects)
    {
        if (relatedTarget.className == a)
        {
            isAnotherObject = false;
            return;
        }
    }

    if(relatedTarget==open_panel||relatedTarget==interaction_container)
    {
        isAnotherObject = false;
    }

    if(isAnotherObject)
        open_panel.style.display = "none";
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

let buttons = Array.from(document.getElementsByClassName("cruise-card__button"));
buttons.forEach(a=>a.addEventListener("click", openCruisePage))

function openCruisePage(a){
    window.open("http://localhost:3000/cruise", "_blank");
}

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
        departureCity: buttonsForSelection[0].values,
        routes: buttonsForSelection[1].values,
        date: document.getElementsByClassName("form-for-search__datepicker")[0].value.split(" - "),
        numberOfDay: buttonsForSelection[2].values,
        ships: buttonsForSelection[2].values
    }
    console.log(searchParameters)
    fetch("http://localhost:3000/getCruises", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
          },
        body: JSON.stringify(searchParameters)
    })
    .then(response => response.json()) // Парсим JSON
    .then(data => {
        console.log(data)
  })   
  .catch(error => console.error("Ошибка:", error));
})

