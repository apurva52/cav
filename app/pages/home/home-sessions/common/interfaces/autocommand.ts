import { PageTab } from './pagetab';

export class AutoCommand
{
nvSessionId : string;
pageinstance : string;
pageTab: PageTab;
particularPage : boolean = false;
constructor()
  {
    this.pageTab = new PageTab();
  }
}
