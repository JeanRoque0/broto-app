# Broto

App mobile de identificação e cuidado de plantas. Foto → identifica a espécie e
diagnostica o problema → cadastra a planta com os cuidados preenchidos → lembra
de cuidar dela no dia certo.

Feito para o Brasil: interface em **pt-BR**, com traduções em inglês e espanhol.

**Expo SDK 54** · expo-router 6 · React Native 0.81 · TypeScript strict · Supabase

---

## Rodando

```bash
npm install
cp .env.example .env      # preencha com as chaves do seu projeto Supabase
npx expo start
```

Roda no **Expo Go** — é por isso que o projeto está fixado no SDK 54, o último
com Expo Go disponível. Câmera, galeria, notificações locais e Supabase
funcionam ali.

Sign in with Apple, AdMob e RevenueCat precisam de código nativo:

```bash
npx expo prebuild --clean
npx expo run:android      # ou run:ios
```

Dependências do Expo sempre com `npx expo install`, nunca `npm install`.
`npx expo install --fix` realinha versões e `npx expo-doctor` valida o projeto.

## Scripts

| comando | o que faz |
|---|---|
| `npm start` | Metro |
| `npm run android` | build nativo Android |
| `npm run ios` | build nativo iOS |
| `npm run lint` | ESLint em `src` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run icons` | regera os ícones a partir do SVG da marca |

## Estrutura

As rotas não têm lógica: cada arquivo em `src/app` só reexporta uma tela.

```
src/
├── app/            rotas do expo-router — (auth) e (app)/(tabs)
├── screens/        cada tela em index.tsx + use<Tela>.ts + style.ts
├── components/     compartilhados; components/ui são os primitivos
├── services/       api (Edge Functions), supabase, notificações, monitoring
├── store/          Zustand persistido
├── hooks/          auth, perfil, plantas, tarefas, lembretes
├── style/          theme.ts e typography.ts — nenhum hex solto em componente
└── i18n/           pt-BR, en-US, es-ES
```

Estado de servidor é TanStack Query; estado de cliente é Zustand com
AsyncStorage. Estilo é `StyleSheet.create` com tokens — sem Tailwind, sem UI kit.

## Segurança

Este repo **não tem chave de API nenhuma**. A chave do modelo de visão vive nos
secrets das Edge Functions e nunca chega ao cliente: toda análise passa pelo
servidor. A única credencial que o app carrega é a `anon key` do Supabase, que é
pública por definição e sozinha não abre nada — a RLS continua valendo.

Crédito, cota e limite são decididos no servidor. O app nunca escreve em
`profiles.plan` nem nos contadores.

O schema do banco, as Edge Functions e os prompts do modelo ficam num repositório
separado e privado.

## Privacidade

Fotos ficam num bucket privado; o app guarda o caminho e gera uma URL assinada de
uma hora na hora de exibir. Erros são monitorados sem identificar a pessoa — sem
nome, sem e-mail, sem foto — e o relatório passa por um filtro que remove token,
e-mail e senha de qualquer mensagem antes de sair do aparelho.
