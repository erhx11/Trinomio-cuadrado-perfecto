const progressBar = document.getElementById("progressBar");
const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchInput");

const aSlider = document.getElementById("aSlider");
const bSlider = document.getElementById("bSlider");
const aValue = document.getElementById("aValue");
const bValue = document.getElementById("bValue");
const signSelect = document.getElementById("signSelect");
const dynamicSteps = document.getElementById("dynamicSteps");

let practiceExpected = 0;
let practiceRoot = 0;
let practiceSign = 1;

window.addEventListener("scroll", () => {
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0;
  progressBar.style.width = `${scrolled}%`;
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark")
    ? "Modo claro"
    : "Modo oscuro";
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  document.querySelectorAll(".searchable").forEach(section => {
    const text = section.innerText.toLowerCase();
    section.classList.toggle("search-hidden", query !== "" && !text.includes(query));
  });
});

function renderSimulator() {
  const a = Number(aSlider.value);
  const b = Number(bSlider.value);
  const sign = signSelect.value;
  const middle = 2 * a * b;
  const signedMiddle = sign === "+" ? middle : -middle;

  aValue.textContent = a;
  bValue.textContent = b;

  dynamicSteps.innerHTML = `
    <p><strong>Binomio:</strong> (${a}x ${sign} ${b})²</p>
    <p><strong>Paso 1:</strong> (${a}x)² = ${a * a}x²</p>
    <p><strong>Paso 2:</strong> 2(${a}x)(${b}) = ${middle}x</p>
    <p><strong>Paso 3:</strong> (${b})² = ${b * b}</p>
    <p><strong>Resultado:</strong> ${a * a}x² ${signedMiddle >= 0 ? "+" : "-"} ${Math.abs(signedMiddle)}x + ${b * b}</p>
  `;
}

[aSlider, bSlider, signSelect].forEach(control => {
  control.addEventListener("input", renderSimulator);
});

document.querySelectorAll(".presets button").forEach(button => {
  button.addEventListener("click", () => {
    aSlider.value = button.dataset.a;
    bSlider.value = button.dataset.b;
    signSelect.value = button.dataset.sign;
    renderSimulator();
  });
});

function newPractice() {
  practiceRoot = Math.floor(Math.random() * 8) + 2;
  practiceSign = Math.random() < 0.5 ? 1 : -1;
  practiceExpected = practiceSign * 2 * practiceRoot;

  const signText = practiceSign === 1 ? "+" : "-";
  document.getElementById("practiceQuestion").textContent =
    `Completa el término central para que x² ${signText} ?x + ${practiceRoot * practiceRoot} sea un trinomio cuadrado perfecto. Escribe solo el coeficiente con su signo.`;

  document.getElementById("practiceAnswer").value = "";
  document.getElementById("practiceFeedback").textContent = "";
}

document.getElementById("checkPractice").addEventListener("click", () => {
  const answer = Number(document.getElementById("practiceAnswer").value);
  const feedback = document.getElementById("practiceFeedback");

  if (answer === practiceExpected) {
    feedback.textContent = "Correcto. Se cumple 2ab.";
    setTimeout(newPractice, 1200);
  } else {
    feedback.textContent = "Incorrecto. Revisa el doble producto de x por la raíz cuadrada del término independiente.";
  }
});

document.getElementById("hintPractice").addEventListener("click", () => {
  document.getElementById("practiceFeedback").textContent =
    `Pista: √${practiceRoot * practiceRoot} = ${practiceRoot}. Luego calcula 2(1)(${practiceRoot}) y conserva el signo del término central.`;
});

document.getElementById("quizForm").addEventListener("submit", event => {
  event.preventDefault();

  const data = new FormData(event.target);
  let score = 0;

  if (data.get("q1") === "a") score++;
  if (data.get("q2") === "b") score++;
  if (data.get("q3") === "b") score++;

  document.getElementById("quizResult").textContent = `Resultado: ${score}/3 respuestas correctas.`;
});

document.getElementById("supportForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("supportMessage").textContent =
    "Consulta registrada en la página. Para enviarla realmente se necesita conectar el formulario a un servicio o servidor.";
});

renderSimulator();
newPractice();
