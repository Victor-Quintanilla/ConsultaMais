// scripts/eventos.js

const API_URL = 'http://localhost:3000/api/eventos';
const form = document.getElementById('formEvento');
const lista = document.getElementById('listaEventos');

// Função para carregar eventos do backend
async function carregarEventos() {
  try {
    const resposta = await fetch(API_URL);
    const eventos = await resposta.json();

    lista.innerHTML = ''; // limpa antes de renderizar

    eventos.forEach(evento => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${evento.titulo}</strong> (${evento.tipo}) - ${evento.data}<br/>
        Responsável: ${evento.responsavel}<br/>
        ${evento.descricao}<br/>
        <button onclick="deletarEvento(${evento.id})">Excluir</button>
      `;
      lista.appendChild(li);
    });

  } catch (erro) {
    console.error('Erro ao carregar eventos:', erro);
  }
}

// Função para criar um novo evento
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const evento = {
    titulo: document.getElementById('titulo').value,
    tipo: document.getElementById('tipo').value,
    data: document.getElementById('data').value,
    descricao: document.getElementById('descricao').value,
    responsavel: document.getElementById('responsavel').value
  };

  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evento)
    });

    if (resposta.ok) {
      form.reset();
      carregarEventos();
    } else {
      alert('Erro ao salvar evento.');
    }

  } catch (erro) {
    console.error('Erro ao criar evento:', erro);
  }
});

// Função para deletar evento
async function deletarEvento(id) {
  const confirmar = confirm('Deseja excluir este evento?');
  if (!confirmar) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (resposta.ok) {
      carregarEventos();
    } else {
      alert('Erro ao excluir evento.');
    }

  } catch (erro) {
    console.error('Erro ao excluir evento:', erro);
  }
}

// Inicialização
carregarEventos();
