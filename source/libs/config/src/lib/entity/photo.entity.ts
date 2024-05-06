import { FormlyFieldConfig } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { IaEntity } from '../interfaces/entity.interface';
import { iaDefaultField } from '../app.defaults';

const fields: FormlyFieldConfig[] = [
  {
    key: 'file',
    type: 'file',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Arquivo',
      filePath: () => ``,
      placeholder: 'Preencha o nome completo',
      required: true,
    },
  },

  {
    key: 'photoUrl',
    type: 'hidden',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      type: 'hidden',
    },
  },

  {
    key: 'item.id',
    type: 'select-modal',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Item',
      required: true,
      dynamicOptions: {
        entityId: 'items',
        label: 'name',
        value: 'id',
      },
    },
  },
];

const appFields: FormlyFieldConfig[] = [];

const filterFields: FormlyFieldConfig[] = [
  {
    key: 'itemId',
    type: 'select-modal',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Item',
      required: true,
      dynamicOptions: {
        entityId: 'items',
        label: 'name',
        value: 'id',
      },
    },
  },
];

const columns: TableColumn[] = [
  {
    name: 'Foto',
    prop: 'photoUrl',
    maxWidth: 100,
    cellClass: 'cell-no-padding',
    pipe: {
      transform: (value: any) => {
        return `<img height="46" src="${value}" />`;
      },
    },
  },
  {
    name: 'URL',
    prop: 'photoUrl',
  },

  { name: 'Item', prop: 'item.name' },
];

const detailFields: {
  name: string;
  prop: string;
  url?: (value: unknown) => string;
  render?: (value: unknown) => string;
}[] = [
  { name: 'File', prop: 'file' },
  { name: 'Url', prop: 'photoUrl' },
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
      //return formatDate(dateString, 'medium', 'pt');
    },
  },
];

export const photoEntity: { [id: string]: IaEntity } = {
  photos: {
    id: 'photos',
    label: 'Fotos',
    labelSingular: 'Foto',
    keyField: 'id',
    displayField: 'photoUrl',
    icon: 'camera',
    actions: [
      'detail',
      'add',
      'edit',
      'remove',
      'export',
      'search',
      'filter',
    ],
    search: (value: any) => ({
      $or: [{ photoUrl: { $cont: value } }],
    }),
    filters: { fields: filterFields },
    form: { fields },
    appForm: { fields: appFields },
    list: { columns, queryFilters: ['itemId'] },
    detail: { fields: detailFields },
  },
};
