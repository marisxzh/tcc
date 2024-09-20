const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3001;

//criando a conexão com o banco
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aapm'
});

//conectando com o banco
db.connect((error) => {
  if (error) {
    console.error('Erro ao conectar ao MySQL:', error)
  } else {
    console.log("Conectado ao MySQL")
  }
});

// CONFIGURA A SESSÃO DO USUÁRIO
app.use(session({
  secret: 'aapm', // CHAVE SECRETA PARA ASSINAR A SESSÃO
  resave: false, // NÃO REGRAVA A SESSÃO SE NÃO HOUVER MUDANÇAS
  saveUninitialized: true // SALVA UMA NOVA SESSÃO MESMO SE NÃO MODIFICADA
}));

app.use((req, res, next) => {
  res.locals.nome = req.session.nome || 'Usuário'; // Substitua 'Usuário' por um valor padrão ou deixe em branco
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Outras configurações e rotas

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});


app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'));
app.use(express.static('src'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// LOGIN
app.get(['/'], (req, res) => {
  res.render('login.ejs');
});

// ROTA DE SAÍDA
app.get('/sair', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Erro ao destruir a sessão:', err);
          res.status(500).send('Erro interno do servidor');
      } else {
          res.redirect('/');
      }
  });
});

// ROTA PARA EXIBIR A PÁGINA INICIAL
app.get('/pagInicial', (req, res) => {
  if (!req.session.cod_usuario) {
      return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
  }
  res.render('pagInicial');
});

// ROTA PARA EXIBIR A PÁGINA INICIAL ADMINISTRADOR
app.get('/pagInicialAdm', (req, res) => {
  if (!req.session.cod_usuario) {
      return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
  }
  res.render('pagInicialAdm'); // Renderiza a página inicial do administrador
});


app.post("/login", (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  db.query('SELECT cod_usuario, nome, senha, cod_cargo FROM usuario WHERE email = ?', [email], (error, results) => {
      if (error) {
          console.error('Erro ao consultar o banco de dados:', error);
          return res.render('login', { errorMessage: 'Erro ao consultar o banco de dados.' });
      }

      if (results.length > 0) {
          const senhaBD = results[0].senha;
          const cod_usuario = results[0].cod_usuario; // PEGA O cod_usuario DO BANCO
          const nome = results[0].nome; // PEGA O NOME DO USUÁRIO
          const cod_cargo = results[0].cod_cargo; // PEGA O CARGO DO USUÁRIO

          // COMPARA A SENHA DO BANCO COM A ENVIADA PELO USUÁRIO
          if (senhaBD === senha) {
              // ARMAZENA O cod_usuario E O NOME NA SESSÃO
              req.session.cod_usuario = cod_usuario;
              req.session.nome = nome;

              console.log('Senha correta!');

              // REDIRECIONA PARA A PÁGINA DE ALUNO OU ADMINISTRADOR BASEADO NO cod_cargo
              if (cod_cargo === 1) { // SE O CARGO FOR ALUNO (EX: cod_cargo = 1)
                  res.redirect('pagInicial'); // REDIRECIONA PARA A PÁGINA DO ALUNO
              } else if (cod_cargo === 2) { // SE O CARGO FOR ADMINISTRADOR (EX: cod_cargo = 2)
                  res.redirect('pagInicialAdm'); // REDIRECIONA PARA A PÁGINA DO ADMINISTRADOR
              } else {
                  res.render('login', { errorMessage: 'Tipo de usuário inválido!' });
              }
          } else {
              console.log('Senha incorreta!');
              res.render('login', { errorMessage: 'Email ou senha incorretos!' });
          }
      } else {
          console.log('Email não cadastrado!');
          res.render('login', { errorMessage: 'Email ou senha incorretos!' });
      }
  });
});

// LEVAR PARA AS PÁGINAS



app.get(['/teste'], (req, res) => {
  res.render('teste.ejs');
});

// get é diferente de post
// get pega do query (url) e post pega do body



// CARREGAR INFORMAÇÕES


const carregarArmarios = (callback) => {
  db.query('SELECT * from armario', (error, results) => {
    if (error) {
      console.log('Erro ao carregar os armarios', error);
    } else {
      const armarios = results
      callback(null, armarios);
    }
  })
};

const carregarCamisetas = (callback) => {
  db.query('SELECT * from camiseta order by modelo_camiseta', (error, results) => {
    if (error) {
      console.log('Erro ao carregar camisetas', error);
    } else {
      const camisetas = results
      callback(null, camisetas);
    }
  })
};

const carregarCargos = (callback) => {
  db.query('SELECT * from cargo order by cod_cargo', (error, results) => {
    if (error) {
      console.log('Erro ao carregar cargos', error);
    } else {
      const cargos = results
      callback(null, cargos);
    }
  })
};

const carregarCursos = (callback) => {
  db.query('SELECT * from curso order by nome_curso', (error, results) => {
    if (error) {
      console.log('Erro ao carregar cursos', error);
    } else {
      const cursos = results
      callback(null, cursos);
    }
  })
};

const carregarEmprestimos = (callback) => {
  db.query('SELECT * from emprestimo_material', (error, results) => {
    if (error) {
      console.log('Erro ao carregar os emprestimos de materiais', error);
    } else {
      const emprestimos = results
      callback(null, emprestimos);
    }
  })
};

const carregarEntregas = (callback) => {
  db.query('SELECT * from entrega_camiseta', (error, results) => {
    if (error) {
      console.log('Erro ao carregar as entregas de camisetas', error);
    } else {
      const entregas = results
      callback(null, entregas);
    }
  })
};

const carregarEventos = (callback) => {
  db.query('SELECT * from evento', (error, results) => {
    if (error) {
      console.log('Erro ao carregar os eventos', error);
    } else {
      const eventos = results
      callback(null, eventos);
    }
  })
};

const carregarIndicacoes = (callback) => {
  db.query('SELECT * from indicacao order by titulo', (error, results) => {
    if (error) {
      console.log('Erro ao carregar as indicações de livros', error);
    } else {
      const indicacoes = results
      callback(null, indicacoes);
    }
  })
};

const carregarLivros = (callback) => {
  db.query('SELECT * from livro order by titulo', (error, results) => {
    if (error) {
      console.log('Erro ao carregar os livros', error);
    } else {
      const livros = results
      callback(null, livros);
    }
  })
};

const carregarMateriais = (callback) => {
  db.query('SELECT * from material order by nome_material', (error, results) => {
    if (error) {
      console.log('Erro ao carregar os materiais', error);
    } else {
      const materiais = results
      callback(null, materiais);
    }
  })
};

const carregarOcorrenciasMateriais = (callback) => {
  db.query('SELECT * from ocorrencia_material order by data_ocorrecia', (error, results) => {
    if (error) {
      console.log('Erro ao carregar as ocorrencias dos materiais', error);
    } else {
      const ocorrenciasMateriais = results
      callback(null, ocorrenciasMateriais);
    }
  })
};

const carregarOcorrenciasPatrimonios = (callback) => {
  db.query('SELECT * from ocorrencia_patrimonio order by data_ocorrencia', (error, results) => {
    if (error) {
      console.log('Erro ao carregar as ocorrencias dos patrimonios', error);
    } else {
      const ocorrenciasPatrimonios = results
      callback(null, ocorrenciasPatrimonios);
    }
  })
};

const carregarPatrimonios = (callback) => {
  db.query('SELECT * from patrimonios order by nome_patrimonio', (error, results) => {
    if (error) {
      console.log('Erro ao carregar os patrimonios', error);
    } else {
      const patrimonios = results
      callback(null, patrimonios);
    }
  })
};

const carregarPeriodos = (callback) => {
  db.query('SELECT * from periodo order by cod_periodo', (error, results) => {
    if (error) {
      console.log('Erro ao carregar os periodos', error);
    } else {
      const periodos = results
      callback(null, periodos);
    }
  })
};

const carregarTipoCursos = (callback) => {
  db.query('SELECT * from tipocurso', (error, results) => {
    if (error) {
      console.log('Erro ao carregar os tipos de curso', error);
    } else {
      const tipocursos = results
      callback(null, tipocursos);
    }
  })
};

const carregarTurmas = (callback) => {
  db.query('SELECT * from turma order by nome_turma', (error, results) => {
    if (error) {
      console.log('Erro ao carregar turmas', error);
    } else {
      const turmas = results
      callback(null, turmas);
    }
  })
};

