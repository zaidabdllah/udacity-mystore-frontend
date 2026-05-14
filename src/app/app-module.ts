import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Navbar } from './components/navbar/navbar';
import { AuthModal } from './components/auth-modal/auth-modal';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { ProductList } from './components/product-list/product-list';
import { ProductCard } from './components/product-card/product-card';
import { ProductDetails } from './components/product-details/product-details';

@NgModule({
  declarations: [App, Navbar, AuthModal, ProductList, ProductCard, ProductDetails],
  imports: [BrowserModule, AppRoutingModule, NgbModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
  ],
  bootstrap: [App],
})
export class AppModule {}
