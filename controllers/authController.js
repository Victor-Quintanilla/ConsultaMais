const prisma = require('../prisma/client');


// POST /api/auth/login
async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.user.findUnique({
      where: { email }
    });

    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    // Login bem-sucedido (sem token ainda)
    res.status(200).json({ mensagem: 'Login realizado com sucesso.' });

  } catch (error) {
    res.status(500).json({ erro: 'Erro no login.' });
  }
}

module.exports = { login, registrar };


async function registrar(req, res) {
  const { email, senha } = req.body;

  try {
    const existente = await prisma.user.findUnique({ where: { email } });
    if (existente) {
      return res.status(400).json({ erro: 'E-mail já cadastrado.' });
    }

    const novoUsuario = await prisma.user.create({
      data: { email, senha }
    });

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  }
}
