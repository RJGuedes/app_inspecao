import { FormlyFieldConfig } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { IaEntity } from '../interfaces/entity.interface';
import { iaDefaultField } from '../app.defaults';
import { ItemDataFields, ItemTypes } from '../../';
import { IaDetailField } from '../interfaces/detail-fields.interface';

import { tap } from 'rxjs/operators';
import { ItemCapacityDataEslinga, ItemCapacityDataLinga } from '../table-data';
import { FormlyHookFn } from '@ngx-formly/core/lib/models';

const fields: FormlyFieldConfig[] = [
  {
    key: 'traceability',
    type: 'input',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Placa de rastreabilidade Seyconel',
      placeholder: 'Preencha a rastreabilidade',
    },
  },
  {
    key: 'sector.id',
    type: 'select-modal',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Setor',
      required: true,
      dynamicOptions: {
        entityId: 'sectors',
        group: 'survey.name',
        label: 'name',
        value: 'id',
      },
    },
  },
  {
    key: 'data.type',
    type: 'select-modal',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Tipo de Item',
      required: true,
      options: ItemTypes,
      valueProp: 'itemType',
      labelProp: 'name',
    },
  },

  {
    key: 'approved',
    type: 'toggle',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Aprovado?',
      required: false,
    },
  },
  ...Object.keys(ItemDataFields).map(
    (k): FormlyFieldConfig => {
      const field = ItemDataFields[k];
      const isHookable =
        [
          'nominal_diameter',
          'extensions',
          'degree_iron',
          'strap_capacity',
          'initial_element',
          'strap_type',
          'strap_capacity',
          'end_element',
          'length',
          'capacity_select',
          'diameter',
          'capacity',
        ].indexOf(k) > -1;
      const hooks:any = isHookable
        ? {
            onInit: (field: any) => {
              if (!field || !field?.formControl) {
                return;
              }
              const updateCalcFields = (value: any) => {
                const extensions: number = field?.formControl?.parent?.get(
                  'extensions'
                )?.value;

                const strap_capacity: number = field?.formControl?.parent?.get(
                  'strap_capacity'
                )?.value;

                const nominal_diameter: number = field?.formControl?.parent?.get(
                  'nominal_diameter'
                )?.value;

                const degree_iron: number = field?.formControl?.parent?.get(
                  'degree_iron'
                )?.value;
                const type = field?.formControl?.parent?.get('type')?.value;

                console.log('calcTable', {
                  type,
                  nominal_diameter,
                  extensions,
                  degree_iron,
                  strap_capacity,
                });

                if (type === 6) {
                  if (
                    !(type && nominal_diameter && extensions && degree_iron)
                  ) {
                    field?.formControl?.parent
                      ?.get('capacity_auto')
                      ?.setValue('');
                  } else {
                    try {
                      const capacityValue =
                        ItemCapacityDataEslinga[degree_iron][nominal_diameter][
                          extensions === 4 ? 3 : extensions
                        ];
                      field?.formControl?.parent
                        ?.get('capacity_auto')
                        ?.setValue(capacityValue.toLocaleString());
                    } catch (err) {
                      console.log(err);
                      field?.formControl?.parent
                        ?.get('capacity_auto')
                        ?.setValue('');
                    }
                  }

                  try {
                    const descriptionFields = [
                      'initial_element',
                      'extensions',
                      'degree_iron',
                      'nominal_diameter',
                      'end_element',
                      'length',
                      'capacity_auto',
                    ];
                    let description = ``;
                    const suffixes: { [k: string]: string } = {
                      length: 'm',
                      capacity_auto: 'kg',
                      nominal_diameter: 'mm',
                      extensions: 'R',
                    };
                    const prefixes: { [k: string]: string } = {
                      degree_iron: 'G',
                    };

                    for (const descriptionField of descriptionFields) {
                      const value: string = field?.formControl?.parent?.get(
                        descriptionField
                      )?.value;
                      if (value) {
                        const suffix = suffixes[descriptionField]
                          ? suffixes[descriptionField]
                          : '';
                        const prefix = prefixes[descriptionField]
                          ? prefixes[descriptionField]
                          : '';
                        description += `${prefix}${value}${suffix}, `;
                      }
                    }
                    description = description.slice(0, -2);
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue(description);
                  } catch (err) {
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue('');
                  }
                  return;
                }
                if (type === 5) {
                  if (!(strap_capacity && extensions)) {
                    field?.formControl?.parent
                      ?.get('capacity_auto')
                      ?.setValue('');
                  } else {
                    try {
                      const capacityValue =
                        ItemCapacityDataLinga[strap_capacity][
                          extensions === 4 ? 3 : extensions
                        ];
                      field?.formControl?.parent
                        ?.get('capacity_auto')
                        ?.setValue(capacityValue.toLocaleString());
                    } catch (err) {
                      console.log(err);
                      field?.formControl?.parent
                        ?.get('capacity_auto')
                        ?.setValue('');
                    }
                  }

                  try {
                    const descriptionFields = [
                      'initial_element',
                      'extensions',
                      'strap_type',
                      'strap_capacity',
                      'end_element',
                      'length',
                      'capacity_auto',
                    ];
                    let description = ``;
                    const suffixes: { [k: string]: string } = {
                      length: 'm',
                      capacity_auto: 'kg',
                      strap_capacity: 'T',
                      extensions: 'R',
                    };

                    for (const descriptionField of descriptionFields) {
                      const value: string = field?.formControl?.parent?.get(
                        descriptionField
                      )?.value;
                      if (value) {
                        const suffix = suffixes[descriptionField]
                          ? suffixes[descriptionField]
                          : '';
                        description += `${value}${suffix}, `;
                      }
                    }
                    description = description.slice(0, -2);

                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue(description);
                  } catch (err) {
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue('');
                  }

                  return;
                }
                if (type === 7) {
                  try {
                    const descriptionFields = [
                      'strap_type',
                      'length',
                      'capacity_select',
                    ];
                    let description = ``;
                    const suffixes: { [k: string]: string } = {
                      length: 'm',
                      capacity_select: 'T',
                    };
                    const prefixes: { [k: string]: string } = {
                      strap_type: 'Cinta ',
                    };

                    for (const descriptionField of descriptionFields) {
                      const value: string = field?.formControl?.parent?.get(
                        descriptionField
                      )?.value;
                      if (value) {
                        const suffix = suffixes[descriptionField]
                          ? suffixes[descriptionField]
                          : '';
                        const prefix = prefixes[descriptionField]
                          ? prefixes[descriptionField]
                          : '';
                        description += `${prefix}${value}${suffix}, `;
                      }
                    }
                    description = description.slice(0, -2);
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue(description);
                  } catch (err) {
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue('');
                  }
                }
                if (type === 9) {
                  try {
                    const descriptionFields = [
                      'diameter',
                      'length',
                      'capacity',
                    ];
                    let description = `Cabo de aço, `;
                    const suffixes: { [k: string]: string } = {
                      diameter: 'mm',
                      length: 'm',
                      capacity: 'T',
                    };

                    for (const descriptionField of descriptionFields) {
                      const value: string = field?.formControl?.parent?.get(
                        descriptionField
                      )?.value;
                      if (value) {
                        const suffix = suffixes[descriptionField]
                          ? suffixes[descriptionField]
                          : '';
                        description += `${value}${suffix}, `;
                      }
                    }
                    description = description.slice(0, -2);
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue(description);
                  } catch (err) {
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue('');
                  }
                }
                if (type === 1) {
                  try {
                    const descriptionFields = [
                      'initial_element',
                      'extensions',
                      '',
                      'diameter',
                      'end_element',
                      'length',
                      'capacity',
                    ];
                    let description = ``;
                    const suffixes: { [k: string]: string } = {
                      diameter: 'mm',
                      length: 'm',
                      capacity: 'T',
                      extensions: 'R',
                    };

                    for (const descriptionField of descriptionFields) {
                      if (descriptionField !== '') {
                        const value: string = field?.formControl?.parent?.get(
                          descriptionField
                        )?.value;
                        if (value) {
                          const suffix = suffixes[descriptionField]
                            ? suffixes[descriptionField]
                            : '';
                          description += `${value}${suffix}, `;
                        }
                      } else {
                        description += `Cabo de aço, `;
                      }
                    }
                    description = description.slice(0, -2);
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue(description);
                  } catch (err) {
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue('');
                  }
                }
              };
              updateCalcFields(field.formControl.value);
              return field.formControl.valueChanges.pipe(
                tap((value) => {
                  console.log('tap', value);
                  return updateCalcFields(value);
                })
              );
            },
          }
        : {};
      return {
        key: `data.${k}`,
        type: `${field.type}`,
        templateOptions: {
          ...iaDefaultField.templateOptions,
          label: field.label,
          ...(field.templateOptions?.readonly ? { readonly: true } : null),
          ...(field.options ? { options: field.options } : null),
        },
        hideExpression: (model: any) => {
          const type = model?.data?.type;
          if (!type) {
            return true;
          }
          const itemType = ItemTypes.find((it) => it.itemType === type);
          if (!itemType) {
            return true;
          }
          return itemType?.fields.indexOf(k) < 0;
        },
        hooks,
      };
    }
  ),
];

