//filling busNo selected by user in buses page which was stored on session storage
const selectedBus=sessionStorage.getItem("selectedBus");
if(selectedBus){
    let busInput=document.getElementById("busNo");
    busInput.value=selectedBus;
    busInput.readOnly=true;
    sessionStorage.removeItem("selectedBus");
}

//disabling past dates and future dates(2 months ahead)
const today=new Date();
//min date is today
const minDate=new Date(today);
//max date is 2 months ahead
const maxDate=new Date(today);
maxDate.setMonth(today.getMonth()+2);
function formatDate(date){
    let yyyy=date.getFullYear();
    let mm=String(date.getMonth()+1).padStart(2,'0');
    let dd=String(date.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
}
const travelDateInput=document.getElementById("travelDate");
travelDateInput.min=formatDate(minDate);
travelDateInput.max=formatDate(maxDate);

//function to display available no of seats on user selecting travel date
travelDate.addEventListener("change",function(){
    const selectedDate=this.value;
    let availableSeats=getSeatsAvailability(selectedBus,selectedDate);
    let seatInfo=document.getElementById("showAvailableSeats");
    if(availableSeats<=0)
        seatInfo.innerHTML=`<strong>Bus is Full<\strong>`;
    else
        seatInfo.innerHTML=`${availableSeats} seats are available`;
});
// it will subtract total no of seats booked in that bus on that day from total seats
function getSeatsAvailability(busNo,date){
    const buses=JSON.parse(localStorage.getItem("availableBuses"))||[];
    const tickets=JSON.parse(localStorage.getItem("tickets"))||[];
    let bus=buses.find(b=>b.busNo===busNo);
    let totalSeats=bus.availableSeats;
    let bookedSeats=
                tickets.filter(t=>t.date===date && t.busNo===busNo)
                        .reduce((sum,t)=>sum+t.seats,0);
    return totalSeats-bookedSeats;
}   
//function to generate unique ticket ID
function generateTicketId(){
    return 'TKT'+Date.now()+Math.floor(Math.random()*900+100);
}

//checking availability of buses
function isBusAvailable(busNo,travelDate){
    const availableBuses=JSON.parse(localStorage.getItem('availableBuses'))||[];
    let bus=availableBuses.find(b=>b.busNo===busNo);
    //entered invalid bus number
    if(!bus)  
    {  
        showToast("Bus not found","fail");
        return false;
    }
    let now=new Date();
    let [h,m,s]=bus.departureTime.split(":");
    let depDateTime=new Date(travelDate);
    depDateTime.setHours(h,m,s,0);
    let diffMinutes=(depDateTime-now)/(60*1000); // 1min=60sec 1sec=1000millisec
    // checking if departure time of bus is less than 50 minutes 
    if(diffMinutes<=50)
        showToast("Can't book buses whose departing time is less than 50 minutes from now","fail");
    return diffMinutes>50;//bus is available only if its departure time is >50min from now
}

//adding event listener on submit function on ticket booking
document.getElementById("bookingForm").addEventListener("submit",function(e){
    e.preventDefault();
    // user must make payment to book tickets 
    let paymentMethodValue=document.getElementById("paymentMethod").value;
    if(!paymentMethodValue){
        showToast("Please select a payment method","fail");
        return ;
    }
    let paymentValid=false;
    // if upi payment is selected validate upi id
    if(paymentMethodValue==="upi"){
        let upiInput=document.getElementById('upiID').value;
        if(!upiInput||!upiInput.match(/^[0-9]{10}@[a-zA-Z]{3}$/)){
            show("Please enter a valid UPI ID","fail");
            return;
        }
        paymentValid=true;
    }
    // if card payment is selected validate card details
    else if(paymentMethodValue==="card"){
        let cardNumber=document.getElementById("cardNumber").value;
        let cardHolder=document.getElementById("cardHolder").value.trim();
        let expiryDate=document.getElementById("expiryDate").value;
        let cvv=document.getElementById("CVV").value;
        if(!cardNumber||!cardNumber.match(/^[0-9]{16}$/)){
            showToast("Please enter a valid 16-digit card number","fail");
            return ;
        }
        if(!cardHolder){
            showToast("Please enter the card holder's name","fail");
            return ;
        }
        if(!expiryDate||!expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)){
            showToast("Please enter a valid expiry date (MM/YY).","fail");
            return;
        }
        if(!cvv||!cvv.match(/^[0-9]{3}$/)){
            showToast("Please enter a valid 3 digit CVV","fail");
            return ;
        }
        paymentValid=true;
    }
    // if payment is invalid return 
    if(!paymentValid){
        showToast("Payment information is invalid","fail");
        return ;
    }
    const busNo=document.getElementById("busNo").value;
    const travelDate=document.getElementById("travelDate").value;
    //listens ticket booking events and checks if bus is available or not
    if(!isBusAvailable(busNo,travelDate))
        return ;
    //collect ticket details
    const seats=parseInt(document.getElementById("seats").value);
    const buses=JSON.parse(localStorage.getItem("availableBuses"))||[];
    const bus=buses.find(b=>b.busNo===busNo);
    //checking if seats are available
    const availableSeats=getSeatsAvailability(bus.busNo,travelDate);
    if(availableSeats<seats){
        showToast(`Only ${availableSeats} seats are available`,"fail");
        return ;
    }
    // to generate new ticketID to uniquely identify each ticket
    const ticketId=generateTicketId();
    // creating ticket to store on local Storage
    const newTicket={
        ticketId:ticketId,
        passenger:currentUser.userName,
        mobile:currentUser.phoneNumber,
        busNo:bus.busNo,
        from:bus.fromCity,
        to:bus.toCity,
        time:bus.departureTime,
        date:travelDate,
        acType:bus.acType,
        busType:bus.busType,
        seats:seats,
        fare:seats*bus.fare
    };
    // retrieve tickets from local Storage
    let tickets=JSON.parse(localStorage.getItem("tickets"))||[];
    // push new ticket into tickets 
    tickets.push(newTicket);
    // now save tickets again into localStorage
    localStorage.setItem("tickets",JSON.stringify(tickets));
    // show success message 
    showToast("Successfully booked tickets","success");
    // generate new ticket 
    generateTicket(newTicket);
});
//ticket generator function
function generateTicket(ticket){
    const ticketHTML=`
        <h2>Bus Ticket</h2>
        <p><b>Ticket ID : </b>${ticket.ticketId}</p>
        <p><b>Booked by : </b>${ticket.passenger}</p>
        <p><b>Mobile : </b>${ticket.mobile}</p>
        <p><b>Bus Number : </b>${ticket.busNo}</p>
        <p><b>From : </b>${ticket.from}</p>
        <p><b>To : </b>${ticket.to}</p>
        <p><b>Date : </b>${ticket.date}</p>
        <p><b>Time : </b>${ticket.time}</p>
        <p><b>Bus Type : </b>${ticket.busType}</p>
        <p><b>AC Type : </b>${ticket.acType}</p>
        <p><b>Seats : </b>${ticket.seats}</p>
        <p><b>Amount Payable :</b>${ticket.fare}</p>
        <p style="color:green"><b>Status : </b>Confirmed</p>
        <button onclick="window.print()">Download Ticket</button>
        `;
        document.getElementById("ticket").innerHTML=ticketHTML;
}
//function to change payment method
const paymentMethod=document.getElementById("paymentMethod");
paymentMethod.addEventListener("change",function(){
    const paymentInputs=document.getElementById("paymentInputs");
    // initially not displaying anything 
    paymentInputs.innerHTML="";
    // if selected upi payment display input container for upi id 
    if(this.value==="upi"){
        paymentInputs.innerHTML=`
            <div class="form-row"><br><br>
                <label> UPI ID *</label>
                <input type="text" id="upiID">
            </div>
                `;
    }
    // if selected card payment display input container for card number,name,expiry date,cvv
    else if(this.value==="card"){
        paymentInputs.innerHTML=`
            <div class="form-row">
                <label>Card Number *</label>
                <input type="text" id="cardNumber">
            </div>
            <div class="form-row"><br><br>
                <label>Card Holder Name *</label>
                <input type="text" id="cardHolder">
            </div>
            <div class="form-row"><br><br>
                <label>Expiry Date *</label>
                <input type="text" id="expiryDate" placeholder="MM/YY">
            </div>
            <div class="form-row"><br><br>
                <label>Enter CVV *</label>
                <input type="password" id="CVV">
            </div>
        `;
    }
});
