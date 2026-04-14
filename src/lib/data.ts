export interface Subject {
  id: string;
  name: string;
  status: 'em_andamento' | 'concluido' | 'planejado';
  hours?: number;
}

export interface Period {
  id: string;
  name: string; // e.g. "1º Período"
  subjects: Subject[];
}

export interface Course {
  id: string;
  name: string; // e.g. "Fisioterapia"
  periods: Period[];
}

export const courses: Course[] = [
  {
    id: "fisioterapia",
    name: "Fisioterapia",
    periods: [
      {
        id: "1-periodo",
        name: "1º Período",
        subjects: [
          { id: "anatomia-1", name: "Anatomia Humana I", status: "em_andamento" },
          { id: "embriologia", name: "Embriologia", status: "em_andamento" },
          { id: "cinesiologia-1", name: "Cinesiologia I", status: "planejado" },
        ],
      },
      {
        id: "2-periodo",
        name: "2º Período",
        subjects: [
          { id: "fisiologia", name: "Fisiologia", status: "planejado" },
          { id: "bioestatistica", name: "Bioestatística", status: "planejado" },
        ],
      },
    ],
  },
  {
    id: "engenharia",
    name: "Engenharia de Software",
    periods: [
      {
        id: "1-periodo-eng",
        name: "1º Período",
        subjects: [
          { id: "calculo-1", name: "Cálculo I", status: "concluido" },
          { id: "algoritmos", name: "Algoritmos", status: "concluido" },
        ],
      },
      {
        id: "2-periodo-eng",
        name: "2º Período",
        subjects: [
          { id: "calculo-2", name: "Cálculo II", status: "em_andamento" },
          { id: "estatistica", name: "Estatística", status: "em_andamento" },
        ],
      },
    ],
  },
];

export const userCurrentState = {
  courseId: "fisioterapia",
  periodId: "1-periodo",
};
