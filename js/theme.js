
const btn=document.getElementById("themeBtn");
// function for dark mode
function setDarkTheme(){
    document.body.classList.add("dark-mode");
    btn.innerHTML=`<img src='../assets/icons/sun.ico' width="20" height="20">`;
    localStorage.setItem("theme","dark");
}
// function for light mode
function setLightTheme(){
    document.body.classList.remove("dark-mode");
    btn.innerHTML=`<img src='../assets/icons/moon.ico' width="20" height="20">`;
    localStorage.setItem("theme","light");
}
// function for toggle button
function toggleTheme(){
    if(document.body.classList.contains("dark-mode"))
        setLightTheme();
    else
        setDarkTheme();
}
//   load saved theme on page load
window.onload=function(){
    const savedTheme=(localStorage.getItem("theme"));
    if(savedTheme==="dark")
        setDarkTheme();
    else if(savedTheme==="light")
        setLightTheme();
    else{//if no saved theme use system preference
        if(window.matchMedia('(prefers-color-scheme:dark)').matches)
            setDarkTheme();
        else
            setLightTheme();
    }
}
// Listen for changes (when user switches Chrome theme)
const prefersDark=window.matchMedia("(prefers-color-scheme:dark)");
prefersDark.addEventListener("change", function(e){
    if(e.matches)
        setDarkTheme();
    else
        setLightTheme();
});
//toast functionality
function showToast(msg,status,duration=3000){
    const toast=document.getElementById("toast");
    toast.innerText=msg;
    toast.className=status;
    setTimeout(()=>{
        toast.className=toast.className.replace(status,"");
    },duration);
}