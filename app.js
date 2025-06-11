const PASSWORD = "Alabama.25";

const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const loginBtn = document.getElementById("login-btn");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");

let map, marker, circle, arrow;

loginBtn.addEventListener("click", () => {
  const pass = passwordInput.value.trim();
  if (pass === PASSWORD) {
    loginError.textContent = "";
    loginScreen.style.display = "none";
    appScreen.style.display = "block";
  } else {
    loginError.textContent = "Nepareiza parole. Mēģiniet vēlreiz.";
  }
});

document.getElementById("search-btn").addEventListener("click", async () => {
  const radio = document.getElementById("radio").value;
  const mcc = parseInt(document.getElementById("mcc").value);
  const mnc = parseInt(document.getElementById("mnc").value);
  const lac = parseInt(document.getElementById("lac").value);
  const cellId = parseInt(document.getElementById("cellid").value);

  const resultDiv = document.getElementById("result");
  const mapDiv = document.getElementById("map");

  if (
    isNaN(mcc) ||
    isNaN(mnc) ||
    isNaN(lac) ||
    isNaN(cellId) ||
    !radio
  ) {
    resultDiv.textContent = "Lūdzu, aizpildiet visus laukus pareizi.";
    return;
  }

  resultDiv.textContent = "Notiek meklēšana...";
  mapDiv.style.display = "none";

  const body = {
    token: "pk.e9e6d27f6abeff2c49da29fa3b871378",
    radio,
    mcc,
    mnc,
    cells: [{ lac, cid: cellId }],
    address: 1,
  };

  try {
    const res = await fetch("https://us1.unwiredlabs.com/v2/process.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Pieprasījums neizdevās");

    const data = await res.json();
    if (data.status !== "ok") throw new Error("Nav atrasta lokācija.");

    const { lat, lon, accuracy, address, bearing } = data;

    resultDiv.textContent = `Latitude: ${lat}\nLongitude: ${lon}\nPrecizitāte: ${accuracy} m\nAdrese: ${address || "—"}\nVirziens: ${bearing || "nav zināms"}`;

    mapDiv.style.display = "block";

    if (!map) {
      map = L.map("map").setView([lat, lon], 16);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);
    } else {
      map.setView([lat, lon], 16);
    }

    if (marker) map.removeLayer(marker);
    if (circle) map.removeLayer(circle);
    if (arrow) map.removeLayer(arrow);

    marker = L.marker([lat, lon]).addTo(map);

    circle = L.circle([lat, lon], {
      radius: accuracy,
      color: "#25d366",
      fillOpacity: 0.2,
    }).addTo(map);

    if (bearing !== undefined && !isNaN(bearing)) {
      const rad = (bearing * Math.PI) / 180;
      const length = accuracy;
      const destLat = lat + (length / 111111) * Math.cos(rad);
      const destLon =
        lon + (length / (111111 * Math.cos((lat * Math.PI) / 180))) * Math.sin(rad);

      arrow = L.polyline([[lat, lon], [destLat, destLon]], {
        color: "red",
        weight: 2,
        dashArray: "4,4",
      }).addTo(map);
    }
  } catch (e) {
    resultDiv.textContent = "Kļūda: " + e.message;
  }
});
