// =================================
// LOGIN SYSTEM
// =================================
const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");
const loginError = document.getElementById("loginError");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

const validUser = {
    username: "kasir",
    password: "12345"
};

function checkLogin() {
    if (localStorage.getItem("logged_in") === "true") {
        loginPage.style.display = "none";
        appPage.style.display = "block";
    } else {
        loginPage.style.display = "block";
        appPage.style.display = "none";
    }
}
checkLogin();

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === validUser.username && pass === validUser.password) {
        localStorage.setItem("logged_in", "true");
        loginError.style.display = "none";
        checkLogin();
    } else {
        loginError.style.display = "block";
    }
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("logged_in");
    checkLogin();
});

// =================================
// DARK MODE
// =================================
document.getElementById("darkModeBtn").onclick = () => {
    document.body.classList.toggle("dark");
};


// =================================
// CRUD + HITUNG TOTAL
// =================================
let items = JSON.parse(localStorage.getItem("kasir_items")) || [];

const tableBody = document.getElementById("tableBody");
const grandTotal = document.getElementById("grandTotal");
const diskon = document.getElementById("diskon");
const bayar = document.getElementById("bayar");

function saveData() {
    localStorage.setItem("kasir_items", JSON.stringify(items));
}

function renderTable() {
    tableBody.innerHTML = "";
    let total = 0;
    let editIndex = -1;


    items.forEach((item, index) => {
        let row = `
        <tr>
            <td>${item.nama}</td>
            <td>${item.harga}</td>
            <td>${item.qty}</td>
            <td>${item.total}</td>
            <td>
                <button onclick="delItem(${index})" class="btn-danger">Hapus</button>
            </td>
            <td>
                <button onclick="editItem(${index})" class="btn-primary">Edit</button>
                <button onclick="delItem(${index})" class="btn-danger">Hapus</button>
            </td>
        </tr>
        `;
        tableBody.innerHTML += row;
        total += item.total;
    });

    let d = total >= 100000 ? total * 0.1 : 0;
    let bayarAkhir = total - d;

    grandTotal.textContent = total;
    diskon.textContent = d;
    bayar.textContent = bayarAkhir;
}
renderTable();

document.getElementById("addBtn").onclick = () => {
    let nama = document.getElementById("nama").value;
    let harga = parseInt(document.getElementById("harga").value);
    let qty = parseInt(document.getElementById("qty").value);

    if (!nama || !harga || !qty) return alert("Isi semua form!");

    let total = harga * qty;

    items.push({ nama, harga, qty, total });

    saveData();
    renderTable();
};

function delItem(i) {
    items.splice(i, 1);
    saveData();
    renderTable();
}

//====EDIT ITEM====//
function editItem(i) {
    document.getElementById("nama").value = items[i].nama;
    document.getElementById("harga").value = items[i].harga;
    document.getElementById("qty").value = items[i].qty;

    editIndex = i;

    document.getElementById("addBtn").style.display = "none";
    document.getElementById("updateBtn").style.display = "inline-block";
}


// CETAK PDF
// =================================
document.getElementById("printBtn").onclick = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("STRUK BELANJA", 10, 10);

    let y = 20;
    items.forEach((item) => {
        doc.text(`${item.nama} - ${item.qty} x ${item.harga} = ${item.total}`, 10, y);
        y += 10;
    });

    y += 10;
    doc.text(`Total: ${grandTotal.textContent}`, 10, y);
    y += 10;
    doc.text(`Diskon: ${diskon.textContent}`, 10, y);
    y += 10;
    doc.text(`Bayar: ${bayar.textContent}`, 10, y);

    doc.save("struk.pdf");
};

document.getElementById("updateBtn").onclick = () => {
    let nama = document.getElementById("nama").value;
    let harga = parseInt(document.getElementById("harga").value);
    let qty = parseInt(document.getElementById("qty").value);

    if (!nama || !harga || !qty) return alert("Isi semua form!");

    items[editIndex] = {
        nama,
        harga,
        qty,
        total: harga * qty
    };

    saveData();
    renderTable();

    // reset form
    document.getElementById("nama").value = "";
    document.getElementById("harga").value = "";
    document.getElementById("qty").value = "";

    editIndex = -1;

    document.getElementById("addBtn").style.display = "inline-block";
    document.getElementById("updateBtn").style.display = "none";
};
