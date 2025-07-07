const prisma = require('../prisma/client');
const axios = require('axios');

const IA_API_URL = 'http://127.0.0.1:5000/generate-report';

async function listarRelatorios(req, res) {
  try {
    const relatorios = await prisma.relatorio.findMany({
      include: { evento: { select: { titulo: true } } } // Inclui o título do evento 
    });
    res.json(relatorios);
  } catch (error) {
    console.error('Erro ao listar relatórios:', error);
    res.status(500).json({ erro: 'Erro ao buscar relatórios.' });
  }
}

async function buscarRelatorioPorId(req, res) {
    const id = parseInt(req.params.id); // Pega o ID da URL
    try {
        const relatorio = await prisma.relatorio.findUnique({
            where: { id }, // Busca pelo ID
            include: { evento: { select: { titulo: true } } } // Inclui o título do evento
        });
        if (!relatorio) {
            return res.status(404).json({ erro: 'Relatório não encontrado.' });
        }
        res.json(relatorio); // Retorna o relatório encontrado
    } catch (error) {
        console.error('Erro ao buscar relatório por ID:', error);
        res.status(500).json({ erro: 'Erro ao buscar relatório.' });
    }
}


async function deletarRelatorio(req, res) {
    const id = parseInt(req.params.id);
    try {
        await prisma.relatorio.delete({ where: { id } });
        res.json({ mensagem: 'Relatório deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar relatório:', error);
        res.status(500).json({ erro: 'Erro ao deletar relatório.' });
    }
}


async function gerarRelatorio(req, res) {
  const { eventoId } = req.body;

  if (!eventoId) {
    return res.status(400).json({ erro: 'ID do evento é obrigatório para gerar o relatório.' });
  }

  try {
    const feedbacksDoEvento = await prisma.feedback.findMany({
      where: { eventoId: parseInt(eventoId) },
      select: {
        participante: true,
        comentario: true,
        sentimento: true
      }
    });

    if (feedbacksDoEvento.length === 0) {
      return res.status(404).json({ erro: 'Nenhum feedback encontrado para este evento.' });
    }

    const evento = await prisma.evento.findUnique({
      where: { id: parseInt(eventoId) },
      select: { titulo: true }
    });

    if (!evento) {
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }

    const iaResponse = await axios.post(IA_API_URL, {
      feedbacks: feedbacksDoEvento,
      event_title: evento.titulo
    });

    const reportContent = iaResponse.data.report;

    const novoRelatorio = await prisma.relatorio.create({
      data: {
        titulo: `Relatório de Feedback - ${evento.titulo}`,
        conteudo: reportContent,
        eventoId: parseInt(eventoId)
      }
    });

    res.status(201).json({
      mensagem: 'Relatório gerado e salvo com sucesso.',
      relatorio: novoRelatorio
    });

  } catch (error) {
    console.error('Erro ao gerar relatório:', error.message);
    if (error.response) {
      console.error('Erro da API de IA (status):', error.response.status);
      console.error('Erro da API de IA (dados):', error.response.data);
    }
    res.status(500).json({ erro: 'Erro ao gerar ou salvar o relatório.' });
  }
}

module.exports = {
  gerarRelatorio,
  listarRelatorios,
  deletarRelatorio,
  buscarRelatorioPorId
};