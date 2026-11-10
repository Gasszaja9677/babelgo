function ambilDataAkun() {
    return JSON.parse(
        localStorage.getItem("babelgo_users")
    ) || [];
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const nama = document.getElementById("nama").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const nomor = document.getElementById("nomor").value.trim();
        const password = document.getElementById("password").value;

        let users = ambilDataAkun();

        const emailTerdaftar = users.some(function(user) {
            return user.email === email;
        });

        if (emailTerdaftar) {
            alert("Email sudah terdaftar! Silakan gunakan email lain.");
            return;
        }

        const akunBaru = {
            nama: nama,
            email: email,
            nomor: nomor,
            password: password
        };

        users.push(akunBaru);

        localStorage.setItem(
            "babelgo_users",
            JSON.stringify(users)
        );

        alert("Registrasi berhasil! Silakan login.");

        window.location.href = "login.html";

    });

}

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const users = ambilDataAkun();

        const akun = users.find(function(user) {
            return user.email === email &&
                   user.password === password;
        });

        if (akun) {

            const penggunaAktif = {
                nama: akun.nama,
                email: akun.email,
                nomor: akun.nomor
            };

            localStorage.setItem(
                "babelgo_current_user",
                JSON.stringify(penggunaAktif)
            );

            alert("Login berhasil! Selamat datang di BabelGo, " + akun.nama + ".");

            window.location.href = "index.html";

        } else {

            alert("Login gagal! Email atau password salah.");

        }

    });

}

(function() {

    const jadwalForm = document.getElementById("jadwalForm");
    const hasilJadwal = document.getElementById("hasilJadwal");

    if (!jadwalForm || !hasilJadwal) {
        return;
    }

    const jadwalBawaan = [
        {
            id: 1,
            asal: "Pangkalpinang",
            tujuan: "Sungailiat",
            jam: "07:00",
            tarif: 35000,
            kursi: 12,
            kendaraan: "Travel BabelGo"
        },
        {
            id: 2,
            asal: "Pangkalpinang",
            tujuan: "Sungailiat",
            jam: "10:00",
            tarif: 35000,
            kursi: 8,
            kendaraan: "Travel BabelGo"
        },
        {
            id: 3,
            asal: "Pangkalpinang",
            tujuan: "Koba",
            jam: "08:00",
            tarif: 50000,
            kursi: 10,
            kendaraan: "Travel BabelGo"
        },
        {
            id: 4,
            asal: "Pangkalpinang",
            tujuan: "Toboali",
            jam: "09:00",
            tarif: 75000,
            kursi: 6,
            kendaraan: "Travel BabelGo"
        },
        {
            id: 5,
            asal: "Sungailiat",
            tujuan: "Pangkalpinang",
            jam: "07:30",
            tarif: 35000,
            kursi: 9,
            kendaraan: "Travel BabelGo"
        },
        {
            id: 6,
            asal: "Sungailiat",
            tujuan: "Belinyu",
            jam: "11:00",
            tarif: 30000,
            kursi: 7,
            kendaraan: "Travel BabelGo"
        }
    ];

    let daftarPerjalanan = jadwalBawaan;

    try {

        const dataAdmin = JSON.parse(
            localStorage.getItem("babelgo_schedules")
        );

        if (Array.isArray(dataAdmin)) {

            daftarPerjalanan = dataAdmin.map(function(item) {

                return {
                    id: item.id,
                    asal: item.asal,
                    tujuan: item.tujuan,
                    jam: item.jam,
                    tarif: Number(item.harga),
                    kursi: Number(item.kursi),
                    kendaraan: "Travel BabelGo"
                };

            });

        }

    } catch (error) {

        console.error("Gagal membaca jadwal Admin:", error);

    }

    const inputTanggal = document.getElementById("tanggal");

    const sekarang = new Date();

    const tahun = sekarang.getFullYear();
    const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
    const hari = String(sekarang.getDate()).padStart(2, "0");

    const tanggalHariIni = `${tahun}-${bulan}-${hari}`;

    inputTanggal.min = tanggalHariIni;

    function formatRupiah(angka) {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(angka);

    }

    jadwalForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const asal = document.getElementById("asal").value;
        const tujuan = document.getElementById("tujuan").value;
        const tanggal = inputTanggal.value;

        if (!asal || !tujuan || !tanggal) {
            alert("Mohon lengkapi kota asal, tujuan, dan tanggal.");
            return;
        }

        if (asal === tujuan) {
            alert("Kota asal dan tujuan tidak boleh sama!");
            return;
        }

        const hasil = daftarPerjalanan.filter(function(perjalanan) {

    const kunci = perjalanan.id + "_" + tanggal;

    const dataKursi = JSON.parse(
        localStorage.getItem("babelgo_booked_seats") || "{}"
    );

    const kursiTerisi = dataKursi[kunci] || [];

    const kapasitas = Number(perjalanan.kursi);

    const kursiTersedia = kapasitas - kursiTerisi.length;

    return perjalanan.asal === asal &&
           perjalanan.tujuan === tujuan &&
           kursiTersedia > 0;

});
        if (hasil.length === 0) {

            hasilJadwal.innerHTML = `
                <p class="pesan-awal">
                    Maaf, jadwal perjalanan dari ${asal}
                    menuju ${tujuan} belum tersedia.
                    Silakan pilih rute lainnya.
                </p>
            `;

            return;

        }

        hasilJadwal.innerHTML = hasil.map(function(perjalanan) {

            return `

                <div class="jadwal-card">

                    <h3>🚍 ${perjalanan.kendaraan}</h3>

                    <div class="jadwal-info">

                        <p>
                            <strong>Rute:</strong>
                            ${perjalanan.asal}
                            → ${perjalanan.tujuan}
                        </p>

                        <p>
                            <strong>Tanggal:</strong>
                            ${tanggal}
                        </p>

                        <p>
                            <strong>Keberangkatan:</strong>
                            ${perjalanan.jam}
                        </p>

                        <p>
                            <strong>Kursi tersedia:</strong>
                            ${Number(perjalanan.kursi) - (
                            JSON.parse(localStorage.getItem("babelgo_booked_seats") || "{}")[
                            perjalanan.id + "_" + tanggal
                            ] || []
                            ).length}
                        </p>

                    </div>

                    <div class="jadwal-harga">
                        ${formatRupiah(perjalanan.tarif)}
                    </div>

                    <button
                        type="button"
                        class="pilih-jadwal"
                        data-id="${perjalanan.id}"
                        data-tanggal="${tanggal}"
                    >
                        Pilih Perjalanan
                    </button>

                </div>

            `;

        }).join("");

    });

    hasilJadwal.addEventListener("click", function(event) {

        const tombol = event.target.closest(".pilih-jadwal");

        if (!tombol) {
            return;
        }

        const id = tombol.dataset.id;
        const tanggal = tombol.dataset.tanggal;

        const perjalanan = daftarPerjalanan.find(function(item) {

            return String(item.id) === String(id);

        });

        if (!perjalanan) {
            alert("Data perjalanan tidak ditemukan.");
            return;
        }

        const dataPilihan = {
            ...perjalanan,
            tanggal: tanggal
        };

        localStorage.setItem(
            "babelgo_selected_trip",
            JSON.stringify(dataPilihan)
        );

        alert("Perjalanan berhasil dipilih!");
        window.location.href = "kursi.html";

    });

})();

