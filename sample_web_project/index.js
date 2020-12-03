document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();

  const { value } = document.querySelector("input");
  const header = document.querySelector("h1");

  if (value.includes("@")) {
    // valid
    return (header.innerHTML = "Looks good");
  } else {
    // invalid
    return (header.innerHTML = "Invalid email");
  }
});

