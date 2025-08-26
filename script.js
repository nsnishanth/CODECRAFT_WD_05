document.getElementById('btn').addEventListener('click', async () => {
  const city = document.getElementById('city').value.trim();
  const out = document.getElementById('weather');
  if (!city) {
    out.innerHTML = '<p class="error">Please enter a city name</p>';
    return;
  }
  out.textContent = 'Searching…';

  try {
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    ).then(r => r.json());

    if (!geo.results || geo.results.length === 0) {
      throw new Error('Location not found');
    }

    const { name, country, latitude: lat, longitude: lon } = geo.results[0];

    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current_weather=true&timezone=auto`
    ).then(r => r.json());

    const c = weather.current_weather;

    out.innerHTML = `
      <h2>${name}, ${country}</h2>
      <p><strong> Temp:</strong> ${c.temperature} °C</p>
      <p><strong> Wind:</strong> ${c.windspeed} m/s</p>
      <p><strong> Time:</strong> ${new Date(c.time).toLocaleString()}</p>
    `;
  } catch (err) {
    out.innerHTML = `<p class="error">${err.message}</p>`;
  }
});