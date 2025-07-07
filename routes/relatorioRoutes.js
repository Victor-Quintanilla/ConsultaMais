const express = require('express');
const router = express.Router();
const { gerarRelatorio, listarRelatorios, deletarRelatorio, buscarRelatorioPorId } = require('../controllers/relatorioController');

router.post('/gerar', gerarRelatorio);
router.get('/', listarRelatorios);
router.delete('/:id', deletarRelatorio); 
router.get('/:id', buscarRelatorioPorId);

module.exports = router;