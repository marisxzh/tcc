const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const ejs = require('ejs');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const app = express();
const port = 3000;

// Atualizar o storage do multer para garantir que estamos tratando o arquivo como imagem
const storage = multer.memoryStorage(); // Usando memoryStorage

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limita o tamanho a 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
            return cb(null, true);
        }
        cb(new Error('Apenas arquivos de imagem são permitidos.'));
    }
});

const db = mysql.createPool({
host: process.env.DB_HOST,
user: process.env.DB_USERNAME,
password: process.env.DB_PASSWORD,
database: process.env.DB_DBNAME,
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0
});

// CRIA CONEXÃO COM O BANCO DE DADOS
//const db = mysql.createConnection({
//    host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'aapm'
//});

// VERIFICA SE A CONEXÃO FOI REALIZADA COM SUCESSO
db.connect((error) => {
    if (error) {
        console.error('Erro ao conectar ao MySQL:', error);
    } else {
        console.log("Conectado ao MySQL!");
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


// CONFIGURA O BODY-PARSER PARA PROCESSAR FORMULÁRIOS
app.use(bodyParser.urlencoded({ extended: true }));

// DEFINE DIRETÓRIOS DE ARQUIVOS ESTÁTICOS
app.use(express.static('public'));
app.use(express.static('src'));

// CONFIGURA O EJS COMO TEMPLATE ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// EXIBE A TELA DE LOGIN
app.get('/', (req, res) => {
    res.render('login');
});


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

const carregarIndicacoesLivros = (callback) => {
    db.query('SELECT * from indicacao order by titulo', (error, results) => {
        if (error) {
            console.log('Erro ao carregar as indicações de livros', error);
        } else {
            const indicacoesLivros = results
            callback(null, indicacoesLivros);
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
    db.query('SELECT * from ocorrencia_material order by data_ocorrencia', (error, results) => {
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
    db.query('SELECT * from patrimonio order by nome_patrimonio', (error, results) => {
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

// ROTA DE LOGIN
app.post("/login", (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    // CONSULTA O BANCO DE DADOS PARA VERIFICAR SE O EMAIL, SENHA E CARGO EXISTEM
    db.query('SELECT cod_usuario, nome, senha, cod_cargo FROM usuario WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.render('login', { errorMessage: 'Erro ao consultar o banco de dados.' });
        }

        // SE O USUÁRIO FOR ENCONTRADO, VERIFICA A SENHA
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



// MOSTRA OS MATERIAIS DISPONÍVEIS PARA O ALUNO - ALUNO
app.get('/materiaisAluno', (req, res) => {

    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    // CONSULTA OS MATERIAIS NO BANCO DE DADOS
    db.query('SELECT cod_material, nome_material, descricao_material FROM material', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar os materiais', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Materiais recuperados:', results);
            // RENDERIZA A PÁGINA DE MATERIAIS
            res.render('materiaisAluno', { materiais: results });
        }
    });
});

// PESQUISA MATERIAIS NO BANCO DE DADOS - ALUNO
app.get('/pesquisarMaterialAluno', (req, res) => {
    const pesquisa = req.query.pesquisarMaterial;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA
    db.query('SELECT nome_material, cod_material FROM material WHERE nome_material LIKE ?', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar o filtro', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('materiaisAluno', { materiais: results });
        }
    });
});

// MOSTRA OS DETALHES DE UM MATERIAL SELECIONADO - ALUNO
app.get('/infoMateriaisAluno', (req, res) => {

    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }

    const nomeMaterial = req.query.nomeMaterial; // OBTÉM O NOME DO MATERIAL DA QUERY STRING

    if (!nomeMaterial) {
        return res.status(400).send('Título do Material não fornecido');
    }

    // CONSULTA O BANCO PARA RECUPERAR OS DETALHES DO MATERIAL - ALUNO
    db.query('SELECT * FROM material WHERE nome_material = ?', [nomeMaterial], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        if (results.length > 0) {
            res.render('infoMateriaisAluno', { material: results[0] });
        } else {
            res.status(404).send('Material não encontrado');
        }
    });
});

// MOSTRA A LISTA DE LIVROS DISPONÍVEIS - ALUNO
app.get('/livrosAluno', (req, res) => {

    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    // CONSULTA TODOS OS LIVROS NO BANCO DE DADOS
    db.query('SELECT * FROM livro', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar os livros', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Página de livros foi acessada');
            res.render('livrosAluno', { livros: results });
        }
    });
});

// PESQUISA LIVROS NO BANCO DE DADOS - ALUNO
app.get('/pesquisarLivroAluno', (req, res) => {
    const pesquisa = req.query.pesquisarLivro;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA
    db.query('SELECT titulo, autor FROM livro WHERE titulo LIKE ?', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('livrosAluno', { livros: results });
        }
    });
});

// MOSTRA OS DETALHES DE UM LIVRO SELECIONADO - ALUNO
app.get('/infoLivroAluno', (req, res) => {

    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    const tituloLivro = req.query.tituloLivro; // OBTÉM O TÍTULO DO LIVRO DA QUERY STRING

    if (!tituloLivro) {
        return res.status(400).send('Título do livro não fornecido');
    }

    // CONSULTA O BANCO PARA RECUPERAR OS DETALHES DO LIVRO 
    db.query('SELECT * FROM livro WHERE titulo = ?', [tituloLivro], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        if (results.length > 0) {
            res.render('infoLivroAluno', { livro: results[0] });
        } else {
            res.status(404).send('Livro não encontrado');
        }
    });
});


// ROTA PARA EXIBIR O FORMULÁRIO DE INDICAÇÃO LIVRO - ALUNO
app.get('/indicarLivroAluno', (req, res) => {

    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    console.log('Código do Usuário na Sessão:', req.session.cod_usuario);

    // VERIFICA SE O USUÁRIO ESTÁ LOGADO
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }

    res.render('indicarLivroAluno', {
        cod_usuario: req.session.cod_usuario // PASSA O COD_USUARIO PARA A VISUALIZAÇÃO
    });
});

// ROTA PARA INSERIR UMA NOVA INDICAÇÃO - ALUNO
app.post('/inserirIndicacaoAluno', (req, res) => {
    const { titulo, autor, genero, descricao, status_indicacao } = req.body;
    const cod_usuario = req.session.cod_usuario;

    // VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO
    if (!cod_usuario) {
        return res.status(400).send('Usuário não autenticado');
    }

    // INSERE A NOVA INDICAÇÃO NO BANCO DE DADOS
    const query = 'INSERT INTO indicacao (cod_usuario, titulo, autor, genero, descricao, status_indicacao) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [cod_usuario, titulo, autor, genero, descricao, status_indicacao || 0]; // Status padrão para 0 se não for fornecido

    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Erro ao inserir indicação:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        console.log('Indicação adicionada com sucesso!');
        res.redirect('/indicacoesLivrosAluno'); // REDIRECIONA PARA A PÁGINA DE LIVROS APÓS INSERIR
    });
});

// SOLICITAÇÕES - ALUNO
app.get('/solicitacoesAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    console.log('Página de solicitações foi acessada');
    res.render('solicitacoesAluno',);
});

// INDICAÇÕES - ALUNO
app.get('/indicacoesAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    console.log('Página de indicações foi acessada');
    res.render('indicacoesAluno',);
});

// OCORRENCIA - ALUNO
app.get('/ocorrenciasAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    console.log('Página de indicações foi acessada');
    res.render('ocorrenciasAluno',);
});


// MOSTRA OS DETALHES DE UMA OCORRÊNCIA PATRIMONIO - ALUNO
app.get('/infoOcorrenciaPatrimonioAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    const descricao = req.query.descricao;

    // CONSULTA DETALHADA DA OCORRÊNCIA E SEUS RELACIONAMENTOS
    const query = `
    SELECT
        o.cod_ocorrencia,
        m.nome_patrimonio,
        o.cod_usuario,
        u.nome as nome_usuario,
        o.data_ocorrencia,
        o.detalhes_ocorrencia,
        o.status_ocorrencia
    FROM
        ocorrencia_patrimonio o
    INNER JOIN
        patrimonio m ON o.cod_patrimonio = m.cod_patrimonio
    INNER JOIN
        usuario u ON o.cod_usuario = u.cod_usuario
    WHERE
        o.detalhes_ocorrencia LIKE ?`;

    db.query(query, [`%${descricao}%`], (error, results) => {
        if (error) {
            console.error('Erro ao recuperar os detalhes da ocorrência:', error);
            res.status(500).send('Erro interno do servidor');
        } else if (results.length > 0) {
            res.render('infoOcorrenciaPatrimonioAluno', { ocorrencia: results[0] });
        } else {
            res.status(404).send('Ocorrência não encontrada');
        }
    });
});
// MOSTRA AS OCORRENCIAS DE PATRIMONIOS ALUNO
app.get('/ocorrenciasPatrimonioAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    const query = `
        SELECT ocorrencia_patrimonio.*, patrimonio.nome_patrimonio 
        FROM ocorrencia_patrimonio 
        JOIN patrimonio ON ocorrencia_patrimonio.cod_patrimonio = patrimonio.cod_patrimonio
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar as ocorrências', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Ocorrências recuperadas:', results);
            res.render('ocorrenciasPatrimonioAluno', { ocorrencia: results });
        }
    });
});



// PESQUISA OCORRÊNCIAS NO BANCO DE DADOS - ALUNO
app.get('/pesquisarOcorrenciaPatrimonioAluno', (req, res) => {
    const pesquisa = req.query.pesquisarOcorrenciaPatrimonio;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA
    db.query('SELECT p.nome_patrimonio,o.data_ocorrencia as data_ocorrencia, o.detalhes_ocorrencia, o.cod_usuario FROM ocorrencia_patrimonio o JOIN patrimonio p ON o.cod_patrimonio = p.cod_patrimonio WHERE p.nome_patrimonio LIKE ?', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Resultados da consulta:', results); // Verifique o conteúdo aqui
            res.render('ocorrenciasPatrimonioAluno', { ocorrencia: results });
        }
    });

});


// RENDERIZA O FORMULÁRIO PARA ADICIONAR OCORRÊNCIA - ALUNO

app.get('/adicionarOcorrenciaPatrimonioAluno', (req, res) => {
    console.log('Código do Usuário na Sessão:', req.session.cod_usuario);
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    // CONSULTA OS ELETRODOMÉSTICOS DISPONÍVEIS PARA ADICIONAR NA OCORRÊNCIA
    db.query('SELECT cod_patrimonio, nome_patrimonio FROM patrimonio', (error, results) => {
        if (error) {
            console.error('Erro ao buscar eletrodomésticos:', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('adicionarOcorrenciaPatrimonioAluno', {
                cod_usuario: req.session.cod_usuario, // PASSA O cod_usuario PARA O TEMPLATE
                patrimonios: results
            });
        }
    });
});


// INSERE UMA NOVA OCORRÊNCIA NO PATRIMONIO - ALUNO
app.post('/inserirOcorrenciasPatrimonioAluno', (req, res) => {
    const cod_patrimonio = req.body.cod_patrimonio;
    const data_ocorrencia = req.body.data_ocorrencia;
    const detalhes_ocorrencia = req.body.detalhes_ocorrencia;
    const status_ocorrencia = req.body.status_ocorrencia;
    const cod_usuario = req.session.cod_usuario;

    // VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO
    if (!cod_usuario) {
        return res.status(400).send('Usuário não autenticado');
    }


    // INSERE A OCORRÊNCIA NO BANCO DE DADOS - ALUNO
    db.query('INSERT INTO ocorrencia_patrimonio (cod_patrimonio, data_ocorrencia, detalhes_ocorrencia, status_ocorrencia, cod_usuario) VALUES (?, ?, ?, ?, ?)',
        [cod_patrimonio, data_ocorrencia, detalhes_ocorrencia, status_ocorrencia, cod_usuario], (error, results) => {
            if (error) {
                console.error('Erro ao inserir ocorrência:', error);
                return res.status(500).send('Erro interno do servidor');
            }

            // REDIRECIONA DE VOLTA PARA A PÁGINA DE OCORRÊNCIAS
            res.redirect('/ocorrenciasPatrimonioAluno');
        });
});


// MOSTRA AS OCORRENCIAS DE MATERIAIS ALUNO
app.get('/ocorrenciasMateriaisAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    const query = `
        SELECT ocorrencia_material.*, material.nome_material 
        FROM ocorrencia_material 
        JOIN material ON ocorrencia_material.cod_material = material.cod_material
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar as ocorrências', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Ocorrências recuperadas:', results);
            res.render('ocorrenciasMateriaisAluno', { ocorrencia: results });
        }
    });
});

// MOSTRA OS DETALHES DE UMA OCORRÊNCIA SELECIONADA - ALUNO
app.get('/infoOcorrenciaMaterialAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    const descricao = req.query.descricao;

    // CONSULTA DETALHADA DA OCORRÊNCIA E SEUS RELACIONAMENTOS
    const query = `
    SELECT
        o.cod_ocorrencia,
        m.nome_material,
        o.cod_usuario,
        u.nome as nome_usuario,
        o.data_ocorrencia,
        o.detalhes_ocorrencia,
        o.status_ocorrencia
    FROM
        ocorrencia_material o
    INNER JOIN
        material m ON o.cod_material = m.cod_material
    INNER JOIN
        usuario u ON o.cod_usuario = u.cod_usuario
    WHERE
        o.detalhes_ocorrencia LIKE ?`;

    db.query(query, [`%${descricao}%`], (error, results) => {
        if (error) {
            console.error('Erro ao recuperar os detalhes da ocorrência:', error);
            res.status(500).send('Erro interno do servidor');
        } else if (results.length > 0) {
            res.render('infoOcorrenciaMaterialAluno', { ocorrencia: results[0] });
        } else {
            res.status(404).send('Ocorrência não encontrada');
        }
    });
});

// RENDERIZA O FORMULÁRIO PARA ADICIONAR OCORRÊNCIA - ALUNO

app.get('/adicionarOcorrenciaMaterialAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    console.log('Código do Usuário na Sessão:', req.session.cod_usuario);

    // CONSULTA OS ELETRODOMÉSTICOS DISPONÍVEIS PARA ADICIONAR NA OCORRÊNCIA
    db.query('SELECT cod_material, nome_material FROM material', (error, results) => {
        if (error) {
            console.error('Erro ao buscar eletrodomésticos:', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('adicionarOcorrenciaMaterialAluno', {
                cod_usuario: req.session.cod_usuario, // PASSA O cod_usuario PARA O TEMPLATE
                materiais: results
            });
        }
    });
});



// INSERE UMA NOVA OCORRÊNCIA NO BANCO DE DADOS - ALUNO
app.post('/inserirOcorrenciasMaterialAluno', (req, res) => {
    const cod_material = req.body.cod_material;
    const data_ocorrencia = req.body.data_ocorrencia;
    const detalhes_ocorrencia = req.body.detalhes_ocorrencia;
    const status_ocorrencia = req.body.status_ocorrencia;
    const cod_usuario = req.session.cod_usuario;

    // VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO
    if (!cod_usuario) {
        return res.status(400).send('Usuário não autenticado');
    }


    // INSERE A OCORRÊNCIA NO BANCO DE DADOS - ALUNO
    db.query('INSERT INTO ocorrencia_material (cod_material, data_ocorrencia, detalhes_ocorrencia, status_ocorrencia, cod_usuario) VALUES (?, ?, ?, ?, ?)',
        [cod_material, data_ocorrencia, detalhes_ocorrencia, status_ocorrencia, cod_usuario], (error, results) => {
            if (error) {
                console.error('Erro ao inserir ocorrência:', error);
                return res.status(500).send('Erro interno do servidor');
            }

            // REDIRECIONA DE VOLTA PARA A PÁGINA DE OCORRÊNCIAS
            res.redirect('/ocorrenciasMateriaisAluno');
        });
});


// PESQUISA OCORRÊNCIAS NO BANCO DE DADOS - ALUNO  ------ NÃO FUNCIONA
app.get('/pesquisarOcorrenciaMaterialAluno', (req, res) => {
    const pesquisa = req.query.pesquisarOcorrenciaMaterial;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA
    db.query(`
        SELECT 
            m.nome_material, 
            DATE_FORMAT(o.data_ocorrencia, "%d/%m/%Y") as data_ocorrencia, 
            o.detalhes_ocorrencia, 
            o.data_ocorrencia,
            o.cod_usuario 
        FROM 
            ocorrencia_material o 
        JOIN 
            material m ON o.cod_material = m.cod_material 
        WHERE 
            m.nome_material LIKE ? 
            OR DATE_FORMAT(o.data_ocorrencia, "%d/%m/%Y") LIKE ?`,
        [`%${pesquisa}%`, `%${pesquisa}%`], (error, results) => {
            if (error) {
                console.log('Ocorreu um erro ao realizar a pesquisa', error);
                res.status(500).send('Erro interno do servidor');
            } else {
                console.log('Resultados da consulta:', results); // Verifique o conteúdo aqui
                res.render('ocorrenciasMateriaisAluno', { ocorrencia: results });
            }
        });

});



// INDICAÇÃO LIVRO - ALUNO
app.get('/indicacoesLivrosAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    // CONSULTA TODOS OS LIVROS NO BANCO DE DADOS
    db.query('SELECT * FROM indicacao', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar os livros', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Página de livros foi acessada');
            res.render('indicacoesLivrosAluno', { indicacao: results });
        }
    });
});

// INDICAR LIVRO - ALUNO
app.get('/indicarLivroAluno', (req, res) => {

    console.log('Código do Usuário na Sessão:', req.session.cod_usuario);
    // VERIFICA SE O USUÁRIO ESTÁ LOGADO
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    res.render('indicarLivroAluno', {
        cod_usuario: req.session.cod_usuario // PASSA O COD_USUARIO PARA A VISUALIZAÇÃO
    });
});

// INSERIR INDICAÇÃO - ALUNO
app.post('/inserirIndicacaoAluno', (req, res) => {
    const { titulo, autor, genero, descricao, status_indicacao } = req.body;
    const cod_usuario = req.session.cod_usuario;

    // VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO
    if (!cod_usuario) {
        return res.status(400).send('Usuário não autenticado');
    }

    // INSERE A NOVA INDICAÇÃO NO BANCO DE DADOS
    const query = 'INSERT INTO indicacao (cod_usuario, titulo, autor, genero, descricao, status_indicacao) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [cod_usuario, titulo, autor, genero, descricao, status_indicacao || 0]; // Status padrão para 0 se não for fornecido

    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Erro ao inserir indicação:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        console.log('Indicação adicionada com sucesso!');
        res.redirect('/indicacoesLivrosAluno'); // REDIRECIONA PARA A PÁGINA DE LIVROS APÓS INSERIR
    });
});


// VER INDICAÇÃO DE LIVRO - ALUNO
app.get('/infoIndicacaoLivroAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }

    const tituloLivroIndicacao = req.query.tituloLivroIndicacao; // OBTÉM O TÍTULO DO LIVRO DA QUERY STRING

    if (!tituloLivroIndicacao) {
        return res.status(400).send('Título do livro não fornecido');
    }

    // CONSULTA O BANCO PARA RECUPERAR OS DETALHES DO LIVRO 
    db.query('SELECT * FROM indicacao WHERE cod_indicacao = ?', [tituloLivroIndicacao], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).send('Erro interno do servidor');
        }
        if (results.length > 0) {
            res.render('infoIndicacaoLivroAluno', { indicacao: results[0] });
        } else {
            res.status(404).send('Livro não encontrado');
        }
    });
});

// PESQUISAR INDICAÇÃO LIVRO - ALUNO
app.get('/pesquisarindicacaoLivroAluno', (req, res) => {
    const pesquisa = req.query.pesquisarLivro;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA
    db.query('SELECT * FROM indicacao WHERE titulo LIKE ?', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('indicacoesLivrosAluno', { indicacao: results });
        }
    });
});
// EVENTOS ALUNO
app.get('/eventosAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    db.query('SELECT * FROM evento', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar os eventos', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            // Criar um objeto para eventos por data
            const eventosPorData = {};
            results.forEach(evento => {
                const data = new Date(evento.data_evento).toISOString().split('T')[0]; // Formato YYYY-MM-DD
                eventosPorData[data] = true; // Marcar como evento disponível
            });

            res.render('eventosAluno', { evento: results, eventosPorData });
        }
    });
});
// MOSTRA A LISTA DE INDICAÇÕES DE EVENTOS DISPONÍVEIS - ALUNO
app.get('/indicacoesEventosAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    // CONSULTA TODOS OS LIVROS NO BANCO DE DADOS
    db.query('SELECT * FROM indicacao_evento', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar os livros', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Página de livros foi acessada');
            res.render('indicacoesEventosAluno', { indicacao: results });
        }
    });
});
// INDICAR EVENTOS - ALUNO
app.get('/indicarEventosAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    db.query('SELECT * FROM evento', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar os eventos', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Eventos recuperados:', results);
            res.render('indicarEventosAluno');
        }
    });
});


// ROTA PARA INSERIR UMA NOVA INDICAÇÃO DE EVENTO - ALUNO
app.post('/inserirIndicacaoEventoAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    const { nome_evento, local_evento, horario_evento, descricao_evento } = req.body;
    const cod_usuario = req.session.cod_usuario;

    // VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO
    if (!cod_usuario) {
        return res.status(400).send('Usuário não autenticado');
    }

    // INSERE A NOVA INDICAÇÃO DE EVENTO NO BANCO DE DADOS
    const query = 'INSERT INTO indicacao_evento (cod_usuario, nome_evento, local_evento, horario_evento, descricao_evento, status_indicacao) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [cod_usuario, nome_evento, local_evento, horario_evento, descricao_evento, 0]; // Status padrão para 0 (não aprovado)

    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Erro ao inserir indicação de evento:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        console.log('Indicação de evento adicionada com sucesso!');
        res.redirect('/indicacoesEventosAluno'); // REDIRECIONA PARA A PÁGINA APÓS INSERIR
    });
});

// PESQUISAR INDICAÇÃO EVENTO - ALUNO
app.get('/pesquisarIndicacaoEventoAluno', (req, res) => {
    const pesquisa = req.query.pesquisarLivro;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA
    db.query('SELECT cod_evento, nome_evento FROM indicacao_evento WHERE nome_evento LIKE ?', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('indicacoesEventosAluno', { indicacao: results });
        }
    });
});

// VER INDICAÇÃO EVENTO ALUNO
app.get('/infoIndicacaoEventoAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    const codIndicacaoEvento = req.query.codIndicacaoEvento; // OBTÉM O CODIGO DA INDICAÇÃO DA QUERY STRING

    if (!codIndicacaoEvento) {
        return res.status(400).send('Código da indicação não fornecido');
    }

    // CONSULTA O BANCO PARA RECUPERAR OS DETALHES DA INDICAÇÃO DO LIVRO E O NOME DO USUÁRIO
    const query = `
        SELECT
            ie.*,
            u.nome as nome_usuario
        FROM
            indicacao_Evento ie
        INNER JOIN
            usuario u ON ie.cod_usuario = u.cod_usuario
        WHERE
            ie.cod_evento = ?`;

    db.query(query, [codIndicacaoEvento], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        if (results.length > 0) {
            res.render('infoIndicacaoEventoAluno', { indicacao: results[0] });
        } else {
            res.status(404).send('Indicação de Eventos não encontrada');
        }
    });
});

// INDICAR MATERIAIS - ALUNO
app.get('/indicacoesMateriaisAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    db.query('SELECT * FROM indicacao_material', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar as indicações', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('indicações recuperadas:', results);
            res.render('indicacoesMateriaisAluno', { indicacao: results });
        }
    });
});

// VER INDICAÇÃO EVENTO ALUNO
app.get('/infoIndicacaoMateriaisAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    const codIndicacaomaterial = req.query.codIndicacaoMaterial; // OBTÉM O CODIGO DA INDICAÇÃO DA QUERY STRING

    if (!codIndicacaomaterial) {
        return res.status(400).send('Código da indicação não fornecido');
    }

    // CONSULTA O BANCO PARA RECUPERAR OS DETALHES DA INDICAÇÃO DO LIVRO E O NOME DO USUÁRIO
    const query = `
        SELECT
            im.*,
            u.nome as nome_usuario
        FROM
            indicacao_material im
        INNER JOIN
            usuario u ON im.cod_usuario = u.cod_usuario
        WHERE
            im.cod_material = ?`;

    db.query(query, [codIndicacaomaterial], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        if (results.length > 0) {
            res.render('infoIndicacaoMateriaisAluno', { indicacao: results[0] });
        } else {
            res.status(404).send('Indicação de materiais não encontrada');
        }
    });
});

// PESQUISAR INDICAÇÃO LIVRO - ALUNO
app.get('/pesquisarIndicacaoMaterialAluno', (req, res) => {
    const pesquisa = req.query.pesquisarMaterial;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA
    db.query('SELECT cod_material, nome_material FROM indicacao_material WHERE nome_material LIKE ?', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('indicacoesMateriaisAluno', { indicacao: results });
        }
    });
});


// INDICAR LIVRO - ALUNO
app.get('/indicarMaterialAluno', (req, res) => {

    console.log('Código do Usuário na Sessão:', req.session.cod_usuario);
    // VERIFICA SE O USUÁRIO ESTÁ LOGADO
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    res.render('indicarMaterialAluno', {
        cod_usuario: req.session.cod_usuario // PASSA O COD_USUARIO PARA A VISUALIZAÇÃO
    });
});

// ROTA PARA INSERIR UMA NOVA INDICAÇÃO - ALUNO
app.post('/inserirIndicacaoMaterialAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    const { nome_material, descricao_material, status_indicacao } = req.body;
    const cod_usuario = req.session.cod_usuario;

    // VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO
    if (!cod_usuario) {
        return res.status(400).send('Usuário não autenticado');
    }

    // INSERE A NOVA INDICAÇÃO NO BANCO DE DADOS
    const query = 'INSERT INTO indicacao_material (cod_usuario, nome_material, descricao_material, status_indicacao) VALUES (?, ?, ?, ?)';
    const values = [cod_usuario, nome_material, descricao_material, status_indicacao || 0]; // Status padrão para 0 se não for fornecido

    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Erro ao inserir indicação:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        console.log('Indicação adicionada com sucesso!');
        res.redirect('/indicacoesMateriaisAluno'); // REDIRECIONA PARA A PÁGINA DE LIVROS APÓS INSERIR
    });
});

// SOLICITACOES MATERIAIS - ALUNO
app.get('/solicitacoesMateriaisAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    // CONSULTA TODOS AS SOLICITACOES NO BANCO DE DADOS
    db.query('SELECT sm.*, m.nome_material FROM solicitacao_material sm INNER JOIN material m ON sm.cod_material = m.cod_material', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar as solicitações', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Página de Solicitações de materiais foi acessada');
            res.render('solicitacoesMateriaisAluno', { solicitacao: results });
        }
    });
});

// PESQUISAR SOLICITACAO MATERIAL - ALUNO
app.get('/pesquisarSolicitacaoMaterialAluno', (req, res) => {
    const pesquisa = req.query.pesquisarMaterial;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA
    db.query('SELECT sm.cod_material, m.nome_material FROM solicitacao_material sm INNER JOIN material m ON sm.cod_material = m.cod_material WHERE nome_material LIKE ?', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('SolicitacoesMateriaisAluno', { solicitacao: results });
        }
    });
});

// VER INDICAÇÃO EVENTO ALUNO
app.get('/infoSolicitacaoMaterialAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    const codIndicacaomaterial = req.query.codSolicitacaoMaterial; // OBTÉM O CODIGO DA INDICAÇÃO DA QUERY STRING

    if (!codIndicacaomaterial) {
        return res.status(400).send('Código da indicação não fornecido');
    }

    // CONSULTA O BANCO PARA RECUPERAR OS DETALHES DA INDICAÇÃO DO LIVRO E O NOME DO USUÁRIO
    const query = `
        SELECT sm.*,
         u.nome as nome_usuario,
         m.nome_material as nome_material
        FROM
            solicitacao_material sm
        INNER JOIN
            usuario u ON sm.cod_usuario = u.cod_usuario
        INNER JOIN
            material m ON sm.cod_material = m.cod_material
        WHERE
            sm.cod_material = ?`;

    db.query(query, [codIndicacaomaterial], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        if (results.length > 0) {
            res.render('infoSolicitacaoMaterialAluno', { solicitacao: results[0] });
        } else {
            res.status(404).send('Solicitação de materiais não encontrada');
        }
    });
});

