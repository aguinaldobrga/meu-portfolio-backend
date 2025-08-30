const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

// O objeto 'app' precisa ser criado primeiro
const app = express();
const port = 3001;
const path = require("path");
// Middleware para processar JSON e habilitar CORS
app.use(express.json());

// AQUI ESTÁ A MUDANÇA
app.use(express.static(path.join(__dirname, 'public')));
// Adicione a URL do seu front-end para que o back-end aceite as requisições
app.use(
  cors({
    origin: ["https://meu-portfolio-sigma-two.vercel.app"], // <-- SUBSTITUA PELA SUA URL REAL
  })
);

// --- ROTAS DA API ---

// Importe os dados dos projetos e defina a rota aqui
const projectsData = require("./projects.json");

app.get("/api/projects", (req, res) => {
  res.json(projectsData);
});

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Rota para o envio do formulário
app.post("/send-email", (req, res) => {
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
        .send({ success: false, message: "Erro ao enviar a mensagem." });
    }
    res
      .status(200)
      .send({ success: true, message: "Mensagem enviada com sucesso!" });
  });
});

// --- INICIALIZAÇÃO DO SERVIDOR ---

app.listen(process.env.PORT || port, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || port}`);
});