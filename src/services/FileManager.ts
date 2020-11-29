import XSLX, {WorkBook, WorkSheet} from 'xlsx';

export default class FileManager {
  private workBook: WorkBook;
  private readonly workBookName: string;

  constructor(path: string) {
    this.workBook = XSLX.readFile(path);
    this.workBookName = this.workBook.SheetNames[0];
  }

  getRows () {
    return  XSLX.utils.sheet_to_json(this.workBook.Sheets[this.workBookName], {raw: false});
  }
}