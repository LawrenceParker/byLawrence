console.log("Game Hub JS loaded");

const buttons = document.querySelectorAll(".nav-btn");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    console.log("Clicked:", button.dataset.page);
  });
});
