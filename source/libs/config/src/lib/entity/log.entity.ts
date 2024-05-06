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
];

const columns: TableColumn[] = [{ name: 'Nome', prop: 'name' }];

const detailFields: IaDetailField[] = [{ name: 'Nome', prop: 'name' }];

export const logEntity: { [id: string]: IaEntity } = {
  logs: {
    id: 'logs',
    label: 'Logs',
    labelSingular: 'Log',
    keyField: 'id',
    displayField: 'name',
    icon: 'receipt',

    actions: ['list', 'detail', 'export', 'search'],
    form: { fields },
    list: { columns },
    detail: { fields: detailFields },
  },
};
