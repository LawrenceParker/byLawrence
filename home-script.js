const buttons=document.querySelectorAll(".nav-btn");
const frame=document.getElementById("content-frame");
const home=document.getElementById("home");
const viewer=document.getElementById("viewer");

buttons.forEach(button=>{
  button.addEventListener("click",()=>{
    const page=button.dataset.page;

    buttons.forEach(btn=>btn.classList.remove("active"));
    button.classList.add("active");

    if(page===""){
      home.classList.add("active");
      viewer.classList.remove("active");
    } else {
      home.classList.remove("active");
      viewer.classList.add("active");
      frame.src=page;
    }
  });
});
