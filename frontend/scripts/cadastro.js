// scripts/cadastro.js

document.getElementById('formCadastro').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
  
    try {
      const resposta = await fetch('http://localhost:3000/api/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });
  
      const dados = await resposta.json();
  
      if (resposta.ok) {
        alert('Usuário cadastrado com sucesso!');
        window.location.href = 'index.html';
      } else {
        document.getElementById('mensagemErro').textContent = dados.erro || 'Erro no cadastro.';
      }
  
    } catch (erro) {
      console.error('Erro ao tentar cadastrar:', erro);
      document.getElementById('mensagemErro').textContent = 'Erro de conexão com o servidor.';
    }
  });
  