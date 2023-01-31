import { Component, OnInit } from '@angular/core';
import { NgxFileManagerService } from 'ngx-file-manager';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'uploader';
  fileInput!: HTMLInputElement;
  previewImage!: HTMLInputElement;
  fileIsSelected=false;
  bascule= false;
  dark__theme= "dark-theme";
  theme= "dark";
  selectedFile!: File;
  reader! : FileReader;
  fileUploading=false;
  progressPercent=0;
  fileIsUploaded=false;

constructor(private ngxFileManagerService: NgxFileManagerService){
  this.ngxFileManagerService.$progress.subscribe(value=>{
    this.progressPercent=value;
  })
}
  ngOnInit(): void {
    this.modeButton();
    this.fileInput=document.querySelector(".input-image") as HTMLInputElement;
    this.previewImage=document.querySelector(".preview-img img") as HTMLInputElement;
    this.fileIsSelected=false;
  }
  
  chooseFile() {
    this.fileInput.click();
  };

  convertSize(fileSizeInOctet: number){
    let i = -1;
    const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
      fileSizeInOctet /= 1024;
      i++;
    } while (fileSizeInOctet > 1024);
    return Math.max(fileSizeInOctet, 0.1).toFixed(1) + byteUnits[i]; 
  }


    modeLight() {
      this.bascule = true;
      document.body.classList.add(this.dark__theme);
      this.theme = "light";
      localStorage.setItem("theme", this.theme);
    }

    modeSombre() {
      this.bascule = false;
      document.body.classList.remove(this.dark__theme);
      this.theme = "dark";
      localStorage.setItem("theme", this.theme);
    }

    getTheme() {
      if (localStorage.getItem("theme")!=null) {
        this.theme =localStorage.getItem("theme") || '{}';
      } else {
        this.theme = "light";
      }
    }

    modeButton() {
      this.getTheme();
      if (this.theme === "dark") {
        this.bascule = false;
        document.body.classList.remove(this.dark__theme);
      } else {
        this.bascule = true;
        document.body.classList.add(this.dark__theme);
      }
    }

      updateFile(event: Event) {
        this.fileIsSelected=true;
        const target= event.target as HTMLInputElement;
        if ((target.files as FileList)[0]===null || (target.files as FileList)[0] === undefined){
          return;
        }
        this.selectedFile= (target.files as FileList)[0];
      }
  
      async saveFile() {
      this.fileUploading=true;
      await this.ngxFileManagerService.uploadMedia(this.selectedFile,'AKIA4LZ3AV2EWMOCZQUY','sTPrPsDnoCO6EKrmSGSQJVKvR9oj2hHoZz7b5Uzz','ngx-file-manager','us-east-1');
      this.fileIsUploaded=true;
      this.fileIsSelected=false;
      setTimeout((()=>{
      this.fileIsUploaded=false;
      this.progressPercent=0;
      this.fileUploading=false
      }),2000)
      }
}
