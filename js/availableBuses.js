
//storing available buses on localStorage so that they can be accessed from any page        
const table=document.getElementById("busTable");
const rows=table.getElementsByTagName("tr");
let buses=[];
//looping through each row add to local storage only if not stored
if(!localStorage.getItem("availableBuses")){
    for(let i=1;i<rows.length;i++)
    {
        let bus={
            busNo:rows[i].cells[0].innerText.trim(),
            busType:rows[i].cells[1].innerText.trim(),
            fromCity:rows[i].cells[2].innerText.trim(),
            toCity:rows[i].cells[3].innerText.trim(),
            departureTime:rows[i].cells[4].innerText.trim(),
            acType:rows[i].cells[5].innerText.trim(),
            fare:rows[i].cells[6].innerText.trim(),
            availableSeats:parseInt(rows[i].cells[7].innerText.trim())
        };
        buses.push(bus);
    }
    localStorage.setItem("availableBuses",JSON.stringify(buses));
}

//search functionality
function search(){
    document.getElementById("noBus").innerText='';
    let from=document.getElementById("fromCity").value.toLowerCase();
    let to=document.getElementById("toCity").value.toLowerCase();
    let found=false;
    for(let i=1;i<rows.length;i++)
    {   
        let fromCity=rows[i].cells[2].innerText.toLowerCase();
        let toCity=rows[i].cells[3].innerText.toLowerCase();
        // if from and to cities both are typed by user display only those matching rows
        if(((from!=="" && fromCity.includes(from)) && (to!=="" && toCity.includes(to)))
            ||((from!=="" && fromCity.includes(from)) && (to===""))
            ||((from==="") && (to!=="" && toCity.includes(to))))
            rows[i].style.display="",found=true;
        // if nothing is typed by user display all rows 
        else if(from==="" && to==="")
            rows[i].style.display="",found=true;
        // else display none of the rows
        else
            rows[i].style.display="none";
        if(!found){
            document.getElementById("noBus").innerText="No buses available on selected route";
            table.style.display='none';
        }
        else{
             document.getElementById("noBus").innerText="";
            table.style.display='table';
        }
    }
}

//booking functionality
//firstly storing selected busNo on session storage and will retrieve it on ticket booking page
function bookBus(busNo){
    sessionStorage.setItem("selectedBus",busNo);
    window.location.href="../html/bookTicket.html";
}

//review functionality
//retrieving all reviews from local storage and filtering reviews of selected bus and storing them on
// sessionStorage to show reviews of that bus on show reviews page
function showReview(busNo){
    let busReviews=[];
    let reviews=JSON.parse(localStorage.getItem("busReviews"))||[];
    for(let r of reviews){
        if(r.busNo===busNo)
            busReviews.push(r);
    }
    sessionStorage.setItem("busNoReviews",JSON.stringify(busReviews));
    //console.log(busNoReviews);
    window.location.href="../html/showReview.html";
}
