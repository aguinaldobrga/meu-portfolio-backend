const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// --- Middlewares ---
app.use(express.json());

// A sua API só vai funcionar se a rota e o CORS estiverem no lugar certo
app.use(cors({
  origin: ['http://localhost:5173', 'https://meu-portfolio-sigma-two.vercel.app']
}));

// Servir arquivos estáticos (imagens, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// --- ROTAS DA API ---

// Importe os dados dos projetos e defina a rota aqui
const projectsData = require('./projects.json');

// A rota deve ser '/projects', sem o '/api'
app.get('/projects', (req, res) => {
  res.json(projectsData);
});

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Rota para o envio do formulário
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Nova mensagem de contato de: ${name}`,
    text: `
    Nome: ${name}
    Email: ${email}
    Mensagem: ${message} `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .send({ success: false, message: 'Erro ao enviar a mensagem.' });
    }
    res
      .status(200)
      .send({ success: true, message: 'Mensagem enviada com sucesso!' });
  });
});

// --- INICIALIZAÇÃO DO SERVIDOR ---

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});