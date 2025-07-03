require('dotenv').config()

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
const eventoRoutes = require('./routes/eventoRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const authRoutes = require('./routes/authRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');

// Usar rotas
app.use('/api/eventos', eventoRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Rota base
app.get('/', (req, res) => {
  res.send('API do Consulta+ está no ar!');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
