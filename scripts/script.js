

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

// let buttons = Array.from(document.getElementsByClassName("cruise-card__button"));
// buttons.forEach(a=>a.addEventListener("click", openCruisePage))

// function openCruisePage(a){
//     window.open("http://localhost:3000/cruise", "_blank");
// }



let inputForEmail = document.getElementsByClassName("entrance-panel__input-for-section")[0];
let inputForPassword = document.getElementsByClassName("entrance-panel__input-for-section")[1];
let entrancePanel = document.getElementsByClassName("entrance-panel")[0];
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



  

 