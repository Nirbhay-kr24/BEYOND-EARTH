/* LOGO */
const logoLink = document.querySelector('.nav__logo');

logoLink.addEventListener('click', function(event) {
  event.preventDefault();  
  location.reload();  
});


/* SHOW MENU */
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/* Show menu */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

/* Hide menu */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/* REMOVE MENU MOBILE */
const navLink = document.querySelectorAll(".nav__link");

const linkAction = () => {
  navMenu.classList.remove("show-menu");
};

navLink.forEach((n) => n.addEventListener("click", linkAction));

/* ADD BLUR HEADER */
const blurHeader = () => {
  const header = document.getElementById('header');
  
  window.scrollY >= 50 ? header.classList.add('blur-header')
                       : header.classList.remove('blur-header');
}

window.addEventListener('scroll', blurHeader);


/* Nasa Api */
const API_KEY = 'RbNJ4JHLoLjQerkKAOeX9RgtCXeeAiF62qayt8Pw'; 
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

// DOM elements
const titleElement = document.getElementById('title_nasa');
const dateElement = document.getElementById('date_nasa');
const imageElement = document.getElementById('image_nasa');
const explanationElement = document.getElementById('explanation_nasa');
const contentNasa = document.getElementById('content_nasa');

// Function to convert UTC date to IST (UTC + 5:30)
function convertUTCToIST(utcDate) {
  const utc = new Date(utcDate);
  
  // Convert UTC time to IST (UTC + 5:30)
  const istOffset = 5.5 * 60; // IST is UTC + 5:30 hours
  const utcTime = utc.getTime() + utc.getTimezoneOffset() * 60000; // Convert current time to UTC
  const istTime = new Date(utcTime + istOffset * 60000); // Add IST offset
  
  // Format the IST date in 'YYYY-MM-DD' format
  const formattedISTDate = istTime.toISOString().split('T')[0];
  
  return formattedISTDate;
}

