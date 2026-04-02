
// retrieve all tickets from local storage and push current user bookings into a array 
const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
//already have current user
let myB = [];
//pushed all tickets of currentUser to myB an array
for (let t of tickets) {
    if (t.passenger === currentUser.userName)
        myB.push(t);
}
// to display latest ticket first in myBookings
myB.sort((a, b) => {
    // Combine date and time into a date object
    const dateA = new Date(`${a.date}T${a.time}`);//"2026-04-02T06:30:00" is iso format
    const dateB = new Date(`${b.date}T${b.time}`);

    // sort descending that is latest first
    return dateB - dateA;
});
let container = document.getElementById('myBookings');
// initially container is empty 
container.innerHTML = '';
let found = false;
// append all myB into my bookings html container
for (let t of myB) {
    found = true;
    // create a div 
    let div = document.createElement("div");
    // add className to it 
    div.className = "booking1"
    // keep all req html code in it 
    div.innerHTML = `
        <br><p><strong>${t.from} ➡️ ${t.to}</strong></p><br><br>
        <p>📅 ${t.date} ⏰ ${t.time}</p><br><br>
        <p><strong>Bus :</strong>${t.busNo} | ${t.acType} | ${t.busType}</p><br><br>
        <p><strong>Ticket :</strong>${t.ticketId} | 💺 ${t.seats} | 🪙 ${t.fare}</p><br><br>
        <button onclick="cancelTicket('${t.busNo}','${t.ticketId}')">Cancel Ticket</button>
        <button onclick="writeReview('${t.busNo}','${t.ticketId}')">Write Review</button><br><br>
        `;
    // append each booking to outer container
    container.append(div);
}
//if no bookings found display no bookings found
if (found === false)
    container.innerHTML = `<p><strong>No bookings found</strong></p>`;
//function to call cancel_ticket page
function cancelTicket(busNo, ticketId) {
    sessionStorage.setItem("cancelBusNo", busNo);
    sessionStorage.setItem("cancelTicketId", ticketId);
    window.location.href = "../html/cancelTicket.html";
}
//function to call review page
function writeReview(busNo, ticketId) {
    sessionStorage.setItem("reviewBusNo", busNo);
    sessionStorage.setItem("reviewTicketId", ticketId);
    window.location.href = "../html/writeReview.html";
}
