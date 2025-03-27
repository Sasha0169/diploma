let buttonsForSelection = document.getElementsByClassName("form-for-search__button-for-selecting");
buttonsForSelection = Array.from(buttonsForSelection);
let openPanel;
buttonsForSelection.forEach((a)=>a.addEventListener("click",(e)=>{
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
    e.currentTarget.values = [];
}));
let radios = document.querySelectorAll(".form-check-input[type=radio]");
radios.forEach((a)=>a.addEventListener("change",(e)=>{
    e.currentTarget.closest(".form-for-search__wrap-for-button").getElementsByClassName("form-for-button__placeholder-for-button")[0].textContent = e.currentTarget.value
}))


let checkboxes = document.querySelectorAll(".form-check-input[type=checkbox]");
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
    if(button.values.length > 1){
        label.textContent = button.values[0]+",...";
    }
    else    
        label.textContent = button.values[0];
}))

let open_panel;
let interaction_container;
let descendants_of_objects = ["navigation-panel__column", "navigation-panel__title", "navigation-panel__option", "navigation-panel__wrap-for-content", "categories-navigation__link"];
let elements = document.getElementsByClassName('categories-navigation__option');
let panels = document.getElementsByClassName('navigation-panel');
for(let i = 0, a = 0; i<elements.length; i++)
{
    if(i==2)
    continue;
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