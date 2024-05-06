import { Injectable } from '@angular/core';
import { Model, ModelFactory } from '@angular-extensions/model';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { IaObject, appConfig } from '@seyconel/config';

@Injectable({
  providedIn: 'root',
})
export class MemoryDatabaseService {
  uniqueKey = 'id';
  entities: { [k: string]: Model<IaObject[]> } = {};

  initialData: { [k: string]: IaObject[] } = {};

  constructor(private modelFactory: ModelFactory<IaObject[]>) {
    const entities = Object.keys(appConfig.entities);

    this.initialData = {
      users: [
        { id: 1, name: 'João da Silva', email: 'joao@silva.com' },
        { id: 2, name: 'João da Silva', email: 'joao@silva.com' },
        { id: 3, name: 'João da Silva', email: 'joao@silva.com' },
        { id: 5, name: 'João da Silva', email: 'joao@silva.com' },
        { id: 6, name: 'João da Silva', email: 'joao@silva.com' },
        { id: 7, name: 'João da Silva', email: 'joao@silva.com' },
      ],
    };

    for (const entity of entities) {
      const initialData = this.initialData[entity]
        ? (this.initialData[entity] as IaObject[])
        : [];
      console.log('initialData', initialData);
      const model = this.modelFactory.create(initialData);
      this.entities[entity] = model;
    }
  }

  save(entityId: string | null, data: IaObject) {
    if (!entityId) {
      throw new Error('Entity not defined');
    }
    return this.uniqueKeysExists(data)
      ? this.update(entityId, data)
      : this.create(entityId, data);
  }

  create(entityId: string, data: IaObject) {
    const model = this.entities[entityId];
    const collection = model.get();
    collection.push({
      ...data,
      [this.uniqueKey]: this.generateNumbericId(entityId),
    });
    model.set(collection);
  }

  update(entityId: string, data: IaObject) {
    const model = this.entities[entityId];
    const collection = model.get();
    const index = collection.findIndex((d: IaObject): boolean => {
      const uniqueKey = this.uniqueKey as keyof IaObject;
      return d[uniqueKey] === data[uniqueKey];
    });
    collection[index] = { ...collection[index], ...data };
    model.set(collection);
  }

  find(entityId: string | null) {
    if (!entityId) {
      throw new Error('Entity not defined');
    }
    const model = this.entities[entityId];
    return model.data$;
  }

  get(entityId: string | null, id: string): Observable<IaObject | null> {
    if (!entityId) {
      throw new Error('Entity not defined');
    }
    const model = this.entities[entityId];
    return model.data$.pipe(
      map((d) => {
        const uniqueKey = this.uniqueKey as keyof IaObject;
        const result = d.find(
          (i: IaObject) => Number(i[uniqueKey]) === Number(id)
        );
        if (!result) {
          return null;
        } else {
          return result;
        }
      })
    );
  }

  async remove(entityId: string | null, id: string) {
    if (!entityId) {
      throw new Error('Entity not defined');
    }
    const model = this.entities[entityId];
    const collection = model.get();
    const newCollection = collection.filter((d: IaObject) => {
      const uniqueKey = this.uniqueKey as keyof IaObject;
      return Number(d[uniqueKey]) !== Number(id);
    });
    model.set(newCollection);
  }

  private generateNumbericId(entityId: string) {
    const model = this.entities[entityId];
    const collection = model.get();
    const lastId = collection.reduce((acc, each) => {
      const uniqueKey = this.uniqueKey as keyof IaObject;
      const uniqueKeyNumber = Number(each[uniqueKey]);
      if (uniqueKeyNumber && uniqueKeyNumber > acc) {
        acc = uniqueKeyNumber;
      }
      return acc;
    }, 0);
    const nextId = lastId + 1;
    return nextId;
  }

  private uniqueKeysExists(data: IaObject) {
    const uniqueKey = this.uniqueKey as keyof IaObject;
    return !(data[uniqueKey] === undefined || data[uniqueKey] === null);
  }
}
