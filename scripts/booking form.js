const fields = Array.from(document.querySelectorAll(".booking-section_first-section .form-control, .booking-section_first-section .form-check-input"));
fields.forEach((element, index)=>{
    if(index<6||index>=9)
        element.disabled = true;
})

const cabins = Array.from(document.getElementsByClassName("booking-section__cabin"));
const buttonForBooking = document.getElementsByClassName("booking-page__button")[0];
buttonForBooking.addEventListener("click", function(e){
    let dataForBooked = {tourists: []};
    const purchaserData = document.getElementsByClassName("booking-section_first-section")[0];
    dataForBooked.purchaser = {
        document: {
            type: purchaserData.getElementsByClassName("form-select")[0].value,
            number: fields[7].value,
            series: fields[6].value, 
            issuedBy: fields[8].value
        }
    };
    cabins.forEach((cabin)=>{
        const tourists = Array.from(cabin.getElementsByClassName("booking-section__passenger"));
        tourists.forEach((tourist)=>{
            dataForBooked.tourists.push({
                firstName: tourist.getElementsByClassName("form-control")[1].value,
                middleName: tourist.getElementsByClassName("form-control")[2].value,
                lastName: tourist.getElementsByClassName("form-control")[0].value,
                email: tourist.getElementsByClassName("form-control")[7].value,
                birthDate: tourist.getElementsByClassName("form-control")[3].value,
                phoneNumber: tourist.getElementsByClassName("form-control")[6].value,
                citizenship: tourist.getElementsByClassName("form-select")[0].value,
                gender: tourist.getElementsByClassName("form-check-input")[0].checked == true? "man": "woman",
                document: {
                    type: tourist.getElementsByClassName("form-select")[1].value,
                    series: tourist.getElementsByClassName("form-control")[4].value,
                    number: tourist.getElementsByClassName("form-control")[5].value
                }
            }) 
        })
    })
    console.log(dataForBooked)
    fetch("/booked", {
    method: 'POST',
    headers: {
          "Content-Type": "application/json" 
        },
      body: JSON.stringify(dataForBooked)
  })
  .then(response => response.json()) 
  .then((data) => {
    console.log(data);
    
  })   
  .catch(error => console.error("Ошибка:", error));
  alert("Билеты успешно забронированы");
  window.open(`http://localhost:3000/`);
});
