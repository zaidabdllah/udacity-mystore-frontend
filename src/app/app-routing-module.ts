import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductList } from './components/product-list/product-list';
import { ProductDetails } from './components/product-details/product-details';

const routes: Routes = [
  {
    path: '',
    component: ProductList
  },
  {
    path: 'products',
    component: ProductList
  },
  {
    path: 'products/:id',
    component: ProductDetails
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }