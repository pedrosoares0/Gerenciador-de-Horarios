let mapaProfessores = {};
function logar() {
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
  
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Login inválido');
        }
        return res.json();
      })
      .then(data => {
        alert(`Bem-vindo, ${data.dados.usuario}!`);
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('home-page').style.display = 'block';
        carregarProfessores(true);
      })
      .catch(err => {
        alert('Usuário ou senha inválidos!');
      });
  }
  

function abrirCadastro() {
  document.getElementById('home-page').style.display = 'none';
  document.getElementById('add-professor-page').style.display = 'block';
}

function abrirCadastroAula() {
  document.getElementById('home-page').style.display = 'none';
  document.getElementById('add-aula-page').style.display = 'block';
  carregarProfessoresParaAula();
}

function voltarHome() {
  document.getElementById('add-professor-page').style.display = 'none';
  document.getElementById('add-aula-page').style.display = 'none';
  document.getElementById('home-page').style.display = 'block';
  carregarProfessores(true);
}

function voltarLogin() {
  document.getElementById('home-page').style.display = 'none';
  document.getElementById('login-page').style.display = 'block';
}

function carregarProfessores(atualizar = false) {
  fetch('http://localhost:3000/professores')
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('selectProfessor');
      select.innerHTML = '';
      mapaProfessores = {};

      data.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof.idProfessor;
        option.textContent = prof.nomeProfessor;
        select.appendChild(option);
        mapaProfessores[prof.idProfessor] = prof.nomeProfessor;
      });

      if (atualizar) atualizarTabela();
    });
}

function carregarProfessoresParaAula() {
  fetch('http://localhost:3000/professores')
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('idProfessorSelect');
      select.innerHTML = '';
      data.forEach(prof => {
        const option = document.createElement('option');
        option.value = prof.idProfessor;
        option.textContent = prof.nomeProfessor;
        select.appendChild(option);
      });
    });
}

let aulasAtual = [];

function atualizarTabela() {
  const select = document.getElementById('selectProfessor');
  const idProfessor = select.value;
  if (!idProfessor) return;

  fetch(`http://localhost:3000/aulas/${idProfessor}`)
    .then(res => res.json())
    .then(dados => {
      aulasAtual = dados;
      const tbody = document.querySelector('.tabela tbody');
      tbody.innerHTML = '';

      dados.forEach((aula, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${aula.dia}</td>
          <td>${aula.data}</td>
          <td>${aula.idTurma}</td>
          <td>${aula.materia}</td>
          <td>${aula.horario}</td>
          <td>
            <button onclick="editarAula(${index})">✏️</button>
            <button onclick="excluirAula(${aula.id})">🗑️</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
}


function adicionarProfessor() {
  const nome = document.getElementById('nomeProfessor').value;
  const email = document.getElementById('emailProfessor').value;

  fetch('http://localhost:3000/professores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nomeProfessor: nome, emailProfessor: email })
  })
    .then(res => {
      if (res.ok) {
        alert('Professor adicionado!');
        voltarHome();
      } else {
        alert('Erro ao adicionar professor');
      }
    });
}

function adicionarAula() {
  const data = {
    materia: document.getElementById('materia').value,
    dia: document.getElementById('dia').value,
    data: document.getElementById('data').value,
    horario: document.getElementById('horario').value,
    idTurma: document.getElementById('idTurma').value,
    idProfessor: document.getElementById('idProfessorSelect').value
  };

  fetch('http://localhost:3000/aulas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => {
    if (res.ok) {
      alert('Aula adicionada!');
      voltarHome();
    } else {
      alert('Erro ao adicionar aula.');
    }
  });
}

// Ao carregar a página, só preenche os selects
document.addEventListener('DOMContentLoaded', () => carregarProfessores(false));

function excluirAula(id) {
    if (confirm('Deseja realmente excluir esta aula?')) {
      fetch(`http://localhost:3000/aulas/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          atualizarTabela();
        });
    }
  }
  
  function editarAula(index) {
    const aula = aulasAtual[index];
    abrirCadastroAula();
    document.getElementById('materia').value = aula.materia;
    document.getElementById('dia').value = aula.dia;
    document.getElementById('data').value = aula.data;
    document.getElementById('horario').value = aula.horario;
    document.getElementById('idTurma').value = aula.idTurma;
    document.getElementById('idProfessorSelect').value = aula.idProfessor;
  
    const botao = document.querySelector('#add-aula-page button[onclick="adicionarAula()"]');
    botao.textContent = 'Atualizar Aula';
    botao.setAttribute('onclick', `atualizarAula(${aula.id})`);
  }
  
  function atualizarAula(id) {
    const data = {
      materia: document.getElementById('materia').value,
      dia: document.getElementById('dia').value,
      data: document.getElementById('data').value,
      horario: document.getElementById('horario').value,
      idTurma: document.getElementById('idTurma').value,
      idProfessor: document.getElementById('idProfessorSelect').value
    };
  
    fetch(`http://localhost:3000/aulas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => {
      if (res.ok) {
        alert('Aula atualizada com sucesso!');
        restaurarFormularioCadastro();
        voltarHome();
      } else {
        alert('Erro ao atualizar aula.');
      }
    });
  }
  
  function restaurarFormularioCadastro() {
    const botao = document.querySelector('#add-aula-page button[onclick^="atualizarAula"]');
    if (botao) {
      botao.textContent = 'Salvar Aula';
      botao.setAttribute('onclick', 'adicionarAula()');
    }
  }
  