(function() {

    const daftarKursi = document.getElementById("daftarKursi");

    if (!daftarKursi) {
        return;
    }

    const infoPerjalanan = document.getElementById("infoPerjalanan");
    const nomorKursi = document.getElementById("nomorKursi");
    const tombolLanjut = document.getElementById("btnLanjutCheckout");

    const perjalanan = JSON.parse(
        localStorage.getItem("babelgo_selected_trip")
    );

    if (!perjalanan) {

        alert("Silakan pilih perjalanan terlebih dahulu.");

        window.location.href = "jadwal.html";

        return;
    }

    const TOTAL_KURSI = Number(perjalanan.kursi);

if (!Number.isInteger(TOTAL_KURSI) || TOTAL_KURSI < 1) {
    alert("Kapasitas kursi perjalanan tidak valid.");
    window.location.href = "jadwal.html";
    return;
}

const kunciPerjalanan =
    perjalanan.id + "_" + perjalanan.tanggal;

function ambilKursiTerisi() {

    const data = JSON.parse(
        localStorage.getItem("babelgo_booked_seats")
    ) || {};

    return data[kunciPerjalanan] || [];

}

function semuaKursiTerisi() {

    return [...new Set(
        ambilKursiTerisi().map(Number)
    )];

}

    infoPerjalanan.innerHTML = `

        <h3>Informasi Perjalanan Anda</h3>

        <p>
            <strong>Rute:</strong>
            ${perjalanan.asal} → ${perjalanan.tujuan}
        </p>

        <p>
            <strong>Tanggal:</strong>
            ${perjalanan.tanggal}
        </p>

        <p>
            <strong>Jam Keberangkatan:</strong>
            ${perjalanan.jam}
        </p>

        <p>
            <strong>Tarif:</strong>
            Rp${Number(perjalanan.tarif).toLocaleString("id-ID")}
        </p>

    `;

    let kursiDipilih = null;

    function tampilkanKursi() {

        const kursiTerisi = semuaKursiTerisi();

        daftarKursi.innerHTML = "";

        for (let i = 1; i <= TOTAL_KURSI; i++) {

            const tombol = document.createElement("button");

            tombol.type = "button";
            tombol.className = "kursi";
            tombol.textContent = "A" + i;

            if (kursiTerisi.includes(i)) {

                tombol.classList.add("terisi");
                tombol.disabled = true;
                tombol.title = "Kursi sudah terisi";

            }

            else if (kursiDipilih === i) {

                tombol.classList.add("dipilih");

            }

            tombol.addEventListener("click", function() {

                if (semuaKursiTerisi().includes(i)) {
                    alert("Kursi tersebut sudah terisi.");
                    tampilkanKursi();
                    return;
                }

                kursiDipilih = i;

                nomorKursi.textContent = "A" + i;

                tombolLanjut.disabled = false;

                tampilkanKursi();

            });

            daftarKursi.appendChild(tombol);

        }

    }

    tampilkanKursi();

    tombolLanjut.addEventListener("click", function() {

        if (!kursiDipilih) {

            alert("Silakan pilih kursi terlebih dahulu.");

            return;

        }

        localStorage.setItem(
            "babelgo_selected_seat",
            JSON.stringify({
                nomor: "A" + kursiDipilih,
                angka: kursiDipilih,
                kunciPerjalanan: kunciPerjalanan
            })
        );

        alert(
            "Kursi A" + kursiDipilih +
            " berhasil dipilih!"
        );

       alert("Pilihan kursi berhasil disimpan!");
       window.location.href = "checkout.html";

    });

})();

