// server.js (em Back/teste-gestao)
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o banco
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456', // ajuste conforme sua senha
  database: 'gestao'
});

// LOGIN
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  const query = 'SELECT * FROM login WHERE usuario = ? AND senha = ?';
  db.query(query, [usuario, senha], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor' });
    if (result.length > 0) {
      res.status(200).json({ message: 'Login válido', dados: result[0] });
    } else {
      res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }
  });
});

// GET PROFESSORES
app.get('/professores', (req, res) => {
  db.query('SELECT * FROM professor', (err, results) => {
    if (err) {
      console.error('Erro no GET /professores:', err);
      return res.status(500).json({ message: 'Erro interno' });
    }
    res.json(results);
  });
});

// POST PROFESSOR
app.post('/professores', (req, res) => {
  const { nomeProfessor, emailProfessor } = req.body;
  const query = 'INSERT INTO professor (nomeProfessor, emailProfessor) VALUES (?, ?)';
  db.query(query, [nomeProfessor, emailProfessor], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar professor:', err);
      return res.status(500).json({ message: 'Erro ao adicionar professor' });
    }
    res.status(201).json({ message: 'Professor adicionado com sucesso' });
  });
});

// GET AULAS (corrigido para retornar o ID da aula)
app.get('/aulas/:idProfessor', (req, res) => {
  const { idProfessor } = req.params;

  const query = `
    SELECT h.id, h.dia, h.data, t.idTurma, h.materia, h.horario, h.idProfessor
    FROM horarios h
    JOIN turma t ON h.idTurma = t.idTurma
    WHERE h.idProfessor = ?
  `;

  db.query(query, [idProfessor], (err, results) => {
    if (err) {
      console.error('Erro ao buscar aulas:', err);
      return res.status(500).json({ message: 'Erro ao buscar horários' });
    }
    res.json(results);
  });
});

// POST AULA
app.post('/aulas', (req, res) => {
  const { dia, data, idTurma, materia, idProfessor, horario } = req.body;
  const query = `
    INSERT INTO horarios (dia, data, idTurma, materia, idProfessor, horario)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [dia, data, idTurma, materia, idProfessor, horario], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar aula:', err);
      return res.status(500).json({ message: 'Erro ao adicionar aula' });
    }
    res.status(201).json({ message: 'Aula adicionada com sucesso' });
  });
});

// PUT AULA
app.put('/aulas/:id', (req, res) => {
  const { id } = req.params;
  const { dia, data, idTurma, materia, idProfessor, horario } = req.body;

  const query = `
    UPDATE horarios
    SET dia = ?, data = ?, idTurma = ?, materia = ?, idProfessor = ?, horario = ?
    WHERE id = ?
  `;
  db.query(query, [dia, data, idTurma, materia, idProfessor, horario, id], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao atualizar aula' });
    res.status(200).json({ message: 'Aula atualizada com sucesso' });
  });
});

// DELETE AULA
app.delete('/aulas/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM horarios WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao excluir aula' });
    res.status(200).json({ message: 'Aula excluída com sucesso' });
  });
});

// Teste de conexão
app.get('/', (req, res) => {
  res.send('API OK!');
});

// Inicializa o servidor
app.listen(3000, () => {
  console.log('rodando na porta 3000');
});
