const form = document.getElementById("workout-form");
const list = document.getElementById("workout-list");

let workouts = JSON.parse(localStorage.getItem("workouts")) || [];

function renderWorkouts() {
  list.innerHTML = "";
  workouts.forEach((workout, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${workout.date} - <strong>${workout.type}</strong> for ${workout.duration} min</span>
      <button class="delete-btn" onclick="deleteWorkout(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteWorkout(index) {
  workouts.splice(index, 1);
  localStorage.setItem("workouts", JSON.stringify(workouts));
  renderWorkouts();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const type = document.getElementById("type").value;
  const duration = document.getElementById("duration").value;
  const date = document.getElementById("date").value;

  const newWorkout = { type, duration, date };
  workouts.push(newWorkout);
  localStorage.setItem("workouts", JSON.stringify(workouts));
  renderWorkouts();
  form.reset();
});

renderWorkouts();