// RENDERIZA O FORMULÁRIO PARA ADICIONAR OCORRÊNCIA - ALUNO
app.get('/solicitarMaterialAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    db.query('SELECT cod_material, nome_material FROM material', (error, results) => {
        if (error) {
            console.error('Erro ao buscar materiais:', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('solicitarMaterialAluno', {
                cod_usuario: req.session.cod_usuario,
                materiais: results // Verifique se results está trazendo dados
            });
        }
    });
});


// ROTA PARA INSERIR UMA NOVA SOLICITACAO DE MATERIAIS - ALUNO
app.post('/inserirSolicitacaoMaterialAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    const cod_material = req.body.cod_material;
    const cod_usuario = req.body.cod_usuario;

    if (!cod_material || !cod_usuario) {
        return res.status(400).send('Dados inválidos');
    }

    const query = 'INSERT INTO solicitacao_material (cod_material, cod_usuario, status_solicitacao) VALUES (?, ?, 0)';
    db.query(query, [cod_material, cod_usuario], (error, results) => {
        if (error) {
            console.error('Erro ao inserir solicitação de material:', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.redirect('/solicitacoesMateriaisAluno');
        }
    });
});


// SOLICITACOES Patrimonios - ALUNO
app.get('/solicitacoesPatrimoniosAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    // CONSULTA TODOS AS SOLICITACOES NO BANCO DE DADOS
    db.query('SELECT sm.*, m.nome_patrimonio FROM solicitacao_patrimonio sm INNER JOIN patrimonio m ON sm.cod_patrimonio = m.cod_patrimonio', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar as solicitações', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Página de Solicitações de Materiais foi acessada');
            res.render('solicitacoesPatrimoniosAluno', { solicitacao: results });
        }
    });
});

// RENDERIZA O FORMULÁRIO PARA ADICIONAR PATRIMONIOS - ALUNO
app.get('/solicitarPatrimoniosAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    db.query('SELECT cod_patrimonio, nome_patrimonio FROM patrimonio', (error, results) => {
        if (error) {
            console.error('Erro ao buscar materiais:', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('solicitarPatrimoniosAluno', {
                cod_usuario: req.session.cod_usuario,
                patrimonio: results // Verifique se results está trazendo dados
            });
        }
    });
});


// ROTA PARA INSERIR UMA NOVA SOLICITACAO DE PATRIMONIOS - ALUNO
app.post('/inserirSolicitacaoPatrimonioAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    const cod_patrimonio = req.body.cod_patrimonio;
    const cod_usuario = req.body.cod_usuario;

    if (!cod_patrimonio || !cod_usuario) {
        return res.status(400).send('Dados inválidos');
    }

    const query = 'INSERT INTO solicitacao_patrimonio (cod_patrimonio, cod_usuario, status_solicitacao) VALUES (?, ?, 0)';
    db.query(query, [cod_patrimonio, cod_usuario], (error, results) => {
        if (error) {
            console.error('Erro ao inserir solicitação de Dpatrimonio:', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.redirect('/solicitacoesPatrimoniosAluno');
        }
    });
});

// PESQUISAR SOLICITACAO PATRIMONIOS - ALUNO
app.get('/pesquisarSolicitacaoPatrimonioAluno', (req, res) => {
    const pesquisa = req.query.pesquisarPatrimonio;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA
    db.query('SELECT sp.cod_patrimonio, m.nome_patrimonio FROM solicitacao_patrimonio sp INNER JOIN patrimonio m ON sp.cod_patrimonio = m.cod_patrimonio WHERE nome_patrimonio LIKE ?', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('SolicitacoesPatrimoniosAluno', { solicitacao: results });
        }
    });
});

// VER SOLICITACAO PATRIMONIO ALUNO
app.get('/InfoSolicitacaoPatrimonioAluno', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    const codPatrimonio = req.query.codSolicitacaoPatrimonio; // OBTÉM O CODIGO DA INDICAÇÃO DA QUERY STRING

    if (!codPatrimonio) {
        return res.status(400).send('Código da indicação não fornecido');
    }

    // CONSULTA O BANCO PARA RECUPERAR OS DETALHES DA INDICAÇÃO DO LIVRO E O NOME DO USUÁRIO
    const query = `
        SELECT sm.*,
         u.nome as nome_usuario,
         m.nome_patrimonio as nome_patrimonio
        FROM
            solicitacao_patrimonio sm
        INNER JOIN
            usuario u ON sm.cod_usuario = u.cod_usuario
        INNER JOIN
            patrimonio m ON sm.cod_patrimonio = m.cod_patrimonio
        WHERE
            sm.cod_patrimonio = ?`;

    db.query(query, [codPatrimonio], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        if (results.length > 0) {
            res.render('InfoSolicitacaoPatrimonioAluno', { solicitacao: results[0] });
        } else {
            res.status(404).send('Solicitação de materiais não encontrada');
        }
    });
});



// ROTA PARA EXIBIR O PERFIL (agora chamada de "trocasenha")
app.get('/perfilAluno', (req, res) => {

    const cod_usuario = req.session.cod_usuario;

    if (!cod_usuario) {
        return res.redirect('/'); // Redireciona para o login se não estiver logado
    }

    db.query('SELECT nome, cpf, celular, email, rua, cep, bairro, cidade, numero, complemento, status_usuario, data_inscricao, data_vencimento, foto_perfil FROM usuario WHERE cod_usuario = ?', [cod_usuario], (error, results) => {
        if (error) {
            console.error('Erro ao buscar perfil:', error);
            return res.status(500).send('Erro ao buscar perfil.');
        } else {
            if (results.length > 0) {
                const usuario = results[0];
                const foto_perfil = usuario.foto_perfil ? `data:image/jpg;base64,${usuario.foto_perfil.toString('base64')}` : '/img/init.jpg';

                // Passa o objeto `usuario` (o primeiro resultado) para a view
                res.render('perfilAluno', { usuario: usuario, foto_perfil: foto_perfil });
            } else {
                res.status(404).send('Usuário não encontrado.');
            }
        }
    });
});


app.post('/editarPerfil', upload.single('profilePic'), (req, res) => {
    const cod_usuario = req.session.cod_usuario;

    if (!req.file) {
        // Redireciona para a página de perfil com uma mensagem de erro
        return res.redirect('/perfilAluno?error=Nenhuma imagem foi enviada.');
    }

    const fotoPerfil = req.file.buffer;

    // Verifique o Buffer antes da inserção no banco
    console.log('Buffer da Imagem:', fotoPerfil);

    // Query de atualização
    const updateQuery = 'UPDATE usuario SET foto_perfil = ? WHERE cod_usuario = ?';
    db.query(updateQuery, [fotoPerfil, cod_usuario], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar perfil: ', err);
            return res.status(500).send('Erro ao atualizar perfil');
        }
        console.log("Imagem salva no banco");

        // Redirecionar para a página de perfil após a atualização
        res.redirect('/perfilAluno');
    });
});
































// ADM //////////////////////////////////////


////////////////////////////////////// USUARIOS ////////////////////////////////////////////////////////////////////////////
// MOSTRA OS USUARIOS - ADM
app.get('/usuariosAdm', (req, res) => {
    db.query('SELECT * FROM usuario', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar os usuarios', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Usuarios recuperados:', results);
            res.render('usuariosAdm', { usuario: results });
        }
    });
});


app.get('/pesquisarUsuariosAdm', (req, res) => {
    const pesquisa = req.query.pesquisa;
    console.log(pesquisa)
    db.query('SELECT nome, cod_usuario, data_inscricao, cpf FROM usuario where nome like ?', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar o filtro')
        } else {
            res.render('usuariosAdm', { usuario: results });
        }
    });
});

app.get('/infoUsuariosAdm', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
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

                                // Adicione a propriedade foto_perfil ao objeto retornado
                                const foto_perfil = usuario.foto_perfil ? Buffer.from(usuario.foto_perfil).toString('base64') : null;

                                callback(null, {
                                    usuario,
                                    usuarios: listaUsuarios,
                                    turmas: listaTurmas,
                                    camisetas: listaCamisetas,
                                    cargos: listaCargos,
                                    data_inscricao,
                                    foto_perfil // Adicione aqui
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

    carregarDados((error, data) => {
        if (error) {
            console.error('Erro ao carregar dados:', error);
            return res.status(500).send('Erro ao carregar dados');
        }
        res.render('infoUsuariosAdm', data);
    });
});
  
  
  app.post('/editarUsuarioAdm/:cod_usuario', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
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
        res.redirect('/usuariosAdm')
      }
    })
  });
  
  
  app.post('/excluirUsuarioAdm/:cod_usuario', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod_usuario = parseInt(req.params.cod_usuario);
    console.log(cod_usuario)
    db.query('DELETE from usuario WHERE cod_usuario = ?', [cod_usuario], (error, results) => {
      if (error) {
        console.log('erro ao excluir o usuario', error)
      } else {
        res.redirect('/usuariosAdm')
      }
    })
  });
  
  
  
