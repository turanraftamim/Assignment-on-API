const countriesContainer = document.getElementById('countriesContainer');
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');

searchButton.addEventListener('click', () => {
  const countryName = searchInput.value.trim();
  if (countryName !== '') {
    fetchCountryData(countryName);
  }
});

async function fetchCountryData(name) {
  countriesContainer.innerHTML = '<p>Loading...</p>';
  try {
    const countryRes = await fetch(`https://restcountries.com/v3.1/name/${name}`);
    const countryData = await countryRes.json();

    if (!countryData || countryData.status === 404) {
      countriesContainer.innerHTML = `<p>No country found.</p>`;
      return;
    }

    countriesContainer.innerHTML = '';

    for (const country of countryData) {
      let capital = country.capital ? country.capital[0] : null;
      let weatherHTML = `<p><strong>Weather:</strong> Not Available</p>`;

      if (capital) {
        try {
          const weatherRes = await fetch(`https://wttr.in/${capital}?format=j1`);
          const weatherData = await weatherRes.json();
          if (weatherData && weatherData.current_condition) {
            const weather = weatherData.current_condition[0];
            weatherHTML = `
              <p><strong>Weather:</strong> ${weather.weatherDesc[0].value}</p>
              <p><strong>Temperature:</strong> ${weather.temp_C}°C</p>
            `;
          }
        } catch (weatherError) {
          console.error('Weather fetch error:', weatherError);
        }
      }

      const countryCard = `
        <div class="country-card">
          <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
          <h2>${country.name.common}</h2>
          <p><strong>Capital:</strong> ${capital ? capital : 'N/A'}</p>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
          
          <button class="more-btn" onclick="showMore(this)">More Details</button>
          
          <div class="more-details" style="display:none;">
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            ${weatherHTML}
          </div>
        </div>
      `;

      countriesContainer.innerHTML += countryCard;
    }

  } catch (error) {
    console.error('Country fetch error:', error);
    countriesContainer.innerHTML = `<p>Error fetching country data.</p>`;
  }
}

function showMore(button) {
  const moreDetails = button.nextElementSibling;
  if (moreDetails.style.display === 'none') {
    moreDetails.style.display = 'block';
    button.textContent = 'Hide Details';
  } else {
    moreDetails.style.display = 'none';
    button.textContent = 'More Details';
  }
}
