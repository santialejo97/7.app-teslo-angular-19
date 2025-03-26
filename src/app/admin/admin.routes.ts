import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '@admin/layouts/admin-layout/admin-layout.component';
import { ProductAdminPageComponent } from './pages/product-admin-page/product-admin-page.component';
import { ProductsAdminPageComponent } from './pages/products-admin-page/products-admin-page.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'product/:id',
        component: ProductAdminPageComponent,
      },
      {
        path: 'products',
        component: ProductsAdminPageComponent,
      },
      {
        path: '**',
        redirectTo: 'products',
      },
    ],
  },
];

export default adminRoutes;
