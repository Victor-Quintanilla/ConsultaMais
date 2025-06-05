// scripts/login.js

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
  
    try {
      const resposta = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });
  
      const dados = await resposta.json();
  
      if (resposta.ok) {
        // Login bem-sucedido
        alert('Login realizado com sucesso!');
        window.location.href = 'eventos.html'; // redireciona para a tela principal
      } else {
        // Falha no login
        document.getElementById('mensagemErro').textContent = dados.erro || 'Falha no login.';
      }
  
    } catch (erro) {
      console.error('Erro ao tentar login:', erro);
      document.getElementById('mensagemErro').textContent = 'Erro de conexão com o servidor.';
    }
  });
  