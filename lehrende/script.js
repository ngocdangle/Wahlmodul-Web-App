function selectOption(card) {
  document.querySelectorAll(".option-card").forEach(option => {
    option.classList.remove("selected");
  });

  card.classList.add("selected");
}