// Fetch and display APOD data when the page loads
async function fetchAPOD() {
  try {
    const response = await fetch(`${BASE_URL}?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    displayAPOD(data);
  } catch (error) {
    console.error('Error fetching APOD:', error);
    alert('Failed to fetch APOD data. Please try again later.');
  }
}

// Display APOD data
function displayAPOD(data) {
  titleElement.textContent = data.title;

  // Convert UTC date from NASA API to IST
  const istDate = convertUTCToIST(data.date);
  dateElement.textContent = `Date: ${istDate}`;
  explanationElement.textContent = data.explanation;

  if (data.media_type === 'image') {
    imageElement.src = data.url;
    imageElement.alt = data.title;
    imageElement.style.display = 'block';
  } else if (data.media_type === 'video') {
    // Replace the image element with an iframe for video
    const videoElement = document.createElement('iframe');
    videoElement.src = data.url;
    videoElement.width = "100%";
    videoElement.height = "400";
    videoElement.frameBorder = "0";
    videoElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    videoElement.allowFullscreen = true;

    // Remove the existing image element if it's present
    imageElement.style.display = 'none';
    if (contentNasa.querySelector('iframe')) {
      contentNasa.removeChild(contentNasa.querySelector('iframe'));
    }

    // Append the video iframe
    contentNasa.appendChild(videoElement);
  } else {
    console.error('Unsupported media type:', data.media_type);
    alert('Unsupported media type returned by NASA API.');
  }
}

// Fetch data automatically when the page loads
document.addEventListener('DOMContentLoaded', fetchAPOD);

/*=============== planet ===============*/
document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "https://api.le-systeme-solaire.net/rest/bodies/";
  const planetSelect = document.getElementById("planet");
  const planetContainer = document.getElementById("planet-info");
  const planetImage = document.getElementById("planet-image");

  // Updated planet images with working URLs
  const planetImages = {
    mercury: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Colors_of_the_Innermost_Planet.gif/180px-Colors_of_the_Innermost_Planet.gif",
    venus: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Venus_Rotation_Movie.gif",
    earth: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Rotating_earth_animated_transparent.gif",
    mars: "https://upload.wikimedia.org/wikipedia/commons/3/34/Spinning_Mars.gif",
    jupiter: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Jupiter.gif",
    saturn: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Saturnoppositions-animated.gif",
    uranus: "https://upload.wikimedia.org/wikipedia/commons/2/20/Uranus.gif",
    neptune: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Neptune.gif"
  };

  async function fetchPlanetData(planet) {
    try {
      console.log(`Fetching data for: ${planet}`); // Debugging log
      const response = await fetch(apiUrl + planet);
      const data = await response.json();
      const image = planetImages[planet];
      planetContainer.innerHTML = `
        <div>
          <h2>${data.englishName}</h2>
          <p><strong>Mass:</strong> ${data.mass.massValue} × 10^${data.mass.massExponent} kg</p>
          <p><strong>Gravity:</strong> ${data.gravity} m/s²</p>
          <p><strong>Moons:</strong> ${data.moons ? data.moons.length : 0}</p>
          <p><strong>Discovery Date:</strong> ${data.discoveryDate ? data.discoveryDate : "Unknown"}</p>
        </div>
        <div>
           <img src="${image}" style="width: 100%; height: auto; max-height: 350px;">
        </div>
      `;

      // Debugging
      console.log("Image URL:", planetImages[planet]);

      if (planetImages[planet]) {
        planetImage.src = planetImages[planet];
        planetImage.alt = `${data.englishName} Image`;
        planetImage.classList.remove("hidden");
      } else {
        planetImage.classList.add("hidden");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      planetContainer.innerHTML = "<p>Failed to load data.</p>";
    }
  }

  // Fetch default planet (Earth)
  fetchPlanetData("earth");

  // Change data when a new planet is selected
  planetSelect.addEventListener("change", (event) => {
    fetchPlanetData(event.target.value);
  });
});



/* Nasa Library */
document.getElementById("nasa-button").addEventListener("click", function() {
  let query = document.getElementById("nasa-search").value;
  if (query) {
      fetchNASAData(query);
  }
});

async function fetchNASAData(query) {
  // NASA Image & Video API Endpoint
  const apiKey = "1P5rKWgjtqIXWcU7wpBE8aVZ9kK4f4BmsQXvOwgr";  // Replace with your actual NASA API key if required
  const url = `https://images-api.nasa.gov/search?q=${query}&media_type=image,video`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      
      const gallery = document.getElementById("nasa-gallery");
      gallery.innerHTML = ""; // Clear previous results
      
      data.collection.items.forEach(item => {
          const nasaItem = document.createElement("div");
          nasaItem.classList.add("nasa-item");
          
          if (item.links && item.links[0].href) {
              const mediaUrl = item.links[0].href;
              
              if (item.data[0].media_type === "image") {
                  const img = document.createElement("img");
                  img.src = mediaUrl;
                  img.alt = item.data[0].title;
                  nasaItem.appendChild(img);
              } else if (item.data[0].media_type === "video") {
                  const video = document.createElement("video");
                  video.src = mediaUrl;
                  video.controls = true;
                  nasaItem.appendChild(video);
              }
              
              const title = document.createElement("p");
              title.textContent = item.data[0].title;
              nasaItem.appendChild(title);
          }
          
          gallery.appendChild(nasaItem);
      });

  } catch (error) {
      console.error("Error fetching NASA data:", error);
  }
}


/* Nasa eonet */
document.addEventListener("DOMContentLoaded", function () {
  const API_KEY = "YOUR_API_KEY"; // Replace with your NASA API key if required
  const eonetURL = `https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=5&api_key=${API_KEY}`;
  const eonetContainer = document.getElementById("eonet-container");

  async function fetchEONETData() {
    try {
      const response = await fetch(eonetURL);
      const data = await response.json();
      displayEvents(data.events);
    } catch (error) {
      console.error("Error fetching EONET data:", error);
      eonetContainer.innerHTML = "<p>Failed to load data. Please try again later.</p>";
    }
  }

  function displayEvents(events) {
    eonetContainer.innerHTML = "";

    if (events.length === 0) {
      eonetContainer.innerHTML = "<p>No current natural events found.</p>";
      return;
    }

    events.forEach((event) => {
      const eventCard = document.createElement("div");
      eventCard.classList.add("eonet-card");

      eventCard.innerHTML = `
        <h3 class="eonet-title">${event.title}</h3>
        <p class="eonet-category">Category: ${event.categories[0].title}</p>
        <p>Location: ${event.geometry[0].coordinates.join(", ")}</p>
        <a href="https://www.google.com/search?q=${encodeURIComponent(event.title)}" target="_blank" 
           class="eonet-link" rel="noopener noreferrer">More Info</a>
      `;

      eonetContainer.appendChild(eventCard);
    });
  }

  fetchEONETData();
});


/* SHOW SCROLL UP */
const scrollUp = () =>{

  const scrollUp = document.getElementById('scroll-up');

window.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
                              :scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)
 

