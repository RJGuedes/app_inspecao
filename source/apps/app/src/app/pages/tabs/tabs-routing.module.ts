import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'customers',
        data: {
          entity: 'customers',
        },
        loadChildren: () =>
          import('../list/list.module').then((m) => m.ListPageModule),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('../account/account.module').then((m) => m.AccountPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/customers',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/customers',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
