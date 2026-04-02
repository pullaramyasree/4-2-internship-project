
//adding event listener on submit function of login form
document.getElementById("loginForm").addEventListener("submit",function(e){
    e.preventDefault();
    const userName=document.getElementById("userName").value.trim();
    const enteredPassword=document.getElementById("password").value;
    // hash the password before storing it on local storage 
    const hashedPassword=hash(enteredPassword);
    //fetching all user details from local storage to check is user already registered in app
    let users=JSON.parse(localStorage.getItem("userDetails"));
    if(!Array.isArray(users))
        users=[];
    const validUser=users.find(user=>
        user.userName===userName && user.hashedPassword===hashedPassword
    );
    // if user found continue else show error 
    if(validUser){
        // storing current user on session storage for security purposes 
        // because if user forgets to logout on tab close it automatically deletes 
        // currentUser from sessionStorage and there by user logs out 
        sessionStorage.setItem("currentUser",JSON.stringify(validUser));
        showToast("Login Successful","success");
        setTimeout(()=>{
            window.location.href="html/home.html";
        },1000);
    }
    else    
        showToast("Invalid username or password","fail");
});
