// Executa os testes unitários e gera o registro da execução em Markdown e CSV.
// Uso: npm run test:registro [-- <argumentos extras do jest>]
const { spawnSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const raiz = path.resolve(__dirname, '..');
const pastaRegistros = path.join(raiz, 'registro-testes');
const pastaCobertura = path.join(raiz, 'coverage');
const arquivoJson = path.join(pastaRegistros, '.resultado-jest.json');

function git(comando) {
  try {
    return execSync(`git ${comando}`, { cwd: raiz, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function carimboDeData(data) {
  const p = (n) => String(n).padStart(2, '0');
  return {
    arquivo: `${data.getFullYear()}-${p(data.getMonth() + 1)}-${p(data.getDate())}_${p(data.getHours())}-${p(data.getMinutes())}-${p(data.getSeconds())}`,
    legivel: `${p(data.getDate())}/${p(data.getMonth() + 1)}/${data.getFullYear()} ${p(data.getHours())}:${p(data.getMinutes())}:${p(data.getSeconds())}`,
  };
}

const RESULTADOS = { passed: 'Passou', failed: 'Falhou', pending: 'Pendente', skipped: 'Ignorado', todo: 'A fazer' };

function separarId(titulo) {
  const encontrado = titulo.match(/^(CT-[A-Z]+-\d+)\s*-\s*(.*)$/);
  return encontrado ? { id: encontrado[1], descricao: encontrado[2] } : { id: '', descricao: titulo };
}

function primeiraLinhaDoErro(mensagens) {
  if (!mensagens || mensagens.length === 0) return '';
  // Remove as cores ANSI e fica só com a primeira linha útil da mensagem.
  const texto = mensagens.join('\n').replace(/\u001b\[[0-9;]*m/g, '');
  return texto.split('\n').map((linha) => linha.trim()).find(Boolean) ?? '';
}

function celulaMarkdown(valor) {
  return String(valor).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function celulaCsv(valor) {
  const texto = String(valor);
  return /[";\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

fs.mkdirSync(pastaRegistros, { recursive: true });

const inicio = new Date();
const execucao = spawnSync(
  process.execPath,
  [
    require.resolve('jest/bin/jest'),
    // Argumentos extras vêm primeiro para não serem lidos como valor de --coverageReporters.
    ...process.argv.slice(2),
    '--json',
    `--outputFile=${arquivoJson}`,
    '--coverage',
    '--coverageReporters=json-summary',
    '--coverageReporters=html',
    '--coverageReporters=text-summary',
  ],
  { cwd: raiz, stdio: 'inherit' },
);

if (!fs.existsSync(arquivoJson)) {
  console.error('\nO Jest não gerou o resultado em JSON; o registro não foi criado.');
  process.exit(execucao.status ?? 1);
}

const resultado = JSON.parse(fs.readFileSync(arquivoJson, 'utf8'));
fs.unlinkSync(arquivoJson);

const linhas = resultado.testResults
  .flatMap((suite) =>
    suite.assertionResults.map((teste) => ({
      ...separarId(teste.title),
      suite: teste.ancestorTitles.join(' › '),
      arquivo: path.relative(raiz, suite.name).split(path.sep).join('/'),
      resultado: RESULTADOS[teste.status] ?? teste.status,
      duracao: teste.duration ?? 0,
      erro: primeiraLinhaDoErro(teste.failureMessages),
    })),
  )
  .sort((a, b) => a.arquivo.localeCompare(b.arquivo) || a.id.localeCompare(b.id, 'pt-BR', { numeric: true }));

// Suítes que nem chegaram a rodar (erro de compilação, import quebrado etc.).
const suitesComErro = resultado.testResults
  .filter((suite) => suite.assertionResults.length === 0 && suite.status === 'failed')
  .map((suite) => ({
    arquivo: path.relative(raiz, suite.name).split(path.sep).join('/'),
    erro: primeiraLinhaDoErro([suite.message]),
  }));

let cobertura = null;
const arquivoCobertura = path.join(pastaCobertura, 'coverage-summary.json');
if (fs.existsSync(arquivoCobertura)) {
  cobertura = JSON.parse(fs.readFileSync(arquivoCobertura, 'utf8')).total;
}

const data = carimboDeData(inicio);
const contexto = {
  branch: git('rev-parse --abbrev-ref HEAD') || '-',
  commit: git('rev-parse --short HEAD') || '-',
  alteracoesNaoCommitadas: git('status --porcelain') !== '',
  responsavel: git('config user.name') || '-',
};

const total = resultado.numTotalTests;
const aprovados = resultado.numPassedTests;
const reprovados = resultado.numFailedTests;
const pendentes = resultado.numPendingTests + (resultado.numTodoTests ?? 0);
const situacao = resultado.success ? 'APROVADO' : 'REPROVADO';

const md = [];
md.push('# Registro de execução dos testes unitários — AgresteGo (backend)');
md.push('');
md.push('| Campo | Valor |');
md.push('|---|---|');
md.push(`| Data e hora | ${data.legivel} |`);
md.push(`| Responsável pela execução | ${celulaMarkdown(contexto.responsavel)} |`);
md.push(`| Branch / commit | ${contexto.branch} / ${contexto.commit}${contexto.alteracoesNaoCommitadas ? ' (com alterações não commitadas)' : ''} |`);
md.push(`| Ambiente | Node ${process.version} · ${process.platform} |`);
md.push(`| Comando | \`npm run test:registro\` |`);
md.push(`| Situação geral | **${situacao}** |`);
md.push('');
md.push('## Resumo');
md.push('');
md.push('| Suítes | Testes | Passaram | Falharam | Pendentes | Tempo total |');
md.push('|---|---|---|---|---|---|');
md.push(
  `| ${resultado.numTotalTestSuites} | ${total} | ${aprovados} | ${reprovados} | ${pendentes} | ${((Date.now() - resultado.startTime) / 1000).toFixed(1)} s |`,
);
md.push('');

if (cobertura) {
  md.push('## Cobertura de código');
  md.push('');
  md.push('| Comandos | Desvios | Funções | Linhas |');
  md.push('|---|---|---|---|');
  md.push(`| ${cobertura.statements.pct}% | ${cobertura.branches.pct}% | ${cobertura.functions.pct}% | ${cobertura.lines.pct}% |`);
  md.push('');
  md.push('Relatório detalhado, linha a linha: `coverage/index.html`.');
  md.push('');
}

if (reprovados > 0 || suitesComErro.length > 0) {
  md.push('## Falhas');
  md.push('');
  md.push('| ID | Teste | Arquivo | Mensagem |');
  md.push('|---|---|---|---|');
  for (const linha of linhas.filter((l) => l.resultado === 'Falhou')) {
    md.push(`| ${linha.id || '-'} | ${celulaMarkdown(linha.descricao)} | ${linha.arquivo} | ${celulaMarkdown(linha.erro)} |`);
  }
  for (const suite of suitesComErro) {
    md.push(`| - | (suíte não executada) | ${suite.arquivo} | ${celulaMarkdown(suite.erro)} |`);
  }
  md.push('');
}

md.push('## Casos de teste executados');
md.push('');
md.push('| ID | Suíte | Teste | Resultado | Duração (ms) | Arquivo |');
md.push('|---|---|---|---|---|---|');
for (const linha of linhas) {
  md.push(
    `| ${linha.id || '-'} | ${celulaMarkdown(linha.suite)} | ${celulaMarkdown(linha.descricao)} | ${linha.resultado} | ${linha.duracao} | ${linha.arquivo} |`,
  );
}
md.push('');

const cabecalhoCsv = ['Data e hora', 'Commit', 'ID', 'Suíte', 'Teste', 'Resultado', 'Duração (ms)', 'Arquivo', 'Mensagem de erro'];
const csv = [cabecalhoCsv.join(';')];
for (const linha of linhas) {
  csv.push(
    [data.legivel, contexto.commit, linha.id, linha.suite, linha.descricao, linha.resultado, linha.duracao, linha.arquivo, linha.erro]
      .map(celulaCsv)
      .join(';'),
  );
}

const base = path.join(pastaRegistros, `registro-${data.arquivo}`);
fs.writeFileSync(`${base}.md`, md.join('\n'), 'utf8');
// BOM para o Excel abrir os acentos corretamente.
fs.writeFileSync(`${base}.csv`, '﻿' + csv.join('\r\n') + '\r\n', 'utf8');

console.log(`\nRegistro gerado (${situacao}: ${aprovados}/${total} testes passaram):`);
console.log(`  ${path.relative(raiz, base)}.md`);
console.log(`  ${path.relative(raiz, base)}.csv`);

process.exit(execucao.status ?? 1);
