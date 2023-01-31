import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxFileManagerService } from 'ngx-file-manager';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [NgxFileManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
