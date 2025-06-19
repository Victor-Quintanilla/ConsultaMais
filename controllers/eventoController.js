const prisma = require('../prisma/client');


// GET /api/eventos
async function listarEventos(req, res) {
  try {
    const eventos = await prisma.evento.findMany({
      include: { feedbacks: true }
    });
    res.json(eventos);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ erro: 'Erro ao buscar eventos.' });
  }
}

// GET /api/eventos/:id
async function buscarEventoPorId(req, res) {
  const id = parseInt(req.params.id);
  try {
    const evento = await prisma.evento.findUnique({
      where: { id },
      include: { feedbacks: true }
    });
    if (!evento) return res.status(404).json({ erro: 'Evento não encontrado.' });
    res.json(evento);
  } catch (error) {
    console.error('Erro ao buscar evento por ID:', error);
    res.status(500).json({ erro: 'Erro ao buscar evento.' });
  }
}

// POST /api/eventos
async function criarEvento(req, res) {
  const { titulo, tipo, data, descricao, responsavel } = req.body;
  try {
    const novoEvento = await prisma.evento.create({
      data: { titulo, tipo, data, descricao, responsavel }
    });
    res.status(201).json(novoEvento);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ erro: 'Erro ao criar evento.' });
  }
}

// PUT /api/eventos/:id
async function atualizarEvento(req, res) {
  const id = parseInt(req.params.id);
  const { titulo, tipo, data, descricao, responsavel } = req.body;
  try {
    const eventoAtualizado = await prisma.evento.update({
      where: { id },
      data: { titulo, tipo, data, descricao, responsavel }
    });
    res.json(eventoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ erro: 'Erro ao atualizar evento.' });
  }
}

// DELETE /api/eventos/:id
async function deletarEvento(req, res) {
  const id = parseInt(req.params.id);
  try {
    await prisma.evento.delete({ where: { id } });
    res.json({ mensagem: 'Evento deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ erro: 'Erro ao deletar evento.' });
  }
}

module.exports = {
  listarEventos,
  buscarEventoPorId,
  criarEvento,
  atualizarEvento,
  deletarEvento
};
