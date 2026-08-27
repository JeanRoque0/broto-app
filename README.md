# Broto

App mobile de identificação e cuidado de plantas. A pessoa fotografa a planta, o
app identifica a espécie e diagnostica o problema, cadastra a planta com os
cuidados já preenchidos e lembra de cuidar dela no dia certo.

Mercado: Brasil. Interface em **pt-BR**, com traduções em inglês e espanhol.

**Expo SDK 54** · expo-router 6 · React Native 0.81 · TypeScript strict · Supabase

---

## O fluxo que define o produto

Uma foto, uma chamada ao modelo, e a resposta traz espécie **e** diagnóstico
juntos. O app nunca pergunta se a pessoa quer identificar ou diagnosticar, e
nunca tenta adivinhar isso antes de chamar o modelo — a tela de resultado
ramifica no dado que voltou (`saude`, `diagnostico`), não na intenção.

O diagnóstico é **ranqueado, nunca veredito único**. Com uma foto só o modelo
hedgia: sai "excesso de água ou pouca luz" em vez de um vencedor claro. Em vez de
esconder isso, a tela mostra as causas por probabilidade e entrega o card **"Como
confirmar"** — um teste que a pessoa faz em casa para separar as hipóteses:
*"enfie o dedo três centímetros na terra; se sair úmido, é excesso de água, não é
fungo."* Esse card é a assinatura do produto, e existe tanto no resultado da
análise quanto no detalhe da planta.

Não há perguntas de contexto antes da foto. Perguntar quando regou e onde a
planta fica resolveria o mesmo problema que o "Como confirmar" resolve — separar
causas parecidas — só que com formulário em vez de um teste. A escolha foi o
teste.

Se a foto for ilegível, o modelo retorna erro e **o crédito volta**. Falha não
consome cota.

## Arquitetura

O app conversa com o backend por duas vias: o cliente do Supabase para as tabelas
e Axios para as Edge Functions. A chave do modelo de visão **nunca** está no
cliente — toda análise passa pela Edge Function, que valida crédito, chama o
modelo e grava o resultado.

- **Estado de servidor**: TanStack Query v5
- **Estado de cliente**: Zustand persistido em AsyncStorage
- **Formulários**: react-hook-form
- **Ilustração e ícones**: react-native-svg
- **Estilo**: `StyleSheet.create` com tokens. Sem Tailwind, sem UI kit

O rascunho da análise fica num store persistido de propósito: o Android pode
matar o app com a câmera aberta, e a pessoa perderia a foto.

### Estrutura

As rotas não têm lógica — cada arquivo em `src/app` só reexporta uma tela.

```
src/
├── app/            rotas do expo-router: (auth) e (app)/(tabs)
├── screens/        cada tela em index.tsx + use<Tela>.ts + style.ts
├── components/     compartilhados; components/ui são os primitivos do design
├── services/       api (Edge Functions), supabase, notificações, monitoring
├── store/          Zustand persistido (auth, onboarding, análise, idioma)
├── hooks/          auth, perfil, plantas, tarefas, lembretes, foto
├── style/          theme.ts e typography.ts
├── types/          espelham o payload do Postgres em snake_case
└── i18n/           pt-BR, en-US, es-ES
```

`index.tsx` lê como uma lista de blocos JSX; qualquer lógica vive no hook da
tela. Nenhum hex solto em componente — cor sempre de `theme`, tamanho de texto
sempre da escala em `typography`.

## Dados

Tabelas: `profiles`, `plants`, `plant_groups`, `plant_tasks`, `care_events`,
`identifications`, `chat_threads`, `chat_messages`, `species_cache`,
`species_facts`, `search_budget`, `credit_purchases`, `ad_rewards`.

Todas com **RLS habilitada** — o app só enxerga as próprias linhas. O bucket de
fotos é privado: o que fica guardado é o caminho, e a URL assinada é gerada na
hora de exibir, válida por uma hora.

Crédito, cota e limite são decididos **no servidor**. O app nunca escreve em
`profiles.plan` nem nos contadores; a RLS não deixa. Os motivos de recusa que a
interface trata são `month_cap`, `daily_cap`, `no_credits` e `no_plan`.

### Economia de chamada

Espécie, saúde e diagnóstico voltam no mesmo JSON de uma única chamada de visão.
O que **não** depende da foto sai de lá: cuidados, toxicidade, temperatura,
cultivo e simbolismo são propriedades da espécie, saem de um modelo mais barato
uma vez por espécie e ficam em `species_facts`. Temperatura aceita valor próprio
por planta, e o que a pessoa definiu vence o da espécie.

