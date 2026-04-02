
//function to toggle password
function togglePassword(){
    const passwordInput=document.getElementById("password");
    if(passwordInput.type==="text")
        passwordInput.type="password";
    else    
        passwordInput.type="text";
}

//function to hash passwords
function hash(password){
    let hashp=0;
    for(let i=0;i<password.length;i++)
        hashp=(hashp<<5)-hashp+password.charCodeAt(i);
    return hashp.toString();
}