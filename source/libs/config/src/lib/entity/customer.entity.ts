import { FormlyFieldConfig } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { IaDetailField } from '../interfaces/detail-fields.interface';
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
    key: 'cnpj',
    type: 'input',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'CNPJ',
      placeholder: 'Preencha um CNPJ válido',
      required: true,
    },
  },
];

const filtersFields: FormlyFieldConfig[] = [
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
    key: 'cnpj',
    type: 'input',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'CNPJ',
      placeholder: 'Preencha um CNPJ válido',
    },
  },
];

const columns: TableColumn[] = [
  { name: 'Nome', prop: 'name' },
  { name: 'CNPJ', prop: 'cnpj' },
  {
    name: 'Vistorias',
    prop: 'surveysCount',
    maxWidth: 80,
    cellClass: 'ion-text-center',
  },
];

const detailFields: IaDetailField[] = [
  { name: 'Nome', prop: 'name' },
  { name: 'CNPJ', prop: 'cnpj' },
  {
    name: 'Vistorias',
    prop: 'surveysCount',
    url: (model: any) => `/admin/surveys/list?customerId=${model.id}`,
  },
  {
    name: 'Criado em',
    prop: 'createdAt',
    render: (value) => {
      const dateString = value as string;
      return dateString;
      //return dateString;
      //return formatDate(dateString, 'medium', 'pt');
    },
  },
  {
    name: 'Atualizado em',
    prop: 'modifiedAt',
    render: (value) => {
      const dateString = value as string;
      return dateString;
      //eturn formatDate(dateString, 'medium', 'pt');
    },
  },
];

export const customerEntity: { [id: string]: IaEntity } = {
  customers: {
    id: 'customers',
    label: 'Clientes',
    labelSingular: 'Cliente',
    keyField: 'id',
    displayField: 'name',
    icon: 'briefcase',

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
      $or: [{ name: { $cont: value } }, { cnpj: { $cont: value } }],
    }),
    filters: { fields: filtersFields },
    form: { fields },
    appForm: { fields: fields },
    list: { columns },
    detail: { fields: detailFields },
  },
};