const carregarUsuarios = (callback) => {
  db.query('SELECT * from usuario order by nome', (error, results) => {
    if (error) {
      console.log('Erro ao carregar usuarios', error);
    } else {
      const usuarios = results
      callback(null, usuarios);
    }
  })
};


  // ARMARIO

  //mudar a data inscrição => data_vencimento
  app.get('/armario', (req, res) => {
    db.query('SELECT a.cod_armario, a.nome_armario, a.status_armario, u.nome, date_format(u.data_vencimento, "%d/%m/%y") as "data_vencimento" FROM armario a JOIN usuario u ON a.cod_usuario = u.cod_usuario order by a.status_armario', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar os usuarios', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Armários recuperados:', results);
            res.render('armario.ejs', { armario: results });
        }
    });
});

app.get('/pesquisarArmario', (req, res) => {
  const pesquisa = req.query.pesquisa;
  console.log(pesquisa)
  db.query('SELECT a.cod_armario, a.nome_armario, a.status_armario, u.nome, date_format(u.data_vencimento, "%d/%m/%y") as "data_vencimento" FROM armario a JOIN usuario u ON a.cod_usuario = u.cod_usuario WHERE a.nome_armario like ? or u.nome like ?', [`%${pesquisa}%`, `%${pesquisa}%`], (error, results) => {
    if (error) {
      console.log('Ocorreu um erro ao realizar o filtro', error)
    } else {
      res.render('armario.ejs', { armario: results })
    }
  });
})

app.get('/infoArmario', (req, res) => {
  const cod = req.query.cod_armario;

  carregarArmarios ((error, listaArmarios) => {
    if(error) {
      console.log('erro ao carregar o armário', error)
    } carregarUsuarios ((error,listaUsuarios) => {
      if (error) {
        console.log ('erro ao carregar usuarios', error)
      } carregarCursos ((error, listaCursos) => {
        if (error) {
          console.log ('erro ao carregar o curso', error)
        } carregarTurmas ((error, results) => {
          if (error) {
            console.log ('erro ao carregar as turmas', error)
          } carregarPeriodos ((error, results) => {
            if (error) {
              console.log ('erro ao buscar periodos', error)
            }
          

      db.query('SELECT a.cod_armario, a.nome_armario, u.nome, u.email, t.nome_turma, c.nome_curso, p.periodo FROM armario a LEFT JOIN usuario u ON a.cod_usuario = u.cod_usuario LEFT JOIN turma t ON t.cod_turma = u.cod_turma LEFT JOIN periodo p ON t.cod_periodo = p.cod_periodo LEFT JOIN curso c ON t.cod_curso = c.cod_curso WHERE a.cod_armario = ?', [cod], (error, results) => {
        if (error){
          console.log ('Erro ao buscar o armário', error)
        } if (results.length > 0) {
          res.render ('infoArmario', {
            armarios: listaArmarios,
            usuarios: listaUsuarios,
            indicacao:results[0]
          })

        } else {
          console.log('indicação não encontrada')
        }
      })
    })
    })
    })
    })
    })
  });




//INDICACOES

app.get(['/livro'], (req, res) => {
  db.query('SELECT * FROM livro', (error, results) => {
    if (error) {
      console.log('Houve um erro ao recuperar os dados do estoque', error)
    } else {
      console.log('puxou', results)
      res.render('indicacao.ejs', { livro: results })
    }
  })
});

app.get('/pesquisarIndicacao', (req, res) => {
  const pesquisa = req.query.pesquisa;
  console.log(pesquisa)
  db.query('SELECT * FROM livro where titulo like ? or autor like ?', [`%${pesquisa}%`, `%${pesquisa}%`], (error, results) => {
    if (error) {
      console.log('Ocorreu um erro ao realizar o filtro', error)
    } else {
      res.render('indicacao.ejs', { livro: results })
    }
  });
})


app.get('/infoIndicacao', (req, res) => {
  const cod = req.query.cod_indicacao;

  carregarLivros ((error, listaLivros) => {
    if(error) {
      console.log('erro ao carregar a indicação', error)
    } carregarUsuarios ((error,listaUsuarios) => {
      db.query('SELECT l.cod_indicacao, l.titulo, l.autor, l.genero, l.descricao, u.nome, u.email FROM livro l JOIN usuario u ON l.cod_usuario = u.cod_usuario WHERE cod_indicacao = ?', [cod], (error, results) => {
        if (error){
          console.log ('Erro ao buscar a indicacao', error)
        } if (results.length > 0) {
          res.render ('infoIndicacao', {
            indicacoes: listaLivros,
            usuarios: listaUsuarios,
            indicacao:results[0]
          })

        } else {
          console.log('indicação não encontrada')
        }
      })
    })
  })

})


