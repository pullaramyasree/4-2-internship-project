
// retrieve busNo and ticketId from sessionStorage to fill in review form automatically 
const busNo=sessionStorage.getItem("reviewBusNo");
const ticketId=sessionStorage.getItem("reviewTicketId");
if(busNo){
    const busInput=document.getElementById("busNo");
    busInput.value=busNo;
    busInput.readOnly=true;
    sessionStorage.removeItem("reviewBusNo");
}
if(ticketId){
    const ticketInput=document.getElementById("ticketId");
    ticketInput.value=ticketId;
    ticketInput.readOnly=true;
    sessionStorage.removeItem("reviewTicketId");
}

const reviewForm=document.getElementById("reviewForm");
//handle form submission
reviewForm.addEventListener('submit',function(e){
    e.preventDefault();
    const rating=document.getElementById('rating').value;
    const comment=document.getElementById('comment').value;
    //fetch all tickets from local storage to validate ticket booking before review
    const tickets=JSON.parse(localStorage.getItem('tickets'))||[];
    const ticket=tickets.find(t=>t.busNo===busNo && t.ticketId===ticketId && t.passenger===currentUser.userName);
    //without booking ticket can't submit review
    if(!ticket){
        showToast("You can only review buses you booked","fail");
        return ;
    }
    let reviews=JSON.parse(localStorage.getItem('busReviews'))||[];
    //prevent multiple reviews on same ticketID
    const existingReview=reviews.find(r=>r.ticketId===ticketId);
    if(existingReview){
        showToast("You have already reviewed this ticket","fail");
        return;
    }
    const [h,m]=ticket.time.split(":");
    const depTime=new Date(ticket.date);
    depTime.setHours(h,m||0,0,0);//hours,minutes or zero,zero for seconds,zero for milliseconds
    const now=new Date();
    const diffHours=(now-depTime)/(1000*60*60);//1000 for milli seconds
    // add a check that review can be submitted only after 4 hours of departure time 
    if(diffHours<4){
        showToast("You can submit review only after your journey is likely completed/started","fail");
        return;
    }
    // store reviews on localStorage
    let user=currentUser.userName;
    const newReview={busNo,ticketId,user,rating,comment};
    reviews.unshift(newReview);
    localStorage.setItem('busReviews',JSON.stringify(reviews));
    // show success message 
    showToast("Review successfully submitted","success");
    reviewForm.reset();
}); 