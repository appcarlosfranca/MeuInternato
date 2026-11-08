# Validação de autenticação e sincronização

- Banco Supabase: criação e atualização por revisão, rejeição de gravação com revisão antiga, isolamento entre dois usuários e rejeição do acesso anônimo testados em transação revertida. Nenhum usuário de teste permaneceu no banco.
- Navegador com SDK real e transporte de teste: login, envio inicial, recebimento da escala em uma segunda sessão, persistência após falha de envio, detecção e resolução de conflitos e isolamento ao trocar de conta passaram sem erros JavaScript.
- Não há mais login obrigatório ou bloqueio da interface. A autenticação fica limitada à sincronização privada opcional.
- A retirada do bloqueio foi verificada com abertura direta da escala e biblioteca.
- Um login real com a conta pessoal depende de criar o primeiro usuário e publicar este ZIP; nenhuma senha pessoal foi solicitada ou definida automaticamente.
- PDFs e uso local não dependem de uma sessão de login.