app.get('/cadastrarUsuarioAdm', (req, res) => {
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
                    res.render('cadastrarUsuarioAdm', {
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
app.post('/cadastrarUsuarioAdm', (req, res) => {
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
            console.log("erro ao inserir o usuario", error)
        } else {

            db.query("SELECT cod_usuario FROM usuario WHERE cpf = ?", [cpf], (error, results) => {
                console.log('resultado da pesquisa', results)
                const cod = results[0]?.cod_usuario
                console.log('cod_usuario esperado', cod)
                if (error) {
                    // Em caso de erro, loga a mensagem de erro e envia uma resposta de erro
                    console.log('Erro ao buscar o usuario', error);
                    res.status(500).send('Erro ao cadastrar usuario');
                } else {
                    if (cargo === 1) {
                        db.query("INSERT INTO entrega_camiseta (cod_camiseta, cod_usuario, status_entrega) VALUES (?, ?, 1)", [camiseta, cod], (error, results) => {
                            if (error) {
                                console.log('erro ao mandar a camiseta', error)
                            } else {
                                res.redirect('/usuariosAdm');
                            }

                        })

                    } else {
                        res.redirect('/usuariosAdm');
                    }

                }
            })
        }
    });
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////// EVENTOS ADM ////////////////////////////////////////////////////////////////////////////
// Rota para listar eventos
app.get('/eventosAdm', (req, res) => {
    db.query('SELECT * FROM evento', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar os eventos', error);
            return res.status(500).send('Erro interno do servidor');
        }
        res.render('eventosAdm', { eventos: results });
    });
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// ARMARIO //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// ARMARIO ADM ARMARIO_ADM

//mudar a data inscrição => data_vencimento
// MOSTRA OS ARMARIOS - ADM
app.get('/armarioAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    db.query('SELECT * FROM armario order by status_armario', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar os usuarios', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('armariosAdm', { armario: results });
        }
    });
  });
  
  // PESQUISAR ARMARIOS ADM
  app.get('/pesquisarArmarioAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const pesquisa = req.query.pesquisa;
    console.log(pesquisa);
    
    db.query('SELECT a.cod_armario, a.nome_armario, a.status_armario, u.nome FROM armario a LEFT JOIN usuario u ON a.cod_usuario = u.cod_usuario WHERE a.nome_armario like ? or u.nome like ?', [`%${pesquisa}%`, `%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar o filtro', error);
            res.status(500).send('Erro ao realizar o filtro');
        } else {
            res.render('armariosAdm', { armario: results });
        }
    });
  });
  
  
  
  // INFO ARMARIO
  app.get('/infoArmariosAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.query.numeroArmario;
    console.log ('codigo:', cod)
  
    // Função de carregamento de dados assíncronos
    const carregarDados = (callback) => {
        carregarArmarios((error, listaArmarios) => {
            if (error) return callback('Erro ao carregar armários', null);
  
            carregarUsuarios((error, listaUsuarios) => {
                if (error) return callback('Erro ao carregar usuários', null);
  
                carregarCursos((error, listaCursos) => {
                    if (error) return callback('Erro ao carregar cursos', null);
  
                    carregarTurmas((error, listaTurmas) => {
                        if (error) return callback('Erro ao carregar turmas', null);
  
                        carregarPeriodos((error, listaPeriodos) => {
                            if (error) return callback('Erro ao buscar períodos', null);
  
                            // Todos os dados carregados com sucesso
                            callback(null, { listaArmarios, listaUsuarios, listaCursos, listaTurmas, listaPeriodos });
                        });
                    });
                });
            });
        });
    };
  
    carregarDados((loadError, data) => {
        if (loadError) {
            console.log(loadError);
            return res.status(500).send(loadError);
        }
  
        // Query para buscar o armário
        db.query(
            `SELECT a.cod_armario, a.nome_armario, a.status_armario, u.nome, u.email, 
                    t.nome_turma, c.nome_curso, p.periodo 
             FROM armario a 
             LEFT JOIN usuario u ON a.cod_usuario = u.cod_usuario 
             LEFT JOIN turma t ON t.cod_turma = u.cod_turma 
             LEFT JOIN periodo p ON t.cod_periodo = p.cod_periodo 
             LEFT JOIN curso c ON t.cod_curso = c.cod_curso 
             WHERE a.cod_armario = ?`, [cod], (error, results) => {
            
            if (error) {
                console.log('Erro ao buscar o armário', error);
                return res.status(500).send('Erro ao buscar o armário');
            }
  
            if (results.length > 0) {
                const armario = results[0]; // Pega o primeiro resultado
  
                // Verifica o status do armário e renderiza a view apropriada
                if (armario.status_armario === 0) {
                    res.render('infoArmarioLivreAdm', {
                        armarios: data.listaArmarios,
                        usuarios: data.listaUsuarios,
                        armario: armario
                    });
                } else if (armario.status_armario === 1) {
                    res.render('infoArmarioEmUsoAdm', {
                        armarios: data.listaArmarios,
                        usuarios: data.listaUsuarios,
                        armario: armario
                    });
                }
            } else {
                console.log('Armário não encontrado');
                res.status(404).send('Armário não encontrado');
            }
        });
    });
  });
  
  app.get('/adicionarArmarioAdm', (req, res) => {
    carregarArmarios((error, listaArmarios) => {
        if (error) {
            console.log('Erro ao carregar armarios:', error)
        }
  
        console.log('Armarios: ', listaArmarios);
        res.render('cadastrarArmarioAdm', {
            armarios: listaArmarios
        })
    })
  });
  
  
  app.post('/cadastrarArmarioAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const nome = req.body.nome_armario;
  
    console.log("nome do armario:", nome);
  
    db.query("INSERT INTO armario (nome_armario, status_armario) VALUES (?, 0)", [nome], (error, results) => {
        if (error) {
            console.log('Erro ao cadastrar armário:', error);
            res.status(500).send('Erro ao cadastrar armário');
        } else {
            console.log('cadastrado')
            res.redirect('/armarioAdm');
        }
    });
  });
  
  
  app.post('/editarArmarioAdm/:cod_armario', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.params.cod_armario;
    const usuario = parseInt(req.body.nome);
  
    console.log(cod, usuario);
  
  
    db.query('UPDATE armario SET cod_usuario = ?, status_armario = 1 WHERE cod_armario = ?', [usuario, cod], (error, results) => {
        if (error) {
            console.log('Erro ao editar o armario.', error);
            res.status(500).send('Erro ao editar o armário');
        } else {
            res.redirect('/armarioAdm');
            console.log('editou')
        }
    });
  });
  
  
  app.post('/desocuparArmarioAdm/:cod_armario', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.params.cod_armario;
  
  
    console.log(cod)
    db.query('UPDATE armario SET status_armario = 0 WHERE cod_armario = ?', [cod], (error, results) => {
        if (error) {
            console.log('Erro ao desocupar o armário', error);
            res.status(500).send('Erro ao editar o armário')
        } else {
            res.redirect('/armarioAdm');
            console.log('desocupou')
        }
    })
  })
  
  
  app.post('/excluirArmarioAdm/:cod_armario', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.params.cod_armario;
  
    console.log('Código do armario para exclusão:', cod);
  
    db.query('DELETE FROM armario WHERE cod_armario = ?', [cod], (error, results) => {
      if (error) {
        console.log('Erro ao excluir o armario:', error);
        res.status(500).send('Erro ao excluir o armario');
      } else {
        console.log('Armario excluído com sucesso');
        res.redirect('/armarioAdm');
      }
    });
  });
  

//////////////////////////////////// PERFIL ADM /////////////////////////////////////////////
app.get('/perfilAdm', (req, res) => {

    const cod_usuario = req.session.cod_usuario;

    if (!cod_usuario) {
        return res.redirect('/'); // Redireciona para o login se não estiver logado
    }

    db.query('SELECT nome, cpf, celular, email, rua, cep, bairro, cidade, numero, complemento, status_usuario, data_inscricao, data_vencimento, foto_perfil FROM usuario WHERE cod_usuario = ?', [cod_usuario], (error, results) => {
        if (error) {
            console.error('Erro ao buscar perfil:', error);
            return res.status(500).send('Erro ao buscar perfil.');
        } else {
            if (results.length > 0) {
                const usuario = results[0];
                const foto_perfil = usuario.foto_perfil ? `data:image/jpg;base64,${usuario.foto_perfil.toString('base64')}` : '/img/init.jpg';

                // Passa o objeto `usuario` (o primeiro resultado) para a view
                res.render('perfilAdm', { usuario: usuario, foto_perfil: foto_perfil });
            } else {
                res.status(404).send('Usuário não encontrado.');
            }
        }
    });
});

// EDITAR PERFIL ///////////
app.post('/editarPerfilAdm', upload.single('profilePic'), (req, res) => {
    const cod_usuario = req.session.cod_usuario;

    if (!req.file) {
        // Redireciona para a página de perfil com uma mensagem de erro
        return res.redirect('/perfilAluno?error=Nenhuma imagem foi enviada.');
    }

    const fotoPerfil = req.file.buffer;

    // Verifique o Buffer antes da inserção no banco
    console.log('Buffer da Imagem:', fotoPerfil);

    // Query de atualização
    const updateQuery = 'UPDATE usuario SET foto_perfil = ? WHERE cod_usuario = ?';
    db.query(updateQuery, [fotoPerfil, cod_usuario], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar perfil: ', err);
            return res.status(500).send('Erro ao atualizar perfil');
        }
        console.log("Imagem salva no banco");

        // Redirecionar para a página de perfil após a atualização
        res.redirect('/perfilAdm');
    });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// ACERVO ///////////////////////////////////////////////////
app.get(['/acervoAdm'], (req, res) => {
    const cod_usuario = req.session.cod_usuario;
    if (!cod_usuario) {
        return res.redirect('/'); // Redireciona para o login se não estiver logado
    }
    res.render('acervoAdm')
  });
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////// CAMISETA ///////////////////////////////////////////////////
  app.get('/estoqueAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    db.query('SELECT cod_camiseta, modelo_camiseta, quantidade FROM camiseta ORDER BY modelo_camiseta', (error, results) => {
      if (error) {
        console.log('Houve um erro ao recuperar os dados do estoque', error);
        res.status(500).send('Erro interno do servidor');
      } else {
        console.log('puxou', results)
        res.render('estoqueAdm', { estoque: results });
      }
    });
  });

  app.get('/infoCamisetaAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
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
          res.render('infoCamisetaAdm', {
            camisetas: listaCamisetas,
            camiseta: results[0] // Passa a camiseta encontrado para a visualização
          });
  
        } else {
          res.status(404).send('Camiseta não encontrada');
        }
      });
    });
  });


  app.post('/editarCamisetaAdm/:cod_camiseta', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.params.cod_camiseta;
    const modelo = req.body.modelo_camiseta;
    const quantidade = req.body.quantidade;
  
    console.log(cod);
  
  
    db.query('UPDATE camiseta SET modelo_camiseta = ?, quantidade = ? WHERE cod_camiseta = ?', [modelo, quantidade, cod], (error, results) => {
      if (error) {
        console.log('Erro ao editar a camiseta.', error);
        res.status(500).send('Erro ao editar a camiseta');
      } else {
        res.redirect('/estoqueAdm');
        console.log('editou')
      }
    });
  });
  
  app.get('/pesquisarCamisetaAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const pesquisa = req.query.pesquisa;
    console.log(pesquisa); // Para depuração
    db.query('SELECT modelo_camiseta, cod_camiseta as "cod", quantidade FROM camiseta WHERE modelo_camiseta LIKE ?', [`%${pesquisa}%`], (error, results) => {
      if (error) {
        console.log('Ocorreu um erro ao realizar o filtro', error);
        res.status(500).send('Erro interno do servidor');
      } else {
        res.render('estoqueAdm', { estoque: results });
      }
    });
  });
  
  app.get('/adicionarCamisetaAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    carregarCamisetas((error, listaCamisetas) => {
      if (error) {
        console.log('Erro ao carregar camisetas:', error);
      }
      console.log('Camisetas:', listaCamisetas);
      res.render('cadastroCamisetaAdm', {
        camisetas: listaCamisetas
      })
    })
  })
  
  app.post('/cadastroCamisetaAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
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
        res.redirect('/estoqueAdm');
      }
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////// ENTREGA ///////////////////////////////////////////////////

  app.get('/entregaAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    res.render('entregaAdm')
  }
  );

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// ENTREGA FEITA ///////////////////////////////////////////////////
  app.get('/entregaFeitaAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    db.query('SELECT e.cod_entrega, u.nome, c.modelo_camiseta, e.status_entrega FROM entrega_camiseta e JOIN usuario u ON e.cod_usuario = u.cod_usuario JOIN camiseta c ON e.cod_camiseta = c.cod_camiseta WHERE e.status_entrega = 0 ', (error, results) => {
      if (error) {
        console.log('Houve um erro ao recuperar as entregas', error);
        res.status(500).send('Erro interno do servidor');
      } else {
        res.render('entregaFeitaAdm.ejs', { entrega: results });
      }
    });
  });
  
  
  app.get('/infoEntregaFeitaAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.query.cod_entrega
  
  
    carregarEntregas((error, listaEntragas) => {
      if (error) {
        console.log('erro ao carregar as entregas', error)
      } carregarUsuarios((error, listaUsuarios) => {
        if (error) {
          console.log('erro ao carregar usuario', error)
        } carregarTurmas((error, listaTurmas) => {
          if (error) {
            console.log('erro ao carregar o curso', error)
          } 
            carregarCamisetas((error, listaCamisetas) => {
              if (error) {
                console.log('erro ao carregar camiseta', error)
              } carregarCursos((error, listaCursos) => {
                if (error) {
                  console.log('erro ao carregar o curso', error)
                } db.query('SELECT e.cod_entrega, u.nome, u.email, DATE_FORMAT(e.data_entrega, "%d/%m/%Y") as data_entrega, u.cpf, t.nome_turma, cu.nome_curso, c.modelo_camiseta FROM entrega_camiseta e JOIN usuario u ON e.cod_usuario = u.cod_usuario JOIN camiseta c ON e.cod_camiseta = c.cod_camiseta JOIN turma t ON u.cod_turma = t.cod_turma JOIN curso cu ON t.cod_curso = cu.cod_curso WHERE e.cod_entrega = ?', [cod], (error, results) => {
                  if (error) {
                    console.log('Erro ao buscar a entrega', error)
                  } if (results.length > 0) {
                    res.render('infoEntregaFeitaAdm', {
                      entregas: listaEntragas,
                      usuarios: listaUsuarios,
                      turmas: listaTurmas,
                      camisetas: listaCamisetas,
                      cursos: listaCursos,
                      entrega: results[0]
                    })
                  } else {
                    console.log('entrega não encontrada')
                  }
                })
              })
            })
          })
        })
      })
    })
  
  
  
  app.get('/pesquisarEntregaFeitaAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const pesquisa = req.query.pesquisa;
    console.log(pesquisa); // Para depuração
    db.query('SELECT e.cod_entrega, e.status_entrega, u.nome, c.modelo_camiseta FROM entrega_camiseta e JOIN usuario u ON e.cod_usuario = u.cod_usuario JOIN camiseta c ON e.cod_camiseta = c.cod_camiseta WHERE e.status_entrega = 0 and u.nome LIKE ?', [`%${pesquisa}%`], (error, results) => {
  
  
      if (error) {
        console.log('Ocorreu um erro ao realizar o filtro', error);
        res.status(500).send('Erro interno do servidor');
      } else {
        console.log(results)
        res.render('entregaFeitaAdm.ejs', { entrega: results });
      }
    });
  });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// ENTREGA PENDENTE /////////////////////////////////////////

  app.get('/entregaPendenteAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    db.query('SELECT e.cod_entrega, u.nome, c.modelo_camiseta, e.status_entrega FROM entrega_camiseta e JOIN usuario u ON e.cod_usuario = u.cod_usuario JOIN camiseta c ON e.cod_camiseta = c.cod_camiseta WHERE e.status_entrega = 1 ', (error, results) => {
      if (error) {
        console.log('Houve um erro ao recuperar as entregas', error);
        res.status(500).send('Erro interno do servidor');
      } else {
        res.render('entregaPendenteAdm.ejs', { entrega: results });
      }
    });
  });
  
  
  app.get('/infoEntregaPendenteAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.query.cod_entrega
  
  
    carregarEntregas((error, listaEntragas) => {
      if (error) {
        console.log('erro ao carregar as entregas', error)
      } carregarUsuarios((error, listaUsuarios) => {
        if (error) {
          console.log('erro ao carregar usuario', error)
        } carregarTurmas((error, listaTurmas) => {
          if (error) {
            console.log('erro ao carregar o curso', error)
          } carregarPeriodos((error, listaPeriodos) => {
            if (error) {
              console.log('erro ao carregar período', error)
            } carregarCamisetas((error, listaCamisetas) => {
              if (error) {
                console.log('erro ao carregar camiseta', error)
              } carregarCursos((error, listaCursos) => {
                if (error) {
                  console.log('erro ao carregar o curso', error)
                } db.query('SELECT e.cod_entrega, u.nome, u.email, u.cpf, p.periodo, t.nome_turma, cu.nome_curso, c.modelo_camiseta FROM entrega_camiseta e JOIN usuario u ON e.cod_usuario = u.cod_usuario JOIN camiseta c ON e.cod_camiseta = c.cod_camiseta JOIN turma t ON u.cod_turma = t.cod_turma JOIN periodo p ON t.cod_periodo = p.cod_periodo JOIN curso cu ON t.cod_curso = cu.cod_curso WHERE e.cod_entrega = ?', [cod], (error, results) => {
                  if (error) {
                    console.log('Erro ao buscar a entrega', error)
                  } if (results.length > 0) {
                    res.render('infoEntregaPendenteAdm', {
                      entregas: listaEntragas,
                      usuarios: listaUsuarios,
                      turmas: listaTurmas,
                      periodos: listaPeriodos,
                      camisetas: listaCamisetas,
                      cursos: listaCursos,
                      entrega: results[0]
                    })
                  } else {
                    console.log('entrega não encontrada')
                  }
                })
              })
            })
          })
        })
      })
    })
  })
  
  
  
  app.get('/pesquisarEntregaPendenteAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const pesquisa = req.query.pesquisa;
    console.log(pesquisa); // Para depuração
    db.query('SELECT e.cod_entrega, e.status_entrega, u.nome, c.modelo_camiseta FROM entrega_camiseta e JOIN usuario u ON e.cod_usuario = u.cod_usuario JOIN camiseta c ON e.cod_camiseta = c.cod_camiseta WHERE e.status_entrega = 1 and u.nome LIKE ?', [`%${pesquisa}%`], (error, results) => {
  
  
      if (error) {
        console.log('Ocorreu um erro ao realizar o filtro', error);
        res.status(500).send('Erro interno do servidor');
      } else {
        console.log(results)
        res.render('entregaPendenteAdm.ejs', { entrega: results });
      }
    });
  });

  app.post('/validarEntregaPendenteAdm/:cod_entrega', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    
    const cod = req.params.cod_entrega;
    console.log (cod)
  
    db.query('UPDATE entrega_camiseta SET status_entrega = 0, data_entrega = CURDATE() WHERE cod_usuario = ?', [cod], (error, results) => {
  
      if (error) {
        console.log('Erro ao editar a entrega.', error);
      } else {
        console.log ('editou')
        res.redirect('/entregaPendenteAdm');
      }
    });
  });
  
  


// MOSTRA A PÁGINA PARA ADICIONAR EVENTOS - ADM
app.get('/indicacaoAdm', (req, res) => {
    res.render('indicacaoAdm');
});

/////////////////////////////////////////////////////////// INDICACOES LIVROS ///////////////////////////////////////////////////////////


// MOSTRA AS INDICACOES DE LIVROS - ADM
app.get('/indicacoesLivrosAdm', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }

    db.query('SELECT * FROM indicacao', (error, results) => {
        if (error) {
            console.log('Erro ao buscar as indicações:', error);
            res.status(500).send('Erro no servidor');
        } else {
            res.render('indicacoesLivrosAdm', { indicacao: results });
        }
    });
});


// PESQUISAR INDICAÇÃO livro - ADM (STATUS 0)
app.get('/pesquisarIndicacaoLivrosAdm', (req, res) => {
    const pesquisa = req.query.pesquisarLivro;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA E STATUS_INDICACAO
    db.query('SELECT cod_indicacao, titulo, autor, status_indicacao FROM indicacao WHERE titulo LIKE ? AND status_indicacao = 0', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            
            res.render('indicacoesLivrosAdm', { indicacao: results });
        }
    });
});


// MOSTRA OS DETALHES DE UMA INDICAÇÃO DE LIVRO - ADM
app.get('/infoIndicacaoLivroAdm', (req, res) => {
    const codIndicacaoLivro = req.query.tituloLivroIndicacao; // OBTÉM O CODIGO DA INDICAÇÃO DA QUERY STRING

    if (!codIndicacaoLivro) {
        return res.status(400).send('Código da indicação não fornecido');
    }

    // CONSULTA O BANCO PARA RECUPERAR OS DETALHES DA INDICAÇÃO DO LIVRO E O NOME DO USUÁRIO
    const query = `
        SELECT
            il.*,
            u.nome as nome_usuario
        FROM
            indicacao il
        INNER JOIN
            usuario u ON il.cod_usuario = u.cod_usuario
        WHERE
            il.cod_indicacao = ?`;

    db.query(query, [codIndicacaoLivro], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        if (results.length > 0) {
            res.render('infoIndicacaoLivroAdm', { indicacao: results[0] });
        } else {
            res.status(404).send('Indicação do livro não encontrada');
        }
    });
});


// APROVAR INDICACAO DE LIVRO ----------------
app.get('/aprovarIndicacao/:cod_indicacao', async (req, res) => {
    const cod_indicacao = req.params.cod_indicacao;

    try {
        // Atualiza o status da indicação
        await db.query('UPDATE indicacao SET status_indicacao = 1 WHERE cod_indicacao = ?', [cod_indicacao]);

        // Recupera os dados da indicação aprovada
        const [indicacao] = await db.query('SELECT titulo, autor, genero, descricao FROM indicacao WHERE cod_indicacao = ?', [cod_indicacao]);

        // Verifica se a indicação foi encontrada
        if (!indicacao) {
            return res.redirect('/indicacoesLivrosAdm?status=error&message=Indicação não encontrada');
        }

        console.log('Indicacao aprovada:', indicacao); // Log da indicação aprovada

        // Inserir os dados na tabela 'livro'
        console.log('Tentando inserir o livro:', {
            titulo: indicacao.titulo,
            autor: indicacao.autor,
            genero: indicacao.genero,
            descricao: indicacao.descricao
        });

        await db.query('INSERT INTO livro (titulo, autor, genero, descricao) VALUES (?, ?, ?, ?)',
            [indicacao.titulo, indicacao.autor, indicacao.genero, indicacao.descricao]);

        console.log('Livro adicionado com sucesso');

        // Redireciona com sucesso
        res.redirect('/indicacoesLivrosAdm?status=success&message=Indicação aprovada e adicionada à biblioteca');

    } catch (err) {
        console.error('Erro ao aprovar a indicação:', err);
        res.redirect('/indicacoesLivrosAdm?status=error&message=Erro ao aprovar a indicação');
    }
});


// NEGAR INDICACAO DE LIVRO ----------------
app.get('/negarIndicacao/:cod_indicacao', async (req, res) => {
    const cod_indicacao = req.params.cod_indicacao;

    try {
        // Atualiza o status da indicação para 'renegada'
        await db.query('UPDATE indicacao SET status_indicacao = 2 WHERE cod_indicacao = ?', [cod_indicacao]);

        // Recupera os dados da indicação renegada
        const [indicacao] = await db.query('SELECT titulo, autor, genero, descricao FROM indicacao WHERE cod_indicacao = ?', [cod_indicacao]);

        // Verifica se a indicação foi encontrada
        if (!indicacao) {
            return res.redirect('/indicacoesLivrosAdm?status=error&message=Indicação não encontrada');
        }

        console.log('Indicação renegada:', indicacao); // Log da indicação renegada

        // Redireciona com sucesso
        res.redirect('/indicacoesLivrosAdm?status=success&message=Indicação renegada com sucesso');

    } catch (err) {
        console.error('Erro ao negar a indicação:', err);
        res.redirect('/indicacoesLivrosAdm?status=error&message=Erro ao negar a indicação');
    }
});







//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// LIVROS APURADOS ///////////////////////////////////////////////


// MOSTRA OS LIVROS APURADOS - ADM
app.get('/livrosApuradosAdm', async (req, res) => {

    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    db.query('SELECT * FROM indicacao where status_indicacao = 1 or status_indicacao = 2', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar os usuarios', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Apuracoes recuperadas:', results);
            res.render('livrosApuradosAdm', { indicacao: results });
        }
    });
});

// PESQUISAR INDICAÇÃO APURACAO - ADM
app.get('/pesquisarLivroApuracaoAdm', (req, res) => {
    const pesquisa = req.query.pesquisarLivro;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA E STATUS_INDICACAO
    db.query('SELECT cod_indicacao, titulo, autor, status_indicacao FROM indicacao WHERE titulo LIKE ? AND status_indicacao IN (1, 2)', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log(results)
            res.render('livrosApuradosAdm', { indicacao: results });
        }
    });
});




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// INDICACOES MATERIAIS ///////////////////////////////////////////////////////////
// MOSTRA AS INDICACOES DE MATERIAIS - ADM
app.get('/indicacoesMateriaisAdm', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }

    db.query('SELECT * FROM indicacao_material', (error, results) => {
        if (error) {
            console.log('Erro ao buscar as indicações:', error);
            res.status(500).send('Erro no servidor');
        } else {
            console.log('Página de indicacao de Materiais foi acessada');
            res.render('indicacoesMateriaisAdm', { indicacao: results });
        }
    });
});

// PESQUISAR INDICAÇÃO MATERIAIS - ADM (STATUS 0)
app.get('/pesquisarIndicacaoMateriaisAdm', (req, res) => {
    const pesquisa = req.query.pesquisarMaterial;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA E STATUS_INDICACAO
    db.query('SELECT cod_material, nome_material, status_indicacao FROM indicacao_material WHERE nome_material LIKE ? AND status_indicacao = 0', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            
            res.render('indicacoesMateriaisAdm', { indicacao: results });
        }
    });
});

// MOSTRA OS DETALHES DE UMA INDICAÇÃO DE LIVRO - ADM
app.get('/infoIndicacaoMaterialAdm', (req, res) => {
    const codIndicacaoMaterial = req.query.codIndicacaoMaterial; // OBTÉM O CODIGO DA INDICAÇÃO DA QUERY STRING

    if (!codIndicacaoMaterial) {
        return res.status(400).send('Código da indicação não fornecido');
    }

    // CONSULTA O BANCO PARA RECUPERAR OS DETALHES DA INDICAÇÃO DO LIVRO E O NOME DO USUÁRIO
    const query = `
        SELECT
            il.*,
            u.nome as nome_usuario
        FROM
            indicacao_material il
        INNER JOIN
            usuario u ON il.cod_usuario = u.cod_usuario
        WHERE
            il.cod_material = ?`;

    db.query(query, [codIndicacaoMaterial], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        if (results.length > 0) {
            console.log('Página de Info de indicacao de Materiais foi acessada');
            res.render('infoIndicacaoMaterialAdm', { indicacao: results[0] });
        } else {
            res.status(404).send('Indicação do livro não encontrada');
        }
    });
});

// Aprovar indicação de material
app.get('/aprovarIndicacaoMaterial/:cod_material', async (req, res) => {
    const cod_material = req.params.cod_material;

    try {
        await db.query('UPDATE indicacao_material SET status_indicacao = 1 WHERE cod_material = ?', [cod_material]);
        res.redirect('/indicacoesMateriaisAdm?status=success&message=Material aprovado com sucesso');
    } catch (err) {
        console.error('Erro ao aprovar o material:', err);
        res.redirect('/indicacoesMateriaisAdm?status=error&message=Erro ao aprovar o material');
    }
});

// Negar indicação de material
app.get('/negarIndicacaoMaterial/:cod_material', async (req, res) => {
    const cod_material = req.params.cod_material;

    try {
        // Atualiza o status da indicação para 'renegada'
        await db.query('UPDATE indicacao_material SET status_indicacao = 2 WHERE cod_material = ?', [cod_material]);

        // Recupera os dados da indicação renegada
        const [indicacaoMaterial] = await db.query('SELECT nome_material, descricao_material FROM indicacao_material WHERE cod_material = ?', [cod_material]);

        // Verifica se a indicação foi encontrada
        if (!indicacaoMaterial) {
            return res.redirect('/indicacoesMateriaisAdm?status=error&message=Indicação de material não encontrada');
        }

        console.log('Indicação de material renegada:', indicacaoMaterial); // Log da indicação renegada

        // Redireciona com sucesso
        res.redirect('/indicacoesMateriaisAdm?status=success&message=Indicação de material renegada com sucesso');

    } catch (err) {
        console.error('Erro ao negar a indicação de material:', err);
        res.redirect('/indicacoesMateriaisAdm?status=error&message=Erro ao negar a indicação de material');
    }
});








//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// MATERIAIS APURADOS ///////////////////////////////////////////////////////////
// MOSTRA OS MATERIAIS APURADOS - ADM
app.get('/materiaisApuradosAdm', async (req, res) => {

    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }

    db.query('SELECT * FROM indicacao_material where status_indicacao = 1 or status_indicacao = 2', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar os usuarios', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Página de apurações de materiais foi acessada');
            res.render('materiaisApuradosAdm', { indicacao: results });
        }
    });
});

// PESQUISAR INDICAÇÃO APURACAO - ADM
app.get('/pesquisarMaterialApuracaoAdm', (req, res) => {
    const pesquisa = req.query.pesquisarMaterial;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA E STATUS_INDICACAO
    db.query('SELECT cod_material, nome_material, status_indicacao FROM indicacao_material WHERE nome_material LIKE ? AND status_indicacao IN (1, 2)', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('materiaisApuradosAdm', { indicacao: results });
        }
    });
});









//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// INDICACOES DE EVENTOS ///////////////////////////////////////////////////////////

// MOSTRA A LISTA DE INDICAÇÕES DE EVENTOS DISPONÍVEIS - ALUNO
app.get('/indicacoesEventosAdm', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    // CONSULTA TODOS OS LIVROS NO BANCO DE DADOS
    db.query('SELECT * FROM indicacao_evento', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar os livros', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Página de Indicacoes de Eventos foi acessada');
            res.render('indicacoesEventosAdm', { indicacao: results });
        }
    });
});


// PESQUISAR INDICAÇÃO Evento - ADM (STATUS 0)
app.get('/pesquisarIndicacaoEventosAdm', (req, res) => {
    const pesquisa = req.query.pesquisarEvento;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA E STATUS_INDICACAO
    db.query('SELECT cod_evento, nome_evento, status_indicacao FROM indicacao_evento WHERE nome_evento LIKE ? AND status_indicacao = 0', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            
            res.render('indicacoesEventosAdm', { indicacao: results });
        }
    });
});

// MOSTRA OS DETALHES DE UMA INDICAÇÃO DE EVENTO - ADM
app.get('/infoIndicacaoEventoAdm', (req, res) => {
    const tituloeventoIndicacao = req.query.tituloeventoIndicacao; // OBTÉM O CODIGO DA INDICAÇÃO DA QUERY STRING

    if (!tituloeventoIndicacao) {
        return res.status(400).send('Código da indicação não fornecido');
    }

    // CONSULTA O BANCO PARA RECUPERAR OS DETALHES DA INDICAÇÃO DO LIVRO E O NOME DO USUÁRIO
    const query = `
        SELECT
            ie.*,
            u.nome as nome_usuario
        FROM
            indicacao_evento ie
        INNER JOIN
            usuario u ON ie.cod_usuario = u.cod_usuario
        WHERE
            ie.cod_evento = ?`;

    db.query(query, [tituloeventoIndicacao], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        if (results.length > 0) {
            res.render('infoIndicacaoEventoAdm', { indicacao: results[0] });
        } else {
            res.status(404).send('Indicação do Evento não encontrada');
        }
    });
});





// Aprovar indicação de evento
app.get('/aprovarIndicacaoEvento/:cod_evento', async (req, res) => {
    const cod_evento = req.params.cod_evento;

    try {
        await db.query('UPDATE indicacao_evento SET status_indicacao = 1 WHERE cod_evento = ?', [cod_evento]);
        res.redirect('/indicacoesEventosAdm?status=success&message=Evento aprovado com sucesso');
    } catch (err) {
        console.error('Erro ao aprovar o evento:', err);
        res.redirect('/indicacoesEventosAdm?status=error&message=Erro ao aprovar o evento');
    }
});

// Negar indicação de evento
app.get('/negarIndicacaoEvento/:cod_evento', async (req, res) => {
    const cod_evento = req.params.cod_evento;

    try {
        // Atualiza o status da indicação para 'renegada'
        await db.query('UPDATE indicacao_evento SET status_indicacao = 2 WHERE cod_evento = ?', [cod_evento]);

        // Recupera os dados da indicação renegada
        const [indicacaoEvento] = await db.query('SELECT nome_evento, descricao_evento FROM indicacao_evento WHERE cod_evento = ?', [cod_evento]);

        // Verifica se a indicação foi encontrada
        if (!indicacaoEvento) {
            return res.redirect('/indicacoesEventosAdm?status=error&message=Indicação de evento não encontrada');
        }

        console.log('Indicação de evento renegada:', indicacaoEvento); // Log da indicação renegada

        // Redireciona com sucesso
        res.redirect('/indicacoesEventosAdm?status=success&message=Indicação de evento renegada com sucesso');

    } catch (err) {
        console.error('Erro ao negar a indicação de evento:', err);
        res.redirect('/indicacoesEventosAdm?status=error&message=Erro ao negar a indicação de evento');
    }
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// EVENTOS APURADOS ///////////////////////////////////////////////////////////
// MOSTRA OS EVENTOS APURADOS - ADM
app.get('/eventosApuradosAdm', async (req, res) => {

    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }

    db.query('SELECT * FROM indicacao_evento where status_indicacao = 1 or status_indicacao = 2', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar os usuarios', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Apuracoes recuperadas:', results);
            res.render('eventosApuradosAdm', { indicacao: results });
        }
    });
});

// PESQUISAR INDICAÇÃO APURACAO - ADM
app.get('/pesquisarEventoApuracaoAdm', (req, res) => {
    const pesquisa = req.query.pesquisarEvento;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA E STATUS_INDICACAO
    db.query('SELECT cod_evento, nome_evento, status_indicacao FROM indicacao_evento WHERE nome_evento LIKE ? AND status_indicacao IN (1, 2)', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('eventosApuradosAdm', { indicacao: results });
        }
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////// LIVROS ////////////////////////////////////////////////////////////////////////////
// MOSTRA A LISTA DE LIVROS DISPONÍVEIS - Adm
app.get(['/livrosAdm'], (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    db.query('SELECT cod_livro, titulo, autor FROM livro', (error, results) => {
      if (error) {
        console.log('Houve um erro ao recuperar os dados do livro', error);
        res.status(500).send('Erro interno do servidor');
      } else {
        console.log('puxou', results)
        res.render('livrosAdm.ejs', { livros: results });
      }
    });
  });
  

  
  app.get('/adicionarLivroAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    carregarLivros((error, listaLivros) => {
      if (error) {
        console.log('Erro ao carregar livros:', error);
      }
      console.log('Livros:', listaLivros);
      res.render('cadastrarLivroAdm.ejs', {
        livros: listaLivros
      })
    })
  })
  
  
  app.post('/cadastrarLivroAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    // Extraindo os valores do corpo da requisição
    const titulo = req.body.titulo;
    const autor = req.body.autor;
    const genero = req.body.genero;
    const descricao = req.body.descricao;
  
    console.log(titulo);
    console.log(autor);
    console.log(genero);
    console.log(descricao);
  
    // Executando a query com os valores extraídos do corpo da requisição
    db.query("INSERT INTO livro (titulo, autor, genero, descricao) values (?, ?, ?, ?)", [titulo, autor, genero, descricao], (error, results) => {
      if (error) {
        // Em caso de erro, loga a mensagem de erro e envia uma resposta de erro
        console.log('Erro ao cadastrar livro:', error);
        res.status(500).send('Erro ao cadastrar livro');
      } else {
        res.redirect('/livrosAdm');
      }
    });
  });
  
  app.get('/pesquisarLivroAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const pesquisa = req.query.pesquisa;
    console.log(pesquisa)
    db.query('SELECT * FROM livro WHERE titulo like ? or autor like ?', [`%${pesquisa}%`, `%${pesquisa}%`], (error, results) => {
      if (error) {
        console.log('Ocorreu um erro ao realizar o filtro')
      } else {
        res.render('livrosAdm.ejs', { livros: results })
        console.log(results)
      }
    });
  })
  
  
  app.get('/infoLivroAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.query.cod_livro;
  
    carregarLivros((error, listaLivros) => {
      if (error) {
        console.log('Erro ao carregar livros:', error);
        return res.status(500).send('Erro ao carregar livros');
      }
  
      db.query('SELECT * FROM livro WHERE cod_livro = ?', [cod], (error, results) => {
        if (error) {
          console.log('Erro ao buscar o livro com o cod_livro', cod, error);
          return res.status(500).send('Erro ao buscar o livro');
        }
  
        if (results.length > 0) {
          res.render('infoLivroAdm', {
            livros: listaLivros,
            livro: results[0]
          });
  
        } else {
          res.status(404).send('Livro não encontrado');
        }
      });
    });
  });
  
  
  app.post('/editarLivroAdm/:cod_livro', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.params.cod_livro
    const titulo = req.body.titulo;
    const autor = req.body.autor;
    const genero = req.body.genero;
    const descricao = req.body.descricao;
  
    console.log(cod);
  
  
    db.query('UPDATE livro SET titulo = ?, autor = ?, genero = ?, descricao = ? WHERE cod_livro = ?', [titulo, autor, genero, descricao, cod], (error, results) => {
      if (error) {
        console.log('Erro ao editar o livros.', error);
        res.status(500).send('Erro ao editar o livros');
      } else {
        res.redirect('/livrosAdm');
        console.log('editou')
      }
    });
  });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// EVENTOS ////////////////////////////////////////////////////////////////////////////////////


app.get('/adicionarEventosAdm', (req, res) => {
    // RENDERIZA O FORMULÁRIO PARA ADICIONAR UM NOVO EVENTO ADM
    res.render('adicionarEventosAdm');
});

// CADASTRAR OS USUARIOS - ADM
app.get('/cadastrarUsuarioAdm', (req, res) => {
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
                    res.render('cadastrarUsuarioAdm', {
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
app.post('/cadastrarUsuarioAdm', (req, res) => {
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
            console.log("erro ao inserir o usuario", error)
        } else {

            db.query("SELECT cod_usuario FROM usuario WHERE cpf = ?", [cpf], (error, results) => {
                console.log('resultado da pesquisa', results)
                const cod = results[0]?.cod_usuario
                console.log('cod_usuario esperado', cod)
                if (error) {
                    // Em caso de erro, loga a mensagem de erro e envia uma resposta de erro
                    console.log('Erro ao buscar o usuario', error);
                    res.status(500).send('Erro ao cadastrar usuario');
                } else {
                    if (cargo === 1) {
                        db.query("INSERT INTO entrega_camiseta (cod_camiseta, cod_usuario, status_entrega) VALUES (?, ?, 1)", [camiseta, cod], (error, results) => {
                            if (error) {
                                console.log('erro ao mandar a camiseta', error)
                            } else {
                                res.redirect('/usuariosAdm');
                            }

                        })

                    } else {
                        res.redirect('/usuariosAdm');
                    }

                }
            })
        }
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// MATERIAL ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get(['/materialAdm'], (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    db.query('SELECT cod_material, nome_material, status_material FROM material ORDER BY nome_material', (error, results) => {
      if (error) {
        console.log('Houve um erro ao recuperar os dados do material:', error);
        res.status(500).send('Erro ao recuperar dados');
      } else {
        // Mapear os resultados para adicionar o status
        const material = results.map((item) => {
          let status = '';
          if (item.status_material === 0) {
            status = 'quebrado';
          } else if (item.status_material === 1) {
            status = 'funcionando';
          } else if (item.status_material === 2) {
            status = 'em manutenção';
          } else {
            status = 'não definido';
          }
          return { ...item, status }; // Retorna um novo objeto com o status adicionado
        });
  
        res.render('materialAdm', { material });
      }
    });
  });
  
  app.get('/pesquisarMaterialAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const pesquisa = req.query.pesquisa;
    console.log(pesquisa)
    db.query('SELECT * FROM material WHERE nome_material like ?', [`%${pesquisa}%`, `%${pesquisa}%`], (error, results) => {
      if (error) {
        console.log('Houve um erro ao recuperar os dados do material:', error);
        res.status(500).send('Erro ao recuperar dados');
      } else {
        // Mapear os resultados para adicionar o status
        const material = results.map((item) => {
          let status = '';
          if (item.status_material === 0) {
            status = 'quebrado';
          } else if (item.status_material === 1) {
            status = 'funcionando';
          } else if (item.status_material === 2) {
            status = 'em manutenção';
          } else {
            status = 'não definido';
          }
          return { ...item, status }; // Retorna um novo objeto com o status adicionado
        });
  
        res.render('materialAdm', { material });
        console.log(results)
      }
    });
  })
  
  
  
  app.get('/adicionarMaterialAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    carregarMateriais((error, listaMateriais) => {
      if (error) {
        console.log('Erro ao carregar materiais:', error)
      }
  
      console.log('Materiais: ', listaMateriais);
      res.render('cadastrarMaterialAdm.ejs', {
        materiais: listaMateriais
      })
    })
  });
  
  
  app.post('/cadastrarMaterialAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    // Extraindo os valores do corpo da requisição
    const nome = req.body.nome_material;
    const descricao = req.body.descricao;
  
    console.log("nome do material:", nome);
    console.log("descricao:", descricao);
  
    // Executando a query com os valores extraídos do corpo da requisição
    db.query("INSERT INTO material (nome_material, descricao_material, status_material) VALUES (?, ?, 1)", [nome, descricao], (error, results) => {
      if (error) {
        // Em caso de erro, loga a mensagem de erro e envia uma resposta de erro
        console.log('Erro ao cadastrar material:', error);
        res.status(500).send('Erro ao cadastrar material');
      } else {
        console.log('cadastrado')
        res.redirect('/materialAdm');
      }
    });
  });
  
  
  app.get('/infoMaterialAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
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
          res.render('infoMaterialAdm', {
            materiais: listaMateriais,
            material: results[0] // Passa o material encontrado para a visualização
          });
  
        } else {
          res.status(404).send('Material não encontrado');
        }
      });
    });
  });
  
  
  
  app.post('/editarMaterialAdm/:cod_material', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.params.cod_material;
    const nome = req.body.nome_material;
    const descricao = req.body.descricao;
  
    console.log(cod);
  
  
    db.query('UPDATE material SET nome_material = ?, descricao_material = ? WHERE cod_material = ?', [nome, descricao, cod], (error, results) => {
      if (error) {
        console.log('Erro ao editar o material.', error);
        res.status(500).send('Erro ao editar o material');
      } else {
        res.redirect('/materialAdm');
        console.log('editou')
      }
    });
  });
  
  
  app.post('/excluirMaterialAdm/:cod_material', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.params.cod_material;
  
    console.log('Código do material para exclusão:', cod);
  
    db.query('DELETE FROM material WHERE cod_material = ?', [cod], (error, results) => {
      if (error) {
        console.log('Erro ao excluir o material:', error);
        res.status(500).send('Erro ao excluir o material');
      } else {
        console.log('Material excluído com sucesso');
        res.redirect('/materialAdm');
      }
    });
  });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// PATRIMONIO //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get(['/patrimonioAdm'], (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    db.query('SELECT cod_patrimonio, nome_patrimonio, status_patrimonio FROM patrimonio ORDER BY nome_patrimonio', (error, results) => {
      if (error) {
        console.log('Houve um erro ao recuperar os dados do patrimônio:', error);
        res.status(500).send('Erro ao recuperar dados');
      } else {
        // Mapear os resultados para adicionar o status
        const patrimonio = results.map((item) => {
          let status = '';
          if (item.status_patrimonio === 0) {
            status = 'quebrado';
          } else if (item.status_patrimonio === 1) {
            status = 'funcionando';
          } else if (item.status_patrimonio === 2) {
            status = 'em manutenção';
          } else {
            status = 'não definido';
          }
          return { ...item, status }; // Retorna um novo objeto com o status adicionado
        });
  
        res.render('patrimonioAdm', { patrimonio });
      }
    });
  });
  
  //redirecionar para a página de cadastro
  app.get('/adicionarPatrimonioAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    carregarPatrimonios((error, listaPatrimonios) => {
      if (error) {
        console.log('Erro ao carregar patrimônios:', error)
      }
  
      console.log('Patrimônios: ', listaPatrimonios);
      res.render('cadastrarPatrimonioAdm.ejs', {
        patrimonios: listaPatrimonios
      })
    })
  });
  
  
  //cadastrar patrimônio
  // 1 => funcionando
  // 2 => em manutenção
  // 0 => quebrado 
  app.post('/cadastrarPatrimonioAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const nome = req.body.nome_patrimonio;
    const detalhe = req.body.detalhe;
  
    console.log("nome do patrimônio:", nome);
    console.log("detalhe:", detalhe);
  
    db.query("INSERT INTO patrimonio (nome_patrimonio, detalhe_patrimonio, status_patrimonio) VALUES (?, ?, 1)", [nome, detalhe], (error, results) => {
      if (error) {
        console.log('Erro ao cadastrar patrimônio:', error);
        res.status(500).send('Erro ao cadastrar patrimônio');
      } else {
        console.log('cadastrado')
        res.redirect('/patrimonioAdm');
      }
    });
  });
  
  
  app.get('/pesquisarPatrimonioAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const pesquisa = req.query.pesquisa;
    console.log(pesquisa)
    db.query('SELECT * FROM patrimonio WHERE nome_patrimonio like ?', [`%${pesquisa}%`], (error, results) => {
      if (error) {
        console.log('Houve um erro ao recuperar os dados do patrimônio:', error);
        res.status(500).send('Erro ao recuperar dados');
      } else {
        // Mapear os resultados para adicionar o status
        const patrimonio = results.map((item) => {
          let status = '';
          if (item.status_patrimonio === 0) {
            status = 'quebrado';
          } else if (item.status_patrimonio === 1) {
            status = 'funcionando';
          } else if (item.status_patrimonio === 2) {
            status = 'em manutenção';
          } else {
            status = 'não definido';
          }
          return { ...item, status }; // Retorna um novo objeto com o status adicionado
        });
  
        res.render('patrimonioAdm', { patrimonio });
      }
    });
  })
  
  app.get('/infoPatrimonioAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.query.cod_patrimonio;
  
    carregarPatrimonios((error, listaPatrimonios) => {
      if (error) {
        console.log('Erro ao carregar patrimônio:', error);
        return res.status(500).send('Erro ao patrimônio ');
      }
  
      db.query('SELECT * FROM patrimonio WHERE cod_patrimonio = ?', [cod], (error, results) => {
        if (error) {
          console.log('Erro ao buscar o patrimônio com o cod_patrimonio', cod, error);
          return res.status(500).send('Erro ao buscar o patrimônio');
        }
  
        if (results.length > 0) {
          // Renderize a página com os dados do patrimônio
          res.render('infoPatrimonioAdm', {
            patrimonios: listaPatrimonios,
            patrimonio: results[0] // Passa o patrimônio encontrado para a visualização
          });
  
        } else {
          res.status(404).send('patrimonio não encontrado');
        }
      });
    });
  });
  
  
  app.post('/editarPatrimonioAdm/:cod_patrimonio', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.params.cod_patrimonio;
    const nome = req.body.nome_patrimonio;
    const detalhe = req.body.detalhe;
  
    console.log(cod);
  
  
    db.query('UPDATE patrimonio SET nome_patrimonio = ?, detalhe_patrimonio = ? WHERE cod_patrimonio = ?', [nome, detalhe, cod], (error, results) => {
      if (error) {
        console.log('Erro ao editar o patrimônio.', error);
        res.status(500).send('Erro ao editar o patrimônio');
      } else {
        res.redirect('/patrimonioAdm');
        console.log('editou')
      }
    });
  });
  
  
  app.post('/excluirPatrimonioAdm/:cod_patrimonio', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.params.cod_patrimonio;
  
  
    db.query('DELETE FROM patrimonio WHERE cod_patrimonio = ?', [cod], (error, results) => {
      if (error) {
        console.log('Erro ao excluir o patrimõnio:', error);
        res.status(500).send('Erro ao excluir o patrimonio');
      } else {
        console.log('patrimônio excluído com sucesso');
        res.redirect('/patrimonioAdm');
      }
    });
  });



  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////// SOLICITAÇÕES - ADM /////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/solicitacoesAdm', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }
    console.log('Página de solicitações foi acessada');
    res.render('solicitacoesAdm',);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// SOLICITACOES DE MATERIAIS ///////////////////////////////////////////////////////////////

// SOLICITACOES MATERIAIS - Adm
app.get('/solicitacoesMateriaisAdm', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    // CONSULTA TODOS AS SOLICITACOES NO BANCO DE DADOS
    db.query('SELECT sm.*, m.nome_material FROM solicitacao_material sm INNER JOIN material m ON sm.cod_material = m.cod_material where status_solicitacao = 0', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar as solicitações', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Página de Solicitações de materiais foi acessada');
            res.render('solicitacoesMateriaisAdm', { solicitacao: results });
        }
    });
});

// PESQUISAR SOLICITACAO MATERIAL - ALUNO
app.get('/pesquisarSolicitacaoMaterialAdm', (req, res) => {
    const pesquisa = req.query.pesquisarMaterial;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA
    db.query('SELECT sm.cod_material, m.nome_material, sm.status_solicitacao FROM solicitacao_material sm INNER JOIN material m ON sm.cod_material = m.cod_material WHERE nome_material LIKE ? AND status_solicitacao = 0', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('solicitacoesMateriaisAdm', { solicitacao: results });
        }
    });
});

// VER INDICAÇÃO EVENTO ALUNO
app.get('/infoSolicitacaoMaterialAdm', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    const codSolicitacaoMaterial = req.query.codSolicitacaoMaterial; // OBTÉM O CODIGO DA INDICAÇÃO DA QUERY STRING

    if (!codSolicitacaoMaterial) {
        return res.status(400).send('Código da indicação não fornecido');
    }

    // CONSULTA O BANCO PARA RECUPERAR OS DETALHES DA INDICAÇÃO DO LIVRO E O NOME DO USUÁRIO
    const query = `
        SELECT sm.*,
         u.nome as nome_usuario,
         m.nome_material as nome_material
        FROM
            solicitacao_material sm
        INNER JOIN
            usuario u ON sm.cod_usuario = u.cod_usuario
        INNER JOIN
            material m ON sm.cod_material = m.cod_material
        WHERE
            sm.cod_material = ?`;

    db.query(query, [codSolicitacaoMaterial], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        if (results.length > 0) {
            res.render('infoSolicitacaoMaterialAdm', { solicitacao: results[0] });
        } else {
            res.status(404).send('Solicitação de materiais não encontrada');
        }
    });
});


// NEGAR INDICACAO DE LIVRO ----------------
app.get('/negarSolicitacao/:cod_solicitacao', async (req, res) => {
    const cod_solicitacao = req.params.cod_solicitacao;

    try {
        // Atualiza o status da indicação para 'renegada'
        await db.query('UPDATE solicitacao_material SET status_solicitacao = 2 WHERE cod_solicitacao = ?', [cod_solicitacao]);

        // Recupera os dados da indicação renegada
        const [solicitacao] = await db.query('SELECT * FROM solicitacao_material WHERE cod_solicitacao = ?', [cod_solicitacao]);

        // Verifica se a indicação foi encontrada
        if (!solicitacao) {
            return res.redirect('/solicitacoesMateriaisAdm?status=error&message=Solicitacao não encontrada');
        }

        console.log('Solicitação renegada:', solicitacao); // Log da indicação renegada

        // Redireciona com sucesso
        res.redirect('/solicitacoesMateriaisAdm?status=success&message=Solicitacao renegada com sucesso');

    } catch (err) {
        console.error('Erro ao negar a Solicitacao:', err);
        res.redirect('/solicitacoesMateriaisAdm?status=error&message=Erro ao negar a Solicitacao');
    }
});

// APROVAR INDICACAO DE LIVRO ----------------
app.get('/aprovarSolicitacao/:cod_solicitacao', async (req, res) => {
    const cod_solicitacao = req.params.cod_solicitacao;

    try {
        // Atualiza o status da indicação para 'renegada'
        await db.query('UPDATE solicitacao_material SET status_solicitacao = 1 WHERE cod_solicitacao = ?', [cod_solicitacao]);

        // Recupera os dados da indicação renegada
        const [solicitacao] = await db.query('SELECT * FROM solicitacao_material WHERE cod_solicitacao = ?', [cod_solicitacao]);

        // Verifica se a indicação foi encontrada
        if (!solicitacao) {
            return res.redirect('/solicitacoesMateriaisAdm?status=error&message=Solicitacao não encontrada');
        }

        console.log('Solicitação aceita:', solicitacao); // Log da indicação renegada

        // Redireciona com sucesso
        res.redirect('/solicitacoesMateriaisAdm?status=success&message=Solicitacao aceita com sucesso');

    } catch (err) {
        console.error('Erro ao negar a Solicitacao:', err);
        res.redirect('/solicitacoesMateriaisAdm?status=error&message=Erro ao negar a Solicitacao');
    }
});






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// SOLICITACOES APURADAS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MOSTRA OS LIVROS APURADOS - ADM
app.get('/solicitacoesMateriaisApuradasAdm', async (req, res) => {

    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }

    const pesquisa = req.query.pesquisarMaterial || ''; // Recebe o termo de pesquisa, se fornecido
    const pesquisaComLike = `%${pesquisa}%`; // Adiciona caracteres % para busca parcial

    db.query(
        'SELECT sm.cod_material, m.nome_material, sm.status_solicitacao FROM solicitacao_material sm INNER JOIN material m ON sm.cod_material = m.cod_material WHERE (sm.status_solicitacao = 1 OR sm.status_solicitacao = 2) AND m.nome_material LIKE ?',
        [pesquisaComLike],
        (error, results) => {
            if (error) {
                console.log('Houve um erro ao recuperar os materiais apurados', error);
                res.status(500).send('Erro interno do servidor');
            } else {
                console.log('Apurações recuperadas:', results);
                res.render('solicitacoesMateriaisApuradasAdm', { solicitacao: results });
            }
        }
    );
});


// PESQUISAR SOLICITACAO APURACAO - ADM
app.get('/pesquisarSolicitacaoApuracaoAdm', (req, res) => {
    const pesquisa = req.query.pesquisarMaterial;

    db.query(
        `SELECT sm.cod_material, m.nome_material, sm.status_solicitacao 
         FROM solicitacao_material sm 
         INNER JOIN material m ON sm.cod_material = m.cod_material 
         WHERE m.nome_material LIKE ? AND sm.status_solicitacao IN (1, 2)`, 
        [`%${pesquisa}%`],
        (error, results) => {
            if (error) {
                console.log('Ocorreu um erro ao realizar a pesquisa', error);
                res.status(500).send('Erro interno do servidor');
            } else {
                res.render('solicitacoesMateriaisApuradasAdm', { solicitacao: results });
            }
        }
    );
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// SOLICITACOES PATRIMONIOS ////////////////////////////////////////

// SOLICITACOES Patrimonios - Adm
app.get('/solicitacoesPatrimoniosAdm', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('login'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    // CONSULTA TODOS AS SOLICITACOES NO BANCO DE DADOS
    db.query('SELECT sm.*, m.nome_patrimonio FROM solicitacao_patrimonio sm INNER JOIN patrimonio m ON sm.cod_patrimonio = m.cod_patrimonio WHERE status_solicitacao = 0', (error, results) => {
        if (error) {
            console.log('Houve um erro ao recuperar as solicitações', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            console.log('Página de Solicitações de Patrimônios foi acessada');
            res.render('solicitacoesPatrimoniosAdm', { solicitacao: results });
        }
    });
});

// PESQUISAR SOLICITACAO PATRIMONIOS - ALUNO
app.get('/pesquisarSolicitacaoPatrimonioAdm', (req, res) => {
    const pesquisa = req.query.pesquisarPatrimonio;

    // EXECUTA A CONSULTA COM BASE NO TERMO DE PESQUISA
    db.query('SELECT sp.cod_patrimonio, m.nome_patrimonio FROM solicitacao_patrimonio sp INNER JOIN patrimonio m ON sp.cod_patrimonio = m.cod_patrimonio WHERE nome_patrimonio LIKE ?', [`%${pesquisa}%`], (error, results) => {
        if (error) {
            console.log('Ocorreu um erro ao realizar a pesquisa', error);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.render('SolicitacoesPatrimoniosAdm', { solicitacao: results });
        }
    });
});

// VER SOLICITACAO PATRIMONIO ALUNO
app.get('/InfoSolicitacaoPatrimonioAdm', (req, res) => {
    if (!req.session.cod_usuario) {
        return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
    const codPatrimonio = req.query.codSolicitacaoPatrimonio; // OBTÉM O CODIGO DA INDICAÇÃO DA QUERY STRING

    if (!codPatrimonio) {
        return res.status(400).send('Código da indicação não fornecido');
    }

    // CONSULTA O BANCO PARA RECUPERAR OS DETALHES DA INDICAÇÃO DO LIVRO E O NOME DO USUÁRIO
    const query = `
        SELECT sm.*,
         u.nome as nome_usuario,
         m.nome_patrimonio as nome_patrimonio
        FROM
            solicitacao_patrimonio sm
        INNER JOIN
            usuario u ON sm.cod_usuario = u.cod_usuario
        INNER JOIN
            patrimonio m ON sm.cod_patrimonio = m.cod_patrimonio
        WHERE
            sm.cod_patrimonio = ?`;

    db.query(query, [codPatrimonio], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).send('Erro interno do servidor');
        }

        if (results.length > 0) {
            res.render('InfoSolicitacaoPatrimonioAdm', { solicitacao: results[0] });
        } else {
            res.status(404).send('Solicitação de materiais não encontrada');
        }
    });
});

// NEGAR SOLICITAÇÃO DE PATRIMÔNIO ----------------
app.get('/negarSolicitacaoPatrimonio/:cod_patrimonio', async (req, res) => {
    const cod_patrimonio = req.params.cod_patrimonio;

    try {
        // Atualiza o status da solicitação para 'renegada'
        await db.query('UPDATE solicitacao_patrimonio SET status_solicitacao = 2 WHERE cod_patrimonio = ?', [cod_patrimonio]);

        // Recupera os dados da solicitação renegada
        const [solicitacao] = await db.query('SELECT * FROM solicitacao_patrimonio WHERE cod_patrimonio = ?', [cod_patrimonio]);

        // Verifica se a solicitação foi encontrada
        if (!solicitacao) {
            return res.redirect('/solicitacoesPatrimoniosAdm?status=error&message=Solicitação não encontrada');
        }

        console.log('Solicitação renegada:', solicitacao); // Log da solicitação renegada

        // Redireciona com sucesso
        res.redirect('/solicitacoesPatrimoniosAdm?status=success&message=Solicitação renegada com sucesso');

    } catch (err) {
        console.error('Erro ao negar a solicitação:', err);
        res.redirect('/solicitacoesPatrimoniosAdm?status=error&message=Erro ao negar a solicitação');
    }
});

// APROVAR SOLICITAÇÃO DE PATRIMÔNIO ----------------
app.get('/aprovarSolicitacaoPatrimonio/:cod_patrimonio', async (req, res) => {
    const cod_patrimonio = req.params.cod_patrimonio;

    try {
        // Atualiza o status da solicitação para 'aprovada'
        await db.query('UPDATE solicitacao_patrimonio SET status_solicitacao = 1 WHERE cod_patrimonio = ?', [cod_patrimonio]);

        // Recupera os dados da solicitação aprovada
        const [solicitacao] = await db.query('SELECT * FROM solicitacao_patrimonio WHERE cod_patrimonio = ?', [cod_patrimonio]);

        // Verifica se a solicitação foi encontrada
        if (!solicitacao) {
            return res.redirect('/solicitacoesPatrimoniosAdm?status=error&message=Solicitação não encontrada');
        }

        console.log('Solicitação aprovada:', solicitacao); // Log da solicitação aprovada

        // Redireciona com sucesso
        res.redirect('/solicitacoesPatrimoniosAdm?status=success&message=Solicitação aprovada com sucesso');

    } catch (err) {
        console.error('Erro ao aprovar a solicitação:', err);
        res.redirect('/solicitacoesPatrimoniosAdm?status=error&message=Erro ao aprovar a solicitação');
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// SOLICITACOES PATRIMONIOS APURADAS ////////////////////////////////////////

app.get('/solicitacoesPatrimoniosApuradosAdm', async (req, res) => {

    if (!req.session.cod_usuario) {
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    }

    const pesquisa = req.query.pesquisarMaterial || ''; // Recebe o termo de pesquisa, se fornecido
    const pesquisaComLike = `%${pesquisa}%`; // Adiciona caracteres % para busca parcial

    db.query(
        'SELECT sm.cod_patrimonio, m.nome_patrimonio, sm.status_solicitacao FROM solicitacao_patrimonio sm INNER JOIN patrimonio m ON sm.cod_patrimonio = m.cod_patrimonio WHERE (sm.status_solicitacao = 1 OR sm.status_solicitacao = 2) AND m.nome_patrimonio LIKE ?',
        [pesquisaComLike],
        (error, results) => {
            if (error) {
                console.log('Houve um erro ao recuperar os materiais apurados', error);
                res.status(500).send('Erro interno do servidor');
            } else {
                console.log('Apurações recuperadas:', results);
                res.render('solicitacoesPatrimoniosApuradosAdm', { solicitacao: results });
            }
        }
    );
});


// PESQUISAR SOLICITACAO APURACAO - ADM
app.get('/pesquisarSolicitacaoApuracaoPatrimonioAdm', (req, res) => {
    const pesquisa = req.query.pesquisarPatrimonio;

    db.query(
        `SELECT sm.cod_patrimonio, m.nome_patrimonio, sm.status_solicitacao 
         FROM solicitacao_patrimonio sm 
         INNER JOIN patrimonio m ON sm.cod_patrimonio = m.cod_patrimonio 
         WHERE m.nome_patrimonio LIKE ? AND sm.status_solicitacao IN (1, 2)`, 
        [`%${pesquisa}%`],
        (error, results) => {
            if (error) {
                console.log('Ocorreu um erro ao realizar a pesquisa', error);
                res.status(500).send('Erro interno do servidor');
            } else {
                res.render('solicitacoesPatrimoniosApuradosAdm', { solicitacao: results });
            }
        }
    );
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// OCORRENCIAS ///////////////////////////////////////////////////////


app.get(['/ocorrenciaAdm'], (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    res.render('ocorrenciaAdm.ejs')
  })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// OCORRENCIAS PATRIMONIOs ///////////////////////////////////////////////////////

app.get(['/ocorrenciasPatrimonioAdm'], (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    db.query('SELECT o.cod_ocorrencia, DATE_FORMAT(o.data_ocorrencia, "%d/%m/%Y") as data_ocorrencia, o.status_ocorrencia, p.nome_patrimonio FROM ocorrencia_patrimonio o JOIN patrimonio p ON o.cod_patrimonio = p.cod_patrimonio order by o.status_ocorrencia;;', (error, results) => {
      if (error) {
        console.log('Houve um erro ao recuperar os dados do ocorrencia', error);
        res.status(500).send('Erro interno do servidor');
      } else {
        console.log('Resultados:', results)
        res.render('ocorrenciasPatrimonioAdm.ejs', { ocorrenciaPatrimonio: results });
      }
    });
  });
  
  
  app.get('/pesquisarOcorrenciaPatrimonioAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const pesquisa = req.query.pesquisa;
    console.log(pesquisa); // Para depuração
    db.query('SELECT o.cod_ocorrencia,o.status_ocorrencia, p.nome_patrimonio FROM ocorrencia_patrimonio o JOIN patrimonio p ON o.cod_patrimonio = p.cod_patrimonio WHERE p.nome_patrimonio like ? order by o.status_ocorrencia;', [`%${pesquisa}%`], (error, results) => {
  
  
      if (error) {
        console.log('Ocorreu um erro ao realizar o filtro', error);
        res.status(500).send('Erro interno do servidor');
      } else {
        res.render('ocorrenciasPatrimonioAdm.ejs', { ocorrenciaPatrimonio: results });
      }
    });
  });
  
  
  app.get('/adicionarOcorrenciaPatrimonioAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    carregarOcorrenciasPatrimonios((error, listaOcorrenciaPatrimonios) => {
      if (error) {
        console.log('Erro ao carregar ocorrencia_patrimonio:', error);
      } carregarPatrimonios ((error, listaPatrimonios) => {
        if (error) {
          console.log ('Erro ao carregar patrimonios:', error)
        }
      
      res.render('cadastrarOcorrenciaPatrimonioAdm', {
        ocorrenciaPatrimonios: listaOcorrenciaPatrimonios,
        patrimonios: listaPatrimonios
      })
    })
  })
  })
  
  
  app.post('/cadastrarOcorrenciaPatrimonioAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
  
    // Extraindo os valores do corpo da requisição
    const patrimonio = parseInt(req.body.patrimonio); 
    const data = req.body.data;
    const detalhe = req.body.detalhe;
    const status = req.body.status;
  
    // Puxando o cod_usuario da sessão
    const cod_usuario = req.session.cod_usuario;
  
    console.log(status);
  
    // Executando a query com os valores extraídos do corpo da requisição
    db.query(
      "INSERT INTO ocorrencia_patrimonio (cod_patrimonio, cod_usuario, data_ocorrencia, detalhes_ocorrencia, status_ocorrencia) VALUES (?, ?, ?, ?, ?)", 
      [patrimonio, cod_usuario, data, detalhe, status], 
      (error, results) => {
        if (error) {
          // Em caso de erro, loga a mensagem de erro e envia uma resposta de erro
          console.log('Erro ao cadastrar ocorrencia:', error);
          res.status(500).send('Erro ao cadastrar ocorrencia');
        } else {
          res.redirect('/ocorrenciasPatrimonioAdm');
        }
      }
    );
  });
  
  app.get('/infoOcorrenciaPatrimonioAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
  
    const cod = req.query.cod_ocorrencia; // Acessando o código da ocorrência pela query string
    console.log('Código da ocorrência:', cod);
  
    // Carregar as ocorrências e outros dados necessários
    carregarOcorrenciasPatrimonios((error, listaOcorrenciaPatrimonios) => {
      if (error) {
        console.log('Erro ao carregar ocorrencias_patrimonio:', error);
      }
  
      carregarPatrimonios((error, listaPatrimonios) => {
        if (error) {
          console.log('Erro ao carregar patrimonios:', error);
        }
  
        carregarUsuarios((error, listaUsuarios) => {
          if (error) {
            console.log('Erro ao carregar usuarios:', error);
          }
  
          // Query para pegar a ocorrência específica
          db.query('SELECT o.cod_ocorrencia, p.nome_patrimonio, u.nome, DATE_FORMAT(data_ocorrencia, "%d/%m/%Y") as data_ocorrencia, o.detalhes_ocorrencia, o.status_ocorrencia FROM ocorrencia_patrimonio o JOIN patrimonio p ON o.cod_patrimonio = p.cod_patrimonio JOIN usuario u ON u.cod_usuario = o.cod_usuario WHERE o.cod_ocorrencia = ?', [cod], (error, results) => {
            if (error) {
              console.log('Erro ao puxar informações da ocorrência:', error);
            }
  
            if (results.length > 0) {
              res.render('infoOcorrenciaPatrimonioAdm', {
                ocorrenciasPatrimonio: listaOcorrenciaPatrimonios,
                usuarios: listaUsuarios,
                patrimonios: listaPatrimonios,
                ocorrencia: results[0] // Passando a ocorrência encontrada para a view
              });
            } else {
              console.log('Ocorrência não encontrada');
              res.status(404).send('Ocorrência não encontrada');
            }
          });
        });
      });
    });
  });
  
  
  app.post ('/editarOcorrenciaPatrimonioAdm/:cod_ocorrencia', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.params.cod_ocorrencia;
    const status = req.body.status;
  
    console.log(cod);
  
  
    db.query('UPDATE ocorrencia_patrimonio SET status_ocorrencia = ? WHERE cod_ocorrencia = ?', [status, cod], (error, results) => {
      if (error) {
        console.log('Erro ao editar a ocorrencia,', error);
        res.status(500).send('Erro ao editar a ocorrência');
      } else {
        res.redirect('/ocorrenciasPatrimonioAdm');
        console.log('editou')
      }
    });
  });
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// OCORRENCIAS MATERIAL ///////////////////////////////////////////////////////
  
app.get(['/ocorrenciasMateriaisAdm'], (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    db.query('SELECT o.cod_ocorrencia, DATE_FORMAT(o.data_ocorrencia, "%d/%m/%Y") as data_ocorrencia, o.status_ocorrencia, m.nome_material FROM ocorrencia_material o JOIN material m ON o.cod_material = m.cod_material order by o.status_ocorrencia;', (error, results) => {
      if (error) {
        console.log('Houve um erro ao recuperar os dados do ocorrencia', error);
        res.status(500).send('Erro interno do servidor');
      } else {
        console.log('Resultados:', results)
        res.render('ocorrenciasMateriaisAdm', { ocorrenciaMaterial: results });
      }
    });
  });
  
  
  app.get('/pesquisarOcorrenciaMaterialAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const pesquisa = req.query.pesquisa;
    console.log(pesquisa); // Para depuração
    db.query('SELECT o.cod_ocorrencia, o.status_ocorrencia, m.nome_material FROM ocorrencia_material o JOIN material m ON o.cod_material = m.cod_material WHERE m.nome_material like ? order by o.status_ocorrencia;', [`%${pesquisa}%`], (error, results) => {
  
  
      if (error) {
        console.log('Ocorreu um erro ao realizar o filtro', error);
        res.status(500).send('Erro interno do servidor');
      } else {
        res.render('ocorrenciasMateriaisAdm', { ocorrenciaMaterial: results });
      }
    });
  });
  
  
  app.get('/adicionarOcorrenciaMaterialAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    carregarOcorrenciasMateriais((error, listaOcorrenciaMateriais) => {
      if (error) {
        console.log('Erro ao carregar ocorrencia_material:', error);
      } carregarMateriais ((error, listaMateriais) => {
        if (error) {
          console.log ('Erro ao carregar materiais:', error)
        }
      
      res.render('cadastrarOcorrenciaMaterialAdm', {
        ocorrenciaMateriais: listaOcorrenciaMateriais,
        materiais: listaMateriais
      })
    })
  })
  })
  
  
  app.post('/cadastrarOcorrenciaMaterialAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
  
    // Extraindo os valores do corpo da requisição
    const material = parseInt(req.body.material); 
    const data = req.body.data;
    const detalhe = req.body.detalhe;
    const status = req.body.status;
  
    // Puxando o cod_usuario da sessão
    const cod_usuario = req.session.cod_usuario;
  
    console.log(status);
  
    // Executando a query com os valores extraídos do corpo da requisição
    db.query(
      "INSERT INTO ocorrencia_material (cod_material, cod_usuario, data_ocorrencia, detalhes_ocorrencia, status_ocorrencia) VALUES (?, ?, ?, ?, ?)", 
      [material, cod_usuario, data, detalhe, status], 
      (error, results) => {
        if (error) {
          // Em caso de erro, loga a mensagem de erro e envia uma resposta de erro
          console.log('Erro ao cadastrar ocorrencia:', error);
          res.status(500).send('Erro ao cadastrar ocorrencia');
        } else {
          res.redirect('/ocorrenciasMateriaisAdm');
        }
      }
    );
  });
  
  app.get('/infoOcorrenciaMaterialAdm', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
    }
  
    const cod = req.query.cod_ocorrencia; // Acessando o código da ocorrência pela query string
    console.log('Código da ocorrência:', cod);
  
    // Carregar as ocorrências e outros dados necessários
    carregarOcorrenciasMateriais((error, listaOcorrenciaMateriais) => {
      if (error) {
        console.log('Erro ao carregar ocorrencias_patrimonio:', error);
      }
  
      carregarMateriais((error, listaMateriais) => {
        if (error) {
          console.log('Erro ao carregar Materiais:', error);
        }
  
        carregarUsuarios((error, listaUsuarios) => {
          if (error) {
            console.log('Erro ao carregar usuarios:', error);
          }
  
          // Query para pegar a ocorrência específica
          db.query('SELECT o.cod_ocorrencia, m.nome_material, u.nome, DATE_FORMAT(data_ocorrencia, "%d/%m/%Y") as data_ocorrencia, o.detalhes_ocorrencia, o.status_ocorrencia FROM ocorrencia_material o JOIN material m ON o.cod_material = m.cod_material JOIN usuario u ON u.cod_usuario = o.cod_usuario WHERE o.cod_ocorrencia = ?', [cod], (error, results) => {
            if (error) {
              console.log('Erro ao puxar informações da ocorrência:', error);
            }
  
            if (results.length > 0) {
              res.render('infoOcorrenciaMaterialAdm', {
                ocorrenciasMaterial: listaOcorrenciaMateriais,
                usuarios: listaUsuarios,
                materiais: listaMateriais,
                ocorrencia: results[0] // Passando a ocorrência encontrada para a view
              });
            } else {
              console.log('Ocorrência não encontrada');
              res.status(404).send('Ocorrência não encontrada');
            }
          });
        });
      });
    });
  });
  
  
  app.post ('/editarOcorrenciaMaterialAdm/:cod_ocorrencia', (req, res) => {
    if (!req.session.cod_usuario) {
      return res.redirect('/'); // REDIRECIONA PARA O LOGIN SE NÃO ESTIVER AUTENTICADO
  }
    const cod = req.params.cod_ocorrencia;
    const status = req.body.status;
  
    console.log(cod);
  
  
    db.query('UPDATE ocorrencia_material SET status_ocorrencia = ? WHERE cod_ocorrencia = ?', [status, cod], (error, results) => {
      if (error) {
        console.log('Erro ao editar a ocorrencia,', error);
        res.status(500).send('Erro ao editar a ocorrência');
      } else {
        res.redirect('/ocorrenciasMateriaisAdm');
        console.log('editou')
      }
    });
  });



  // INICIALIZA O SERVIDOR NODE.JS
app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
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

