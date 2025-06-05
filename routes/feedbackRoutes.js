
const express = require('express');
const router = express.Router();
const {
  listarFeedbacks,
  criarFeedback,
  buscarFeedbackPorId,
  atualizarFeedback,
  deletarFeedback
} = require('../controllers/feedbackController');

// Rotas REST para Feedbacks
router.get('/', listarFeedbacks);            // GET /api/feedbacks
router.post('/', criarFeedback);            // POST /api/feedbacks
router.get('/:id', buscarFeedbackPorId);    // GET /api/feedbacks/:id
router.put('/:id', atualizarFeedback);      // PUT /api/feedbacks/:id
router.delete('/:id', deletarFeedback);     // DELETE /api/feedbacks/:id

module.exports = router;
