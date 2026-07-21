function showPage(pageName){
    document.querySelectorAll(".page")
        .forEach(page=>{
            page.classList.remove("active");
        });

    document.getElementById(pageName)
        .classList.add("active");

    document.querySelectorAll(".nav-btn")
        .forEach(btn=>{
            btn.classList.remove("active");
        });

    event.currentTarget.classList.add("active");
}
