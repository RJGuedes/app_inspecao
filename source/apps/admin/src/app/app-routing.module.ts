import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/auth/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/menu/menu.module').then((m) => m.MenuPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'logout',
    loadChildren: () =>
      import('./pages/auth/logout/logout.module').then(
        (m) => m.LogoutPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
