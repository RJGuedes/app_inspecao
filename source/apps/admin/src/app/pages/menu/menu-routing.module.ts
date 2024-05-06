import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [

      {
        path: ':entity/list',
        loadChildren: () =>
          import('../actions/list/list.module').then((m) => m.ListPageModule),
      },
      {
        path: ':entity/form',
        loadChildren: () =>
          import('../actions/form/form.module').then((m) => m.FormPageModule),
      },
      {
        path: ':entity/form/:id',
        loadChildren: () =>
          import('../actions/form/form.module').then((m) => m.FormPageModule),
      },
      {
        path: ':entity/detail/:id',
        loadChildren: () =>
          import('../actions/detail/detail.module').then(
            (m) => m.DetailPageModule
          ),
      },
      {
        path: 'print',
        loadChildren: () =>
          import('../print/print.module').then(
            (m) => m.PrintPageModule
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardPageModule
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
