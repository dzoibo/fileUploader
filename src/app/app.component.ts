import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'uploader';
  
  currentImage= require("../assets/img/card-image.svg");
  textBtnSave= "Sauvegarder";
  fileInput!: HTMLInputElement;
  previewImage!: HTMLInputElement;
  fileIsSelected!: boolean;
  bascule= false;
  dark__theme= "dark-theme";
  theme= "dark";
  selectedFile!: File;

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
        this.selectedFile= (target.files as FileList)[0];
        if (this.selectedFile===null || this.selectedFile === undefined){
          return;
        }
        console.log(this.selectedFile,'Mon fichier');
        this.loadingImage();
        this.currentImage = URL.createObjectURL(this.selectedFile); // Url de l'image
      }
  
      loadingImage() {
        document.querySelector(".preview-img img")?.addEventListener("load",()=> {
        document.querySelector(".home")?.classList.remove("disabel");
          });
      }
  

      saveFile() {
        this.textBtnSave = "En cours...";
      }
  
     
}
