const prisma = require('../prisma/client');
// GET /api/feedbacks?filtro=positivo eventoId=2
async function listarFeedbacks(req, res) {
  try {
    const filtro = req.query.filtro || '';
    const { sentimento, eventoId } = interpretarComando(filtro);

    const feedbacks = await prisma.feedback.findMany({
      where: {
        ...(sentimento && { sentimento }),
        ...(eventoId && { eventoId })
      },
      include: { evento: true }
    });

    res.json(feedbacks);
  } catch (error) {
    console.error('Erro no listarFeedbacks:', error);
    res.status(500).json({ erro: 'Erro ao buscar feedbacks.' });
  }
}

// GET /api/feedbacks/:id
async function buscarFeedbackPorId(req, res) {
  const id = parseInt(req.params.id);
  try {
    const feedback = await prisma.feedback.findUnique({
      where: { id },
      include: { evento: true }
    });
    if (!feedback) return res.status(404).json({ erro: 'Feedback não encontrado.' });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar feedback.' });
  }
}

// POST /api/feedbacks
async function criarFeedback(req, res) {
  const { participante, comentario, sentimento, dataEnvio, eventoId } = req.body;
  try {
    const novoFeedback = await prisma.feedback.create({
      data: { participante, comentario, sentimento, dataEnvio, eventoId }
    });
    res.status(201).json(novoFeedback);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar feedback.' });
  }
}

// PUT /api/feedbacks/:id
async function atualizarFeedback(req, res) {
  const id = parseInt(req.params.id);
  const { participante, comentario, sentimento, dataEnvio, eventoId } = req.body;
  try {
    const feedbackAtualizado = await prisma.feedback.update({
      where: { id },
      data: { participante, comentario, sentimento, dataEnvio, eventoId }
    });
    res.json(feedbackAtualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar feedback.' });
  }
}

// DELETE /api/feedbacks/:id
async function deletarFeedback(req, res) {
  const id = parseInt(req.params.id);
  try {
    await prisma.feedback.delete({ where: { id } });
    res.json({ mensagem: 'Feedback deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar feedback.' });
  }
}

module.exports = {
  listarFeedbacks,
  buscarFeedbackPorId,
  criarFeedback,
  atualizarFeedback,
  deletarFeedback
};
