# Acesso e sincronização — App Cirurgia

O app está integrado ao projeto Supabase da conta acadêmica já autorizado. A tabela privada de sincronização e as políticas de acesso foram instaladas no banco.

## Primeiro acesso

1. Extraia o ZIP e substitua os arquivos do repositório GitHub Pages, mantendo a pasta vendor e index.html na raiz. Remova arquivos antigos que não constem neste pacote.
2. Abra o endereço publicado. Se a instalação anterior estiver em cache, recarregue após a atualização do site.
3. Na tela de acesso, preencha e-mail e senha e clique em Criar conta. Confirme o e-mail recebido e retorne à tela para entrar. Esta é uma conta de acesso ao aplicativo; ela não é criada automaticamente a partir do login no painel do Supabase.
4. Entre com essa mesma conta no computador e no tablet. Use Sincronizar para acompanhar o estado do envio.

Se necessário, o responsável também pode criar o usuário no painel Authentication → Users → Add user do projeto e confirmar o próprio e-mail por lá. Não há senha padrão nem chave secreta no frontend.

## O que sincroniza

A escala completa salva pelo usuário, o histórico de trocas/edições, os favoritos, as notas, os assuntos e cartões revisados e a última página de leitura são guardados por conta. A primeira sessão envia os dados locais. Um aparelho novo recebe a versão já salva na nuvem. Se os dois lados tiverem alterações diferentes, o app pede uma escolha em vez de sobrescrever silenciosamente.

As mudanças são enviadas após uma pequena pausa na edição; o app também verifica alterações a cada 30 segundos enquanto está visível e ao recuperar conexão ou foco. O botão Sincronizar agora permite fazer uma verificação imediata.

## Falhas de conexão e versões conflitantes

Uma falha de envio não apaga os dados locais. A próxima sincronização compara novamente as versões. Antes de substituir dados locais pela versão da nuvem, o app guarda cópias locais de recuperação, disponíveis para download em Sincronizar.

A proteção de acesso continua exigindo validação online da sessão e bloqueia a interface quando o aparelho fica offline. Os PDFs importados ficam guardados no aparelho, mas o modo offline não contorna o login. A leitura plenamente offline depende de uma futura mudança deliberada nessa política de acesso.

## Contas diferentes no mesmo navegador

Os dados locais são arquivados separadamente por conta antes de trocar o usuário. Ao voltar a uma conta usada anteriormente, sua cópia local é restaurada e comparada com a nuvem. Dados de uma conta não são enviados automaticamente para outra.

## PDFs e backups

As nove partes do acervo e PDFs pessoais continuam sendo importados em cada aparelho. Os arquivos PDF não são enviados ao banco por esta sincronização. Use o mesmo acervo já baixado.

Os backups individuais de escala e estudo continuam disponíveis. A cópia de recuperação da sincronização reúne ambos e seu histórico recente para eventual recuperação assistida.

## Proteção

A tabela usa políticas por user_id e a função de gravação executa com as permissões do usuário autenticado. A revisão esperada é conferida no banco antes de aceitar uma gravação. Uma requisição sem autenticação não pode consultar ou gravar esses dados.

O login protege a interface e os dados privados sincronizados. Os arquivos estáticos do GitHub Pages, incluindo a escala-base e textos fornecidos no pacote, continuam públicos para quem souber o endereço.

## Dependência

Supabase JavaScript 2.119.0 distribuído localmente em vendor/supabase-2.119.0.js, com versão fixada e lockfile incluído. Somente a chave publicável é usada no navegador.
