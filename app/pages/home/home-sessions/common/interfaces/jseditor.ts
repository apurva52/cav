export class JSEditor {
  url: string;
  col: number;
  row: number;
  content: string;
  file: string;
  shortenedFileName: string;
  constructor(url, col, row) {
    this.url = url;
    this.col = col;
    this.row = row;
    this.content = null;
    this.file = url.split('/').pop();
    if (this.file.length > 23) {
      this.shortenedFileName = this.file.substring(0, 20) + '...';
    } else {
      this.shortenedFileName = this.file;
    }
  }
}
