
document.getElementById('login-btn').addEventListener('click', function () {
  const pw = document.getElementById('password').value;
  if (pw === '4488') {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'block';
  } else {
    document.getElementById('login-error').innerText = 'Nepareiza parole!';
  }
});

document.getElementById('search-btn').addEventListener('click', async function () {
  const mcc = parseInt(document.getElementById('mcc').value);
  const mnc = parseInt(document.getElementById('mnc').value);
  const lac = parseInt(document.getElementById('lac').value);
  const cellid = parseInt(document.getElementById('cellid').value);
  const radio = document.getElementById('radio').value;

  const result = document.getElementById('result');
  result.textContent = 'Notiek meklēšana...';

  const body = {
    token: "pk.e9e6d27f6abeff2c49da29fa3b871378",
    radio,
    mcc,
    mnc,
    cells: [{ lac: lac, cid: cellid }],
    address: 1
  };

  try {
    const res = await fetch("https://us1.unwiredlabs.com/v2/process.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (data.status !== "ok") throw new Error("Nav atrasta lokācija.");

    const { lat, lon, accuracy } = data;
    result.textContent = `Koordinātes: ${lat}, ${lon}\nPrecizitāte: ${accuracy} m`;

    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = '';
    const map = L.map(mapContainer).setView([lat, lon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    L.marker([lat, lon]).addTo(map);
    L.circle([lat, lon], { radius: accuracy }).addTo(map);
  } catch (e) {
    result.textContent = "Kļūda: " + e.message;
  }
});
