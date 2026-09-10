const express = require('express');
const router = express.Router();
const { professorController } = require('../controllers/ProfessorController');

router.get('/', professorController.getAllProfessores);
router.get('/:id', professorController.getProfessorById);
router.get('/nome/:nome', professorController.getProfessorByName);
router.post('/', professorController.createProfessor);

module.exports = router;
