fetch('/order-records', {
    method: 'GET',
    headers: {
        "Content-Type": "application/json" 
    }
})
.then(res => res.json())
.then(data => {
    console.log(data);
    let str = "";
    data.forEach((order)=>{
        str+=`
        <tr class="orders__row">
            <td class="orders__cell">#${String(order.order_id).padStart(6, '0')}</td>
            <td class="orders__cell">${order.time.date} ${order.time.time}</td>
            <td class="orders__cell">${order.people_count}</td>
            <td class="orders__cell">${String(order.cruise_id).padStart(6, '0')}</td>
            <td class="orders__cell">27.06.2025</td>
            <td class="orders__cell orders__cell_status orders__cell_status_unpaid">Не оплачено</td>
            <td class="orders__cell">${order.payment_amount} ₽</td>
        </tr>`
    })
    const bodyTable = document.getElementsByClassName("orders__body")[0];
    bodyTable.innerHTML = str;
})
.catch(error => console.error("Ошибка:", error));