(function() {

    const checkoutForm = document.getElementById("checkoutForm");

    if (!checkoutForm) {
        return;
    }

    const ringkasan = document.getElementById("ringkasanPerjalanan");
    const totalHarga = document.getElementById("totalHarga");

    const perjalanan = JSON.parse(
        localStorage.getItem("babelgo_selected_trip")
    );

    const kursi = JSON.parse(
        localStorage.getItem("babelgo_selected_seat")
    );

    if (!perjalanan || !kursi) {

        alert("Data perjalanan atau kursi belum tersedia.");

        window.location.href = "jadwal.html";

        return;
    }

    const pengguna = JSON.parse(
        localStorage.getItem("babelgo_current_user")
    );

    if (pengguna) {

        document.getElementById("namaPemesan").value =
            pengguna.nama || "";

        document.getElementById("emailPemesan").value =
            pengguna.email || "";

        document.getElementById("nomorPemesan").value =
            pengguna.nomor || "";

    }

    const harga = Number(perjalanan.tarif);

    totalHarga.textContent =
        "Rp" + harga.toLocaleString("id-ID");

    ringkasan.innerHTML = `

        <div class="checkout-info">
            <span>Kota Asal</span>
            <strong>${perjalanan.asal}</strong>
        </div>

        <div class="checkout-info">
            <span>Kota Tujuan</span>
            <strong>${perjalanan.tujuan}</strong>
        </div>

        <div class="checkout-info">
            <span>Tanggal Perjalanan</span>
            <strong>${perjalanan.tanggal}</strong>
        </div>

        <div class="checkout-info">
            <span>Jam Keberangkatan</span>
            <strong>${perjalanan.jam}</strong>
        </div>

        <div class="checkout-info">
            <span>Nomor Kursi</span>
            <strong>${kursi.nomor}</strong>
        </div>

        <div class="checkout-info">
            <span>Harga Tiket</span>
            <strong>Rp${harga.toLocaleString("id-ID")}</strong>
        </div>

    `;

    checkoutForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const nama = document.getElementById("namaPemesan").value.trim();
        const email = document.getElementById("emailPemesan").value.trim();
        const nomor = document.getElementById("nomorPemesan").value.trim();

        const metode = document.getElementById("metodePembayaran").value;

        if (!nama || !email || !nomor || !metode) {

            alert("Mohon lengkapi seluruh data pemesanan.");

            return;
        }

        const semuaPesanan = JSON.parse(
            localStorage.getItem("babelgo_booked_seats")
        ) || {};

        const kunci = kursi.kunciPerjalanan;

        if (!semuaPesanan[kunci]) {
            semuaPesanan[kunci] = [];
        }

        if (semuaPesanan[kunci].includes(kursi.angka)) {

            alert("Maaf, kursi tersebut sudah dipesan.");

            window.location.href = "kursi.html";

            return;
        }

        const nomorPesanan =
            "BG" + Date.now();

        const transaksi = {

            nomorPesanan: nomorPesanan,

            nama: nama,
            email: email,
            nomorHP: nomor,

            kunciPerjalanan: kursi.kunciPerjalanan,
            angkaKursi: kursi.angka,

            asal: perjalanan.asal,
            tujuan: perjalanan.tujuan,

            tanggal: perjalanan.tanggal,
            jam: perjalanan.jam,

            kursi: kursi.nomor,

            harga: harga,

            metodePembayaran: metode,

            status: "Menunggu Pembayaran",

            tanggalPemesanan: new Date().toLocaleString("id-ID")

        };

        const riwayat = JSON.parse(
            localStorage.getItem("babelgo_bookings")
        ) || [];

        riwayat.push(transaksi);

        localStorage.setItem(
            "babelgo_bookings",
            JSON.stringify(riwayat)
        );

        semuaPesanan[kunci].push(kursi.angka);

        localStorage.setItem(
            "babelgo_booked_seats",
            JSON.stringify(semuaPesanan)
        );

        localStorage.setItem(
            "babelgo_last_booking",
            JSON.stringify(transaksi)
        );

        alert(
            "Pemesanan berhasil dibuat!\n\n" +
            "Nomor Pesanan: " + nomorPesanan +
            "\nTotal: Rp" + harga.toLocaleString("id-ID") +
            "\nStatus: Menunggu Pembayaran"
        );

        window.location.href = "pembayaran.html";

    });

})();

(function() {

    const totalPelanggan = document.getElementById("totalPelanggan");

    if (!totalPelanggan) {
        return;
    }

    const pelanggan = JSON.parse(
        localStorage.getItem("babelgo_users")
    ) || [];

    const pemesanan = JSON.parse(
        localStorage.getItem("babelgo_bookings")
    ) || [];

    const pendapatan = pemesanan.reduce(function(total, pesanan) {

    const sudahDibayar =
        pesanan.status === "Lunas (Simulasi)" ||
        pesanan.status === "Lunas";

    if (!sudahDibayar) {
        return total;
    }

    const nilai = Number(
        pesanan.total ??
        pesanan.tarif ??
        pesanan.harga ??
        0
    );

    return total + (Number.isFinite(nilai) ? nilai : 0);

}, 0);

    totalPelanggan.textContent = pelanggan.length;

    document.getElementById("totalPemesanan").textContent =
        pemesanan.length;

    document.getElementById("totalPendapatan").textContent =
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(pendapatan);

})();

