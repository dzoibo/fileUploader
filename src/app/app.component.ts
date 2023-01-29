import { Component, OnInit } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Body } from 'aws-sdk/clients/s3';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';

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
  isConfigUpdate=false;
  reader! : FileReader;
  fileUploading=false;
  progressPercent=0;
  fileIsUploaded=false;


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
        this.loadingImage();
      }
  
      loadingImage() {
        document.querySelector(".preview-img img")?.addEventListener("load",()=> {
        document.querySelector(".home")?.classList.remove("disabel");
          });
      }
  

      async saveFile() {
      this.fileUploading=true;
      await this.uploadMedia();
      this.fileIsUploaded=true;
      this.fileIsSelected=false;
      setTimeout((()=>{
      this.fileIsUploaded=false;
      this.progressPercent=0;
      this.fileUploading=false
      }),2000)
      }
  
      /**
       * this function is to upload to  
       */
     async uploadToS3Bucket(stream: Body, credential: CredentialsOptions,cd: { (progress: any): void; (arg0: Promise<number>): void; }){
      try {
        
        if (!this.isConfigUpdate) {
           AWS.config.update(({ region: 'us-east-1'}));
            this.isConfigUpdate = true;
        }

        let s3 = new AWS.S3({
          apiVersion: '2006-03-01',
            region: 'us-east-1',
            credentials: new AWS.Credentials({
                accessKeyId: credential.accessKeyId,
                secretAccessKey: credential.secretAccessKey,
            })
        });
        let uploadItem = await s3.upload({
            Bucket: 'ngx-file-manager',
            Key: this.selectedFile.name,// name for the bucket file
            ContentType: this.selectedFile.type,
            Body: stream
        }).on("httpUploadProgress",  progress => {
            cd(this.getUploadingProgress(progress.loaded, progress.total));
        }).promise();
        console.log("uploadItem=>", uploadItem);
        return uploadItem;
        
    }
    catch (error) {
        console.log(error)
    }
     }
     async getUploadingProgress(uploadSize: number,totalSize: number){
      let uploadProgress = (uploadSize / totalSize) * 100;
      this.progressPercent= Number(uploadProgress.toFixed(0));
      return this.progressPercent;
  }
     /**
      * use to confure file to make it ready to load bzy the browser
      */
     async uploadMedia(){
      const credentialRequest={
        accessKeyId:'AKIA4LZ3AV2EWMOCZQUY',
        secretAccessKey: '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',
      }
      const mediaStreamRequest = this.getFile(this.selectedFile);
      const [mediaStream]=await Promise.all([mediaStreamRequest]);
      await this.uploadToS3Bucket(mediaStream,credentialRequest,progress=>{
        console.log(progress); 
      });
      
     }
     async getFile(file: File){
      return new Promise((resolve,reject)=>{
        const reader=new FileReader();
        reader.onload=(e)=>{
          resolve(e.target?.result);
        };
        reader.onerror=(err)=>{
          reject(false);
        };
        reader.readAsArrayBuffer(file);
      });
     }
}
