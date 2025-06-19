// scripts/eventos.js

const API_URL = 'http://localhost:3000/api/eventos';
const form = document.getElementById('formEvento');
const lista = document.getElementById('listaEventos');

let eventoEmEdicaoId = null;

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
        <button onclick="editarEvento(${evento.id})">Editar</button> 
        <button onclick="deletarEvento(${evento.id})">Excluir</button>
      `;
      lista.appendChild(li);
    });

  } catch (erro) {
    console.error('Erro ao carregar eventos:', erro);
  }
}

// Função para editar um evento
async function editarEvento(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}`);
    const evento = await resposta.json();

    if (resposta.ok) {
      // Preenche os campos do formulário
      document.getElementById('titulo').value = evento.titulo;
      document.getElementById('tipo').value = evento.tipo;
      document.getElementById('data').value = evento.data;
      document.getElementById('descricao').value = evento.descricao;
      document.getElementById('responsavel').value = evento.responsavel;

      // Armazena o ID do evento para saber que estamos em modo de edição
      eventoEmEdicaoId = evento.id;

      // Altera o texto do botão para indicar "Atualizar"
      document.querySelector('#formEvento button[type="submit"]').textContent = 'Atualizar Evento';
    } else {
      alert('Erro ao carregar evento para edição.');
    }
  } catch (erro) {
    console.error('Erro ao carregar evento para edição:', erro);
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

  let resposta;
  if (eventoEmEdicaoId) {
    // Se eventoEmEdicaoId existe, é uma atualização (PUT)
    resposta = await fetch(`${API_URL}/${eventoEmEdicaoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evento)
    });
  } else {
    // Caso contrário, é uma criação (POST)
    resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evento)
    });
  }

  if (resposta.ok) {
    form.reset();
    eventoEmEdicaoId = null;
    document.querySelector('#formEvento button[type="submit"]').textContent = 'Salvar Evento';
    carregarEventos();
  } else {
    alert(`Erro ao ${eventoEmEdicaoId ? 'atualizar' : 'salvar'} evento.`); // LINHA ALTERADA: Mensagem dinâmica
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