const appFields: FormlyFieldConfig[] = [
  {
    key: 'data.type',
    type: 'select-modal',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Tipo de Item',
      required: true,
      options: ItemTypes,
      valueProp: 'itemType',
      labelProp: 'name',
    },
  },
  {
    key: 'traceability',
    type: 'input',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Placa de rastreabilidade Seyconel',
      placeholder: 'Preencha a rastreabilidade',
      required: true,
    },
  },
  {
    key: 'approved',
    type: 'toggle',
    defaultValue: false,
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Aprovado?',
      required: false,
    },
  },

  ...Object.keys(ItemDataFields).map(
    (k): FormlyFieldConfig => {
      const field = ItemDataFields[k];
      const isHookable =
        [
          'nominal_diameter',
          'extensions',
          'degree_iron',
          'strap_capacity',
          'initial_element',
          'strap_type',
          'strap_capacity',
          'end_element',
          'length',
          'capacity_select',
          'diameter',
          'capacity',
        ].indexOf(k) > -1;
      const hooks: any = isHookable
        ? {
            onInit: (field: any) => {
              if (!field || !field?.formControl) {
                return;
              }
              const updateCalcFields = (value: any) => {
                const extensions: number = field?.formControl?.parent?.get(
                  'extensions'
                )?.value;

                const strap_capacity: number = field?.formControl?.parent?.get(
                  'strap_capacity'
                )?.value;

                const nominal_diameter: number = field?.formControl?.parent?.get(
                  'nominal_diameter'
                )?.value;

                const degree_iron: number = field?.formControl?.parent?.get(
                  'degree_iron'
                )?.value;
                const type = field?.formControl?.parent?.get('type')?.value;

                console.log('calcTable', {
                  type,
                  nominal_diameter,
                  extensions,
                  degree_iron,
                  strap_capacity,
                });

                if (type === 6) {
                  if (
                    !(type && nominal_diameter && extensions && degree_iron)
                  ) {
                    field?.formControl?.parent
                      ?.get('capacity_auto')
                      ?.setValue('');
                  } else {
                    try {
                      const capacityValue =
                        ItemCapacityDataEslinga[degree_iron][nominal_diameter][
                          extensions === 4 ? 3 : extensions
                        ];
                      field?.formControl?.parent
                        ?.get('capacity_auto')
                        ?.setValue(capacityValue.toLocaleString());
                    } catch (err) {
                      console.log(err);
                      field?.formControl?.parent
                        ?.get('capacity_auto')
                        ?.setValue('');
                    }
                  }

                  try {
                    const descriptionFields = [
                      'initial_element',
                      'extensions',
                      'degree_iron',
                      'nominal_diameter',
                      'end_element',
                      'length',
                      'capacity_auto',
                    ];
                    let description = ``;
                    const suffixes: { [k: string]: string } = {
                      length: 'm',
                      capacity_auto: 'kg',
                      nominal_diameter: 'mm',
                      extensions: 'R',
                    };
                    const prefixes: { [k: string]: string } = {
                      degree_iron: 'G',
                    };

                    for (const descriptionField of descriptionFields) {
                      const value: string = field?.formControl?.parent?.get(
                        descriptionField
                      )?.value;
                      if (value) {
                        const suffix = suffixes[descriptionField]
                          ? suffixes[descriptionField]
                          : '';
                        const prefix = prefixes[descriptionField]
                          ? prefixes[descriptionField]
                          : '';
                        description += `${prefix}${value}${suffix}, `;
                      }
                    }
                    description = description.slice(0, -2);
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue(description);
                  } catch (err) {
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue('');
                  }
                  return;
                }
                if (type === 5) {
                  if (!(strap_capacity && extensions)) {
                    field?.formControl?.parent
                      ?.get('capacity_auto')
                      ?.setValue('');
                  } else {
                    try {
                      const capacityValue =
                        ItemCapacityDataLinga[strap_capacity][
                          extensions === 4 ? 3 : extensions
                        ];
                      field?.formControl?.parent
                        ?.get('capacity_auto')
                        ?.setValue(capacityValue.toLocaleString());
                    } catch (err) {
                      console.log(err);
                      field?.formControl?.parent
                        ?.get('capacity_auto')
                        ?.setValue('');
                    }
                  }

                  try {
                    const descriptionFields = [
                      'initial_element',
                      'extensions',
                      'strap_type',
                      'strap_capacity',
                      'end_element',
                      'length',
                      'capacity_auto',
                    ];
                    let description = ``;
                    const suffixes: { [k: string]: string } = {
                      length: 'm',
                      capacity_auto: 'kg',
                      strap_capacity: 'T',
                      extensions: 'R',
                    };

                    for (const descriptionField of descriptionFields) {
                      const value: string = field?.formControl?.parent?.get(
                        descriptionField
                      )?.value;
                      if (value) {
                        const suffix = suffixes[descriptionField]
                          ? suffixes[descriptionField]
                          : '';
                        description += `${value}${suffix}, `;
                      }
                    }
                    description = description.slice(0, -2);

                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue(description);
                  } catch (err) {
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue('');
                  }

                  return;
                }
                if (type === 7) {
                  try {
                    const descriptionFields = [
                      'strap_type',
                      'length',
                      'capacity_select',
                    ];
                    let description = ``;
                    const suffixes: { [k: string]: string } = {
                      length: 'm',
                      capacity_select: 'T',
                    };

                    for (const descriptionField of descriptionFields) {
                      const value: string = field?.formControl?.parent?.get(
                        descriptionField
                      )?.value;
                      if (value) {
                        const suffix = suffixes[descriptionField]
                          ? suffixes[descriptionField]
                          : '';
                        description += `${value}${suffix}, `;
                      }
                    }
                    description = description.slice(0, -2);
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue(description);
                  } catch (err) {
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue('');
                  }
                }
                if (type === 9) {
                  try {
                    const descriptionFields = [
                      'diameter',
                      'length',
                      'capacity',
                    ];
                    let description = `Cabo de aço, `;
                    const suffixes: { [k: string]: string } = {
                      diameter: 'mm',
                      length: 'm',
                      capacity: 'T',
                    };

                    for (const descriptionField of descriptionFields) {
                      const value: string = field?.formControl?.parent?.get(
                        descriptionField
                      )?.value;
                      if (value) {
                        const suffix = suffixes[descriptionField]
                          ? suffixes[descriptionField]
                          : '';
                        description += `${value}${suffix}, `;
                      }
                    }
                    description = description.slice(0, -2);
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue(description);
                  } catch (err) {
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue('');
                  }
                }
                if (type === 1) {
                  try {
                    const descriptionFields = [
                      'initial_element',
                      'extensions',
                      '',
                      'diameter',
                      'end_element',
                      'length',
                      'capacity',
                    ];
                    let description = ``;
                    const suffixes: { [k: string]: string } = {
                      diameter: 'mm',
                      length: 'm',
                      capacity: 'T',
                      extensions: 'R',
                    };

                    for (const descriptionField of descriptionFields) {
                      if (descriptionField !== '') {
                        const value: string = field?.formControl?.parent?.get(
                          descriptionField
                        )?.value;
                        if (value) {
                          const suffix = suffixes[descriptionField]
                            ? suffixes[descriptionField]
                            : '';
                          description += `${value}${suffix}, `;
                        }
                      } else {
                        description += `Cabo de aço, `;
                      }
                    }
                    description = description.slice(0, -2);
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue(description);
                  } catch (err) {
                    field?.formControl?.parent
                      ?.get('description')
                      ?.setValue('');
                  }
                }
              };
              updateCalcFields(field.formControl.value);
              return field.formControl.valueChanges.pipe(
                tap((value) => {
                  console.log('tap', value);
                  return updateCalcFields(value);
                })
              );
            },
          }
        : {};
      return {
        key: `data.${k}`,
        type: `${field.type}`,
        templateOptions: {
          ...iaDefaultField.templateOptions,
          label: field.label,
          ...(field.templateOptions?.readonly ? { readonly: true } : null),
          ...(field.options ? { options: field.options } : null),
        },
        hideExpression: (model: any) => {
          const type = model?.data?.type;
          if (!type) {
            return true;
          }
          const itemType = ItemTypes.find((it) => it.itemType === type);
          if (!itemType) {
            return true;
          }
          return itemType?.fields.indexOf(k) < 0;
        },
        hooks,
      };
    }
  ),
];

