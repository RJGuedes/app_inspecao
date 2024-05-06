import { FormlyFieldConfig } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { IaDetailField } from '../interfaces/detail-fields.interface';
import { IaEntity } from '../interfaces/entity.interface';
import { iaDefaultField } from '../app.defaults';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

const date = format(new Date(), `MMMM 'de' yyyy`, { locale: ptBR });
const titleDate = date[0].toUpperCase() + date.substr(1).toLowerCase();
const yearDate = format(new Date(), `yyyy`, { locale: ptBR });
const monthDate = format(new Date(), `M`, { locale: ptBR });

const appFields: FormlyFieldConfig[] = [
  {
    key: 'name',
    type: 'input',
    defaultValue: titleDate,
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Nome',
      placeholder: 'Preencha o nome completo',
      required: true,
    },
  },
  {
    key: 'city',
    type: 'input',
    // defaultValue: titleDate,
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Cidade',
      placeholder: 'Preencha a cidade',
      required: true,
    },
  },
  {
    key: 'state',
    type: 'input',
    // defaultValue: titleDate,
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Estado',
      placeholder: 'Preencha o estado',
      required: true,
    },
  },
  {
    key: 'month',
    type: 'input',
    defaultValue: monthDate,
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Mês',
      placeholder: 'Preencha o mês',
      required: true,
    },
  },
  {
    key: 'year',
    type: 'input',
    defaultValue: yearDate,
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Ano',
      placeholder: 'Preencha o ano',
      required: true,
    },
  },
  {
    key: 'completed',
    type: 'toggle',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Concluído',
    },
  },
];

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
    key: 'city',
    type: 'input',
    // defaultValue: titleDate,
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Cidade',
      placeholder: 'Preencha a cidade',
      required: true,
    },
  },
  {
    key: 'state',
    type: 'input',
    // defaultValue: titleDate,
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Estado',
      placeholder: 'Preencha o estado',
      required: true,
    },
  },
  {
    key: 'month',
    type: 'input',
    defaultValue: monthDate,
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Mês',
      placeholder: 'Preencha o mês',
      required: true,
    },
  },
  {
    key: 'year',
    type: 'input',
    defaultValue: yearDate,
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Ano',
      placeholder: 'Preencha o ano',
      required: true,
    },
  },
  {
    key: 'customer.id',
    type: 'select-modal',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Cliente',
      required: true,
      dynamicOptions: {
        entityId: 'customers',
        label: 'name',
        value: 'id',
      },
    },
  },
  {
    key: 'completed',
    type: 'toggle',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Concluído',
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
    key: 'customerId',
    type: 'select-modal',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Cliente',
      required: true,
      dynamicOptions: {
        entityId: 'customers',
        label: 'name',
        value: 'id',
      },
    },
  },

  {
    key: 'completed',
    type: 'toggle',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Concluído',
    },
  },
];

const columns: TableColumn[] = [
  { name: 'Nome', prop: 'name' },
  { name: 'Cliente', prop: 'customer.name' },
  {
    name: 'Concluído',
    prop: 'completed',
    maxWidth: 80,
    pipe: { transform: (val) => (val ? 'Sim' : 'Não') },
  },
  { name: 'Setores', prop: 'sectorsCount', maxWidth: 80 },

  {
    name: 'Atualizado em',
    prop: 'modifiedAt',
    pipe: {
      transform: (value) => {
        const dateString = value as string;
        return dateString;
      //return formatDate(dateString, 'medium', 'pt');
      },
    },
    maxWidth: 200,
    minWidth: 200,
  },
];

const detailFields: IaDetailField[] = [
  { name: 'Nome', prop: 'name' },
  { name: 'Cidade', prop: 'city' },
  { name: 'Estado', prop: 'state' },
  { name: 'Mês', prop: 'month' },
  { name: 'Ano', prop: 'year' },
  {
    name: 'Cliente',
    prop: 'customer.name',
    url: (model: any) => `/admin/customers/detail/${model.customerId}`,
  },
  {
    name: 'Concluído',
    prop: 'completed',
    render: (val) => (val ? 'Sim' : 'Não'),
  },
  {
    name: 'Setores',
    prop: 'sectorsCount',
    url: (model: any) => `/admin/sectors/list?surveyId=${model.id}`,
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

export const surveyEntity: { [id: string]: IaEntity } = {
  surveys: {
    id: 'surveys',
    label: 'Vistorias',
    labelSingular: 'Vistoria',
    keyField: 'id',
    displayField: 'name',
    icon: 'list',
    actions: [
      'list',
      'detail',
      'add',
      'edit',
      'remove',
      'export',
      'search',
      'filter',
      'report',
    ],
    search: (value) => ({
      $or: [{ name: { $cont: value } }, { 'customer.name': { $cont: value } }],
    }),
    filters: { fields: filterFields },
    form: { fields },
    appForm: { fields: appFields },
    list: { columns, queryFilters: ['customerId'] },
    detail: { fields: detailFields },
  },
};
