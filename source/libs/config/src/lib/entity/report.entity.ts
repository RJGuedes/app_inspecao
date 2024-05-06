import { FormlyFieldConfig } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { IaDetailField } from '../interfaces/detail-fields.interface';
import { IaEntity } from '../interfaces/entity.interface';
import { iaDefaultField } from '../app.defaults';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

const date = format(new Date(), `MMMM 'de' yyyy`, { locale: ptBR });
const titleDate = date[0].toUpperCase() + date.substr(1).toLowerCase();

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
];

const columns: TableColumn[] = [
  { name: 'Nome', prop: 'name' },
  { name: 'RI', prop: 'ri' },

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
  { name: 'RI', prop: 'ri' },

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
  {
    name: 'Dados',
    prop: 'data',
    render: (value) => {
      return `${JSON.stringify(value)}`;
    },
  },
];

export const reportEntity: { [id: string]: IaEntity } = {
  reports: {
    id: 'reports',
    label: 'Relatórios',
    labelSingular: 'Relatório',
    keyField: 'id',
    displayField: 'name',
    icon: 'print',
    actions: [
      'list',
      'detail',
      'add',
      'edit',
      'remove',
      'export',
      'search',
      'filter',
      'print',
    ],
    search: (value) => ({
      $or: [{ name: { $cont: value } }],
    }),
    filters: { fields: filterFields },
    form: { fields },
    appForm: { fields: appFields },
    list: { columns },
    detail: { fields: detailFields },
  },
};
