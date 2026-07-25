// =======================
// AMBIL NAMA DARI LINK
// =======================
const urlParams = new URLSearchParams(window.location.search);
const namaTamu = urlParams.get('to');

if(namaTamu){
  document.getElementById("nama-tamu").innerText = namaTamu;
}

// =======================
// UPLOAD EXCEL
// =======================
const fileInput = document.getElementById("fileExcel");
const hasil = document.getElementById("hasil");

fileInput.addEventListener("change", function(e){
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e){
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type:'array'});

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    tampilkan(json);
  };

  reader.readAsArrayBuffer(file);
});

function tampilkan(data){
  hasil.innerHTML = "";

  data.forEach(row => {
    const nama = row["Nama Tamu"];
    const link = `https://charmingproject01-tech.github.io/Sany-Delvand/Tester/?to=${encodeURIComponent(nama)}`;

    const pesan = `Assalamu’alaikum 🙏

Kepada Yth
Bapak/Ibu/Saudara/i ${nama}

Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami

Berikut link undangan:
${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir

Terima kasih atas doa dan restunya

Wassalamu’alaikum Warahmatullahi Wabarakatuh`;

    hasil.innerHTML += `
      <div class="card">
        <b>${nama}</b><br><br>

        <a class="btn wa" href="https://wa.me/?text=${encodeURIComponent(pesan)}" target="_blank">WA</a>

        <a class="btn fb" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}" target="_blank">FB</a>

        <button class="btn ig" onclick="copyLink('${link}')">IG</button>
      </div>
    `;
  });
}

// =======================
// COPY LINK IG
// =======================
function copyLink(link){
  navigator.clipboard.writeText(link);
  alert("Link disalin! Paste di Instagram ya 👍");
}