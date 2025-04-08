CREATE DATABASE gestao;
USE gestao;

CREATE TABLE coordenador (
    idCoordenador INT AUTO_INCREMENT PRIMARY KEY,
    nomeCoordenador VARCHAR(100) NOT NULL,
    emailCoordenador VARCHAR(100) NOT NULL
);

INSERT INTO coordenador (nomeCoordenador, emailCoordenador) VALUES 
('Jailson Rodrigues', 'jailson.rodrigues@ba.estudante.senai.br');


CREATE TABLE professor (
    idProfessor INT AUTO_INCREMENT PRIMARY KEY,
    nomeProfessor VARCHAR(100) NOT NULL,
    emailProfessor VARCHAR(100) NOT NULL
);

INSERT INTO professor (nomeProfessor, emailProfessor) VALUES 
('Celso Barreto', 'celso.barreto@ba.estudante.senai.br'),
('Witã Silva', 'wita.silva@ba.estudante.senai.br');


CREATE TABLE turma (
    idTurma INT AUTO_INCREMENT PRIMARY KEY,
    curso VARCHAR(100) NOT NULL,
    periodo VARCHAR(100) NOT NULL
);

INSERT INTO turma (curso, periodo) VALUES 
('ADS', 'Noturno'),
('ADS', 'Vespertino'),
('REDES', 'Noturno');

CREATE TABLE login (
    idLogin INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(20) UNIQUE NOT NULL,
    senha VARCHAR(20) NOT NULL,
    nivelAcesso ENUM('coordenador', 'professor') NOT NULL,
    idProfessor INT,
    idCoordenador INT,
    FOREIGN KEY (idProfessor) REFERENCES professor(idProfessor),
    FOREIGN KEY (idCoordenador) REFERENCES coordenador(idCoordenador)
);

INSERT INTO login (usuario, senha, nivelAcesso, idProfessor, idCoordenador) VALUES 
('celsoBarreto', '12345', 'professor', 1, NULL),
('jailsonRodrigues', '12345', 'coordenador', NULL, 1);

CREATE TABLE horarios (
    idHorario INT AUTO_INCREMENT PRIMARY KEY,
    dia VARCHAR(20) NOT NULL,
    data VARCHAR(20) NOT NULL,
    idTurma INT NOT NULL,
    materia VARCHAR(100) NOT NULL,
    idProfessor INT NOT NULL,
    horario VARCHAR(50) NOT NULL,
    FOREIGN KEY (idTurma) REFERENCES turma(idTurma),
    FOREIGN KEY (idProfessor) REFERENCES professor(idProfessor)
);

INSERT INTO horarios (dia, data, idTurma, materia, idProfessor, horario) VALUES
('Segunda', '07/04', 1, 'Desenvolvimento de Software', 1, '16:00 - 18:15'),
('Segunda', '07/04', 1, 'Banco de Dados', 1, '18:30 - 21:30');
