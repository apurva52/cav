import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-local-file-upload',
  templateUrl: './local-file-upload.component.html',
  styleUrls: ['./local-file-upload.component.scss'],
})
export class LocalFileUploadComponent implements OnInit {
  isDialogOpen: any = false;
  uploadedFiles: any[] = [];
  uploadUrl : string;
  constructor() {}

  ngOnInit(): void {}

  onUpload(event) {
    const me = this;
    for (let file of event.files) {
      me.uploadedFiles.push(file);
    }
  }

  show() {
    this.isDialogOpen = true;
  }
}