// MATERIAIS

app.get(['/material'], (req, res) => {
  db.query('SELECT cod_material, nome_material FROM material', (error, results) => {
    if (error) {
      console.log('Houve um erro ao recuperar os dados do material', error)
    } else {
      res.render('material.ejs', { material: results })
    }
  })
});

app.get('/pesquisarMaterial', (req, res) => {
  const pesquisa = req.query.pesquisa;
  console.log(pesquisa)
  db.query('SELECT * FROM material WHERE nome_material like ?', [`%${pesquisa}%`, `%${pesquisa}%`], (error, results) => {
    if (error) {
      console.log('Ocorreu um erro ao realizar o filtro')
    } else {
      res.render('material.ejs', { material: results })
      console.log (results)
    }
  });
})



app.get('/adicionarMaterial', (req, res) => {
  carregarMateriais ((error, listaMateriais) => {
    if (error) {
      console.log ('Erro ao carregar materiais:', error)
    } 

    console.log ('Materiais: ', listaMateriais);
    res.render('cadastrarMaterial.ejs', {
      materiais: listaMateriais
    })
  })
});


app.post('/cadastrarMaterial', (req, res) => {
  // Extraindo os valores do corpo da requisição
  const nome = req.body.nome_material; 
  const descricao = req.body.descricao;

  console.log("nome do material:", nome);
  console.log("descricao:", descricao);

  // Executando a query com os valores extraídos do corpo da requisição
  db.query("INSERT INTO material (nome_material, descricao_material) VALUES (?, ?)", [nome, descricao], (error, results) => {
    if (error) {
      // Em caso de erro, loga a mensagem de erro e envia uma resposta de erro
      console.log('Erro ao cadastrar material:', error);
      res.status(500).send('Erro ao cadastrar material');
    } else {
      console.log ('cadastrado')
      res.redirect('/material');
    }
  });
});


app.get('/infoMaterial', (req, res) => {
  const cod = req.query.cod_material;

  // Primeiro, carregue a lista de materiais (se necessário)
  carregarMateriais((error, listaMateriais) => {
    if (error) {
      console.log('Erro ao carregar materiais:', error);
      return res.status(500).send('Erro ao carregar materiais');
    }

    // Em seguida, execute a consulta ao banco de dados
    db.query('SELECT * FROM material WHERE cod_material = ?', [cod], (error, results) => {
      if (error) {
        console.log('Erro ao buscar o material com o cod_material', cod, error);
        return res.status(500).send('Erro ao buscar o material');
      }

      if (results.length > 0) {
        // Renderize a página com os dados do material
        res.render('infoMaterial', {
          materiais: listaMateriais,
          material: results[0] // Passa o material encontrado para a visualização
        });

      } else {
        res.status(404).send('Material não encontrado');
      }
    });
  });
});



app.post('/editarMaterial/:cod_material', (req, res) => {
  const cod = req.params.cod_material;
  const nome = req.body.nome_material;
  const descricao = req.body.descricao;

  console.log (cod);


  db.query('UPDATE material SET nome_material = ?, descricao_material = ? WHERE cod_material = ?', [nome, descricao, cod], (error, results) => {
    if (error) {
      console.log('Erro ao editar o material.', error);
      res.status(500).send('Erro ao editar o material');
    } else {
      res.redirect('/material');
      console.log ('editou')
    }
  });
});


app.post('/excluirMaterial/:cod_material', (req, res) => {
  const cod = req.params.cod_material;
    
  console.log('Código do material para exclusão:', cod);

  db.query('DELETE FROM material WHERE cod_material = ?', [cod], (error, results) => {
    if (error) {
      console.log('Erro ao excluir o material:', error);
      res.status(500).send('Erro ao excluir o material');
    } else {
      console.log('Material excluído com sucesso');
      res.redirect('/material');
    }
  });
});




// OCORRENCIA

app.get(['/ocorrencia'], (req, res) => {
  db.query('SELECT o.cod_ocorrencia, p.nome_patrimonio FROM ocorrencia o JOIN patrimonio p ON o.cod_patrimonio = p.cod_patrimonio;', (error, results) => {
    if (error) {
      console.log('Houve um erro ao recuperar os dados do ocorrencia', error);
      res.status(500).send('Erro interno do servidor');
    } else {
      console.log('puxou', results)
      res.render('ocorrencia.ejs', { ocorrencia: results });
    }
  });
});


