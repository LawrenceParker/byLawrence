const buttons = document.querySelectorAll(".nav-btn");
const frame = document.getElementById("content-frame");
const homeContent = document.getElementById("home");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const page = button.dataset.page;

    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    if (page === "") {
      frame.style.display = "none";
      homeContent.style.display = "block";
    } else {
      homeContent.style.display = "none";
      frame.style.display = "block";
      frame.src = page;
    }
  });
});
