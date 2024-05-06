import { SCondition } from '@dataui/crud-request';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { IaDetailField } from './detail-fields.interface';

export interface IaEntity {
  id: string;
  label: string;
  labelSingular: string;
  displayField: string;
  keyField: string;
  icon?: string;

  actions?: (
    | 'add'
    | 'edit'
    | 'list'
    | 'detail'
    | 'remove'
    | 'export'
    | 'search'
    | 'report'
    | 'filter'
    | 'print'
  )[];

  search?: (val: string) => SCondition;

  filters?: {
    fields?: FormlyFieldConfig[];
  };

  detail?: {
    fields?: IaDetailField[];
  };
  form?: {
    fields?: FormlyFieldConfig[];
  };

  appForm?: {
    fields?: FormlyFieldConfig[];
  };
  list?: {
    columns?: TableColumn[];
    queryFilters?: string[];
  };
}
