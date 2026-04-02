// get busNo,ticketId from session storage to fill automatically in cancel ticket form 
const busNo = sessionStorage.getItem("cancelBusNo");
const ticketId = sessionStorage.getItem("cancelTicketId");
if (busNo) {
    let busInput = document.getElementById("busNo");
    busInput.value = busNo;
    busInput.readOnly = true;
    sessionStorage.removeItem("cancelBusNo");
}
if (ticketId) {
    let ticketInput = document.getElementById("ticketId");
    ticketInput.value = ticketId;
    ticketInput.readOnly = true;
    sessionStorage.removeItem("cancelTicketId");
}
//adding event listener on submit function of cancel ticket
document.getElementById("cancelForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let refundMethod = document.getElementById("refundMethod").value;
    let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    //to cancel ticket firstly the ticket must be booked should have valid busNo ,ticketId and must be cancelled by user who booked it
    let ticket = tickets.find(t => t.busNo === busNo && t.ticketId === ticketId && t.passenger === currentUser.userName);
    if (!ticket) {
        showToast("Ticket not found or doesn't belong to current user", "fail");
        return;
    }
    const [h, m, s] = ticket.time.split(":");
    const depTime = new Date(ticket.date);
    depTime.setHours(h, m || 0, s || 0, 0);
    const now = new Date();
    const diffHours = (depTime - now) / (1000 * 60 * 60);
    //if departure time<4 hrs from now then not possible to cancel ticket
    if (diffHours < 4) {
        showToast("Cancellation must be atleast 4 hours before departure", "fail");
        return;
    }
    //updating tickets on local storage
    const updatedTickets = tickets.filter(t => t.ticketId !== ticketId);
    localStorage.setItem("tickets", JSON.stringify(updatedTickets));
    //adding cancelled ticket to local storage
    let cancelledTickets = JSON.parse(localStorage.getItem('cancelledTickets')) || [];
    // adding cancelledAt,refund method to cancelled ticket before pushing it onto local storage 
    ticket.cancelledAt = new Date();
    ticket.refundMethod = refundMethod;
    cancelledTickets.push(ticket);
    localStorage.setItem("cancelledTickets", JSON.stringify(cancelledTickets));
    // show alert and clear form
    showToast("Ticket cancelled successfully\nRefund will be processed in next 24 hours", "success");
    document.getElementById("cancelForm").reset();
});