app.get('/pesquisarOcorrencia', (req, res) => {
  const pesquisa = req.query.pesquisa;
  console.log(pesquisa); // Para depuração
  db.query('SELECT o.cod_ocorrencia, p.nome_patrimonio FROM ocorrencia o JOIN patrimonio p ON o.cod_patrimonio = p.cod_patrimonio WHERE p.nome_patrimonio like ?', [`%${pesquisa}%`], (error, results) => {


    if (error) {
      console.log('Ocorreu um erro ao realizar o filtro', error);
      res.status(500).send('Erro interno do servidor');
    } else {
      console.log(results)
      res.render('ocorrencia.ejs', { ocorrencia: results });
    }
  });
});




// ESTOQUE

app.get('/estoque', (req, res) => {
  db.query('SELECT cod_camiseta, modelo_camiseta, quantidade FROM camiseta ORDER BY modelo_camiseta', (error, results) => {
    if (error) {
      console.log('Houve um erro ao recuperar os dados do estoque', error);
      res.status(500).send('Erro interno do servidor');
    } else {
      console.log('puxou', results)
      res.render('estoque.ejs', { estoque: results });
    }
  });
});

app.get('/pesquisarCamiseta', (req, res) => {
  const pesquisa = req.query.pesquisa;
  console.log(pesquisa); // Para depuração
  db.query('SELECT modelo_camiseta, cod_camiseta as "cod", quantidade FROM camiseta WHERE modelo_camiseta LIKE ?', [`%${pesquisa}%`], (error, results) => {
    if (error) {
      console.log('Ocorreu um erro ao realizar o filtro', error);
      res.status(500).send('Erro interno do servidor');
    } else {
      res.render('estoque.ejs', { estoque: results });
    }
  });
});

app.post('/cadastroCamiseta', (req, res) => {
  // Extraindo os valores do corpo da requisição
  const modelo = req.body.modelo_camiseta;
  const quantidade = req.body.quantidade;

  console.log(modelo);
  console.log(quantidade);


  // Executando a query com os valores extraídos do corpo da requisição
  db.query("INSERT INTO camiseta (modelo_camiseta, quantidade) values (?, ?)", [modelo, quantidade], (error, results) => {
    if (error) {
      // Em caso de erro, loga a mensagem de erro e envia uma resposta de erro
      console.log('Erro ao cadastrar usuario:', error);
      res.status(500).send('Erro ao cadastrar usuario');
    } else {
      res.redirect('/estoque');
    }
  });
});


app.get('/adicionarCamiseta', (req, res) => {

  carregarCamisetas((error, listaCamisetas) => {
    if (error) {
      console.log('Erro ao carregar camisetas:', error);
    }
    console.log('Camisetas:', listaCamisetas);
    res.render('cadastroCamiseta.ejs', {
      camisetas: listaCamisetas
    })
  })
})

app.get('/infoCamiseta', (req, res) => {
  const cod = req.query.cod_camiseta;

  // Primeiro, carregue a lista de camisetas (se necessário)
  carregarCamisetas((error, listaCamisetas) => {
    if (error) {
      console.log('Erro ao carregar camisetas:', error);
      return res.status(500).send('Erro ao carregar camisetas');
    }

    // Em seguida, execute a consulta ao banco de dados
    db.query('SELECT * FROM camiseta WHERE cod_camiseta = ?', [cod], (error, results) => {
      if (error) {
        console.log('Erro ao buscar a camiseta com o cod_camiseta', cod, error);
        return res.status(500).send('Erro ao buscar a camiseta');
      }

      if (results.length > 0) {
        // Renderize a página com os dados da camiseta
        res.render('infoCamiseta', {
          camisetas: listaCamisetas,
          camiseta: results[0] // Passa a camiseta encontrado para a visualização
        });

      } else {
        res.status(404).send('Camiseta não encontrada');
      }
    });
  });
});


app.post('/editarCamiseta/:cod_camiseta', (req, res) => {
  const cod = req.params.cod_camiseta;
  const modelo = req.body.modelo_camiseta;
  const quantidade = req.body.quantidade;

  console.log (cod);


  db.query('UPDATE camiseta SET modelo_camiseta = ?, quantidade = ? WHERE cod_camiseta = ?', [modelo, quantidade, cod], (error, results) => {
    if (error) {
      console.log('Erro ao editar a camiseta.', error);
      res.status(500).send('Erro ao editar a camiseta');
    } else {
      res.redirect('/estoque');
      console.log ('editou')
    }
  });
});


