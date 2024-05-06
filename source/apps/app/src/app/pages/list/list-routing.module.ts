import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPage } from './list.page';

const routes: Routes = [
  {
    path: '',
    component: ListPage,
  },
  {
    path: ':customerId/surveys',
    data: {
      entity: 'surveys',
    },
    component: ListPage,
  },
  {
    path: ':customerId/surveys/:surveyId/sectors',
    data: {
      entity: 'sectors',
    },
    component: ListPage,
  },
  {
    path: ':customerId/surveys/:surveyId/sectors/:sectorId/items',
    data: {
      entity: 'items',
    },
    component: ListPage,
  },
  {
    path: ':customerId/surveys/:surveyId/sectors/:sectorId/items/:itemId',
    data: {
      entity: 'items',
    },
    loadChildren: () =>
      import('../form/form.module').then((m) => m.FormPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPageRoutingModule {}
