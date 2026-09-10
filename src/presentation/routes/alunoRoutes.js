const express = require('express');
const router = express.Router();
const { alunoController } = require('../controllers/AlunoController');

router.get('/', alunoController.getAllAlunos);
router.get('/:id', alunoController.getAlunoById);
router.post('/', alunoController.createAluno);

module.exports = router;
