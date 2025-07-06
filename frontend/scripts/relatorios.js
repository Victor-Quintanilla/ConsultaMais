const API_EVENTOS_URL = 'http://localhost:3000/api/eventos';
const API_RELATORIOS_URL = 'http://localhost:3000/api/relatorios';

const formGerarRelatorio = document.getElementById('formGerarRelatorio');
const eventoSelect = document.getElementById('eventoSelect');
const mensagemGeracao = document.getElementById('mensagemGeracao');
const listaRelatorios = document.getElementById('listaRelatorios');
const detalhesRelatorioSection = document.getElementById('detalhesRelatorio');
const tituloRelatorioDetalhe = document.getElementById('tituloRelatorioDetalhe');
const conteudoRelatorioDetalhe = document.getElementById('conteudoRelatorioDetalhe');

// Função para carregar eventos 
async function carregarEventosParaSelect() {
    try {
        const resposta = await fetch(API_EVENTOS_URL);
        if (!resposta.ok) {
            throw new Error('Falha ao carregar eventos');
        }
        const eventos = await resposta.json();

        eventoSelect.innerHTML = '<option value="">Selecione o evento</option>'; 
        eventos.forEach(evento => {
            const option = document.createElement('option');
            option.value = evento.id;
            option.textContent = evento.titulo;
            eventoSelect.appendChild(option);
        });
        if (eventos.length === 0) {
            eventoSelect.innerHTML = '<option value="">Nenhum evento disponível</option>';
            eventoSelect.disabled = true;
            formGerarRelatorio.querySelector('button[type="submit"]').disabled = true;
            mensagemGeracao.textContent = 'Crie eventos e feedbacks para gerar relatórios.';
        } else {
            eventoSelect.disabled = false;
            formGerarRelatorio.querySelector('button[type="submit"]').disabled = false;
            mensagemGeracao.textContent = '';
        }

    } catch (error) {
        console.error('Erro ao carregar eventos para seleção:', error);
        mensagemGeracao.textContent = 'Erro ao carregar eventos. Tente novamente mais tarde.';
        eventoSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        eventoSelect.disabled = true;
        formGerarRelatorio.querySelector('button[type="submit"]').disabled = true;
    }
}

// Função para gerar relatório
formGerarRelatorio.addEventListener('submit', async function (e) {
    e.preventDefault();

    const eventoId = eventoSelect.value;
    if (!eventoId) {
        mensagemGeracao.textContent = 'Por favor, selecione um evento.';
        return;
    }

    mensagemGeracao.textContent = 'Gerando relatório... Isso pode levar alguns segundos.';
    formGerarRelatorio.querySelector('button[type="submit"]').disabled = true;

    try {
        const resposta = await fetch(`${API_RELATORIOS_URL}/gerar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventoId: parseInt(eventoId) })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mensagemGeracao.textContent = 'Relatório gerado e salvo com sucesso!';
            formGerarRelatorio.reset();
            carregarEventosParaSelect(); 
            carregarRelatorios(); 
        } else {
            mensagemGeracao.textContent = `Erro: ${dados.erro || 'Falha ao gerar relatório.'}`;
            console.error('Erro detalhado:', dados.erro);
        }

    } catch (error) {
        console.error('Erro de conexão ao gerar relatório:', error);
        mensagemGeracao.textContent = 'Erro de conexão com o servidor de relatórios.';
    } finally {
        formGerarRelatorio.querySelector('button[type="submit"]').disabled = false;
    }
});

// Função para carregar e exibir relatórios existentes
async function carregarRelatorios() {
    try {
        const resposta = await fetch(API_RELATORIOS_URL);
        if (!resposta.ok) {
            throw new Error('Falha ao carregar relatórios');
        }
        const relatorios = await resposta.json();

        listaRelatorios.innerHTML = ''; 
        if (relatorios.length === 0) {
            listaRelatorios.innerHTML = '<p>Nenhum relatório gerado ainda.</p>';
        } else {
            relatorios.forEach(relatorio => {
                const li = document.createElement('li');
                li.classList.add('relatorio-item');
                li.innerHTML = `
                    <strong>${relatorio.titulo}</strong>
                    <small>(Gerado em: ${new Date(relatorio.dataGeracao).toLocaleDateString()})</small>
                    <button onclick="verDetalhesRelatorio(${relatorio.id})">Ver Detalhes</button>
                    <button onclick="deletarRelatorio(${relatorio.id})">Excluir</button>
                `;
                listaRelatorios.appendChild(li);
            });
        }

    } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
        listaRelatorios.innerHTML = '<p style="color: red;">Erro ao carregar relatórios.</p>';
    }
}

// Função para exibir o conteúdo detalhado de um relatório
async function verDetalhesRelatorio(id) {
    try {
        const resposta = await fetch(`${API_RELATORIOS_URL}/${id}`);
        if (!resposta.ok) {
            throw new Error('Falha ao carregar detalhes do relatório');
        }
        const relatorio = await resposta.json();

        tituloRelatorioDetalhe.textContent = relatorio.titulo;
        conteudoRelatorioDetalhe.textContent = relatorio.conteudo;
        detalhesRelatorioSection.style.display = 'block';
        detalhesRelatorioSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Erro ao ver detalhes do relatório:', error);
        alert('Não foi possível carregar os detalhes do relatório.');
    }
}

// Função para fechar a seção de detalhes
function fecharDetalhesRelatorio() {
    detalhesRelatorioSection.style.display = 'none';
    tituloRelatorioDetalhe.textContent = '';
    conteudoRelatorioDetalhe.textContent = '';
}

// Função para deletar um relatório
async function deletarRelatorio(id) {
    const confirmar = confirm('Deseja excluir este relatório?');
    if (!confirmar) return;

    try {
        const resposta = await fetch(`${API_RELATORIOS_URL}/${id}`, {
            method: 'DELETE'
        });

        if (resposta.ok) {
            alert('Relatório excluído com sucesso!');
            carregarRelatorios(); 
            fecharDetalhesRelatorio(); 
        } else {
            const erroDados = await resposta.json();
            alert(`Erro ao excluir relatório: ${erroDados.erro || 'Falha desconhecida'}`);
        }
    } catch (error) {
        console.error('Erro ao excluir relatório:', error);
        alert('Erro de conexão ao excluir relatório.');
    }
}

carregarEventosParaSelect();
carregarRelatorios();