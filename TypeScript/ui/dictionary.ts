export type Language = 'en' | 'es';

type SortOption =
  | 'item-asc'
  | 'item-desc'
  | 'sellIn-lowest'
  | 'sellIn-highest'
  | 'quality-lowest'
  | 'quality-highest'
  | 'criticality-lowest'
  | 'criticality-highest';

type UiText = {
  heroEyebrow: string;
  heroTitle: string;
  initialSummary: string;
  summaryForDay: (day: number) => string;
  nextDayButton: string;
  resetButton: string;
  dayLabel: (day: number) => string;
  currentInventoryTitle: string;
  timelineTitle: string;
  sortByLabel: string;
  metrics: {
    highCriticality: string;
    averageQuality: string;
    expiredItems: string;
  };
  tableHeaders: {
    item: string;
    sellIn: string;
    quality: string;
    criticality: string;
    rule: string;
  };
  sortOptions: Record<SortOption, string>;
  timeline: {
    itemsCount: (count: number) => string;
    sellIn: string;
    quality: string;
    criticality: string;
  };
  criticality: {
    high: string;
    medium: string;
    low: string;
  };
  rules: {
    agedBrie: string;
    backstage: string;
    sulfuras: string;
    conjured: string;
    regular: string;
  };
};

export const dictionaries: Record<Language, UiText> = {
  en: {
    heroEyebrow: 'Technical Kata Visualizer',
    heroTitle: 'Gilded Rose Inventory Simulator',
    initialSummary: 'Initial inventory state before applying any rules.',
    summaryForDay: (day: number): string => 'Inventory after ' + day + ' daily update(s).',
    nextDayButton: 'Advance 1 day',
    resetButton: 'Reset',
    dayLabel: (day: number): string => 'Day ' + day,
    currentInventoryTitle: 'Current Inventory',
    timelineTitle: 'Timeline',
    sortByLabel: 'Sort by',
    metrics: {
      highCriticality: 'Items at high criticality',
      averageQuality: 'Average inventory quality',
      expiredItems: 'Expired items',
    },
    tableHeaders: {
      item: 'Item',
      sellIn: 'Sell In',
      quality: 'Quality',
      criticality: 'Criticality',
      rule: 'Rule',
    },
    sortOptions: {
      'item-asc': 'Item: A to Z',
      'item-desc': 'Item: Z to A',
      'sellIn-lowest': 'Sell In: Lowest first',
      'sellIn-highest': 'Sell In: Highest first',
      'quality-lowest': 'Quality: Lowest first',
      'quality-highest': 'Quality: Highest first',
      'criticality-lowest': 'Criticality: Lowest first',
      'criticality-highest': 'Criticality: Highest first',
    },
    timeline: {
      itemsCount: (count: number): string => count + ' items',
      sellIn: 'Sell In',
      quality: 'Quality',
      criticality: 'Criticality',
    },
    criticality: {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    },
    rules: {
      agedBrie: 'Increases in quality over time.',
      backstage: 'Increases near the concert and drops to zero after it.',
      sulfuras: 'Legendary item: never changes.',
      conjured: 'Degrades twice as fast.',
      regular: 'Regular item: loses quality normally.',
    },
  },
  es: {
    heroEyebrow: 'Visualizador del kata técnico',
    heroTitle: 'Simulador de inventario Gilded Rose',
    initialSummary: 'Estado inicial del inventario antes de aplicar cualquier regla.',
    summaryForDay: (day: number): string => 'Inventario después de ' + day + ' actualización(es) diaria(s).',
    nextDayButton: 'Avanzar 1 día',
    resetButton: 'Reiniciar',
    dayLabel: (day: number): string => 'Día ' + day,
    currentInventoryTitle: 'Inventario actual',
    timelineTitle: 'Timeline',
    sortByLabel: 'Ordenar por',
    metrics: {
      highCriticality: 'Ítems con criticidad alta',
      averageQuality: 'Calidad promedio del inventario',
      expiredItems: 'Ítems vencidos',
    },
    tableHeaders: {
      item: 'Ítem',
      sellIn: 'Sell In',
      quality: 'Quality',
      criticality: 'Criticidad',
      rule: 'Regla',
    },
    sortOptions: {
      'item-asc': 'Ítem: A a Z',
      'item-desc': 'Ítem: Z a A',
      'sellIn-lowest': 'Sell In: menor primero',
      'sellIn-highest': 'Sell In: mayor primero',
      'quality-lowest': 'Quality: menor primero',
      'quality-highest': 'Quality: mayor primero',
      'criticality-lowest': 'Criticidad: menor primero',
      'criticality-highest': 'Criticidad: mayor primero',
    },
    timeline: {
      itemsCount: (count: number): string => count + ' ítems',
      sellIn: 'Sell In',
      quality: 'Quality',
      criticality: 'Criticidad',
    },
    criticality: {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
    },
    rules: {
      agedBrie: 'Aumenta su calidad con el tiempo.',
      backstage: 'Aumenta cerca del concierto y baja a cero después.',
      sulfuras: 'Ítem legendario: nunca cambia.',
      conjured: 'Se degrada al doble de velocidad.',
      regular: 'Ítem normal: pierde calidad normalmente.',
    },
  },
};
