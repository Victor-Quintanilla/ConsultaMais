
const express = require('express');
const router = express.Router();
const {
  listarEventos,
  criarEvento,
  buscarEventoPorId,
  atualizarEvento,
  deletarEvento
} = require('../controllers/eventoController');

// Rotas REST para Evento
router.get('/', listarEventos);            // GET /api/eventos
router.post('/', criarEvento);            // POST /api/eventos
router.get('/:id', buscarEventoPorId);    // GET /api/eventos/:id
router.put('/:id', atualizarEvento);      // PUT /api/eventos/:id
router.delete('/:id', deletarEvento);     // DELETE /api/eventos/:id

module.exports = router;
