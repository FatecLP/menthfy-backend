class Usuario {
    constructor({ id, nome, email, tipoUsuario }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.tipoUsuario = tipoUsuario;
    }
}

module.exports = Usuario;
