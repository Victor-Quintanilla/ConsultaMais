// Simula o "banco de dados" local
const dbKey = "usuarios";

// CADASTRO
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const user = document.getElementById("registerUser").value.trim();
  const pass = document.getElementById("registerPass").value;

  if (!user || !pass) {
    document.getElementById("registerMsg").innerText = "Preencha todos os campos.";
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem(dbKey)) || [];

  const existente = usuarios.find(u => u.user === user);
  if (existente) {
    document.getElementById("registerMsg").innerText = "Usuário já existe!";
    return;
  }

  usuarios.push({ user, pass });
  localStorage.setItem(dbKey, JSON.stringify(usuarios));

  document.getElementById("registerMsg").innerText = "Cadastro realizado com sucesso!";
  document.getElementById("registerForm").reset();
});

// LOGIN
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;

  const usuarios = JSON.parse(localStorage.getItem(dbKey)) || [];

  const match = usuarios.find(u => u.user === user && u.pass === pass);

  if (match) {
    document.getElementById("loginMsg").innerText = "Login bem-sucedido!";
    // Redirecionar ou desbloquear acesso
    setTimeout(() => {
      window.location.href = "home.html"; 
    }, 1000);
  } else {
    document.getElementById("loginMsg").innerText = "Usuário ou senha incorretos.";
  }
});
