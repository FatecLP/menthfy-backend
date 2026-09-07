const express = require('express');
const router = express.Router();
const {
    getAllProfessores,
    getProfessorById,
    getProfessorByName,
    createProfessor
} = require('../controllers/professorController');

router.get('/', getAllProfessores);
router.get('/:id', getProfessorById);
router.get('/nome/:nome', getProfessorByName);
router.post('/', createProfessor);

module.exports = router;
