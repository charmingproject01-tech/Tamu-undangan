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
    // Ambil nama dari Excel (fleksibel jika kolomnya bernama 'Nama Tamu', 'Nama', atau 'nama')
    const nama = row["Nama Tamu"] || row["Nama"] || row["nama"] || "Tamu Undangan";
    
    // Ambil nomor WA jika ada di Excel (opsional: nama kolom 'No WA' / 'No HP' / 'Telepon')
    const noHp = row["No WA"] || row["No HP"] || row["Telepon"] || "";
    
    // Format nomor HP ke standar internasional (0812... -> 62812...)
    let formattedPhone = String(noHp).replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.slice(1);
    }

    const link = `https://charmingproject01-tech.github.io/Sany-Delvand/?to=${encodeURIComponent(nama)}`;

    // Gunakan \n langsung untuk baris baru
    const pesan = `Assalamu’alaikum 🙏

Kepada Yth.
Bapak/Ibu/Saudara/i ${nama}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.

Berikut link undangan lengkapnya:
${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.
Wassalamu’alaikum Warahmatullahi Wabarakatuh`;

    // Buat URL WhatsApp yang valid
    const waUrl = formattedPhone 
      ? `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(pesan)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(pesan)}`;

    hasil.innerHTML += `
      <div class="card">
        <b>${nama}</b> ${formattedPhone ? `<small>(${formattedPhone})</small>` : ''}<br><br>

        <a class="btn wa" href="${waUrl}" target="_blank">WA</a>

        <a class="btn fb" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}" target="_blank">FB</a>

        <button class="btn ig" onclick="copyText('${pesan}')">Salin Pesan</button>
      </div>
    `;
  });
}

// =======================
// COPY PESAN UNTUK IG / LAINNYA
// =======================
function copyText(pesan){
  navigator.clipboard.writeText(pesan).then(() => {
    alert("Pesan & Link berhasil disalin! Tinggal paste di pesan Instagram 👍");
  }).catch(err => {
    alert("Gagal menyalin teks");
  });
}