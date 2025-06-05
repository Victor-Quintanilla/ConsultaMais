// scripts/feedbacks.js

const API_FEEDBACKS = 'http://localhost:3000/api/feedbacks';
const API_EVENTOS = 'http://localhost:3000/api/eventos';

const form = document.getElementById('formFeedback');
const lista = document.getElementById('listaFeedbacks');
const selectEventos = document.getElementById('eventoId');

// Carrega os eventos disponíveis para seleção no formulário
async function carregarEventosParaSelect() {
  try {
    const resposta = await fetch(API_EVENTOS);
    const eventos = await resposta.json();

    eventos.forEach(evento => {
      const option = document.createElement('option');
      option.value = evento.id;
      option.textContent = evento.titulo;
      selectEventos.appendChild(option);
    });

  } catch (erro) {
    console.error('Erro ao carregar eventos:', erro);
  }
}

// Carrega feedbacks do backend
async function carregarFeedbacks() {
  try {
    const resposta = await fetch(API_FEEDBACKS);
    const feedbacks = await resposta.json();

    lista.innerHTML = ''; // limpa a lista

    feedbacks.forEach(fb => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${fb.participante}</strong> (${fb.sentimento})<br/>
        Evento: ${fb.evento?.titulo || 'Não encontrado'}<br/>
        "${fb.comentario}"<br/>
        <small>Data: ${fb.dataEnvio}</small><br/>
        <button onclick="deletarFeedback(${fb.id})">Excluir</button>
      `;
      lista.appendChild(li);
    });

  } catch (erro) {
    console.error('Erro ao carregar feedbacks:', erro);
  }
}

// Cadastra novo feedback
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const feedback = {
    participante: document.getElementById('participante').value,
    comentario: document.getElementById('comentario').value,
    sentimento: document.getElementById('sentimento').value,
    eventoId: parseInt(document.getElementById('eventoId').value),
    dataEnvio: new Date().toISOString().split('T')[0]
  };

  try {
    const resposta = await fetch(API_FEEDBACKS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback)
    });

    if (resposta.ok) {
      form.reset();
      carregarFeedbacks();
    } else {
      alert('Erro ao enviar feedback.');
    }

  } catch (erro) {
    console.error('Erro ao criar feedback:', erro);
  }
});

// Deleta um feedback
async function deletarFeedback(id) {
  const confirmar = confirm('Deseja excluir este feedback?');
  if (!confirmar) return;

  try {
    const resposta = await fetch(`${API_FEEDBACKS}/${id}`, {
      method: 'DELETE'
    });

    if (resposta.ok) {
      carregarFeedbacks();
    } else {
      alert('Erro ao excluir feedback.');
    }

  } catch (erro) {
    console.error('Erro ao excluir feedback:', erro);
  }
}

// Inicialização
carregarEventosParaSelect();
carregarFeedbacks();
