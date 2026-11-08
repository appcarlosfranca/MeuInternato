# Validação de autenticação e sincronização

- Banco Supabase: criação e atualização por revisão, rejeição de gravação com revisão antiga, isolamento entre dois usuários e rejeição do acesso anônimo testados em transação revertida. Nenhum usuário de teste permaneceu no banco.
- Navegador com SDK real e transporte de teste: login, envio inicial, recebimento da escala em uma segunda sessão, persistência após falha de envio, detecção e resolução de conflitos e isolamento ao trocar de conta passaram sem erros JavaScript.
- A configuração usa o mesmo cliente Auth para o login e a sincronização, evitando sessões duplicadas.
- A validação inclui a tela de acesso da versão mais recente adicionada em outra conversa.
- Um login real com a conta pessoal depende de criar o primeiro usuário e publicar este ZIP; nenhuma senha pessoal foi solicitada ou definida automaticamente.
- Os PDFs continuam locais a cada aparelho. A proteção de acesso exige conexão para validar a sessão.
