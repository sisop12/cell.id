
const PASSWORD = "4488";
document.getElementById("login-btn").onclick = function () {
  const entered = document.getElementById("password").value;
  if (entered === PASSWORD) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("app-screen").style.display = "block";
  } else {
    document.getElementById("login-error").innerText = "Nepareiza parole!";
  }
};

document.getElementById("search-btn").onclick = async function () {
  const mcc = parseInt(document.getElementById("mcc").value);
  const mnc = parseInt(document.getElementById("mnc").value);
  const lac = parseInt(document.getElementById("lac").value);
  const cid = parseInt(document.getElementById("cellid").value);
  const radio = document.getElementById("radio").value;

  const res = await fetch("https://us1.unwiredlabs.com/v2/process.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: "pk.e9e6d27f6abeff2c49da29fa3b871378",
      radio,
      mcc,
      mnc,
      cells: [{ lac, cid }],
      address: 1
    })
  });

  const data = await res.json();
  if (data.status !== "ok") {
    document.getElementById("result").innerText = "Kļūda: Nav atrasta lokācija.";
    return;
  }

  const map = L.map('map').setView([data.lat, data.lon], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  L.marker([data.lat, data.lon]).addTo(map);
  document.getElementById("result").innerText = `Koordinātes: ${data.lat}, ${data.lon}`;
};
