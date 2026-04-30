import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Parse "3×10", "3×20s", "4×5 cada", "5×3 pesado" etc.
function parseReps(repsStr: string): {
  sets: number;
  targetReps: string | null;
  targetTimeSec: number | null;
  measureType: string;
} {
  const match = repsStr.match(/^(\d+)[×x](.+)$/);
  if (!match) return { sets: 1, targetReps: repsStr, targetTimeSec: null, measureType: "reps" };

  const sets = parseInt(match[1]);
  const raw = match[2].trim().split(/\s+/)[0].split("+")[0]; // pega só a primeira parte

  if (raw.endsWith("s") && !isNaN(parseInt(raw))) {
    return { sets, targetReps: null, targetTimeSec: parseInt(raw), measureType: "time" };
  }

  return { sets, targetReps: raw.replace(/[^0-9MaxmaxKgkg+]/g, "") || raw, targetTimeSec: null, measureType: "reps" };
}

const rawWorkouts = [
  // ────── INICIANTE (1–10) ──────
  {
    id: 1, title: "Fundação #1", level: "beginner", duration: 25,
    description: "Introdução ao movimento de barra e empurrar. Ideal para o primeiro dia.",
    videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    exercises: [
      { name: "Dead Hang (Suspensão Estática)", reps: "3×20s", cues: "Ombros ativos, não deixe afundar", muscles: ["Shoulders", "Core"], equipment: ["Pull-up Bar"] },
      { name: "Flexão de Joelhos", reps: "3×10", cues: "Peito toca o chão, cotovelos a 45°", muscles: ["Chest"], equipment: ["None"] },
      { name: "Agachamento Corporal", reps: "3×15", cues: "Joelhos na linha dos pés", muscles: ["Quadriceps"], equipment: ["None"] },
      { name: "Prancha", reps: "3×20s", cues: "Quadril neutro, core contraído", muscles: ["Core"], equipment: ["None"] },
    ],
  },
  {
    id: 2, title: "Fundação #2", level: "beginner", duration: 25,
    description: "Ativação escapular e primeiros passos na barra.",
    videoUrl: "https://www.youtube.com/watch?v=Jm8jIAqHGA4",
    exercises: [
      { name: "Retração Escapular na Barra", reps: "3×10", cues: "Sobe e desce só com omoplatas", muscles: ["Upper Back"], equipment: ["Pull-up Bar"] },
      { name: "Flexão Inclinada (na parede)", reps: "3×12", cues: "Corpo rígido como tábua", muscles: ["Chest"], equipment: ["None"] },
      { name: "Ponte de Glúteos", reps: "3×15", cues: "Empurra o chão com os calcanhares", muscles: ["Glutes"], equipment: ["None"] },
      { name: "Superman", reps: "3×10", cues: "Segura 2 segundos no topo", muscles: ["Lower Back"], equipment: ["None"] },
    ],
  },
  {
    id: 3, title: "Empurrar & Puxar Leve", level: "beginner", duration: 30,
    description: "Primeiro contato com puxada australiana e flexão padrão.",
    videoUrl: "https://www.youtube.com/watch?v=G4MiH6Nnmxc",
    exercises: [
      { name: "Australian Pull-up (Remada Invertida)", reps: "3×8", cues: "Barra na altura do quadril, corpo reto", muscles: ["Upper Back", "Biceps"], equipment: ["Low Bar"] },
      { name: "Flexão Padrão", reps: "3×8", cues: "Cotovelos a 45°, peito toca o chão", muscles: ["Chest"], equipment: ["None"] },
      { name: "Afundo (Lunge)", reps: "3×10", cues: "Joelho traseiro a 2cm do chão", muscles: ["Quadriceps", "Glutes"], equipment: ["None"] },
      { name: "Mountain Climber", reps: "3×20s", cues: "Quadril baixo, ritmo constante", muscles: ["Core"], equipment: ["None"] },
    ],
  },
  {
    id: 4, title: "Força de Tração", level: "beginner", duration: 30,
    description: "Negativos na barra constroem força antes da primeira barra completa.",
    videoUrl: "https://www.youtube.com/watch?v=hdtoQO0cBzU",
    exercises: [
      { name: "Negativo na Barra (Pullup Negativo)", reps: "3×5", cues: "Desce lento, 5 segundos", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Flexão Diamante", reps: "3×8", cues: "Polegar e indicador formam diamante", muscles: ["Triceps", "Chest"], equipment: ["None"] },
      { name: "Agachamento Jump (Baixo Impacto)", reps: "3×10", cues: "Aterrisa suave com joelhos flexionados", muscles: ["Quadriceps", "Glutes"], equipment: ["None"] },
      { name: "Prancha Lateral", reps: "3×20s", cues: "Quadril não afunda", muscles: ["Core", "Obliques"], equipment: ["None"] },
    ],
  },
  {
    id: 5, title: "Core & Mobilidade", level: "beginner", duration: 25,
    description: "Sessão focada em core, essencial para todos os movimentos avançados.",
    videoUrl: "https://www.youtube.com/watch?v=LlDNef_Ztsc",
    exercises: [
      { name: "Dead Hang com Knee Raise", reps: "3×8", cues: "Joelhos acima do quadril no topo", muscles: ["Core", "Hip Flexors"], equipment: ["Pull-up Bar"] },
      { name: "Flexão Lenta (3s baixando)", reps: "3×8", cues: "Controle total na descida", muscles: ["Chest", "Triceps"], equipment: ["None"] },
      { name: "Hollow Body Hold", reps: "3×20s", cues: "Lombar cola no chão", muscles: ["Core"], equipment: ["None"] },
      { name: "Hip Hinge", reps: "3×12", cues: "Empurra o quadril pra trás", muscles: ["Hamstrings", "Glutes"], equipment: ["None"] },
    ],
  },
  {
    id: 6, title: "Resistência Básica", level: "beginner", duration: 30,
    description: "Volume maior para construir base de resistência muscular.",
    videoUrl: "https://www.youtube.com/watch?v=CkHKGlf5HBw",
    exercises: [
      { name: "Australian Pull-up", reps: "4×10", cues: "Peito toca a barra no topo", muscles: ["Upper Back", "Biceps"], equipment: ["Low Bar"] },
      { name: "Flexão de Joelhos", reps: "4×12", cues: "Não bate o peito no chão", muscles: ["Chest"], equipment: ["None"] },
      { name: "Agachamento Isométrico (Wall Sit)", reps: "4×30s", cues: "Joelhos a 90° na parede", muscles: ["Quadriceps"], equipment: ["None"] },
      { name: "Elevação de Quadril", reps: "4×15", cues: "Espreme glúteos no topo", muscles: ["Glutes", "Hamstrings"], equipment: ["None"] },
    ],
  },
  {
    id: 7, title: "Explosão Leve", level: "beginner", duration: 30,
    description: "Introdução a movimentos dinâmicos com segurança.",
    videoUrl: "https://www.youtube.com/watch?v=qDhMFhpJBi0",
    exercises: [
      { name: "Jumping Pull-up", reps: "3×6", cues: "Usa o salto pra chegar ao topo", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Flexão com Palmada", reps: "3×5", cues: "Foca em velocidade de empurrar", muscles: ["Chest", "Triceps"], equipment: ["None"] },
      { name: "Step-up (degrau ou banco)", reps: "3×10", cues: "Sobe com o calcanhar, não com os dedos", muscles: ["Quadriceps", "Glutes"], equipment: ["Box/Step"] },
      { name: "Burpee Modificado", reps: "3×8", cues: "Sem salto no final", muscles: ["Full Body"], equipment: ["None"] },
    ],
  },
  {
    id: 8, title: "Full Body Leve", level: "beginner", duration: 35,
    description: "Treino completo com todos os padrões de movimento básicos.",
    videoUrl: "https://www.youtube.com/watch?v=vc1E5CfRfos",
    exercises: [
      { name: "Hang Estático", reps: "3×25s", cues: "Respira fundo, relaxa o pescoço", muscles: ["Shoulders", "Forearms"], equipment: ["Pull-up Bar"] },
      { name: "Flexão Padrão", reps: "3×10", cues: "Peito toca o chão", muscles: ["Chest", "Triceps"], equipment: ["None"] },
      { name: "Agachamento Profundo", reps: "3×15", cues: "Quadris abaixo dos joelhos", muscles: ["Quadriceps", "Glutes"], equipment: ["None"] },
      { name: "Superman + Prancha", reps: "3×10", cues: "Transição controlada", muscles: ["Lower Back", "Core"], equipment: ["None"] },
      { name: "Elevação de Panturrilha", reps: "3×20", cues: "Sobe no limite máximo", muscles: ["Calves"], equipment: ["None"] },
    ],
  },
  {
    id: 9, title: "Puxar Progressivo", level: "beginner", duration: 30,
    description: "Progressão gradual para a primeira barra completa.",
    videoUrl: "https://www.youtube.com/watch?v=M2jwMNQtvJQ",
    exercises: [
      { name: "Scapular Pull-up", reps: "3×10", cues: "Só movimento de omoplata, sem dobrar cotovelo", muscles: ["Upper Back"], equipment: ["Pull-up Bar"] },
      { name: "Flexed Arm Hang (Braço Dobrado)", reps: "3×10s", cues: "Queixo acima da barra", muscles: ["Biceps", "Lats"], equipment: ["Pull-up Bar"] },
      { name: "Australian Pull-up Lento", reps: "3×10", cues: "Pés no chão, corpo inclinado", muscles: ["Upper Back", "Biceps"], equipment: ["Low Bar"] },
      { name: "Flexão Wide Grip", reps: "3×8", cues: "Mãos mais largas que ombros", muscles: ["Chest"], equipment: ["None"] },
    ],
  },
  {
    id: 10, title: "Rotina Semanal A", level: "beginner", duration: 35,
    description: "Treino para fechar a semana com volume moderado para iniciantes.",
    videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    exercises: [
      { name: "Pull-up Negativo", reps: "3×5", cues: "5 segundos na descida", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Flexão Padrão", reps: "3×12", cues: "Toca o chão, empurra até o topo", muscles: ["Chest", "Triceps"], equipment: ["None"] },
      { name: "Afundo Estático", reps: "3×30s", cues: "Mantém 90° nos joelhos", muscles: ["Quadriceps", "Glutes"], equipment: ["None"] },
      { name: "Hollow Body", reps: "3×25s", cues: "Empurra a lombar no chão", muscles: ["Core"], equipment: ["None"] },
      { name: "Bird Dog", reps: "3×10", cues: "Estabiliza antes de estender", muscles: ["Core", "Lower Back"], equipment: ["None"] },
    ],
  },

  // ────── INTERMEDIÁRIO (11–20) ──────
  {
    id: 11, title: "Força Composta", level: "intermediate", duration: 40,
    description: "Pull-up + dip + agachamento unilateral — os três pilares intermediários.",
    videoUrl: "https://www.youtube.com/watch?v=tIpEAqhS1GY",
    exercises: [
      { name: "Pull-up (Barra Pronada)", reps: "4×6", cues: "Peito toca a barra, desce até extensão total", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Dip em Cadeira/Banco", reps: "4×10", cues: "Desce até 90° nos cotovelos", muscles: ["Triceps", "Chest"], equipment: ["Parallel Bars"] },
      { name: "Agachamento Pistol (Assistido)", reps: "4×5", cues: "Segura algo para equilíbrio", muscles: ["Quadriceps", "Glutes"], equipment: ["None"] },
      { name: "Leg Raise na Barra", reps: "4×8", cues: "Joelhos a 90° no topo", muscles: ["Core", "Hip Flexors"], equipment: ["Pull-up Bar"] },
    ],
  },
  {
    id: 12, title: "Empurrar Avançado", level: "intermediate", duration: 40,
    description: "Pike push-up como base para HSPU. Força de ombros.",
    videoUrl: "https://www.youtube.com/watch?v=0Z_WjJjIByM",
    exercises: [
      { name: "Chin-up (Barra Supinada)", reps: "4×7", cues: "Cotovelos puxam pra cima, não para trás", muscles: ["Biceps", "Lats"], equipment: ["Pull-up Bar"] },
      { name: "Pike Push-up", reps: "4×8", cues: "Cabeça passa entre os braços no fundo", muscles: ["Shoulders", "Triceps"], equipment: ["None"] },
      { name: "Hollow Body Rocks", reps: "4×15", cues: "Lombar nunca sai do chão", muscles: ["Core"], equipment: ["None"] },
      { name: "Nordic Curl (parcial)", reps: "4×5", cues: "Desce o mais lento possível", muscles: ["Hamstrings"], equipment: ["None"] },
    ],
  },
  {
    id: 13, title: "L-sit & Tração", level: "intermediate", duration: 40,
    description: "Compressão de quadril e pull-ups com variações de pegada.",
    videoUrl: "https://www.youtube.com/watch?v=OvRJyWVxVCc",
    exercises: [
      { name: "L-sit na Barra (Tuck L)", reps: "4×10s", cues: "Quadris acima dos ombros", muscles: ["Core", "Hip Flexors"], equipment: ["Pull-up Bar"] },
      { name: "Commando Pull-up", reps: "4×5", cues: "Alterna o lado do queixo", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Flexão Arqueiro", reps: "4×5", cues: "Braço esticado vai ao lado", muscles: ["Chest", "Shoulders"], equipment: ["None"] },
      { name: "Dragon Flag (Negativo)", reps: "4×4", cues: "Corpo reto durante toda a descida", muscles: ["Core", "Lower Back"], equipment: ["Bench"] },
    ],
  },
  {
    id: 14, title: "Explosão Intermediária", level: "intermediate", duration: 35,
    description: "Movimentos pliométricos para desenvolver potência.",
    videoUrl: "https://www.youtube.com/watch?v=qDhMFhpJBi0",
    exercises: [
      { name: "Pull-up Explosivo", reps: "4×5", cues: "Tenta tocar o peito na barra", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Flexão com Palma (Clap Push-up)", reps: "4×6", cues: "Peito não toca o chão rápido", muscles: ["Chest", "Triceps"], equipment: ["None"] },
      { name: "Jump Squat", reps: "4×10", cues: "Aterrisa com joelhos semicurvados", muscles: ["Quadriceps", "Glutes"], equipment: ["None"] },
      { name: "Toes to Bar", reps: "4×6", cues: "Controla o swing", muscles: ["Core", "Hip Flexors"], equipment: ["Pull-up Bar"] },
    ],
  },
  {
    id: 15, title: "Pistolet & Pull", level: "intermediate", duration: 40,
    description: "Força unilateral de perna combinada com puxadas.",
    videoUrl: "https://www.youtube.com/watch?v=qDhMFhpJBi0",
    exercises: [
      { name: "Typewriter Pull-up", reps: "4×4", cues: "Desliza o queixo de lado pra lado", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Shrimp Squat", reps: "4×5", cues: "Joelho traseiro toca o chão levemente", muscles: ["Quadriceps", "Glutes"], equipment: ["None"] },
      { name: "Flexão Diamante", reps: "4×10", cues: "Cotovelos colados ao corpo", muscles: ["Triceps", "Chest"], equipment: ["None"] },
      { name: "Hanging Knee Raise to L-sit", reps: "4×8", cues: "Para no L por 1 segundo", muscles: ["Core", "Hip Flexors"], equipment: ["Pull-up Bar"] },
    ],
  },
  {
    id: 16, title: "Volume Médio", level: "intermediate", duration: 45,
    description: "Sessão de alto volume para hipertrofia com peso corporal.",
    videoUrl: "https://www.youtube.com/watch?v=tIpEAqhS1GY",
    exercises: [
      { name: "Pull-up", reps: "5×5", cues: "1 segundo de pausa no topo", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Flexão Decline (pés elevados)", reps: "5×10", cues: "Pés num banco, mais ênfase em peitoral alto", muscles: ["Chest", "Shoulders"], equipment: ["Bench"] },
      { name: "Agachamento Búlgaro", reps: "5×8", cues: "Pé traseiro elevado", muscles: ["Quadriceps", "Glutes"], equipment: ["Bench"] },
      { name: "Ab Wheel", reps: "5×8", cues: "Core durinho durante todo o movimento", muscles: ["Core"], equipment: ["Ab Wheel"] },
    ],
  },
  {
    id: 17, title: "Back & Biceps", level: "intermediate", duration: 40,
    description: "Foco em dorsal e bíceps com variações de pegada na barra.",
    videoUrl: "https://www.youtube.com/watch?v=M2jwMNQtvJQ",
    exercises: [
      { name: "Wide Pull-up", reps: "4×6", cues: "Pegada bem larga, cotovelos apontam para os lados", muscles: ["Lats", "Upper Back"], equipment: ["Pull-up Bar"] },
      { name: "Chin-up Supinado", reps: "4×6", cues: "Cotovelos apontam para frente", muscles: ["Biceps", "Lats"], equipment: ["Pull-up Bar"] },
      { name: "Close Grip Pull-up", reps: "4×6", cues: "Mãos quase se tocam", muscles: ["Biceps", "Lats"], equipment: ["Pull-up Bar"] },
      { name: "Australian Pull-up Lento (3s)", reps: "4×8", cues: "3 segundos de descida controlada", muscles: ["Upper Back", "Biceps"], equipment: ["Low Bar"] },
    ],
  },
  {
    id: 18, title: "Progressão Muscle-up", level: "intermediate", duration: 40,
    description: "Treino voltado para a transição acima da barra.",
    videoUrl: "https://www.youtube.com/watch?v=hdtoQO0cBzU",
    exercises: [
      { name: "Pull-up até o Peito", reps: "4×5", cues: "Peito/esterno toca a barra", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Dip em Cadeira", reps: "4×10", cues: "Cotovelos atrás, não para fora", muscles: ["Triceps", "Chest"], equipment: ["Parallel Bars"] },
      { name: "Kipping Pull-up Controlado", reps: "4×5", cues: "Usa o quadril, não os braços só", muscles: ["Lats", "Core"], equipment: ["Pull-up Bar"] },
      { name: "Hollow Body to Arch", reps: "4×10", cues: "Transição fluida", muscles: ["Core"], equipment: ["None"] },
    ],
  },
  {
    id: 19, title: "Ombro & Pushing", level: "intermediate", duration: 40,
    description: "Desenvolvimento de força de ombro para pré-handstand.",
    videoUrl: "https://www.youtube.com/watch?v=0Z_WjJjIByM",
    exercises: [
      { name: "Pike Push-up Elevado", reps: "4×8", cues: "Pés num banco, angulação maior", muscles: ["Shoulders", "Triceps"], equipment: ["Bench"] },
      { name: "Pull-up Neutro", reps: "4×6", cues: "Palmas se olham", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Handstand Wall Hold", reps: "4×20s", cues: "Empurra a parede com as mãos", muscles: ["Shoulders", "Core"], equipment: ["Wall"] },
      { name: "L-sit Pleno", reps: "4×10s", cues: "Pernas paralelas ao chão", muscles: ["Core", "Hip Flexors"], equipment: ["Parallel Bars"] },
    ],
  },
  {
    id: 20, title: "Full Body Intermediário", level: "intermediate", duration: 45,
    description: "Treino completo com todos os padrões de movimento intermediários.",
    videoUrl: "https://www.youtube.com/watch?v=CkHKGlf5HBw",
    exercises: [
      { name: "Pull-up", reps: "4×6", cues: "Peito à barra", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Flexão Arqueiro", reps: "4×5", cues: "Braço esticado ao lado", muscles: ["Chest", "Shoulders"], equipment: ["None"] },
      { name: "Agachamento Pistol Assistido", reps: "4×6", cues: "Segura na barra", muscles: ["Quadriceps", "Glutes"], equipment: ["Pull-up Bar"] },
      { name: "Dragon Flag Negativo", reps: "4×4", cues: "10 segundos de descida", muscles: ["Core", "Lower Back"], equipment: ["Bench"] },
      { name: "Toes to Bar", reps: "4×6", cues: "Sem balanço excessivo", muscles: ["Core", "Hip Flexors"], equipment: ["Pull-up Bar"] },
    ],
  },

  // ────── AVANÇADO (21–30) ──────
  {
    id: 21, title: "Muscle-up & Potência", level: "advanced", duration: 50,
    description: "Muscle-up estrito + movimentos de potência avançados.",
    videoUrl: "https://www.youtube.com/watch?v=hdtoQO0cBzU",
    exercises: [
      { name: "Strict Muscle-up", reps: "5×3", cues: "Sem balanço, transição controlada", muscles: ["Lats", "Triceps", "Shoulders"], equipment: ["Pull-up Bar"] },
      { name: "Pseudo Planche Push-up", reps: "5×6", cues: "Mãos apontam para trás, lean para frente", muscles: ["Shoulders", "Chest", "Core"], equipment: ["None"] },
      { name: "Pistol Squat", reps: "5×5", cues: "Calcanhar no chão, controle total", muscles: ["Quadriceps", "Glutes"], equipment: ["None"] },
      { name: "L-sit to V-sit", reps: "5×5", cues: "Comprime o quadril até pernas irem acima da horizontal", muscles: ["Core", "Hip Flexors"], equipment: ["Parallel Bars"] },
    ],
  },
  {
    id: 22, title: "One-arm Progressão", level: "advanced", duration: 50,
    description: "Progressão para barra com um braço: o exercício mais desafiador.",
    videoUrl: "https://www.youtube.com/watch?v=M2jwMNQtvJQ",
    exercises: [
      { name: "One-arm Chin-up Negativo", reps: "5×3", cues: "10 segundos de descida com 1 braço", muscles: ["Biceps", "Lats"], equipment: ["Pull-up Bar"] },
      { name: "Archer Pull-up", reps: "5×4", cues: "Braço esticado vai perto do topo", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Handstand Push-up (parede)", reps: "5×5", cues: "Cabeça toca o chão", muscles: ["Shoulders", "Triceps"], equipment: ["Wall"] },
      { name: "Dragon Flag", reps: "5×5", cues: "Corpo reto do pescoço aos calcanhares", muscles: ["Core", "Lower Back"], equipment: ["Bench"] },
    ],
  },
  {
    id: 23, title: "Front Lever", level: "advanced", duration: 50,
    description: "Progressão de front lever — força de alta demanda em dorsal.",
    videoUrl: "https://www.youtube.com/watch?v=ZBMxX7WJqrs",
    exercises: [
      { name: "Tuck Front Lever Hold", reps: "5×10s", cues: "Quadris na linha dos ombros", muscles: ["Lats", "Core"], equipment: ["Pull-up Bar"] },
      { name: "Straddle Front Lever", reps: "5×5s", cues: "Pernas abertas, corpo paralelo ao chão", muscles: ["Lats", "Core"], equipment: ["Pull-up Bar"] },
      { name: "Front Lever Pull-up (Tuck)", reps: "5×4", cues: "Puxa a barra em direção ao quadril", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Planche Lean", reps: "5×20s", cues: "Inclina o corpo para frente nas mãos", muscles: ["Shoulders", "Core"], equipment: ["None"] },
    ],
  },
  {
    id: 24, title: "Handstand & Força", level: "advanced", duration: 50,
    description: "HSPU livre + habilidades de equilíbrio invertido.",
    videoUrl: "https://www.youtube.com/watch?v=0Z_WjJjIByM",
    exercises: [
      { name: "Freestanding Handstand", reps: "5×15s", cues: "Dedo mindinho controla equilíbrio", muscles: ["Shoulders", "Core"], equipment: ["None"] },
      { name: "Handstand Push-up Estrito", reps: "5×5", cues: "Cabeça toca o chão, empurra vertical", muscles: ["Shoulders", "Triceps"], equipment: ["None"] },
      { name: "Weighted Pull-up (mochila)", reps: "5×5", cues: "10-15kg adicionais", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar", "Weight"] },
      { name: "Nordic Curl", reps: "5×5", cues: "Desce completamente, isquio trabalha", muscles: ["Hamstrings"], equipment: ["None"] },
    ],
  },
  {
    id: 25, title: "Back Lever & Força", level: "advanced", duration: 50,
    description: "Back lever e movimentos de força avançados no abdome.",
    videoUrl: "https://www.youtube.com/watch?v=ZBMxX7WJqrs",
    exercises: [
      { name: "Back Lever", reps: "5×8s", cues: "Palmas pra fora, corpo paralelo ao chão", muscles: ["Shoulders", "Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Muscle-up + Dip na Barra", reps: "5×3", cues: "Transição sobe e desce controlada", muscles: ["Lats", "Triceps"], equipment: ["Pull-up Bar"] },
      { name: "Toes to Bar Lento", reps: "5×8", cues: "3 segundos de descida", muscles: ["Core", "Hip Flexors"], equipment: ["Pull-up Bar"] },
      { name: "Planche Push-up Tuck", reps: "5×5", cues: "Joelhos no peito, avança o corpo", muscles: ["Shoulders", "Chest", "Core"], equipment: ["None"] },
    ],
  },
  {
    id: 26, title: "360 & Explosão", level: "advanced", duration: 45,
    description: "Movimentos circulares e explosivos na barra.",
    videoUrl: "https://www.youtube.com/watch?v=qDhMFhpJBi0",
    exercises: [
      { name: "Bar Kip + Muscle-up", reps: "5×3", cues: "Usa a inercia do kip para subir", muscles: ["Lats", "Triceps", "Core"], equipment: ["Pull-up Bar"] },
      { name: "Clap Pull-up", reps: "5×3", cues: "Explode acima, bate palma e reaprende a barra", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Shrimp Squat Completo", reps: "5×5", cues: "Joelho toca o chão", muscles: ["Quadriceps", "Glutes"], equipment: ["None"] },
      { name: "Dragon Flag a 360", reps: "5×4", cues: "Sobe e desce controlado", muscles: ["Core", "Lower Back"], equipment: ["Bench"] },
    ],
  },
  {
    id: 27, title: "Planche Progressão", level: "advanced", duration: 50,
    description: "Foco em planche — o empurrar mais difícil da calistenia.",
    videoUrl: "https://www.youtube.com/watch?v=tIpEAqhS1GY",
    exercises: [
      { name: "Tuck Planche Hold", reps: "5×10s", cues: "Braços retos, quadril acima dos ombros", muscles: ["Shoulders", "Core"], equipment: ["None"] },
      { name: "Straddle Planche Lean", reps: "5×15s", cues: "Pernas abertas, inclinação frontal", muscles: ["Shoulders", "Core"], equipment: ["None"] },
      { name: "Pseudo Planche Push-up (avançado)", reps: "5×8", cues: "Mãos viradas para trás, lean extremo", muscles: ["Shoulders", "Chest", "Core"], equipment: ["None"] },
      { name: "One-arm Pull-up Parcial", reps: "5×5", cues: "Amplitude parcial com 1 braço", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
    ],
  },
  {
    id: 28, title: "Força Máxima", level: "advanced", duration: 45,
    description: "Baixo volume, alta intensidade — máxima produção de força.",
    videoUrl: "https://www.youtube.com/watch?v=ZBMxX7WJqrs",
    exercises: [
      { name: "Weighted Pull-up Máximo", reps: "5×3", cues: "20kg+ na mochila", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar", "Weight"] },
      { name: "Handstand Push-up Fundo", reps: "5×4", cues: "Amplitude completa", muscles: ["Shoulders", "Triceps"], equipment: ["Wall"] },
      { name: "Pistol Squat com Peso", reps: "5×4", cues: "Segura mochila no peito", muscles: ["Quadriceps", "Glutes"], equipment: ["Weight"] },
      { name: "Front Lever Raise", reps: "5×4", cues: "De dead hang sobe ao front lever", muscles: ["Lats", "Core"], equipment: ["Pull-up Bar"] },
    ],
  },
  {
    id: 29, title: "Human Flag Progressão", level: "advanced", duration: 50,
    description: "O movimento lateral mais icônico da calistenia.",
    videoUrl: "https://www.youtube.com/watch?v=hdtoQO0cBzU",
    exercises: [
      { name: "Tuck Human Flag", reps: "5×5s", cues: "Braço de baixo empurra, de cima puxa", muscles: ["Shoulders", "Lats", "Core"], equipment: ["Vertical Bar"] },
      { name: "Straddle Human Flag", reps: "5×3s", cues: "Pernas abertas ajudam a equilibrar", muscles: ["Shoulders", "Lats", "Core"], equipment: ["Vertical Bar"] },
      { name: "Pull-up Explosivo ao Peito", reps: "5×5", cues: "Peito bate na barra", muscles: ["Lats", "Biceps"], equipment: ["Pull-up Bar"] },
      { name: "Dragon Flag Completo", reps: "5×6", cues: "Lento na subida e descida", muscles: ["Core", "Lower Back"], equipment: ["Bench"] },
    ],
  },
  {
    id: 30, title: "Elite Full Body", level: "advanced", duration: 55,
    description: "O treino completo de atleta de calistenia: todos os elementos avançados.",
    videoUrl: "https://www.youtube.com/watch?v=CkHKGlf5HBw",
    exercises: [
      { name: "Muscle-up Estrito", reps: "5×3", cues: "Sem balanço, transição suave", muscles: ["Lats", "Triceps", "Shoulders"], equipment: ["Pull-up Bar"] },
      { name: "Handstand Push-up", reps: "5×5", cues: "Amplitude total", muscles: ["Shoulders", "Triceps"], equipment: ["Wall"] },
      { name: "Front Lever Hold Straddle", reps: "5×8s", cues: "Corpo paralelo ao chão", muscles: ["Lats", "Core"], equipment: ["Pull-up Bar"] },
      { name: "Pistol Squat + Jump", reps: "5×4", cues: "Salta do pistol, aterrisa no pistol", muscles: ["Quadriceps", "Glutes"], equipment: ["None"] },
      { name: "L-sit to V-sit Avançado", reps: "5×6", cues: "Sem balançar, só compressão", muscles: ["Core", "Hip Flexors"], equipment: ["Parallel Bars"] },
    ],
  },
];

async function main() {
  console.log("Limpando banco...");
  await prisma.setLog.deleteMany();
  await prisma.workoutLog.deleteMany();
  await prisma.workoutSet.deleteMany();
  await prisma.workoutBlock.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.exercise.deleteMany();

  console.log("Criando exercícios únicos...");

  // Collect unique exercises by name
  const exerciseMap = new Map<string, string>(); // name → id

  for (const w of rawWorkouts) {
    for (const ex of w.exercises) {
      if (!exerciseMap.has(ex.name)) {
        const created = await prisma.exercise.create({
          data: {
            name: ex.name,
            videoUrl: w.videoUrl,
            primaryMuscles: [ex.muscles[0]],
            secondaryMuscles: ex.muscles.slice(1),
            equipment: ex.equipment,
            steps: [ex.cues],
          },
        });
        exerciseMap.set(ex.name, created.id);
      }
    }
  }

  console.log(`Criados ${exerciseMap.size} exercícios únicos.`);
  console.log("Criando treinos...");

  for (const w of rawWorkouts) {
    const workout = await prisma.workout.create({
      data: {
        title: w.title,
        description: w.description,
        level: w.level,
        category: "calisthenics",
        warmupMinutes: 10,
        cooldownMinutes: 5,
      },
    });

    for (let i = 0; i < w.exercises.length; i++) {
      const ex = w.exercises[i];
      const exerciseId = exerciseMap.get(ex.name)!;
      const parsed = parseReps(ex.reps);

      const block = await prisma.workoutBlock.create({
        data: {
          workoutId: workout.id,
          exerciseId,
          order: i + 1,
          measureType: parsed.measureType,
        },
      });

      for (let s = 0; s < parsed.sets; s++) {
        await prisma.workoutSet.create({
          data: {
            blockId: block.id,
            order: s + 1,
            targetReps: parsed.targetReps,
            targetTimeSec: parsed.targetTimeSec,
          },
        });
      }
    }
  }

  console.log(`Seeded: ${rawWorkouts.length} treinos de calistenia (10 iniciante, 10 intermediário, 10 avançado)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
