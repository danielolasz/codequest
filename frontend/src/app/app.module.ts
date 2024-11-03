import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NavigationComponent } from "./shared/components/navigation/navigation.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    NavigationComponent,
],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule {}