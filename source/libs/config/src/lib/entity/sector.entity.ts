import { FormlyFieldConfig } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { IaEntity } from '../interfaces/entity.interface';
import { iaDefaultField } from '../app.defaults';

const fields: FormlyFieldConfig[] = [
  {
    key: 'name',
    type: 'input',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Nome',
      placeholder: 'Preencha o nome completo',
      required: true,
    },
  },

  {
    key: 'survey.id',
    type: 'select-modal',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Vistoria',
      required: true,
      dynamicOptions: {
        entityId: 'surveys',
        label: 'name',
        value: 'id',
      },
    },
  },
];

const appFields: FormlyFieldConfig[] = [
  {
    key: 'name',
    type: 'input',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Nome',
      placeholder: 'Preencha o nome completo',
      required: true,
    },
  },
];

const filterFields: FormlyFieldConfig[] = [
  {
    key: 'name',
    type: 'input',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Nome',
      placeholder: 'Preencha o nome completo',
    },
  },

  {
    key: 'surveyId',
    type: 'select-modal',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Vistoria',
      required: true,
      dynamicOptions: {
        entityId: 'surveys',
        label: 'name',
        value: 'id',
      },
    },
  },
];

const columns: TableColumn[] = [
  { name: 'Nome', prop: 'name' },
  { name: 'Vistoria', prop: 'survey.name' },
  {
    name: 'Itens',
    prop: 'itemsCount',
    maxWidth: 80,
  },
];

const detailFields: {
  name: string;
  prop: string;
  url?: (value: unknown) => string;
  render?: (value: unknown) => string;
}[] = [
  { name: 'Nome', prop: 'name' },
  {
    name: 'Itens',
    prop: 'itemsCount',
    url: (model: any) => `/admin/items/list?sectorId=${model.id}`,
  },
  {
    name: 'Vistoria',
    prop: 'survey.name',
    url: (model: any) => `/admin/surveys/detail/${model.survey.id}`,
  },
  {
    name: 'Cliente',
    prop: 'survey.customer.name',
    url: (model: any) => `/admin/customers/detail/${model.survey.customer.id}`,
  },

  {
    name: 'Criado em',
    prop: 'createdAt',
    render: (value) => {
      const dateString = value as string;
      return dateString;
      //return formatDate(dateString, 'medium', 'pt');
    },
  },
  {
    name: 'Atualizado em',
    prop: 'modifiedAt',
    render: (value) => {
      const dateString = value as string;
      return dateString;
      //return formatDate(dateString, 'medium', 'pt');
    },
  },
];

export const sectorEntity: { [id: string]: IaEntity } = {
  sectors: {
    id: 'sectors',
    label: 'Setores',
    labelSingular: 'Setor',
    keyField: 'id',
    displayField: 'name',
    icon: 'layers',
    actions: [
      'list',
      'detail',
      'add',
      'edit',
      'remove',
      'export',
      'search',
      'filter',
    ],
    search: (value: any) => ({
      $or: [{ name: { $cont: value } }, { 'customer.name': { $cont: value } }],
    }),
    filters: { fields: filterFields },
    form: { fields },
    appForm: { fields: appFields },
    list: { columns, queryFilters: ['surveyId'] },
    detail: { fields: detailFields },
  },
};
