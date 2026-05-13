import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Navbar } from './components/navbar/navbar';
import { AuthModal } from './components/auth-modal/auth-modal';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [App, Navbar, AuthModal],
  imports: [BrowserModule, AppRoutingModule, NgbModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideClientHydration(withEventReplay()), provideHttpClient()],
  bootstrap: [App],
})

export class AppModule {}
