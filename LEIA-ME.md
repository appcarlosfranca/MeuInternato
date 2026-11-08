# Cirurgia — Internato Carlos

Versão de revisão de 07/11/2026. O aplicativo integra escala e biblioteca no mesmo PWA.

## Hospedar no GitHub Pages

1. Extraia `app-cirurgia-github.zip`.
2. Envie todo o conteúdo para a raiz do repositório, sem criar pastas.
3. No GitHub, abra Settings → Pages e selecione a branch e a pasta raiz.
4. Abra o endereço HTTPS gerado. No navegador, você também pode instalar o aplicativo.

O app utiliza o Supabase para autenticação e sincronização. Abrir o HTML com duplo clique não oferece os mesmos recursos: o leitor, os textos e o funcionamento offline exigem hospedagem HTTPS ou localhost.

## Importar os PDFs — uma vez por aparelho

Os PDFs originais somam cerca de 1,5 GB e estão divididos em nove coleções `acervo-cirurgia-01.cirurgia` até `acervo-cirurgia-09.cirurgia`. **Não envie essas coleções para o repositório do GitHub.**

1. Baixe as nove coleções no computador ou tablet.
2. Entre em Biblioteca → Importar acervo / PDF.
3. Selecione todas as coleções, ou importe uma por vez. Aguarde a mensagem de conclusão.
4. O aplicativo confere o SHA-256 de cada PDF e grava os bytes originais no aparelho. Coleções repetidas substituem a mesma cópia, sem duplicar o documento.
5. Use Preparar textos offline e mantenha a página aberta até a confirmação.

A biblioteca pode ser usada imediatamente para resumos e cartões. Para ler os PDFs no visualizador, é necessário importar as coleções ou seus arquivos originais. PDFs adicionais aparecem na seção de documentos pessoais. O armazenamento depende do espaço disponível no navegador. Limpar os dados do site remove as cópias locais e exige nova importação.

## O que está incluído

- 89 PDFs únicos a partir de 105 arquivos conferidos; 16 duplicações exatas.
- 28 resumos introdutórios, 662 cartões e 7 mapas mentais originais.
- Catálogo em 41 assuntos, incluindo 13 prioridades do manual ainda sem síntese específica.
- Grupos de abdome agudo, trauma e urgência, fundamentos e perioperatório, especialidades e prioridades do manual.
- Busca por assunto, filtros, favoritos, assuntos estudados e cartões revisados.
- Leitor PDF com paginação, zoom e retomada automática; texto extraído com busca por documento.
- Importação de PDFs pessoais, notas por assunto e backup do progresso.
- Escala com as visualizações, temas, edição e importação/exportação existentes preservados.

Os resumos são introdutórios e não representam cobertura integral dos capítulos. Os cartões foram extraídos dos PDFs fornecidos; fórmulas, imagens e tabelas podem exigir a consulta à página original. Cada cartão indica sua fonte e página.

## Login, backups e sincronização

Esta versão abre sem login. A sincronização privada entre aparelhos é opcional; consulte AUTH-LEIA-ME.md. A escala, trocas e progresso de estudo são enviados ao Supabase com acesso privado por conta. PDFs continuam locais a cada aparelho.

Dados e trocas → Exportar JSON salva a escala. Biblioteca → Backup do estudo salva favoritos, notas e progresso. Esses backups são independentes da sincronização. A tela Sincronizar permite baixar cópias de recuperação anteriores.

A interface funciona sem login. Os PDFs e textos salvos localmente podem ser usados offline após preparar o aplicativo.

## Escala corrigida conforme o PDF

A base foi reconstruída por células da tabela do PDF atualizado, páginas 13–24. Carlos tem 36 alocações: sutura diurna em 09, 11, 13, 16, 18, 20 e 23/11; sutura noturna em 10, 17 e 24/11; enfermaria em 25–27/11, 30/11–04/12 e 07–10/12; especialidades conforme as semanas seguintes.

Os horários seguem o cabeçalho da tabela: 07–19h para atividades diurnas e especialidades; 19–23h para sutura noturna. O cabeçalho da sexta-feira da semana iniciada em 28/12 está escrito 01/12 no PDF; o aplicativo usa 01/01/2027 pela sequência semanal. Carlos não tem alocação nessa sexta-feira.

Ao abrir esta versão com dados da versão anterior, o aplicativo guarda uma cópia integral da escala salva e atualiza as alocações de Carlos. Os ajustes locais de outros internos são mantidos; os grupos de origem dos plantões de Carlos são corrigidos conforme a tabela. A cópia anterior fica em Dados e trocas → Baixar cópia anterior. A atualização ocorre uma única vez; edições posteriores são mantidas.

O PDF identifica férias do 6º ano nas semanas 6 e 7, mas também contém alocações nominais de Carlos nessas semanas. O app mantém as alocações escritas na tabela e sinaliza essa inconsistência.

Para atualizar a versão antiga sem trocar os arquivos do site, importe `escala-atualizada-carlos.json` em Dados e trocas → Importar JSON/CSV. Esse arquivo substitui a escala completa; exporte o backup atual antes caso tenha trocas pessoais.

## Licenças

O leitor utiliza PDF.js e os arquivos de licença estão na raiz do repositório. Os documentos são os materiais fornecidos pelo usuário e permanecem no aparelho após a importação.

## Identidade visual

Logo de Cirurgia — Internato Carlos atualizado na interface, favicon e ícones de instalação. A versão escura usa o logo branco e o tema Pérola usa o azul-marinho. Após substituir os arquivos no GitHub, recarregue o aplicativo para receber os novos recursos. Alguns sistemas exigem reinstalar o atalho para renovar o ícone da tela inicial.

## Envio com até 100 arquivos

Esta edição reúne os textos e os recursos auxiliares do leitor em arquivos únicos. Extraia o ZIP e envie seu conteúdo à raiz do repositório, sem criar pastas. As nove coleções .cirurgia são importadas no aplicativo; não devem ser enviadas ao GitHub.

## Correção do arquivo de sincronização ausente

Todos os arquivos deste pacote ficam na raiz, sem pastas. Extraia o ZIP, selecione todos os arquivos extraídos e envie-os para a raiz do repositório. O arquivo supabase-2.119.0.js precisa estar ao lado de index.html, sync.js e supabase-config.js. O novo service worker identifica esta versão como root-v9. Depois da publicação, recarregue o app para atualizar o cache.
