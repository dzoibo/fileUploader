import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UploadServiceService } from 'ngx-file-manager/lib/upload-service.service';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [UploadServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
