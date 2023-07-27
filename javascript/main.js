function getPersons(){
  
  const apiUrl = "https://api.themoviedb.org/3/person/popular?api_key=60352d0e1d07a5b5492aa1b0e399801c&page=7";
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const results = data.results;
      const resultsContainer = document.getElementById("results-container");
  
      // Crear la card para cada actor
      results.forEach(person => {
        const card = document.createElement("div");
        card.classList.add("card");
  
        const profileImage = document.createElement("img");
        profileImage.src = `https://image.tmdb.org/t/p/w200${person.profile_path}`;
        profileImage.alt = person.name;
  
        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");
  
        const nameElement = document.createElement("h2");
        nameElement.textContent = person.name;
        nameElement.style.cursor = "pointer"; // Agregar cursor de clic
  
        nameElement.addEventListener("click", () => viewPerson(person.id));
  
        cardContent.appendChild(nameElement);
  
  
        card.appendChild(profileImage);
        card.appendChild(cardContent);
  
        resultsContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
};


function viewPerson(personId) {
  // Redirigir a la página "person.html" con el parámetro del personId en la URL
  window.location.href = `person.html?id=${personId}`;
}


function loadPersonDetails() {
  // Obtener el valor del parámetro "id" de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const personId = urlParams.get("id");

  const url_person = `https://api.themoviedb.org/3/person/${personId}?api_key=60352d0e1d07a5b5492aa1b0e399801c`;

  // Realizar la solicitud a la API
  fetch(url_person)
    .then(response => response.json())
    .then(data => {
      // Mostrar los detalles del actor en el HTML
      const personDetailsContainer = document.getElementById("person-details");
      personDetailsContainer.innerHTML = `
        <h2>${data.name}</h2>
        <p>Known For Department: ${data.known_for_department}</p>
        <p>Popularity: ${data.popularity}</p>
        <p>Biography: ${data.biography}</p>
        <p>Birthday: ${data.birthday}</p>
        <p>Place of Birth: ${data.place_of_birth}</p>
      `;

      // Actualizar la imagen del actor
      const profileImage = document.getElementById("profile-image");
      profileImage.src = `https://image.tmdb.org/t/p/w200${data.profile_path}`;
      profileImage.alt = data.name;
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}