import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  showUploadModel: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  open() {
    this.showUploadModel = true;
  }

  close() {
    this.showUploadModel = false;
  }

}
