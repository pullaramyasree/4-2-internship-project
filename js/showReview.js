
const reviewList=document.getElementById("reviewList");
//load reviews
function loadReviews(){
    // retrieve all reviews related to busNo from sessionStorage which were stored on available_buses page
    const reviews=JSON.parse(sessionStorage.getItem("busNoReviews"))||[];
    sessionStorage.removeItem("busNoReviews");
    reviewList.innerHTML='';
    let found=false;
    let avgRating=0,count=0;
    // append each review to reviewList to display 
    reviews.forEach(review=>{
        found=true;
        avgRating+=review.rating-'0';
        count++;
        const div=document.createElement('div');
        div.className='review';
        div.innerHTML=`
                <p><strong>User : </strong> ${review.user}</p>
                <p><strong>Bus No : </strong> ${review.busNo}</p>
                <p><strong>Rating : </strong> ${review.rating}</p>
                <p><strong>Comment : </strong> ${review.comment}</p>`;
        reviewList.append(div);
    });
    // if no reviews found display no reviews 
    if(!found){
        document.getElementById("noReviews").innerText="No reviews available";
    }
    else{
        let r=(avgRating/count).toFixed(2);
        document.getElementById("avgRating").innerHTML=`<p><b>Average rating is ${r} ⭐</b> (${count} reviews)</p>`;
    }
}

loadReviews();