const buttons = document.querySelectorAll(".nav-btn");
const frame = document.getElementById("content-frame");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    frame.src = button.dataset.page;

    buttons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
  });
});