app.post('/excluirCamiseta/:cod_camiseta', (req, res) => {
  const cod = req.params.cod_camiseta;
    
  console.log('Código da camiseta para exclusão:', cod);

  db.query('DELETE FROM camiseta WHERE cod_camiseta = ?', [cod], (error, results) => {
    if (error) {
      console.log('Erro ao excluir a camiseta:', error);
      res.status(500).send('Erro ao excluir a camiseta');
    } else {
      console.log('Camiseta excluída com sucesso');
      res.redirect('/estoque');
    }
  });
});





// ENTREGA

app.get('/entrega', (req, res) => {
  db.query('SELECT e.cod_entrega, u.nome, c.modelo_camiseta FROM entrega_camiseta e JOIN usuario u ON e.cod_usuario = u.cod_usuario JOIN camiseta c ON e.cod_camiseta = c.cod_camiseta;', (error, results) => {
    if (error) {
      console.log('Houve um erro ao recuperar as entregas', error);
      res.status(500).send('Erro interno do servidor');
    } else {
      res.render('entrega.ejs', { entrega: results });
    }
  });
});


app.get('/infoEntrega', (req, res) => {
  const cod = req.query.cod_entrega


  carregarEntregas ((error, listaEntragas) => {
    if (error) {
      console.log ('erro ao carregar as entregas', error)
    } carregarUsuarios ((error, listaUsuarios) => {
      if(error) {
        console.log ('erro ao carregar usuario', error)
      } carregarTurmas ((error, listaTurmas) =>{
        if (error) {
          console.log ('erro ao carregar o curso', error)
        } carregarPeriodos ((error, listaPeriodos) => {
          if (error) {
            console.log ('erro ao carregar período', error)
          } carregarCamisetas ((error, listaCamisetas) => {
            if (error) {
              console.log ('erro ao carregar camiseta', error)
            } carregarCursos ((error, listaCursos) => {
              if (error) {
                console.log ('erro ao carregar o curso', error)
              } db.query ('SELECT e.cod_entrega, u.nome, u.email, p.periodo, t.nome_turma, cu.nome_curso, c.modelo_camiseta FROM entrega_camiseta e JOIN usuario u ON e.cod_usuario = u.cod_usuario JOIN camiseta c ON e.cod_camiseta = c.cod_camiseta JOIN turma t ON u.cod_turma = t.cod_turma JOIN periodo p ON t.cod_periodo = p.cod_periodo JOIN curso cu ON t.cod_curso = cu.cod_curso WHERE e.cod_entrega = ?', [cod],(error, results) => {
                if (error) {
                  console.log ('Erro ao buscar a entrega', error)
                } if (results.length > 0) {
                  res.render ('infoEntrega', {
                    entregas: listaEntragas,
                    usuarios: listaUsuarios,
                    turmas: listaTurmas,
                    periodos: listaPeriodos,
                    camisetas: listaCamisetas,
                    cursos: listaCursos,
                    entrega: results[0]
                  })
                } else {
                  console.log ('entrega não encontrada')
                }
              })
            })
          })
        })
      })
    })
  })
})



app.get('/pesquisarEntrega', (req, res) => {
  const pesquisa = req.query.pesquisa;
  console.log(pesquisa); // Para depuração
  db.query('SELECT e.cod_entrega, u.nome, c.modelo_camiseta FROM entrega_camiseta e JOIN usuario u ON e.cod_usuario = u.cod_usuario JOIN camiseta c ON e.cod_camiseta = c.cod_camiseta WHERE u.nome LIKE ?', [`%${pesquisa}%`], (error, results) => {


    if (error) {
      console.log('Ocorreu um erro ao realizar o filtro', error);
      res.status(500).send('Erro interno do servidor');
    } else {
      console.log(results)
      res.render('entrega.ejs', { entrega: results });
    }
  });
});


// USUARIOS


