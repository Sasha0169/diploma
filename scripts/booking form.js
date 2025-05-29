const fields = Array.from(document.querySelectorAll(".booking-section_first-section .form-control, .booking-section_first-section .form-check-input"));
fields.forEach((element, index)=>{
    if(index<6||index>=9)
        element.disabled = true;
})