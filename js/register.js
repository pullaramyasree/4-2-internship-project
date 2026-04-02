
const password=document.getElementById('password');
const phone=document.getElementById('phoneNumber');
const passwordError=document.getElementById('passwordError');
const phoneError=document.getElementById('phoneError');

//password validation while user was typing
password.addEventListener("input",()=>{
    const value=password.value;
    const regex=/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.[a-zA-Z]).{8,}$/;
    if(!regex.test(value))
        passwordError.innerText="Min 8 characters required, atleast 1 letter, 1 digit, 1 special character required";
    else
        passwordError.innerText="";
});

//phone number validation while user was typing
phone.addEventListener("input",()=>{
    const value=phone.value;
    const regex=/^[0-9]{10}$/;
    if(!regex.test(value))
        phoneError.innerText="Enter valid 10-digit phone number";
    else
        phoneError.innerText="";
});

//save the registration details of users
const registration=document.getElementById("registration");
registration.addEventListener('submit',function(e){
    e.preventDefault();
    const userName=document.getElementById('userName').value.trim();
    const password=document.getElementById('password').value;
    const phoneNumber=document.getElementById('phoneNumber').value;
    // validate password and phone number when user clicks submit
    const passwordValid=/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/.test(password);
    const phoneValid=/^[0-9]{10}$/.test(phoneNumber);

    if(!passwordValid){
        showToast("Invalid password format","fail");
        return ;
    }
    if(!phoneValid){
        showToast("Invalid phone number","fail");
        return ;
    }
    const hashedPassword=hash(password);
    const age=document.getElementById('age').value;
    let users=JSON.parse(localStorage.getItem('userDetails'))||[];
    //check if user already exists
    const userExists=users.some(user=>
        user.userName===userName);
    if(userExists){
        showToast("Username already taken. Please choose another.","fail");
        return ;
    }
    // if new user store details on local storage in users 
    const newUser={userName,hashedPassword,phoneNumber,age};
    users.unshift(newUser);
    localStorage.setItem('userDetails',JSON.stringify(users));
    showToast("Registration Successful","success");
    // save current user on session storage to check on other pages 
    sessionStorage.setItem("currentUser",JSON.stringify(newUser));
    setTimeout(()=>{
        window.location.href="../html/home.html";
    },1000);
}); 