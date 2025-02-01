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
