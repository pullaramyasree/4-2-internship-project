
// to check if user logged in or not
// without login user can access only login or register pages other pages are redirected to login page only
// it checks this by accessing currentUser from sesssionStorage
const currentUser=JSON.parse(sessionStorage.getItem("currentUser"));
if(!currentUser){
    showToast("Please login first","fail");
    setTimeout(()=>{
        window.location.href="../index.html";
    },1000);
}

//to logout of app
// on clicking logout it automatically deletes currentUser from sessionStorage
function logout(){
    sessionStorage.removeItem('currentUser');
    showToast("Logged out successfully","success");
    setTimeout(()=>{
        window.location.href="../index.html";
    },1000);
}

//show welcome message on home page
const welcome=document.getElementById("welcome");
if(welcome && currentUser){
    welcome.innerText="Welcome "+currentUser.userName;
}