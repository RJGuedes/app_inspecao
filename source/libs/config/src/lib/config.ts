import { ItemCapacityDataEslinga8 } from './table-data';

export const simNao = (value: any) => (value ? 'Sim' : 'Não');
export const ItemTypes = [
  {
    name: 'Linga de Cabo de Aço',
    itemType: 1,
    renderContent: (item: any, sector: any) => {
      const setor = sector?.name;
      return [
        `${'Linga de Cabo de Aço'}
Placa de rastreabilidade Seyconel: ${item?.traceability}
Setor: ${setor}
Comprimento: ${item?.data?.length} m
Elemento inicial: ${
          item?.data?.initial_element
        }                 Elemento de ligação: ${
          item?.data?.connection_element
        }                 Elemento final: ${item?.data?.end_element}
Ident.decargalegível: ${simNao(item?.data?.legible_load_id)}
Ruptura de pernas: ${simNao(item?.data?.leg_break)}
Amassados: ${simNao(item?.data?.crumpled)}
Desgastes excessivos: ${simNao(item?.data?.excessive_wear)}
Redução de elasticidade: ${simNao(item?.data?.elasticity_reduction)}
Descrição: ${item?.data?.description}
Observação: ${item?.data?.observation ? item?.data?.observation : ''}
      `,
        `
Ramais: ${item?.data?.extensions}
Capacidade: ${item?.data?.capacity} T
Diâmetro: ${item?.data?.diameter} mm

Arames rompidos:${simNao(item?.data?.broken_wire)}

Deformação: ${simNao(item?.data?.deformation)}
Danos por calor: ${simNao(item?.data?.heat_damage)}
Corrosão externa/interna: ${simNao(item?.data?.corrosion)}`,
      ];
    },
    fields: [
      'extensions',
      'capacity',
      'length',
      'diameter',
      'initial_element',
      'connection_element',
      'end_element',
      'legible_load_id',
      'broken_wire',
      'leg_break',
      'crumpled',
      'deformation',
      'excessive_wear',
      'heat_damage',
      'elasticity_reduction',
      'corrosion',
      'description',
      'observation',
    ],
  },
  {
    name: 'Dispositivos Especiais',
    itemType: 2,
    renderContent: (item: any, sector: any) => {
      const setor = sector?.name;
      return [
        `${'Dispositivos Especiais'}
Placa de rastreabilidade Seyconel: ${item?.traceability}
Setor: ${setor}
Comprimento: ${item?.data?.length} m
Olhal danificado: ${simNao(item?.data?.eyelet_damage)}
Alavanca danificada: ${simNao(item?.data?.lever_damage)}
Trinca nas soldas: ${simNao(item?.data?.weld_cracks)}

Descrição: ${item?.data?.description}
Observação: ${item?.data?.observation ? item?.data?.observation : ''}`,
        `
Capacidade: ${item?.data?.capacity} T
Tara: ${item?.data?.tare} kg
Estrutura externa danificada: ${simNao(item?.data?.external_structure_damage)}
Base inferior danificada: ${simNao(item?.data?.lower_base_damage)}
Ensaios não destrutivos: ${simNao(item?.data?.non_destructive_testing)}
`,
      ];
    },
    fields: [
      'length',
      'capacity',
      'tare',
      'eyelet_damage',
      'external_structure_damage',
      'lever_damage',
      'lower_base_damage',
      'documentation',
      'welds_cracks',
      'description',
      'observation',
    ],
  },
  {
    name: 'Garras de elevação',
    itemType: 3,
    renderContent: (item: any, sector: any) => {
      const setor = sector?.name;
      return [
        `${'Garras de elevação'}
Placa de rastreabilidade Seyconel: ${item?.traceability}
Setor: ${setor}
Came danificado: ${simNao(item?.data?.came_damage)}
Pinos danificados: ${simNao(item?.data?.pine_damage)}

Descrição: ${item?.data?.description}
Observação: ${item?.data?.observation ? item?.data?.observation : ''}`,
        `
Capacidade: ${item?.data?.capacity} T
Deformação: ${simNao(item?.data?.deformation)}
Olhal danificado: ${simNao(item?.data?.eyelet_damage)}
Dano na trava: ${simNao(item?.data?.latch_damage)}
`,
      ];
    },
    fields: [
      'capacity',
      'deformation',
      'eyelet_damage',
      'latch_damage',
      'came_damage',
      'pine_damage',
      'description',
      'observation',
    ],
  },
  {
    name: 'Acessórios',
    itemType: 4,
    renderContent: (item: any, sector: any) => {
      const setor = sector?.name;
      return [
        `${'Acessórios'}
Placa de rastreabilidade Seyconel: ${item?.traceability}
Setor: ${setor}
Grau: ${(item?.data?.degree)}
Identificação: ${simNao(item?.data?.identification)}
Alongamento: ${simNao(item?.data?.stretching)}

Descrição: ${item?.data?.description}
Observação: ${item?.data?.observation ? item?.data?.observation : ''}`,
        `

Capacidade: ${item?.data?.capacity} T
Deformação: ${simNao(item?.data?.deformation)}
Travas: ${simNao(item?.data?.latches)}
Trincas: ${simNao(item?.data?.cracks)}
`,
      ];
    },
    fields: [
      'capacity',
      'degree',
      'identification',
      'deformation',
      'stretching',
      'latches',
      'cracks',
      'description',
      'observation',
    ],
  },
  {
    name: 'Eslingas',
    itemType: 5,
    renderContent: (item: any, sector: any) => {
      const setor = sector?.name;
      return [
        `${'Eslingas'}
Placa de rastreabilidade Seyconel: ${item?.traceability}
Setor: ${setor}
Elemento inicial: ${
          item?.data?.initial_element
        }                 Elemento de ligação: ${
          item?.data?.connection_element
        }                 Elemento final: ${item?.data?.end_element}
Danos costura do corpo: ${simNao(item?.data?.body_seam_damage)}
Cortes: ${simNao(item?.data?.cuts)}
Travas: ${simNao(item?.data?.latches)}
Trinca: ${simNao(item?.data?.cracks)}
Placa de Identificação: ${simNao(item?.data?.nameplate)}

Descrição: ${item?.data?.description}
Observação: ${item?.data?.observation ? item?.data?.observation : ''}`,
        `
Ramais: ${item?.data?.extensions}
Capacidade cinta: ${item?.data?.strap_capacity}

Danos nos olhais: ${simNao(item?.data?.eyelets_damage)}
Danos costura principal: ${simNao(item?.data?.main_seam_damage)}
Abrasão: ${simNao(item?.data?.abrasion)}
Deformação: ${simNao(item?.data?.deformation)}
Alongamento: ${simNao(item?.data?.stretching)}

`,
      ];
    },
    fields: [
      'extensions',
      'strap_type',
      'initial_element',
      'connection_element',
      'end_element',
      'length',
      'strap_capacity',
      'capacity_auto',
      'body_seam_damage',
      'main_seam_damage',
      'eyelets_damage',
      'abrasion',
      'deformation',
      'stretching',
      'cuts',
      'latches',
      'cracks',
      'nameplate',

      // TODO: CAPACIDADE

      'description',
      'observation',
    ],
  },
  {
    name: 'Lingas',
    itemType: 6,
    renderContent: (item: any, sector: any) => {
      const setor = sector?.name;
      return [
        `${'Lingas'}
Placa de rastreabilidade Seyconel: ${item?.traceability}
Setor: ${setor}
Elemento inicial: ${
          item?.data?.initial_element
        }                 Elemento de ligação: ${
          item?.data?.connection_element
        }                 Elemento final: ${item?.data?.end_element}
Grau aço: ${item?.data?.degree_iron}
Alongamento interno da corrente: ${simNao(item?.data?.internal_stretching)}
Alongamento externo da corrente: ${simNao(item?.data?.external_stretching)}
Capacidade: ${item?.data?.capacity_auto}
Deformação:  ${simNao(item?.data?.deformation)}
Descrição: ${item?.data?.description}
Observação: ${item?.data?.observation ? item?.data?.observation : ''}`,
        `
Comprimento: ${item?.data?.length} m
Ramais: ${item?.data?.extensions}

Travas: ${simNao(item?.data?.latches)}
Trinca: ${simNao(item?.data?.cracks)}
Placa de Identificação: ${simNao(item?.data?.nameplate)}


`,
      ];
    },
    fields: [
      'extensions',
      'length',
      'initial_element',
      'connection_element',
      'end_element',
      'nominal_diameter',
      'capacity_auto',

      'degree_iron',
      'internal_stretching',
      'external_stretching',
      'latches',
      'cracks',
      'deformation',
      'nameplate',
      // TODO: CAPACIDADE TABELA
      'description',
      'observation',
    ],
  },
  {
    name: 'Cintas',
    itemType: 7,
    renderContent: (item: any, sector: any) => {
      const setor = sector?.name;
      return [
        `${'Cintas'}
Placa de rastreabilidade Seyconel: ${item?.traceability}
Setor: ${setor}
Capacidade: ${item?.data?.capacity_select}
Tipo de cinta: ${item?.data?.strap_type}
Danos na costura do corpo: ${simNao(item?.data?.body_seam_damage)}
Danos nos olhais: ${simNao(item?.data?.eyelets_damage)}
Cortes: ${simNao(item?.data?.cuts)}

Descrição: ${item?.data?.description}
Observação: ${item?.data?.observation ? item?.data?.observation : ''}`,
        `
Comprimento: ${item?.data?.length} m
Ramais: ${item?.data?.extensions}

Danos na costura principal: ${simNao(item?.data?.main_seam_damage)}
Abrasão: ${simNao(item?.data?.abrasion)}
Placa de Identificação: ${simNao(item?.data?.nameplate)}


`,
      ];
    },
    fields: [
      'extensions',
      'capacity_select',
      'length',
      'strap_type',
      'body_seam_damage',
      'main_seam_damage',
      'eyelets_damage',
      'cuts',
      'abrasion',
      'nameplate',
      'description',
      'observation',
    ],
  },
  {
    name: 'Talhas manuais',
    itemType: 8,
    renderContent: (item: any, sector: any) => {
      const setor = sector?.name;
      return [
        `${'Talhas manuais'}
Placa de rastreabilidade Seyconel: ${item?.traceability}
Setor: ${setor}
Capacidade: ${item?.data?.capacity} T

Gancho danificado: ${simNao(item?.data?.hook_damaged)}
Alavanca danificada: ${simNao(item?.data?.lever_damage)}
Trinca nas soldas: ${simNao(item?.data?.welds_cracks)}
Deformação nos elos da corrente: ${simNao(item?.data?.chain_links_deformation)}

Descrição: ${item?.data?.description}
Observação: ${item?.data?.observation ? item?.data?.observation : ''}`,
        `

Comprimento: ${item?.data?.length} m

Estrutura externa danificada: ${simNao(item?.data?.external_structure_damage)}
Pinos danificados: ${simNao(item?.data?.pine_damage)}
Travas: ${simNao(item?.data?.latches)}
`,
      ];
    },
    fields: [
      'length',
      'capacity',
      'hook_damaged',
      'external_structure_damage',
      'lever_damage',
      'welds_cracks',
      'pine_damage',
      'chain_links_deformation',
      'latches',
      'description',
      'observation',
    ],
  },
  {
    name: 'Cabo de Aço',
    itemType: 9,
    renderContent: (item: any, sector: any) => {
      const setor = sector?.name;
      return [
        `${'Cabo de Aço'}
Placa de rastreabilidade Seyconel: ${item?.traceability}
Setor: ${setor}
Comprimento: ${item?.data?.length} m

Ident.de carga legível: ${simNao(item?.data?.legible_load_id)}
Ruptura de pernas: ${simNao(item?.data?.leg_break)}
Amassados: ${simNao(item?.data?.crumpled)}
Desgastes excessivos: ${simNao(item?.data?.excessive_wear)}
Redução de elasticidade: ${simNao(item?.data?.elasticity_reduction)}
Descrição: ${item?.data?.description}
Observação: ${item?.data?.observation ? item?.data?.observation : ''}
      `,
        `
Ramais: ${item?.data?.extensions}
Capacidade: ${item?.data?.capacity} T
Diâmetro: ${item?.data?.diameter} mm

Arames rompidos:${simNao(item?.data?.broken_wire)}

Deformação: ${simNao(item?.data?.deformation)}
Danos por calor: ${simNao(item?.data?.heat_damage)}
Corrosão externa/interna: ${simNao(item?.data?.corrosion)}`,
      ];
    },
    fields: [
      'extensions',
      'capacity',
      'length',
      'diameter',
      'legible_load_id',
      'broken_wire',
      'leg_break',
      'crumpled',
      'excessive_wear',
      'deformation',
      'elasticity_reduction',
      'heat_damage',
      'corrosion',
      'description',
      'observation',
    ],
  },
];

export const ItemDataFieldLegends: { [k: string]: string } = {
  ELO: 'Elo de sustentação',
  ESE: 'Elos com sub elos',
  CAD: 'Cadeado',
  CAC: 'Cadeado para cinta',
  MPC: 'Manilha ancora com porca e cupilha',
  MAR: 'Manilha ancora com rosca',
  GEF: 'Gancho especial de fundição',
  GOT: 'Gancho olhal com trava',
  GOA: 'Gancho olhal auto-travante',
  SEP: 'Separador de Perfil',
  DIS: 'Dispositivo Especial',
  GCT: 'Gancho clévis com trava',
  GCA: 'Gancho clévis auto-travante',
  GGA: 'Gancho giratório auto-travante',
  GOF: 'Gancho Olhal de Fundição',
  ENC: 'Encurtador de corrente',
  OG: 'Olhal giratório',
  OA: 'Olhal articulado',
  OF: 'Olhal fixo',
  PCH: 'Pega chapa Horizontal',
  PCV: 'Pega chapa Vertical',
  PV: 'Pega Viga',
  PTB: 'Pega Tambor',
};

export const ItemDataFields: {
  [k: string]: {
    label: string;
    type: string;
    options?: any;
    templateOptions?: any;
  };
} = {
  sector: {
    label: 'Setor',
    type: 'input',
  },
  length: {
    label: 'Comprimento',
    type: 'input',
  },

  extensions: {
    label: 'Ramais',
    type: 'select-modal',
    options: [
      { label: 'Ramal 1', value: 1 },
      { label: 'Ramal 2', value: 2 },
      { label: 'Ramal 3', value: 3 },
      { label: 'Ramal 4', value: 4 },
    ],
  },
  strap_capacity: {
    label: 'Capacidade cinta',
    type: 'select-modal',
    options: [
      { label: '1 T', value: 1 },
      { label: '2 T', value: 2 },
      { label: '3 T', value: 3 },
      { label: '4 T', value: 4 },
      { label: '5 T', value: 5 },
      { label: '6 T', value: 6 },
      { label: '8 T', value: 8 },
      { label: '10 T', value: 10 },
      { label: '12 T', value: 12 },
      { label: '15 T', value: 15 },
      { label: '20 T', value: 20 },
    ],
  },

  strap_type: {
    label: 'Tipo de cinta',
    type: 'select-modal',
    options: [
      { label: 'Plana', value: 'plana' },
      { label: 'Anel', value: 'anel' },
      { label: 'Tubular', value: 'tubular' },
    ],
  },
  degree: {
    label: 'Grau',
    type: 'select-modal',
    options: [
      { label: '6', value: 6 },
      { label: '8', value: 8 },
      { label: '10', value: 10 },
      { label: '12', value: 12 },
    ],
  },
  degree_iron: {
    label: 'Grau aço',
    type: 'select-modal',
    options: [
      { label: 'G8: Grau 8', value: 8 },
      { label: 'G10: Grau 10', value: 10 },
    ],
  },
  nominal_diameter: {
    label: 'Diâmetro nominal da corrente',
    type: 'select-modal',
    options: Object.keys(ItemCapacityDataEslinga8).map((k) => ({
      label: `${k}mm`,
      value: Number(k),
    })),
  },
  capacity_select: {
    label: 'Capacidade',
    type: 'select-modal',
    options: [
      { label: '1 T', value: 1 },
      { label: '2 T', value: 2 },
      { label: '3 T', value: 3 },
      { label: '4 T', value: 4 },
      { label: '5 T', value: 5 },
      { label: '6 T', value: 6 },
      { label: '8 T', value: 8 },
      { label: '10 T', value: 10 },
      { label: '12 T', value: 12 },
      { label: '15 T', value: 15 },
      { label: '18 T', value: 18 },
      { label: '20 T', value: 20 },
    ],
  },
  capacity: {
    label: 'Capacidade',
    type: 'input',
  },

  capacity_auto: {
    label: 'Capacidade',
    type: 'input',
    templateOptions: {
      readonly: true,
    },
  },
  tare: {
    label: 'Tara',
    type: 'input',
  },
  initial_element: {
    label: 'Elemento inicial',
    type: 'select-modal',
    options: Object.keys(ItemDataFieldLegends).map((value: string) => ({
      label: `${value} - ${ItemDataFieldLegends[value]}`,
      value,
    })),
  },
  connection_element: {
    label: 'Elemento de ligação',
    type: 'select-modal',
    options: Object.keys(ItemDataFieldLegends).map((value: string) => ({
      label: `${value} - ${ItemDataFieldLegends[value]}`,
      value,
    })),
  },
  end_element: {
    label: 'Elemento final',
    type: 'select-modal',
    options: Object.keys(ItemDataFieldLegends).map((value: string) => ({
      label: `${value} - ${ItemDataFieldLegends[value]}`,
      value,
    })),
  },
  diameter: {
    label: 'Diâmetro',
    type: 'input',
  },
  corrosion: {
    label: 'Corrosão interna/externa',
    type: 'toggle',
  },
  internal_stretching: {
    label: 'Alongamento interno da corrente',
    type: 'toggle',
  },
  external_stretching: {
    label: 'Alongamento externo da corrente',
    type: 'toggle',
  },

  deformation: {
    label: 'Deformação',
    type: 'toggle',
  },
  chain_links_deformation: {
    label: 'Deformação nos elos da corrente',
    type: 'toggle',
  },
  identification: {
    label: 'Identificação',
    type: 'toggle',
  },
  stretching: {
    label: 'Alongamento',
    type: 'toggle',
  },
  latches: {
    label: 'Travas',
    type: 'toggle',
  },
  cracks: {
    label: 'Trincas',
    type: 'toggle',
  },
  welds_cracks: {
    label: 'Trincas nas soldas',
    type: 'toggle',
  },
  nameplate: {
    label: 'Placa de identificação',
    type: 'toggle',
  },
  eyelets_damage: {
    label: 'Danos nos olhais',
    type: 'toggle',
  },
  eyelet_damage: {
    label: 'Olhal danificado',
    type: 'toggle',
  },
  body_seam_damage: {
    label: 'Danos costura do corpo',
    type: 'toggle',
  },
  main_seam_damage: {
    label: 'Danos costura principal',
    type: 'toggle',
  },
  came_damage: {
    label: 'Came danificado',
    type: 'toggle',
  },
  pine_damage: {
    label: 'Pinos Danificado',
    type: 'toggle',
  },
  latch_damage: {
    label: 'Dano na trava',
    type: 'toggle',
  },
  cuts: {
    label: 'Cortes',
    type: 'toggle',
  },
  abrasion: {
    label: 'Abrasão',
    type: 'toggle',
  },
  external_structure_damage: {
    label: 'Estrutura externa danificada',
    type: 'toggle',
  },
  lever_damage: {
    label: 'Alavanca danificada',
    type: 'toggle',
  },
  lower_base_damage: {
    label: 'Base inferior danificada',
    type: 'toggle',
  },
  technical_drawing: {
    label: 'Desenho técnico',
    type: 'toggle',
  },
  measures_match_drawing: {
    label: 'Medidas batem com desenho',
    type: 'toggle',
  },
  eyelet_fine: {
    label: 'Olhal em bom estado',
    type: 'toggle',
  },
  legible_load_id: {
    label: 'Ident. de carga legível',
    type: 'toggle',
  },
  broken_wire: {
    label: 'Arames rompidos',
    type: 'toggle',
  },
  documentation: {
    label: 'Documentação',
    type: 'toggle',
  },
  leg_break: {
    label: 'Ruptura de pernas',
    type: 'toggle',
  },
  crumpled: {
    label: 'Amassados',
    type: 'toggle',
  },
  excessive_wear: {
    label: 'Desgastes excessivos',
    type: 'toggle',
  },
  hook_damaged: {
    label: 'Gancho danificado',
    type: 'toggle',
  },
  heat_damage: {
    label: 'Danos por calor',
    type: 'toggle',
  },
  elasticity_reduction: {
    label: 'Redução de elasticidade',
    type: 'toggle',
  },
  observation: {
    label: 'Observação',
    type: 'textarea',
  },

  non_destructive_testing: {
    label: 'Ensaios não destrutivos',
    type: 'toggle',
  },
  /*approved: {
    label: 'Aprovado?',
    type: 'toggle',
  },*/
  description: {
    label: 'Descrição',
    type: 'textarea',
  },
};
