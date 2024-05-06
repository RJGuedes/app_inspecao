import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/auth/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'logout',
    loadChildren: () =>
      import('./pages/auth/logout/logout.module').then(
        (m) => m.LogoutPageModule
      ),
  },
  {
    path: 'form/:entityId',
    loadChildren: () =>
      import('./pages/form/form.module').then((m) => m.FormPageModule),
    canActivate: [],
  },
  {
    path: 'form/:entityId/:id',
    loadChildren: () =>
      import('./pages/form/form.module').then((m) => m.FormPageModule),
    canActivate: [],
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [],
  },
  {
    path: 'photo',
    loadChildren: () => import('./pages/photo/photo.module').then( m => m.PhotoPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
