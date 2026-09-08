require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// rotas da camada de apresentação
const professorRoutes = require('./src/presentation/routes/professorRoutes');
const alunoRoutes = require('./src/presentation/routes/alunoRoutes');
const authRoutes = require('./src/presentation/routes/authRoutes');
const mentorshipRoutes = require('./src/presentation/routes/mentorshipRoutes');

app.use('/api/professores', professorRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/usuarios', authRoutes);
app.use('/api/mentorships', mentorshipRoutes);

module.exports = app;
