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


async function loadPersonDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const personId = urlParams.get("id");

  const url_person = `https://api.themoviedb.org/3/person/popular?api_key=60352d0e1d07a5b5492aa1b0e399801c&page=7`;

  const url_personId = `https://api.themoviedb.org/3/person/${personId}?api_key=60352d0e1d07a5b5492aa1b0e399801c`;

  let popularity;
  let biography;
  let birthday;
  let place_of_birth;

  await fetch(url_personId)
    .then(response => response.json())
    .then(data => {

      popularity = data.popularity;
      biography = data.biography;
      birthday = data.birthday;
      place_of_birth = data.place_of_birth;

    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });


  // Realizar la solicitud a la API
  await fetch(url_person)
    .then(response => response.json())
    .then(data => {
      // Obtener el array de resultados del JSON
      const results = data.results;

      // Buscar el elemento con el ID coincidente
      const matchingPerson = results.find(person => person.id == personId);

      if (matchingPerson) {
        // Mostrar los detalles del actor en el HTML
        const personDetailsContainer = document.getElementById("person-details");
        personDetailsContainer.innerHTML = `
          <h2>${matchingPerson.name}</h2>
          <p style="white-space: nowrap;">
            <span style="font-weight:bold;">Known For Department:</span>
            <span style="font-weight:normal;">${matchingPerson.known_for_department}</span>
          </p>
          <p style="white-space: nowrap;">
            <span style="font-weight:bold;">Popularity:</span>
            <span style="font-weight:normal;">${popularity}</span>
          </p>
          <div id="biography-container">
            <p id="biography" style="overflow: hidden; text-overflow: ellipsis; max-height: 90px;">${biography}</p>
            <button id="show-more-button" style="background-color: rgb(255, 183, 48);border-radius: 10px;">Ver más</button>
          </div>
          <p style="white-space: nowrap;">
            <span style="font-weight:bold;">Birthday:</span>
            <span style="font-weight:normal;">${birthday}</span>
          </p>
          <p style="white-space: nowrap;">
            <span style="font-weight:bold;">Place of Birth:</span>
            <span style="font-weight:normal;">${place_of_birth}</span>
          </p>
          <p style="font-size: 25px; font-weight:bold; text-decoration:underline;">Known for:</p>
        `;
        

        // Agregar evento click al botón "Ver más"
        const showMoreButton = document.getElementById("show-more-button");
        const biographyParagraph = document.getElementById("biography");

        // Mostrar u ocultar el botón "Ver más" según el contenido de la biografía
        // scrollHeight -> devuelve la altura total del elemento
        // clientHeight -> devuelve la altura visible del elemento
        // compara las alturas del contenido total (scrollHeight) y el contenido visible del párrafo (clientHeight)
        showMoreButton.style.display = biographyParagraph.scrollHeight > biographyParagraph.clientHeight ? "block" : "none";

        /*
        Si la condición es verdadera (hay más contenido oculto), se establece showMoreButton.style.display en "block", 
        lo que hace que el botón de "Mostrar más" sea visible en la página. Si la condición es falsa (todo el contenido es visible), 
        se establece showMoreButton.style.display en "none", lo que oculta el botón de "Mostrar más" de la página.
        */

        showMoreButton.addEventListener("click", () => {
          if (biographyParagraph.style.maxHeight === "none") {
            // Si la altura es "none", significa que ya se mostró el texto completo, entonces hacemos clic en "Ver menos"
            biographyParagraph.style.maxHeight = "90px";
            showMoreButton.textContent = "Ver más";
          } else {
            // Si la altura es diferente a "none", hacemos clic en "Ver más"
            biographyParagraph.style.maxHeight = "none";
            showMoreButton.textContent = "Ver menos";
          }
        });


        // Actualizar la imagen del actor
        const profileImage = document.getElementById("profile-image");
        profileImage.src = `https://image.tmdb.org/t/p/w200${matchingPerson.profile_path}`;
        profileImage.alt = matchingPerson.name;

        // Carrusel de películas
        const movieCarouselContainer = document.getElementById("movie-carousel");
        movieCarouselContainer.innerHTML = '';

        matchingPerson.known_for.forEach(movie => {
          // Crear elementos para cada película en el carrusel
          const movieElement = document.createElement('div');
          movieElement.classList.add('movie-card');
          movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <p style="font-weight:bold;">${movie.title} <br> ${movie.release_date.split('-')[0]}</p>
          `;

          // Agregar el elemento de la película al carrusel
          movieCarouselContainer.appendChild(movieElement);
        });

      } else {
        // Si no se encuentra ninguna coincidencia, mostrar un mensaje de error
        const personDetailsContainer = document.getElementById("person-details");
        personDetailsContainer.innerHTML = "<p>Person not found.</p>";
      }

    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}