const filterFields: FormlyFieldConfig[] = [
  {
    key: 'traceability',
    type: 'input',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Placa de rastreabilidade Seyconel',
      placeholder: 'Preencha a rastreabilidade',
      required: true,
    },
  },
  {
    key: 'sectorId',
    type: 'select-modal',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Setor',
      required: true,
      dynamicOptions: {
        entityId: 'sectors',
        group: 'survey.name',
        label: 'name',
        value: 'id',
      },
    },
  },
  {
    key: 'approved',
    type: 'toggle',
    templateOptions: {
      ...iaDefaultField.templateOptions,
      label: 'Aprovado?',
    },
  },
];

const columns: TableColumn[] = [
  { name: 'Placa de Rastreabilidade', prop: 'traceability' },
  {
    name: 'Tipo',
    prop: 'data.type',
    pipe: {
      transform: (val) => ItemTypes.find((it) => it.itemType === val)?.name,
    },
  },

  {
    name: 'Aprovado',
    prop: 'approved',
    pipe: { transform: (val) => (val ? 'Sim' : 'Não') },
  },
  { name: 'Setor', prop: 'sector.name' },
  { name: 'Vistoria', prop: 'sector.survey.name', sortable: false },
  { name: 'Cliente', prop: 'sector.survey.customer.name', sortable: false },
];

