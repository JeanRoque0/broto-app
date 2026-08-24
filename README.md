# Broto

App mobile de identificação e cuidado de plantas. Foto → identifica a espécie e
diagnostica o problema → cadastra a planta com os cuidados preenchidos → lembra de regar.

Expo SDK 54 + expo-router + Supabase. Interface toda em pt-BR.

## Rodando

```bash
npm install
cp .env.example .env      # preencha com as chaves do seu projeto Supabase
npx expo start
```

Roda no **Expo Go** — é por isso que o projeto está fixado no SDK 54, que é o
último com Expo Go disponível. Câmera, galeria, notificações locais e Supabase
funcionam ali.

Sign in with Apple, AdMob e RevenueCat precisam de código nativo. Para eles:

```bash
npx expo prebuild --clean
npx expo run:android      # ou run:ios
```

Dependências do Expo sempre com `npx expo install`, nunca `npm install`.
`npx expo install --fix` realinha versões e `npx expo-doctor` valida o projeto.

## Scripts

| comando | o que faz |
|---|---|
| `npm start` | Metro / dev client |
| `npm run android` | build nativo Android |
| `npm run ios` | build nativo iOS |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | typecheck |

## Backend

O schema do banco, as Edge Functions e os prompts do modelo ficam num repo
separado e privado. Este repo não tem chave de API nenhuma: a chave do modelo
vive nos secrets das Edge Functions, e a única credencial que o app carrega é a
`anon key` do Supabase, que é pública por definição e sozinha não abre nada — a
RLS continua valendo.

## Documentação

`AGENTS.md` — arquitetura, design system e as regras que não se quebram.