app.get('/usuario', (req, res) => {
  db.query('SELECT cod_usuario, nome, date_format(data_inscricao, "%d/%m/%y") as "data_inscricao" FROM usuario', (error, results) => {
    if (error) {
      console.log('Houve um erro ao recuperar os usuarios', error);
      res.status(500).send('Erro interno do servidor');
    } else {
      res.render('usuario', { usuario: results }); // Corrija aqui para passar `usuario`
    }
  });
});


app.get('/pesquisarUsuarios', (req, res) => {
  const pesquisa = req.query.pesquisa;
  console.log(pesquisa)
  db.query('SELECT nome, cod_usuario FROM usuario where nome like ?', [`%${pesquisa}%`], (error, results) => {
    if (error) {
      console.log('Ocorreu um erro ao realizar o filtro')
    } else {
      res.render('usuario', { usuario: results });
    }
  });
});


app.get('/adicionarUsuario', (req, res) => {
  carregarUsuarios((error, listaUsuarios) => {
    if (error) {
      console.log('Erro ao carregar usuários:', error);
    }
    carregarTurmas((error, listaTurmas) => {
      if (error) {
        console.log('Erro ao carregar turmas:', error);
      }
      carregarCamisetas((error, listaCamisetas) => {
        if (error) {
          console.log('Erro ao carregar camisetas:', error);
        } carregarCargos((error, listaCargos) => {
          if (error) {
            console.log('Erro ao carregar os cargos:', error);
          }


          console.log('Turmas:', listaTurmas);
          console.log('Usuarios:', listaUsuarios);
          console.log('Camisetas:', listaCamisetas);
          console.log('Cargos:', listaCargos);
          res.render('cadastrarUsuario.ejs', {
            usuarios: listaUsuarios,
            turmas: listaTurmas,
            camisetas: listaCamisetas,
            cargos: listaCargos
          })
        })
      })
    });
  });
});


// cadastro
app.post('/cadastrarUsuario', (req, res) => {
  // Extraindo os valores do corpo da requisição
  const usuario = req.body.nome;  // Mantido como String
  const cpf = req.body.cpf;       // Mantido como String ou pode converter para Number se necessário
  const celular = req.body.celular; // Mantido como String ou pode converter para Number se necessário
  const email = req.body.email;   // Mantido como String
  const cidade = req.body.cidade; // Mantido como String
  const bairro = req.body.bairro; // Mantido como String
  const rua = req.body.rua;       // Mantido como String
  const complemento = req.body.complemento; // Mantido como String
  const numero = req.body.numero; // Mantido como String ou pode converter para Number se necessário
  const cep = req.body.cep;       // Mantido como String ou pode converter para Number se necessário
  const turma = parseInt(req.body.turma); // Conversão para Number (id)
  const camiseta = parseInt(req.body.camiseta); // Conversão para Number (id)
  const senha = req.body.senha;   // Mantido como String
  const data_inscricao = req.body.data_inscricao; // Mantido como String
  const cargo = parseInt(req.body.cargo); // Conversão para Number (id)

  console.log(data_inscricao);
  console.log("nome usuario:", usuario);
  console.log("id turma:", turma);
  console.log("id camiseta:", camiseta);

  // Executando a query com os valores extraídos do corpo da requisição
  db.query("INSERT INTO usuario (cod_turma, cod_camiseta, cod_cargo, nome, cpf, celular, email, senha, rua, cep, bairro, cidade, numero, complemento, status_usuario, data_inscricao) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)", [turma, camiseta, cargo, usuario, cpf, celular, email, senha, rua, cep, bairro, cidade, numero, complemento, data_inscricao], (error, results) => {
    if (error) {
      console.log ("erro ao inserir o usuario", error)
    } else {

    db.query ("SELECT cod_usuario FROM usuario WHERE cpf = ?", [cpf], (error, results) =>{
      console.log ('resultado da pesquisa', results)
      const cod = results[0]?.cod_usuario
      console.log ('cod_usuario esperado', cod)
    if (error) {
      // Em caso de erro, loga a mensagem de erro e envia uma resposta de erro
      console.log('Erro ao buscar o usuario', error);
      res.status(500).send('Erro ao cadastrar usuario');
    } else {
      if (cargo === 1) {
      db.query("INSERT INTO entrega_camiseta (cod_camiseta, cod_usuario, status_entrega) VALUES (?, ?, 1)", [camiseta, cod], (error,results) => {
        if(error) {
          console.log ('erro ao mandar a camiseta', error)
        } else {
          res.redirect('/usuario');
        }
      
      })

      } else {
        res.redirect('/usuario');
      }
      
    }
  })
}
  });
});

app.get('/infoUsuario', (req, res) => {
  const cod = req.query.cod_usuario;
  console.log('Código do usuário:', cod);

  // Função para carregar os dados do banco de dados
  const carregarDados = (callback) => {
    carregarUsuarios((error, listaUsuarios) => {
      if (error) return callback(error);

      carregarTurmas((error, listaTurmas) => {
        if (error) return callback(error);

        carregarCamisetas((error, listaCamisetas) => {
          if (error) return callback(error);

          carregarCargos((error, listaCargos) => {
            if (error) return callback(error);


            db.query('SELECT * FROM usuario WHERE cod_usuario = ?', [cod], (error, results) => {
              if (error) return callback(error);

              if (results.length > 0) {
                const usuario = results[0];
                const data_inscricao_bd = usuario.data_inscricao;
                const data_inscricao_js = new Date(data_inscricao_bd);
                const data_inscricao = data_inscricao_js.toISOString().substring(0, 10);

                callback(null, {
                  usuario,
                  usuarios: listaUsuarios,
                  turmas: listaTurmas,
                  camisetas: listaCamisetas,
                  cargos: listaCargos,
                  data_inscricao
                });
              } else {
                callback(new Error('Usuário não encontrado'));
              }
            });
          });
        });
      });
    });
  };

  carregarDados((error, dados) => {
    if (error) {
      if (error.message === 'Usuário não encontrado') {
        console.log(error.message);
        return res.status(404).send(error.message);
      }
      console.log('Erro ao carregar dados:', error.message);
      return res.status(500).send('Erro ao carregar dados');
    }

    res.render('infoUsuario.ejs', dados);
  });
});



app.post('/editarUsuario/:cod_usuario', (req, res) => {
  // Extraindo os valores do corpo da requisição
  const cod_usuario = req.params.cod_usuario;
  const usuario = req.body.nome;  // Mantido como String
  const cpf = req.body.cpf;       // Mantido como String ou pode converter para Number se necessário
  const celular = req.body.celular; // Mantido como String ou pode converter para Number se necessário
  const email = req.body.email;   // Mantido como String
  const cidade = req.body.cidade; // Mantido como String
  const bairro = req.body.bairro; // Mantido como String
  const rua = req.body.rua;       // Mantido como String
  const complemento = req.body.complemento; // Mantido como String
  const numero = req.body.numero; // Mantido como String ou pode converter para Number se necessário
  const cep = req.body.cep;       // Mantido como String ou pode converter para Number se necessário
  const turma = parseInt(req.body.turma); // Conversão para Number (id)
  const camiseta = parseInt(req.body.camiseta); // Conversão para Number (id)
  const senha = req.body.senha;   // Mantido como String
  const data_inscricao = req.body.data_inscricao; // Mantido como String
  const cargo = parseInt(req.body.cargo); // Conversão para Number (id)


  db.query('UPDATE usuario set nome = ?, cpf = ?, celular = ?, email = ?, cidade = ?, bairro = ?, rua = ?, complemento = ?, numero = ?, cep = ?, cod_turma = ?, cod_camiseta = ?, senha = ?, data_inscricao = ?, cod_cargo = ? where cod_usuario = ?', [usuario, cpf, celular, email, cidade, bairro, rua, complemento, numero, cep, turma, camiseta, senha, data_inscricao, cargo, cod_usuario], (error, results) => {
    if (error) {
      console.log('Erro ao editar usuario.', error)
    } else {
      res.redirect('/usuario')
    }
  })
});


app.post('/excluirUsuario/:cod_usuario', (req, res) => {
  const cod_usuario = parseInt(req.params.cod_usuario);
  console.log(cod_usuario)
  db.query('DELETE from usuario WHERE cod_usuario = ?', [cod_usuario], (error, results) => {
    if (error) {
      console.log('erro ao excluir o usuario', error)
    } else {
      res.redirect('/usuario')
    }
  })
});





  // PATRIMONIO

  app.get(['/patrimonio'], (req, res) => {
    db.query('SELECT cod_patrimonio, nome_patrimonio FROM patrimonio', (error, results) => {
      if (error) {
        console.log('Houve um erro ao recuperar os dados do patrimonio', error)
      } else {
        res.render('patrimonio.ejs', { patrimonio: results })
      }
    })
  });
  



//FUNÇÕES