const detailFields: IaDetailField[] = [
  { name: 'Placa de Rastreabilidade', prop: 'traceability' },
  {
    name: 'Aprovado',
    prop: 'approved',
    render: (value) => `${value ? 'Sim' : 'Não'}`,
  },
  {
    name: 'Tipo',
    prop: 'data.type',
    render: (value) => `${ItemTypes.find((it) => it.itemType === value)?.name}`,
  },

  {
    name: 'Setor',
    prop: 'sector.name',
    url: (model: any) => `/admin/sectors/detail/${model.sector.id}`,
  },
  {
    name: 'Vistoria',
    prop: 'sector.survey.name',
    url: (model: any) => `/admin/surveys/detail/${model.sector.survey.id}`,
  },
  {
    name: 'Cliente',
    prop: 'sector.survey.customer.name',
    url: (model: any) =>
      `/admin/customers/detail/${model.sector.survey.customer.id}`,
  },
  {
    name: 'Fotos',
    prop: 'photosCount',
    url: (model: any) => `/admin/photos/list?itemId=${model.id}`,
  },
];

export const itemEntity: { [id: string]: IaEntity } = {
  items: {
    id: 'items',
    label: 'Itens',
    labelSingular: 'Item',
    keyField: 'id',
    displayField: 'name',
    icon: 'checkbox',
    actions: ['list', 'detail', 'add', 'edit', 'remove', 'export', 'filter'],
    form: { fields },
    appForm: { fields: appFields },
    filters: { fields: filterFields },
    list: { columns, queryFilters: ['sectorId'] },
    detail: { fields: detailFields },
  },
};
