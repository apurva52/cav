import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import jsbs from 'js-beautify-sourcemap';
import { ConfirmationService, MenuItem } from 'primeng';
import { JSEditor } from '../../../common/interfaces/jseditor';
import { NVAppConfigService } from '../../../common/service/nvappconfig.service';
import { NvhttpService } from '../../../common/service/nvhttp.service';
import { StackTrace } from '../service/js-error.model';

declare var ace: any;

@Component({
  selector: 'app-source-viewer',
  templateUrl: './source-viewer.component.html',
  styleUrls: ['./source-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SourceViewerComponent {

  @Output() onEditorClose = new EventEmitter<boolean>();

  @Input() stackTrace: StackTrace[];
  @Input() message: string;
  @Input() nvAppConfig: any;
  @ViewChild('editor') editor;

  private _editorInfo: JSEditor;
  jsEditorMap = new Map<string, JSEditor>();

  code: string = '';
  line: number = -1;
  column: number = -1;
  file: string = '';

  showCodeEditor: boolean;
  items: MenuItem[] = [];
  beautified: any;
  activeTab: MenuItem;

  constructor(private http: HttpClient, private nvHTTPService: NvhttpService, private nvAppConfigService: NVAppConfigService, private confirmationService: ConfirmationService) { }

  get editorInfo(): JSEditor {
    return this._editorInfo;
  }

  @Input() set editorInfo(value: JSEditor) {
    if (value) {
      this._editorInfo = value;
      this.file = value.file;
      this.line = value.row;
      this.column = value.col;

      if (this.jsEditorMap.get(value.url) != undefined) {
        this.jsEditorMap.get(value.url).col = value.col;
        this.jsEditorMap.get(value.url).row = value.row;

        this.setEditor(value);

      } else {
        // check if nvapp configuration data is present
        if (!this.nvAppConfig) {
          this.nvAppConfigService.getdata().subscribe(data => {
            this.nvAppConfig = data;
            this.getFileContent(value);
          });

        } else {
          this.getFileContent(value);
        }

      }

    }
  }

  getFileContent(value: JSEditor): void {
    let url = this.nvHTTPService.base + this.nvHTTPService.getRequestUrl(NvhttpService.apiUrls.getFile);
    url += '&url=' + this.nvAppConfig.proxyServer + value.url;
    this.http.get(url, { responseType: 'text' }).subscribe(data => {
      if (data !== 'Error in getting requested file') {
        value.content = data;
        this.jsEditorMap.set(value.url, value);
        this.setEditor(value);
      } else {
        this.confirmationService.confirm({
          message: data,
          acceptLabel: 'OK',
          key: 'source-viewer',
          rejectVisible: false
        })
      }


    });
  }

  setEditor(value: JSEditor): void {
    // check if beautify turned on
    this.formatDocument();
    setTimeout(() => {
      this.onChange();
    });

    this.getTabs();
    this.getActiveTab(value.url);
  }

  /** This method is used to close the opened editor */
  closeEditor(): void {
    this.onEditorClose.emit(false);
  }

  /** This method is used to open file externally in a new tab */
  openFileExternal(): void {
    if (this.editorInfo) {
      window.open(this.editorInfo.url, '_new');
    }
  }

  /** This method is used to beautify the file. */
  formatDocument(flag?: boolean): void {
    if (flag) {
      this.beautified = true;
    }
    if (this.beautified) {
      this.beautified = jsbs(this.jsEditorMap.get(this.editorInfo.url).content, {}, { line: this.line + 1, column: this.column - 1 });
      this.column = this.beautified.loc.column;
      this.line = this.beautified.loc.line;
      this.code = this.beautified.code;

    } else {
      this.code = this.jsEditorMap.get(this.editorInfo.url).content;

    }

  }

  /** This method is emitted when the code changes. Here, we go and mark the error line */
  onChange() {
    // if the error line and column present, mark the error line
    if (this.line !== -1 && this.column !== -1) {
      this.editor.getEditor().gotoLine(this.line, this.column, true);
      this.editor.getEditor().session.addMarker(new ace.Range(this.line - 1, this.column, this.line, 0), 'myMarker', 'text');
    }
  }

  addInJSEditor(token: StackTrace): void {
    // get row, column and filename from token
    const tmp = token.text.split(':');
    const col = Number(tmp[tmp.length - 1]);
    const row = Number(tmp[tmp.length - 2]);
    tmp.pop();
    tmp.pop();
    const url = tmp.join(':');

    this.editorInfo = new JSEditor(url, col, row);
  }

  /** This function is used to close the tab of the editor */
  removeFile(key: string): void {
    this.jsEditorMap.delete(key);

    if (!this.jsEditorMap.size) {
      this.closeEditor();
    }
    this.getTabs();
  }

  /** This method is used to get the tabs for the editor */
  getTabs(): void {
    const tabs = Array.from(this.jsEditorMap.keys());
    this.items = tabs.map(key => {
      return {
        label: this.jsEditorMap.get(key).file === '' ? 'view-source:' + this.jsEditorMap.get(key).url : this.jsEditorMap.get(key).file,
        title: this.jsEditorMap.get(key).url,
        icon: this.jsEditorMap.get(key).file.split('.').pop() === 'js' ? 'las-js-square' : '',
        id: key,
        command: () => {
          this.onTabChange(key);
        }
      };
    });

    this.activeTab = this.items[0];
  }

  getActiveTab(key: string): void {
    const index = this.items.findIndex(item => item.id === key);

    if (index > -1) {
      this.activeTab = this.items[index];
    }
  }

  onTabChange(key: string): void {
    const url = this.jsEditorMap.get(key).url;
    const col = this.jsEditorMap.get(key).col;
    const row = this.jsEditorMap.get(key).row;

    this.editorInfo = new JSEditor(url, col, row);
  }

}
