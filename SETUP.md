# CALISFIT — Setup Guide

## Pré-requisitos
- Node.js 18+ (https://nodejs.org)
- PostgreSQL (local ou Neon/Supabase gratuito)

## 1. Instalar dependências
```bash
npm install
```

## 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
```
Edite `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/calisfit"
NEXTAUTH_SECRET="gere-um-secret-com: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

## 3. Criar banco e executar migrations
```bash
npm run db:push
```

## 4. Popular com dados de exemplo
```bash
npm run db:seed
```

## 5. Rodar o servidor
```bash
npm run dev
```
Acesse: http://localhost:3000

---

## Estrutura do projeto
```
/app
  /(auth)/login          — Tela de login
  /(auth)/register       — Tela de cadastro
  /(app)/dashboard       — Dashboard com stats e atividade recente
  /(app)/workouts        — Lista de treinos
  /(app)/workouts/[id]   — Página de treino (split view 2 colunas)
  /(app)/exercises       — Biblioteca de exercícios
  /(app)/meal-plans      — Planos alimentares (fase 4)
  /(app)/community       — Comunidade (fase 4)
  /api/auth/[...nextauth] — NextAuth handlers
  /api/auth/register     — Criação de conta
  /api/workouts          — CRUD workouts
  /api/logs              — Workout logs
  /api/logs/set          — Registrar série (done/reps/weight)
  /api/logs/[id]/finish  — Finalizar treino
  /api/exercises         — Biblioteca exercícios

/components
  VideoPlayer.tsx        — Player YouTube com overlay
  ProgramPreview.tsx     — Painel direito com lista de exercícios
  ExerciseCard.tsx       — Card expansível com SetTable
  ExerciseInfoDrawer.tsx — Drawer lateral "How to do it"
  SetTable.tsx           — Tabela Done/Reps/Weight/Round
  BottomNav.tsx          — Navegação inferior mobile

/prisma
  schema.prisma          — Models: User, Exercise, Workout, WorkoutBlock, WorkoutSet, WorkoutLog, SetLog
  seed.ts                — 7 exercícios + 1 treino "Men Gym Medium + Cardio"
```

## Design tokens
| Token | Valor |
|-------|-------|
| Amarelo (CTA) | `#FFDE02` |
| Preto (cards) | `#07070A` |
| Tailwind class | `bg-brand-yellow`, `bg-brand-black` |

## Fase 2 (próximos passos)
- [ ] View History por exercício (gráfico de progresso)
- [ ] Timer para exercícios do tipo "time"
- [ ] Notificações de descanso entre séries
- [ ] Upload de vídeo próprio (Cloudflare Stream ou S3)
