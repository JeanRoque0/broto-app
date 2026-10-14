# Revisão do Broto: app e broto-api

Data: 14/10/2026  
App analisado: `broto-app`, commit base `a36f1ca`  
API analisada: `broto-api-golang`, base `9eb6557`

## Resultado principal

O app publicado ainda não usa a broto-api para autenticação nem para os dados da conta. O login, cadastro, Google, perfil, plantas, fotos, histórico, tarefas e notificações ainda passam pelo Supabase. Identificação, chat e pesquisa passam pelas Edge Functions do próprio Supabase (`/functions/v1/*`). Portanto, configurar o SMTP da broto-api não muda os e-mails disparados pelo cadastro atual do app, e trocar apenas a URL do cliente quebraria a autenticação: o app guarda sessões JWT do Supabase, enquanto a API espera tokens de sessão próprios.

A API tem uma implementação independente para autenticação por e-mail, confirmação, recuperação e Google, com testes de integração. Mas o site dos links de autenticação ainda conversa diretamente com o Supabase. Para migrar autenticação por completo, será necessário adaptar esse site e depois o cliente de sessão do app; isso não é uma mudança de URL.

## Fluxos verificados no app

| Área | Implementação observada | Situação para a broto-api |
|---|---|---|
| E-mail/senha | `supabase.auth.signUp`, `signInWithPassword`, `resend` e `resetPasswordForEmail` | A API tem rotas equivalentes, mas o app não as chama nem persiste/renova a sessão da API. |
| Google | OAuth com Supabase Auth e retorno por `broto://auth-callback` | A API tem OAuth Google próprio; falta migrar o callback e o armazenamento/troca da sessão no app. |
| Apple | SDK nativo e envio de identity token | Não encontrei fluxo Apple correspondente na API. |
| Dados do usuário | SDK Supabase em serviços de perfil, plantas, grupos, tarefas, identificações, chat, lembretes, avisos e exportação | A API cobre grande parte dos contratos, com diferenças documentadas em `docs/frontend-compatibility.md`; não há migração no app. |
| Fotos | Supabase Storage | A API tem upload/assinatura de URL e armazenamento local/S3 configurável; cliente ainda não foi adaptado. |
| Identificação, chat e busca | `EXPO_PUBLIC_SUPABASE_URL/functions/v1` com token Supabase | A API tem rotas equivalentes; os requests atuais não chegam ao host da broto-api. Busca também consulta `species_cache` diretamente no Supabase. |
| Push | Registro e remoção de token diretamente em `push_tokens` | A API tem endpoint compatível; cliente ainda grava no Supabase. |
| Exclusão de conta | Edge Function Supabase `delete-account` | A API tem rota equivalente, ainda não usada pelo app. |
| Compras | Funções de compra estão desabilitadas no app | Sem fluxo ativo a migrar ou testar no backend. |

## E-mail e link expirado

O cadastro do app chama `supabase.auth.signUp`; o botão “reenviar” chama `supabase.auth.resend`. Logo, os dois envios atuais pertencem ao Supabase e às configurações SMTP/limites/templates dele, não ao SMTP da broto-api.

Os templates versionados enviam o usuário para `/confirmado` ou `/nova-senha` com `token_hash`. A página pública `/confirmado/` carrega um script que lê o token e chama automaticamente `https://fqulknevqwjxojsfowkk.supabase.co/auth/v1/verify`; a página de recuperação faz o mesmo para o token de recuperação. Esse token é de uso único. Se um scanner/protetor de links executar a página antes do usuário, o clique posterior pode encontrar o token consumido. É uma explicação provável para “link vencido”, mas não foi possível reproduzir a ação de um scanner nem observar uma caixa de entrada real neste teste. O `auth.js` público também contém o endpoint/chave pública do projeto Supabase, então não está ligado à autenticação da broto-api.

O app não tem uma tela de confirmação própria: `useAuthDeepLink` trata o código OAuth, não o `token_hash` desses e-mails. Hoje o fluxo esperado depende da página web externa confirmar a conta e então abrir `broto://`.

## Testes executados

### App

- `tsc --noEmit`: inicialmente falhou em `RipplePressable.tsx`, porque o tipo `PressableStateCallbackType` não contém `hovered`. Corrigi a construção de estado para usar apenas `pressed`.
- ESLint: passou.
- Jest: 6 suítes, 64 testes passaram.
- O relatório Jest mostrou 95,2% de statements apenas entre os arquivos instrumentados/importados pela suíte. Isso **não** significa cobertura de 95% do app: não há testes de tela/fluxo para login, OAuth, cadastro, deep link, integração HTTP, upload, chat ou navegação autenticada.

### API

- `go test ./...`: passou.
- `go vet ./...`: passou.
- `sh scripts/test-integration.sh`: passou com PostgreSQL temporário em RAM e `go test -race`; inclui os contratos de frontend, autenticação/SMTP local, Google com provedor simulado, IA simulada, dados, fotos, concorrência, limites, jobs e documentação.
- A integração SMTP simulada agora também verifica que uma falha do provedor não prende o usuário no intervalo de reenvio de 60 segundos.
- Nenhum teste deste lote enviou e-mail real nem consumiu créditos de IA. A suíte verifica comportamento do servidor e protocolos com dependências isoladas; ela não demonstra entrega na caixa postal, callbacks reais do Google/Apple, nem compatibilidade de uma versão instalada do app.

## Correções feitas nesta revisão

1. API: ao falhar o envio SMTP, libera a reserva do cooldown somente se ela ainda pertence àquela tentativa. Assim uma falha não bloqueia o retry imediato e uma limpeza atrasada não apaga uma reserva concorrente mais nova. Há teste de regressão com intervalo de 60 segundos.
2. App: removi o campo `hovered` inválido que impedia o typecheck.

## O que ainda precisa acontecer para a migração ficar completa

1. Adaptar o site servido em `brotoplantas.com` para confirmar/redefinir senha pela broto-api, em vez de enviar `token_hash` ao endpoint Supabase.
2. Tornar a confirmação uma ação explícita do usuário na página, para não consumir tokens apenas ao carregar links. Depois, testar com Gmail e um cliente que tenha scanner de URL.
3. Migrar o cliente de autenticação do app: signup/login, SecureStore, restauração/refresh serializado, logout e tratamento de 401; adaptar Google e decidir o destino do login Apple.
4. Substituir por etapas os serviços de dados e fotos, mantendo ownership sempre derivado do token no servidor. O app ainda depende de RLS/Supabase em diversos fluxos.
5. Adicionar testes de integração do app para os fluxos críticos acima e validar builds/execução em Android e iOS. Não há simulador/dispositivo e sessão de provedor configurados nesta máquina para afirmar esses resultados.

O repositório/caminho-fonte do site que publica `/confirmado`, `/nova-senha` e `auth.js` não está presente nos checkouts locais consultados; por isso essa correção específica não foi aplicada nesta revisão.