(function () {

    const form = document.getElementById("formKendaraan");
    const daftar = document.getElementById("daftarKendaraan");

    if (!form || !daftar) return;

    const namaInput = document.getElementById("namaKendaraan");
    const platInput = document.getElementById("platKendaraan");
    const kapasitasInput = document.getElementById("kapasitasKendaraan");
    const statusInput = document.getElementById("statusKendaraan");
    const tombolSimpan = form.querySelector('button[type="submit"]');

    const KUNCI_KENDARAAN = "babelgo_vehicles";

    let idSedangDiedit = null;

    function ambilKendaraan() {
        try {
            const data = JSON.parse(
                localStorage.getItem(KUNCI_KENDARAAN)
            );

            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function simpanKendaraan(data) {
        localStorage.setItem(
            KUNCI_KENDARAAN,
            JSON.stringify(data)
        );
    }

    function resetForm() {
        form.reset();
        idSedangDiedit = null;
        tombolSimpan.textContent = "Simpan Kendaraan";
    }

    function tampilkanKendaraan() {

        const kendaraan = ambilKendaraan();

        daftar.replaceChildren();

        if (kendaraan.length === 0) {

            const baris = document.createElement("tr");
            const kolom = document.createElement("td");

            kolom.colSpan = 6;
            kolom.textContent = "Belum ada data kendaraan.";

            baris.appendChild(kolom);
            daftar.appendChild(baris);

            return;
        }

        kendaraan.forEach(function (item, index) {

            const baris = document.createElement("tr");

            const data = [
                index + 1,
                item.nama,
                item.plat,
                item.kapasitas + " Kursi",
                item.status
            ];

            data.forEach(function (isi) {

                const kolom = document.createElement("td");
                kolom.textContent = isi;
                baris.appendChild(kolom);

            });

            const kolomAksi = document.createElement("td");

            const tombolEdit = document.createElement("button");
            tombolEdit.type = "button";
            tombolEdit.textContent = "Edit";
            tombolEdit.className = "aksi-edit";
            tombolEdit.dataset.id = item.id;

            const tombolHapus = document.createElement("button");
            tombolHapus.type = "button";
            tombolHapus.textContent = "Hapus";
            tombolHapus.className = "aksi-hapus";
            tombolHapus.dataset.id = item.id;

            kolomAksi.append(tombolEdit, tombolHapus);
            baris.appendChild(kolomAksi);

            daftar.appendChild(baris);

        });

    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const nama = namaInput.value.trim();
        const plat = platInput.value.trim().toUpperCase();
        const kapasitas = Number(kapasitasInput.value);
        const status = statusInput.value;

        if (!nama || !plat || !Number.isInteger(kapasitas) || kapasitas < 1) {
            alert("Mohon isi data kendaraan dengan benar.");
            return;
        }

        const kendaraan = ambilKendaraan();

        const platSudahAda = kendaraan.some(function (item) {
            return item.plat === plat && item.id !== idSedangDiedit;
        });

        if (platSudahAda) {
            alert("Nomor polisi tersebut sudah terdaftar.");
            return;
        }

        if (idSedangDiedit !== null) {

            const index = kendaraan.findIndex(function (item) {
                return item.id === idSedangDiedit;
            });

            if (index !== -1) {
                kendaraan[index] = {
                    ...kendaraan[index],
                    nama: nama,
                    plat: plat,
                    kapasitas: kapasitas,
                    status: status
                };
            }

            alert("Data kendaraan berhasil diperbarui.");

        } else {

            kendaraan.push({
                id: Date.now().toString(),
                nama: nama,
                plat: plat,
                kapasitas: kapasitas,
                status: status
            });

            alert("Kendaraan berhasil ditambahkan.");

        }

        simpanKendaraan(kendaraan);
        resetForm();
        tampilkanKendaraan();

    });

    daftar.addEventListener("click", function (event) {

        const tombol = event.target.closest("button");

        if (!tombol) return;

        const id = tombol.dataset.id;
        const kendaraan = ambilKendaraan();

        const item = kendaraan.find(function (data) {
            return data.id === id;
        });

        if (!item) return;

        if (tombol.classList.contains("aksi-edit")) {

            idSedangDiedit = id;

            namaInput.value = item.nama;
            platInput.value = item.plat;
            kapasitasInput.value = item.kapasitas;
            statusInput.value = item.status;

            tombolSimpan.textContent = "Perbarui Kendaraan";

            form.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

        if (tombol.classList.contains("aksi-hapus")) {

            const yakin = confirm(
                "Apakah kamu yakin ingin menghapus kendaraan ini?"
            );

            if (!yakin) return;

            const dataTerbaru = kendaraan.filter(function (data) {
                return data.id !== id;
            });

            simpanKendaraan(dataTerbaru);

            if (idSedangDiedit === id) {
                resetForm();
            }

            tampilkanKendaraan();

            alert("Data kendaraan berhasil dihapus.");

        }

    });

    tampilkanKendaraan();

})();

(function () {

    const form = document.getElementById("formDriver");
    const daftar = document.getElementById("daftarDriver");

    if (!form || !daftar) return;

    const namaInput = document.getElementById("namaDriver");
    const teleponInput = document.getElementById("teleponDriver");
    const simInput = document.getElementById("simDriver");
    const statusInput = document.getElementById("statusDriver");
    const tombolSimpan = form.querySelector('button[type="submit"]');

    const KUNCI_DRIVER = "babelgo_drivers";

    let idSedangDiedit = null;

    function ambilDriver() {

        try {
            const data = JSON.parse(
                localStorage.getItem(KUNCI_DRIVER)
            );

            return Array.isArray(data) ? data : [];

        } catch (error) {
            return [];
        }

    }

    function simpanDriver(data) {

        localStorage.setItem(
            KUNCI_DRIVER,
            JSON.stringify(data)
        );

    }

    function resetForm() {

        form.reset();
        idSedangDiedit = null;
        tombolSimpan.textContent = "Simpan Driver";

    }

    function tampilkanDriver() {

        const driver = ambilDriver();

        daftar.replaceChildren();

        if (driver.length === 0) {

            const baris = document.createElement("tr");
            const kolom = document.createElement("td");

            kolom.colSpan = 6;
            kolom.textContent = "Belum ada data driver.";

            baris.appendChild(kolom);
            daftar.appendChild(baris);

            return;
        }

        driver.forEach(function (item, index) {

            const baris = document.createElement("tr");

            const data = [
                index + 1,
                item.nama,
                item.telepon,
                item.sim,
                item.status
            ];

            data.forEach(function (isi) {

                const kolom = document.createElement("td");
                kolom.textContent = isi;
                baris.appendChild(kolom);

            });

            const kolomAksi = document.createElement("td");

            const tombolEdit = document.createElement("button");
            tombolEdit.type = "button";
            tombolEdit.textContent = "Edit";
            tombolEdit.className = "aksi-edit";
            tombolEdit.dataset.id = item.id;

            const tombolHapus = document.createElement("button");
            tombolHapus.type = "button";
            tombolHapus.textContent = "Hapus";
            tombolHapus.className = "aksi-hapus";
            tombolHapus.dataset.id = item.id;

            kolomAksi.append(tombolEdit, tombolHapus);
            baris.appendChild(kolomAksi);

            daftar.appendChild(baris);

        });

    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const nama = namaInput.value.trim();
        const telepon = teleponInput.value.trim();
        const sim = simInput.value.trim();
        const status = statusInput.value;

        if (!nama || !telepon || !sim) {

            alert("Mohon lengkapi semua data driver.");
            return;

        }

        const driver = ambilDriver();
        const simSudahAda = driver.some(function (item) {

            return item.sim.toLowerCase() === sim.toLowerCase()
                && item.id !== idSedangDiedit;

        });

        if (simSudahAda) {

            alert("Nomor SIM tersebut sudah terdaftar.");
            return;

        }

        if (idSedangDiedit !== null) {

            const index = driver.findIndex(function (item) {
                return item.id === idSedangDiedit;
            });

            if (index !== -1) {

                driver[index] = {
                    ...driver[index],
                    nama: nama,
                    telepon: telepon,
                    sim: sim,
                    status: status
                };

            }

            alert("Data driver berhasil diperbarui.");

        } else {

            driver.push({

                id: Date.now().toString(),
                nama: nama,
                telepon: telepon,
                sim: sim,
                status: status

            });

            alert("Driver berhasil ditambahkan.");

        }

        simpanDriver(driver);
        resetForm();
        tampilkanDriver();

    });

    daftar.addEventListener("click", function (event) {

        const tombol = event.target.closest("button");

        if (!tombol) return;

        const id = tombol.dataset.id;
        const driver = ambilDriver();

        const item = driver.find(function (data) {
            return data.id === id;
        });

        if (!item) return;

        if (tombol.classList.contains("aksi-edit")) {

            idSedangDiedit = id;

            namaInput.value = item.nama;
            teleponInput.value = item.telepon;
            simInput.value = item.sim;
            statusInput.value = item.status;

            tombolSimpan.textContent = "Perbarui Driver";

            form.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

        if (tombol.classList.contains("aksi-hapus")) {

            const yakin = confirm(
                "Apakah kamu yakin ingin menghapus data driver ini?"
            );

            if (!yakin) return;

            const dataTerbaru = driver.filter(function (data) {
                return data.id !== id;
            });

            simpanDriver(dataTerbaru);

            if (idSedangDiedit === id) {
                resetForm();
            }

            tampilkanDriver();

            alert("Data driver berhasil dihapus.");

        }

    });

    tampilkanDriver();

})();

(function () {

    const form = document.getElementById("formJadwalAdmin");
    const daftar = document.getElementById("daftarJadwalAdmin");

    if (!form || !daftar) return;

    const asalInput = document.getElementById("asalJadwal");
    const tujuanInput = document.getElementById("tujuanJadwal");
    const jamInput = document.getElementById("jamJadwal");
    const hargaInput = document.getElementById("hargaJadwal");
    const kursiInput = document.getElementById("kursiJadwal");

    const tombolSimpan = form.querySelector(
        'button[type="submit"]'
    );

    const KUNCI_JADWAL = "babelgo_schedules";

    let idSedangDiedit = null;

    function ambilJadwal() {

        try {
            const data = JSON.parse(
                localStorage.getItem(KUNCI_JADWAL)
            );

            return Array.isArray(data) ? data : [];

        } catch (error) {
            return [];
        }

    }

    function simpanJadwal(data) {

        localStorage.setItem(
            KUNCI_JADWAL,
            JSON.stringify(data)
        );

    }

    function resetForm() {

        form.reset();

        idSedangDiedit = null;

        tombolSimpan.textContent = "Simpan Jadwal";

    }

    function tampilkanJadwal() {

        const jadwal = ambilJadwal();

        daftar.replaceChildren();

        if (jadwal.length === 0) {

            const baris = document.createElement("tr");
            const kolom = document.createElement("td");

            kolom.colSpan = 7;
            kolom.textContent = "Belum ada data jadwal.";

            baris.appendChild(kolom);
            daftar.appendChild(baris);

            return;

        }

        jadwal.forEach(function (item, index) {

            const baris = document.createElement("tr");

            const data = [
                index + 1,
                item.asal,
                item.tujuan,
                item.jam,
                "Rp" + Number(item.harga).toLocaleString("id-ID"),
                item.kursi + " Kursi"
            ];

            data.forEach(function (isi) {

                const kolom = document.createElement("td");

                kolom.textContent = isi;

                baris.appendChild(kolom);

            });

            const kolomAksi = document.createElement("td");

            const tombolEdit = document.createElement("button");

            tombolEdit.type = "button";
            tombolEdit.textContent = "Edit";
            tombolEdit.className = "aksi-edit";
            tombolEdit.dataset.id = item.id;

            const tombolHapus = document.createElement("button");

            tombolHapus.type = "button";
            tombolHapus.textContent = "Hapus";
            tombolHapus.className = "aksi-hapus";
            tombolHapus.dataset.id = item.id;

            kolomAksi.append(tombolEdit, tombolHapus);

            baris.appendChild(kolomAksi);

            daftar.appendChild(baris);

        });

    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const asal = asalInput.value;
        const tujuan = tujuanInput.value;
        const jam = jamInput.value;
        const harga = Number(hargaInput.value);
        const kursi = Number(kursiInput.value);

        if (!asal || !tujuan || !jam) {

            alert("Mohon lengkapi semua data jadwal.");
            return;

        }

        if (asal === tujuan) {

            alert("Kota asal dan tujuan tidak boleh sama.");
            return;

        }

        if (
            !Number.isFinite(harga) ||
            harga <= 0 ||
            !Number.isInteger(kursi) ||
            kursi < 1
        ) {

            alert("Harga dan kapasitas kursi tidak valid.");
            return;

        }

        const jadwal = ambilJadwal();

        if (idSedangDiedit !== null) {

            const index = jadwal.findIndex(function (item) {

                return item.id === idSedangDiedit;

            });

            if (index === -1) {

                alert("Data jadwal tidak ditemukan.");
                resetForm();
                return;

            }

            jadwal[index] = {

                ...jadwal[index],
                asal: asal,
                tujuan: tujuan,
                jam: jam,
                harga: harga,
                kursi: kursi

            };

            alert("Jadwal berhasil diperbarui.");

        } else {

            jadwal.push({

                id: Date.now().toString(),
                asal: asal,
                tujuan: tujuan,
                jam: jam,
                harga: harga,
                kursi: kursi

            });

            alert("Jadwal berhasil ditambahkan.");

        }

        try {

            simpanJadwal(jadwal);

            resetForm();
            tampilkanJadwal();

        } catch (error) {

            alert("Data gagal disimpan. Periksa penyimpanan browser.");

        }

    });

    daftar.addEventListener("click", function (event) {

        const tombol = event.target.closest("button");

        if (!tombol) return;

        const id = tombol.dataset.id;

        const jadwal = ambilJadwal();

        const item = jadwal.find(function (data) {

            return data.id === id;

        });

        if (!item) return;

        if (tombol.classList.contains("aksi-edit")) {

            idSedangDiedit = id;

            asalInput.value = item.asal;
            tujuanInput.value = item.tujuan;
            jamInput.value = item.jam;
            hargaInput.value = item.harga;
            kursiInput.value = item.kursi;

            tombolSimpan.textContent = "Perbarui Jadwal";

            form.scrollIntoView({

                behavior: "smooth",
                block: "center"

            });

        }

        if (tombol.classList.contains("aksi-hapus")) {

            const yakin = confirm(
                "Apakah kamu yakin ingin menghapus jadwal ini?"
            );

            if (!yakin) return;

            const dataTerbaru = jadwal.filter(function (data) {

                return data.id !== id;

            });

            try {

                simpanJadwal(dataTerbaru);

                if (idSedangDiedit === id) {
                    resetForm();
                }

                tampilkanJadwal();

                alert("Jadwal berhasil dihapus.");

            } catch (error) {

                alert("Jadwal gagal dihapus.");

            }

        }

    });

    tampilkanJadwal();

})();

(function () {
    const detailPembayaran = document.getElementById("detailPembayaran");

    if (!detailPembayaran) return;

    const pesanan = JSON.parse(
        localStorage.getItem("babelgo_last_booking")
    );

    const statusPembayaran = document.getElementById("statusPembayaran");
    const informasiMetode = document.getElementById("informasiMetode");

    if (!pesanan) {
        detailPembayaran.textContent = "Data pesanan tidak ditemukan.";
        statusPembayaran.textContent = "Belum Ada Pesanan";
        informasiMetode.textContent = "Silakan lakukan pemesanan terlebih dahulu.";
        return;
    }

    function tambahDetail(label, nilai) {
        const baris = document.createElement("p");
        const teks = document.createElement("strong");

        teks.textContent = label + ": ";

        const isi = document.createElement("span");
        isi.textContent = nilai ?? "-";

        baris.appendChild(teks);
        baris.appendChild(isi);

        detailPembayaran.appendChild(baris);
    }

    detailPembayaran.innerHTML = "";

    tambahDetail("Nomor Pesanan", pesanan.nomorPesanan);
    tambahDetail("Nama Pelanggan", pesanan.nama);
    tambahDetail("Email", pesanan.email);
    tambahDetail("Nomor HP", pesanan.nomorHP);
    tambahDetail("Asal", pesanan.asal);
    tambahDetail("Tujuan", pesanan.tujuan);
    tambahDetail("Tanggal Perjalanan", pesanan.tanggal);
    tambahDetail("Jam Keberangkatan", pesanan.jam);
    tambahDetail("Nomor Kursi", pesanan.kursi);
    tambahDetail(
        "Total Pembayaran",
        "Rp" + Number(pesanan.harga).toLocaleString("id-ID")
    );
    tambahDetail("Metode Pembayaran", pesanan.metodePembayaran);

    statusPembayaran.textContent =
        pesanan.status || "Menunggu Pembayaran";

    informasiMetode.textContent =
        "Metode yang dipilih: " +
        pesanan.metodePembayaran +
        ". Pembayaran ini masih berupa simulasi dan belum memproses transaksi sungguhan.";
})();

(function () {
    const areaQRIS = document.getElementById("areaQRIS");

    if (!areaQRIS) return;

    const tombolQRIS = document.getElementById("btnSimulasiBayar");
    const nominalQRIS = document.getElementById("nominalQRIS");
    const hasilSimulasi = document.getElementById("hasilSimulasi");
    const statusPembayaran = document.getElementById("statusPembayaran");

    let pesanan = JSON.parse(
        localStorage.getItem("babelgo_last_booking") || "null"
    );

    if (!pesanan) {
        areaQRIS.hidden = true;
        return;
    }

    if (pesanan.metodePembayaran !== "QRIS") {
        areaQRIS.hidden = true;
        return;
    }

    areaQRIS.hidden = false;

    nominalQRIS.textContent =
        "Rp" + Number(pesanan.harga).toLocaleString("id-ID");

    statusPembayaran.textContent =
        pesanan.status || "Menunggu Pembayaran";

    if (pesanan.status === "Lunas (Simulasi)") {
        hasilSimulasi.textContent =
            "Pembayaran demo sebelumnya sudah berhasil.";

        tombolQRIS.disabled = true;
        tombolQRIS.textContent = "Simulasi Sudah Selesai";
        return;
    }

    tombolQRIS.addEventListener("click", function () {

        if (pesanan.status === "Lunas (Simulasi)") return;

        const konfirmasi = confirm(
            "Jalankan simulasi pembayaran QRIS sebesar Rp" +
            Number(pesanan.harga).toLocaleString("id-ID") +
            "?"
        );

        if (!konfirmasi) return;

        pesanan.status = "Lunas (Simulasi)";

        localStorage.setItem(
            "babelgo_last_booking",
            JSON.stringify(pesanan)
        );

        let daftarPesanan = JSON.parse(
            localStorage.getItem("babelgo_bookings") || "[]"
        );

        daftarPesanan = daftarPesanan.map(function (item) {
            if (
                String(item.nomorPesanan) ===
                String(pesanan.nomorPesanan)
            ) {
                return {
                    ...item,
                    status: "Lunas (Simulasi)"
                };
            }

            return item;
        });

        localStorage.setItem(
            "babelgo_bookings",
            JSON.stringify(daftarPesanan)
        );

        statusPembayaran.textContent = "Lunas (Simulasi)";

        hasilSimulasi.textContent =
            "Simulasi pembayaran berhasil! Status pesanan telah diperbarui.";

        tombolQRIS.disabled = true;
        tombolQRIS.textContent = "Simulasi Sudah Selesai";

        alert(
            "Simulasi pembayaran BabelGo berhasil!\n" +
            "Status: Lunas (Simulasi)"
        );
    });

})();

(function () {

   
(function () {

    const daftarTransaksi = document.getElementById(
        "daftarTransaksiAdmin"
    );

    if (!daftarTransaksi) return;

    function ambilTransaksi() {
        try {
            const data = JSON.parse(
                localStorage.getItem("babelgo_bookings")
            );

            return Array.isArray(data) ? data : [];

        } catch (error) {
            return [];
        }
    }

    function tampilkanTransaksi() {

        const transaksi = ambilTransaksi();

        daftarTransaksi.replaceChildren();

        if (transaksi.length === 0) {

            const baris = document.createElement("tr");
            const kolom = document.createElement("td");

            kolom.colSpan = 10;
            kolom.textContent = "Belum ada transaksi.";

            baris.appendChild(kolom);
            daftarTransaksi.appendChild(baris);

            return;
        }

        transaksi.forEach(function (item, index) {

            const baris = document.createElement("tr");

            const harga = Number(item.harga ?? item.total ?? 0);

            const data = [
                index + 1,
                item.nomorPesanan || "-",
                item.nama || "-",
                (item.asal || "-") + " → " + (item.tujuan || "-"),
                item.tanggal || "-",
                item.kursi || "-",
                "Rp" + harga.toLocaleString("id-ID"),
                item.metodePembayaran || "-",
                item.status || "Menunggu Pembayaran"
            ];

            data.forEach(function (isi) {

                const kolom = document.createElement("td");
                kolom.textContent = isi;
                baris.appendChild(kolom);

            });

            const kolomAksi = document.createElement("td");
            const tombolStatus = document.createElement("button");

            tombolStatus.type = "button";
            tombolStatus.textContent = "Ubah Status";
            tombolStatus.className = "aksi-edit";
            tombolStatus.dataset.id = item.nomorPesanan;

            const tombolHapus = document.createElement("button");

            tombolHapus.type = "button";
            tombolHapus.textContent = "Hapus";
            tombolHapus.className = "aksi-hapus";
            tombolHapus.dataset.id = item.nomorPesanan;

            kolomAksi.append(tombolStatus, tombolHapus);

            baris.appendChild(kolomAksi);

            daftarTransaksi.appendChild(baris);

        });

    }

    daftarTransaksi.addEventListener("click", function (event) {

        const tombolHapus = event.target.closest(".aksi-hapus");
        const tombolStatus = event.target.closest(".aksi-edit");

        if (tombolHapus) {

            const nomorPesanan = tombolHapus.dataset.id;

            const yakin = confirm(
                "Apakah kamu yakin ingin menghapus transaksi " +
                nomorPesanan + "?"
            );

            if (!yakin) return;

           const transaksi = ambilTransaksi();

const itemDihapus = transaksi.find(function (item) {
    return String(item.nomorPesanan) === String(nomorPesanan);
});

if (!itemDihapus) {
    alert("Transaksi tidak ditemukan.");
    return;
}

const semuaKursi = JSON.parse(
    localStorage.getItem("babelgo_booked_seats") || "{}"
);

const kunciPerjalanan = itemDihapus.kunciPerjalanan;

if (kunciPerjalanan && Array.isArray(semuaKursi[kunciPerjalanan])) {

    const nomorKursi = Number(
        String(itemDihapus.kursi).replace("A", "")
    );

    semuaKursi[kunciPerjalanan] =
        semuaKursi[kunciPerjalanan].filter(function (angka) {
            return Number(angka) !== nomorKursi;
        });

    localStorage.setItem(
        "babelgo_booked_seats",
        JSON.stringify(semuaKursi)
    );

}

const transaksiTerbaru = transaksi.filter(function (item) {
    return String(item.nomorPesanan) !== String(nomorPesanan);
});

            if (transaksiTerbaru.length === transaksi.length) {
                alert("Transaksi tidak ditemukan.");
                return;
            }

            localStorage.setItem(
                "babelgo_bookings",
                JSON.stringify(transaksiTerbaru)
            );

            const pesananTerakhir = JSON.parse(
                localStorage.getItem("babelgo_last_booking") || "null"
            );

            if (
                pesananTerakhir &&
                String(pesananTerakhir.nomorPesanan) === String(nomorPesanan)
            ) {
                localStorage.removeItem("babelgo_last_booking");
            }

            tampilkanTransaksi();

            alert("Transaksi berhasil dihapus.");

            return;
        }

        if (!tombolStatus) return;

        const nomorPesanan = tombolStatus.dataset.id;

        const transaksi = ambilTransaksi();

        const index = transaksi.findIndex(function (item) {
            return String(item.nomorPesanan) === String(nomorPesanan);
        });

        if (index === -1) {
            alert("Transaksi tidak ditemukan.");
            return;
        }

        const statusSekarang = transaksi[index].status ||
            "Menunggu Pembayaran";

        let statusBaru;

        if (statusSekarang === "Menunggu Pembayaran") {
            statusBaru = "Lunas (Simulasi)";
        } else {
            statusBaru = "Menunggu Pembayaran";
        }

        const konfirmasi = confirm(
            "Ubah status transaksi " + nomorPesanan +
            " menjadi " + statusBaru + "?"
        );

        if (!konfirmasi) return;

        transaksi[index].status = statusBaru;

        localStorage.setItem(
            "babelgo_bookings",
            JSON.stringify(transaksi)
        );

        const pesananTerakhir = JSON.parse(
            localStorage.getItem("babelgo_last_booking") || "null"
        );

        if (
            pesananTerakhir &&
            String(pesananTerakhir.nomorPesanan) === String(nomorPesanan)
        ) {

            pesananTerakhir.status = statusBaru;

            localStorage.setItem(
                "babelgo_last_booking",
                JSON.stringify(pesananTerakhir)
            );

        }

        tampilkanTransaksi();

        alert("Status transaksi berhasil diperbarui.");

    });

    tampilkanTransaksi();

})();

})();

(function () {

    const daftarPelanggan = document.getElementById(
        "daftarPelangganAdmin"
    );

    if (!daftarPelanggan) return;

    const totalPelanggan = document.getElementById(
        "totalPelanggan"
    );

    function ambilPelanggan() {

        try {

            const data = JSON.parse(
                localStorage.getItem("babelgo_users")
            );

            return Array.isArray(data) ? data : [];

        } catch (error) {

            return [];

        }

    }

    function tampilkanPelanggan() {

        const pelanggan = ambilPelanggan();

        daftarPelanggan.replaceChildren();

        if (totalPelanggan) {
            totalPelanggan.textContent = pelanggan.length;
        }

        if (pelanggan.length === 0) {

            const baris = document.createElement("tr");
            const kolom = document.createElement("td");

            kolom.colSpan = 4;
            kolom.textContent = "Belum ada pelanggan.";

            baris.appendChild(kolom);
            daftarPelanggan.appendChild(baris);

            return;

        }

        pelanggan.forEach(function (item, index) {

            const baris = document.createElement("tr");

            const data = [
                index + 1,
                item.nama || "-",
                item.email || "-"
            ];

            data.forEach(function (isi) {

                const kolom = document.createElement("td");

                kolom.textContent = isi;

                baris.appendChild(kolom);

            });

            const kolomAksi = document.createElement("td");

            const tombolHapus = document.createElement("button");

            tombolHapus.type = "button";
            tombolHapus.textContent = "Hapus";
            tombolHapus.className = "aksi-hapus";
            tombolHapus.dataset.email = item.email;

            kolomAksi.appendChild(tombolHapus);
            baris.appendChild(kolomAksi);

            daftarPelanggan.appendChild(baris);

        });

    }

    daftarPelanggan.addEventListener("click", function (event) {

        const tombol = event.target.closest(".aksi-hapus");

        if (!tombol) return;

        const email = tombol.dataset.email;

        const yakin = confirm(
            "Apakah kamu yakin ingin menghapus akun pelanggan ini?"
        );

        if (!yakin) return;

        const pelanggan = ambilPelanggan();

        const pelangganTerbaru = pelanggan.filter(function (item) {

            return item.email !== email;

        });

        if (pelangganTerbaru.length === pelanggan.length) {

            alert("Data pelanggan tidak ditemukan.");

            return;

        }

        localStorage.setItem(
            "babelgo_users",
            JSON.stringify(pelangganTerbaru)
        );

        const penggunaAktif = JSON.parse(
            localStorage.getItem("babelgo_current_user") || "null"
        );

        if (penggunaAktif && penggunaAktif.email === email) {

            localStorage.removeItem("babelgo_current_user");

        }

        tampilkanPelanggan();

        alert("Akun pelanggan berhasil dihapus.");

    });

    tampilkanPelanggan();

})();