import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout';

export const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },

  // =========================
  // CLIENTE
  // =========================

  {
    path: 'cliente',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio'
      },

      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/cliente/inicio/inicio')
            .then(m => m.Inicio)
      },

      {
        path: 'compras',
        loadComponent: () =>
          import('./features/cliente/compras/compras')
            .then(m => m.Compras)
      },

      {
        path: 'compras/:id',
        loadComponent: () =>
          import('./features/cliente/detalle-compra/detalle-compra')
            .then(m => m.DetalleCompra)
      },

      {
        path: 'devoluciones',
        loadComponent: () =>
          import('./features/cliente/mis-devoluciones/mis-devoluciones')
            .then(m => m.MisDevoluciones)
      },

      {
        path: 'devoluciones/nueva/:compraId',
        loadComponent: () =>
          import('./features/cliente/nueva-devolucion/nueva-devolucion')
            .then(m => m.NuevaDevolucion)
      },

      {
        path: 'devoluciones/:id',
        loadComponent: () =>
          import('./features/cliente/detalle-devolucion/detalle-devolucion')
            .then(m => m.DetalleDevolucion)
      },

      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/cliente/perfil/perfil')
            .then(m => m.Perfil)
      }

    ]
  },

  // =========================
  // OPERADOR
  // =========================

  {
    path: 'operador',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio'
      },

      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/operador/inicio/inicio')
            .then(m => m.Inicio)
      },

      {
        path: 'devoluciones',
        loadComponent: () =>
          import('./features/operador/devoluciones/devoluciones')
            .then(m => m.Devoluciones)
      },

      {
        path: 'detalle-devolucion/:id',
        loadComponent: () =>
          import('./features/operador/detalle-devolucion/detalle-devolucion')
            .then(m => m.DetalleDevolucion)
      },

      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/operador/perfil/perfil')
            .then(m => m.Perfil)
      }

    ]
  },

  // =========================
  // ADMIN
  // =========================

  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio'
      },

      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/admin/inicio/inicio')
            .then(m => m.Inicio)
      },

      {
        path: 'devoluciones',
        loadComponent: () =>
          import('./features/admin/devoluciones/devoluciones')
            .then(m => m.Devoluciones)
      },

      {
        path: 'detalle-devolucion/:id',
        loadComponent: () =>
          import('./features/admin/detalle-devolucion/detalle-devolucion')
            .then(m => m.DetalleDevolucion)
      },

      {
        path: 'compras',
        loadComponent: () =>
          import('./features/admin/compras/compras')
            .then(m => m.Compras)
      },

      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/admin/usuarios/usuarios')
            .then(m => m.Usuarios)
      },

      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/admin/perfil/perfil')
            .then(m => m.Perfil)
      }

    ]
  },

  // =========================
  // NO ENCONTRADO
  // =========================

  {
    path: '**',
    redirectTo: 'login'
  }

];