const express = require('express');
const router = express.Router();
const { gerarRelatorio } = require('../controllers/relatorioController');

router.post('/gerar', gerarRelatorio);

module.exports = router;