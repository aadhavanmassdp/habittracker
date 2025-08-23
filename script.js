// ================= AUTHENTICATION =================
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout-btn");
const socialLoginBtn = document.getElementById("social-login");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email && password) {
    localStorage.setItem("user", email);
    showApp();
  }
});

socialLoginBtn.addEventListener("click", () => {
  localStorage.setItem("user", "google_user@example.com");
  showApp();
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  location.reload();
});

function showApp() {
  authSection.classList.add("d-none");
  appSection.classList.remove("d-none");
  loadHabits();
  updateChart();
}

if (localStorage.getItem("user")) showApp();

// ================= HABIT MANAGEMENT =================
const habitForm = document.getElementById("habit-form");
const habitCards = document.getElementById("habit-cards");
let habits = JSON.parse(localStorage.getItem("habits")) || [];

habitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("habit-name").value;
  const goal = parseInt(document.getElementById("habit-goal").value);

  habits.push({ name, goal, progress: 0 });
  saveHabits();
  loadHabits();
  updateChart();
  habitForm.reset();
});

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function loadHabits() {
  habitCards.innerHTML = "";
  habits.forEach((habit, index) => {
    const percent = Math.min((habit.progress / habit.goal) * 100, 100).toFixed(0);
    const card = `
      <div class="col-md-4 mb-3">
        <div class="card habit-card shadow p-3">
          <h6>${habit.name}</h6>
          <div class="progress my-2">
            <div class="progress-bar bg-success" role="progressbar" style="width: ${percent}%">
              ${percent}%
            </div>
          </div>
          <p class="small">Progress: ${habit.progress} / ${habit.goal}</p>
          <button class="btn btn-sm btn-primary" onclick="incrementHabit(${index})">+1</button>
        </div>
      </div>
    `;
    habitCards.innerHTML += card;
  });
}

function incrementHabit(index) {
  habits[index].progress++;
  saveHabits();
  loadHabits();
  updateChart();
}

// ================= CHART VISUALIZATION =================
let chart;

function updateChart() {
  const labels = habits.map(h => h.name);
  const data = habits.map(h => Math.min(h.progress / h.goal * 100, 100));

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("progressChart"), {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}
