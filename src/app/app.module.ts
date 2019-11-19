import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CargarArchivoComponent } from './componentes';
import { GooglemapsService } from './servicios';


@NgModule({
  declarations: [
    AppComponent,
    CargarArchivoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    GooglemapsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
