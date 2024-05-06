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
      placeholder: 'Preencha o nome completo.',
      required: true,
    },
  },
  {
    key: 'email',
    type: 'input',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      type: 'email',
      label: 'E-mail',
      placeholder: 'Preencha um e-mail válido.',
      required: true,
    },
  },
  {
    key: 'password',
    type: 'input',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Senha',
      type: 'password',
      placeholder: 'Preencha a senha.',
      required: true,
    },
  },
  {
    key: 'isActive',
    type: 'checkbox',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Está ativo?',
      required: true,
    },
  },
];

const columns: TableColumn[] = [
  { name: 'Nome', prop: 'name' },
  { name: 'E-mail', prop: 'email' },
];

const detailFields: IaDetailField[] = [
  { name: 'Nome', prop: 'name' },
  { name: 'E-mail', prop: 'email' },
];

export const userEntity: { [id: string]: IaEntity } = {
  users: {
    id: 'users',
    label: 'Usuários',
    labelSingular: 'Usuário',
    keyField: 'id',
    displayField: 'name',
    icon: 'people',

    actions: ['list', 'detail', 'add', 'edit', 'remove', 'export'],
    form: { fields },
    list: { columns },
    detail: { fields: detailFields },
  },
};
