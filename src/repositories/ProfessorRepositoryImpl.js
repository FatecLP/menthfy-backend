const db = require('../config/db');
const ProfessorRepository = require('./ProfessorRepository');

class ProfessorRepositoryImpl extends ProfessorRepository {
    async getAllProfessors(filters = {}) {
        let query = `
            SELECT 
                p.id,
                p.nome,
                p.disciplina_principal,
                p.descricao,
                p.quantidade_alunos,
                p.tempo_resposta_minutos,
                p.preco_hora,
                p.foto_url,
                p.email,
                COALESCE(ROUND(AVG(a.nota), 1), p.media_avaliacao) as media_avaliacao,
                COUNT(a.id) as total_avaliacoes
            FROM professores p
            LEFT JOIN avaliacoes a ON p.id = a.professor_id
        `;

        const conditions = [];
        const params = [];

        const havingConditions = [];
        const havingParams = [];

        if (filters.busca) {
            conditions.push(
                `(p.nome LIKE ? OR p.disciplina_principal LIKE ?)`
            );

            params.push(
                `%${filters.busca}%`,
                `%${filters.busca}%`
            );
        }

        if (filters.disciplina) {
            conditions.push(`p.disciplina_principal = ?`);
            params.push(filters.disciplina);
        }

        if (filters.precoMin !== undefined && filters.precoMin !== null) {
            conditions.push(`p.preco_hora >= ?`);
            params.push(filters.precoMin);
        }

        if (filters.precoMax !== undefined && filters.precoMax !== null) {
            conditions.push(`p.preco_hora <= ?`);
            params.push(filters.precoMax);
        }

        if (
            filters.tempoRespostaMax !== undefined &&
            filters.tempoRespostaMax !== null
        ) {
            conditions.push(`p.tempo_resposta_minutos <= ?`);
            params.push(filters.tempoRespostaMax);
        }

        if (
            filters.avaliacaoMin !== undefined &&
            filters.avaliacaoMin !== null
        ) {
            havingConditions.push(
                `COALESCE(ROUND(AVG(a.nota), 1), p.media_avaliacao) >= ?`
            );

            havingParams.push(filters.avaliacaoMin);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += `
            GROUP BY 
                p.id,
                p.nome,
                p.disciplina_principal,
                p.descricao,
                p.quantidade_alunos,
                p.tempo_resposta_minutos,
                p.preco_hora,
                p.foto_url,
                p.email,
                p.media_avaliacao
        `;

        if (havingConditions.length > 0) {
            query += ` HAVING ${havingConditions.join(' AND ')}`;
        }

        const allowedSortFields = {
            avaliacao: 'media_avaliacao',
            preco: 'p.preco_hora',
            tempoResposta: 'p.tempo_resposta_minutos',
            nome: 'p.nome'
        };

        const sortField =
            allowedSortFields[filters.ordenar] || 'media_avaliacao';

        const sortOrder =
            filters.ordem &&
            filters.ordem.toLowerCase() === 'asc'
                ? 'ASC'
                : 'DESC';

        query += ` ORDER BY ${sortField} ${sortOrder}`;

        const [professores] = await db.query(
            query,
            [...params, ...havingParams]
        );

        return professores;
    }

    async getById(id) {
        const [professores] = await db.query(
            'SELECT * FROM professores WHERE id = ?',
            [id]
        );

        if (professores.length === 0) {
            return null;
        }

        const professor = professores[0];

        const [avaliacoes] = await db.query(`
            SELECT 
                a.*, 
                al.nome as aluno_nome 
            FROM avaliacoes a 
            JOIN alunos al ON a.aluno_id = al.id 
            WHERE a.professor_id = ?
            ORDER BY a.data_avaliacao DESC
        `, [id]);

        professor.avaliacoes = avaliacoes;

        if (avaliacoes.length > 0) {
            const soma = avaliacoes.reduce(
                (acc, curr) => acc + Number(curr.nota),
                0
            );

            professor.media_avaliacao = Number(
                (soma / avaliacoes.length).toFixed(1)
            );
        }

        return professor;
    }

    async getByName(nome) {
        const [professores] = await db.query(
            'SELECT * FROM professores WHERE nome = ?',
            [nome]
        );

        if (professores.length === 0) {
            return null;
        }

        const professor = professores[0];

        const [avaliacoes] = await db.query(`
            SELECT 
                a.*, 
                al.nome as aluno_nome 
            FROM avaliacoes a 
            JOIN alunos al ON a.aluno_id = al.id 
            WHERE a.professor_id = ?
            ORDER BY a.data_avaliacao DESC
        `, [professor.id]);

        professor.avaliacoes = avaliacoes;

        if (avaliacoes.length > 0) {
            const soma = avaliacoes.reduce(
                (acc, curr) => acc + Number(curr.nota),
                0
            );

            professor.media_avaliacao = Number(
                (soma / avaliacoes.length).toFixed(1)
            );
        }

        return professor;
    }

    async create(professorData) {
        const {
            nome,
            email,
            senha,
            disciplina_principal = 'Geral',
            descricao = '',
            preco_hora = 50.00,
            foto_url = '/public/assets/images/default.webp'
        } = professorData;

        const [result] = await db.query(
            `
            INSERT INTO professores
            (
                nome,
                email,
                senha,
                disciplina_principal,
                descricao,
                preco_hora,
                foto_url
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                nome,
                email,
                senha,
                disciplina_principal,
                descricao,
                preco_hora,
                foto_url
            ]
        );

        return {
            id: result.insertId,
            nome,
            email,
            foto_url
        };
    }
}

module.exports = ProfessorRepositoryImpl;