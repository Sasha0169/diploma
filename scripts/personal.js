const inputs = Array.from(document.querySelectorAll('.form-control, .form-check-input'));
inputs.forEach((element)=>{
    element.style.pointerEvents = 'none'
})
const selects = Array.from(document.getElementsByClassName("form-select"));
selects.forEach((element)=>{
    element.style.display = 'none'
})
const checkboxes = Array.from(document.getElementsByClassName("form-check"));
checkboxes.forEach((element)=>{
    element.style.display = 'none'
})

const buttonForEditAndSaveData = document.getElementsByClassName("user-account__button")[0];
buttonForEditAndSaveData.addEventListener("click", editData);

function editData(e){
    inputs.forEach((element)=>{
        element.style.pointerEvents="auto";
    })
    inputs[6].style.display = "none";
    inputs[7].style.display = "none";
    selects.forEach((element)=>{
        element.style.display = 'flex'
    })
    checkboxes.forEach((element)=>{
        element.style.display = 'flex'
    })
    document.getElementsByClassName("user-account__gender")[0].style.display = "none";
    e.currentTarget.textContent = "Сохранить данные";
}

function saveData(){
    
}