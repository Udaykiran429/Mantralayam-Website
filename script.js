let isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
// Get stored volunteers or empty array
let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];



function hideAllSections() {
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active-section');
    });
}

function removeActiveMenu() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
}

function showSection(sectionId, element) {
    hideAllSections();
    removeActiveMenu();

    if (sectionId === 'admin') {
        if (isAdminLoggedIn) {
            document.getElementById('admin-dashboard').classList.add('active-section');
        } else {
            document.getElementById('admin-login').classList.add('active-section');
        }
    } else {
        document.getElementById(sectionId).classList.add('active-section');
    }

    element.classList.add('active');
}

/* ---------- ADMIN LOGIN ---------- */
function adminLogin() {
    const user = document.getElementById("admin-username").value;
    const pass = document.getElementById("admin-password").value;
    const error = document.getElementById("admin-error");

    if (user === "GURUPADA SEVA" && pass === "RAYARU1234") {
        isAdminLoggedIn = true;
        localStorage.setItem("adminLoggedIn", "true");

        hideAllSections();
        document.getElementById("admin-dashboard").classList.add("active-section");
    } else {
        error.textContent = "Invalid username or password";
    }
  loadVolunteers();
}



function adminLogout() {
    isAdminLoggedIn = false;
    localStorage.removeItem("adminLoggedIn");

    hideAllSections();
    document.getElementById("admin-login").classList.add("active-section");
}

/* ---------- PASSWORD TOGGLE ---------- */
function togglePassword() {
    const pass = document.getElementById("admin-password");
    pass.type = pass.type === "password" ? "text" : "password";
}



function generateID() {
    const name = document.getElementById("vname").value;
    const mobile = document.getElementById("vmobile").value;
    const photo = document.getElementById("vphoto").files[0];

    if (!name || !mobile || !photo) {
        alert("Please fill all details");
        return;
    }

    // Auto ID (10 crore limit)
    let currentID = localStorage.getItem("currentID")
        ? parseInt(localStorage.getItem("currentID"))
        : 1;

    if (currentID > 100000000) {
        alert("Volunteer ID limit reached");
        return;
    }

    // Display ID Card
    document.getElementById("card-name").innerText = name;
    document.getElementById("card-id").innerText = currentID;
    document.getElementById("card-mobile").innerText = mobile;

    const reader = new FileReader();
    reader.onload = function () {
        document.getElementById("card-photo").src = reader.result;
    };
    reader.readAsDataURL(photo);

    document.getElementById("id-card").style.display = "block";

    // SAVE volunteer data
    volunteers.push({
        name: name,
        id: currentID,
        mobile: mobile
    });

    localStorage.setItem("volunteers", JSON.stringify(volunteers));
    localStorage.setItem("currentID", currentID + 1);

    alert("Volunteer ID Generated Successfully!");
}

function loadVolunteers() {
    const table = document.getElementById("volunteerTable");

    if (!table) return; // safety

    table.innerHTML = "";

    const storedVolunteers = JSON.parse(localStorage.getItem("volunteers")) || [];

    if (storedVolunteers.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">No records found</td>
            </tr>`;
        return;
    }

    storedVolunteers.forEach((v, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${v.name}</td>
            <td>${v.id}</td>
            <td>${v.mobile}</td>
        `;

        table.appendChild(row);
    });
}




function loadVolunteers() {
    if (!isAdminLoggedIn) return; // 🔐 block public access

    const table = document.getElementById("volunteerTable");
    if (!table) return;

    table.innerHTML = "";

    const data = JSON.parse(localStorage.getItem("volunteers")) || [];

    if (data.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">No records found</td>
            </tr>`;
        return;
    }

    data.forEach((v, i) => {
        table.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${v.name}</td>
                <td>${v.id}</td>
                <td>${v.mobile}</td>
            </tr>`;
    });
}


window.onload = function () {
    hideAllSections();

    if (isAdminLoggedIn) {
        document.getElementById("admin-dashboard").classList.add("active-section");
        loadVolunteers(); // 🔥 LOAD DATA ON REFRESH
    } else {
        document.getElementById("home").classList.add("active-section");
    }
};


function resetVolunteerData() {
    if (!isAdminLoggedIn) {
        alert("Access denied!");
        return;
    }

    const confirmReset = confirm(
        "⚠️ WARNING!\n\nThis will delete ALL volunteer data and reset ID to 1.\n\nAre you sure?"
    );

    if (!confirmReset) return;

    // Clear data
    localStorage.removeItem("volunteers");
    localStorage.removeItem("currentID");

    // Clear table instantly
    const table = document.getElementById("volunteerTable");
    if (table) {
        table.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">No records found</td>
            </tr>`;
    }

    alert("✅ All volunteer data cleared. ID reset to 1.");
}


let slideIndex = 0;
const slides = document.querySelectorAll(".about-slide");

setInterval(() => {
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
}, 3000); // change image every 3 seconds


function toggleBot() {
    const bot = document.getElementById("chatbot");
    bot.style.display = bot.style.display === "block" ? "none" : "block";
}

function sendMessage() {
    const input = document.getElementById("userInput");
    const msg = input.value.toLowerCase();
    if (!msg) return;

    addMessage(msg, "user");
    input.value = "";

    let reply = "🙏 Sorry, I can help with temple timings, sevas, contact & location.";

    if (msg.includes("timing") || msg.includes("open")) {
        reply = "🕕 Temple opens at 6:00 AM and closes at 9:00 PM.";
    }
    else if (msg.includes("darshan")) {
        reply = "✨ Morning Darshan: 6:00 AM – 2:00 PM | Evening: 4:00 PM – 9:00 PM.";
    }
    else if (msg.includes("seva")) {
        reply = "🛕 Sevas include Archana, Abhishekam, Annadanam & GuruPada Seva.";
    }
    else if (msg.includes("contact") || msg.includes("phone")) {
        reply = "📞 Contact: 9876543210 | ✉️ info@mantralayamtemple.com";
    }
    else if (msg.includes("location") || msg.includes("where")) {
        reply = "📍 Mantralayam, Kurnool District, Andhra Pradesh.";
    }

    setTimeout(() => addMessage(reply, "bot"), 600);
}

function addMessage(text, type) {
    const chatBody = document.getElementById("chat-body");
    const div = document.createElement("div");
    div.className = type;
    div.innerText = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}