## Lembretes

O nome na interface é sempre **lembrete**, nas três línguas.

**Um lembrete por planta**, não um resumo do dia: o corpo diz o que aquela planta
precisa — *"Jiboia — Hoje: regar e girar o vaso"*. **Cada tarefa tem seu
horário**; nulo cai no horário do perfil, que por sua vez cai em 09:00.

O iOS derruba tudo acima de **64 notificações locais pendentes**. Por isso o
agendamento é limitado por contagem, não por dias: as próximas 60 em ordem
cronológica, reagendadas a cada foco de tela. O efeito colateral é assumido — o
horizonte encolhe conforme o número de plantas.

Tarefa atrasada volta a lembrar, com o texto dizendo de quantos dias é o atraso.
Tocar no lembrete abre a planta que o disparou. O horário usa o fuso do usuário,
guardado no perfil.

## Monetização

Três análises no primeiro mês, uma por mês depois. Acabou, dá para comprar
análise avulsa. O plano **Pro** libera 40 análises e 150 mensagens do assistente
por mês, mais as tarefas de rotina completas; o plano **Chat** libera só as
mensagens.

Assinatura é StoreKit e Google Play Billing, via RevenueCat. Nunca pagamento
externo dentro do app.

**Nenhum plano se chama "ilimitado".** Os números aparecem na tela, nos Termos e
na ficha da loja, sempre iguais.

## Regras de conteúdo

Valem para o app e para os prompts do modelo:

1. Nunca recomendar **dosagem de defensivo**. Tratamento na ordem: cultural
   primeiro — podar a folha afetada, ajustar rega, ventilação, isolar — depois
   categoria de produto, com instrução de seguir o rótulo.
2. Nunca dizer se algo é **comestível**.
3. **Toxicidade para pets** sempre com a ressalva de que não substitui
   veterinário.
4. Se a foto não permitir identificar a espécie, o modelo diz que não sabe.
   Espécie errada com confiança alta destrói a confiança no produto mais rápido
   que qualquer erro de layout.

## Design

Interface neutra de propósito: a foto da planta é a única coisa saturada na tela,
e cor cheia fica reservada para ação. Fundo areia, cards cerâmica, barro na ação
primária, musgo no estado saudável, ocre no alerta médio.

Três famílias com papéis fixos: **Fraunces** em títulos e nome de planta, **DM
Sans** no corpo, **DM Mono** em número, data e contador — o mono separa
visualmente informação de conteúdo.

Boa parte do público usa a fonte do sistema aumentada, então o componente de
texto deriva o limite de escala do próprio tamanho, nada tem altura fixa com
texto dentro, e `allowFontScaling` nunca é desligado.

## Privacidade e monitoramento

Este repositório **não contém chave de API**. A única credencial que o app
carrega é a `anon key` do Supabase, pública por definição e inofensiva sozinha
com a RLS de pé.

O monitoramento de erro é **só erro, não analytics**: sem eventos de
comportamento, sem perfil de pessoa, sem identificação. Sobem exceção não
tratada, promise rejeitada, erro de render e falha 5xx do servidor. Todo evento
passa por um filtro que remove JWT, e-mail e valores de `token=` e `password=` de
qualquer string antes de sair do aparelho — mensagem de erro carrega URL assinada
de foto e header de autenticação com facilidade.

## Exigências das lojas

Tratadas como parte da versão 1, não como ajuste final: Sign in with Apple quando
há login social de terceiro no iOS, exclusão de conta dentro do app apagando
dados de verdade, aviso de que a assinatura não é cancelada junto, restauração de
compra visível, política de privacidade em URL pública e strings de permissão
explicando o uso real.

## Repositórios

O app é público. O schema do banco, as migrations, as Edge Functions e os prompts
do modelo vivem num repositório separado e privado, e o site — documentos legais,
ajuda e as páginas de confirmação de e-mail e troca de senha — em outro. Deste
lado só existe o contrato: a URL da Edge Function e o formato do JSON.

## Restrições conhecidas

O projeto está fixado no **SDK 54** porque é o último com Expo Go, o que permite
testar sem build nativo. Sign in with Apple, AdMob e RevenueCat exigem código
nativo e só rodam em dev build.

`expo-file-system@19` usa a API de objetos; `expo-image-manipulator@14` é
encadeado; `StyleSheet.absoluteFill` é um número no RN 0.81 e não pode ser
espalhado. Dependências do Expo entram com `npx expo install`, nunca
`npm install`.
