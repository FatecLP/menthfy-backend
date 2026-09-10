const db = require('../database/db');
const AlunoRepository = require('../../domain/repositories/AlunoRepository');
const Aluno = require('../../domain/models/Aluno');

class MySqlAlunoRepository extends AlunoRepository {
    async getAll() {
        const [alunos] = await db.query('SELECT id, nome, email FROM alunos');
        return alunos.map((row) => new Aluno(row));
    }

    async getById(id) {
        const [alunos] = await db.query('SELECT id, nome, email FROM alunos WHERE id = ?', [id]);
        if (alunos.length === 0) return null;
        return new Aluno(alunos[0]);
    }

    async findByEmail(email) {
        const [alunos] = await db.query('SELECT * FROM alunos WHERE email = ?', [email]);
        if (alunos.length === 0) return null;
        return new Aluno(alunos[0]);
    }

    async create(alunoData) {
        const { nome, email, senha } = alunoData;
        const [result] = await db.query(
            'INSERT INTO alunos (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha]
        );

        return new Aluno({
            id: result.insertId,
            nome,
            email,
        });
    }
}

module.exports = MySqlAlunoRepository;
