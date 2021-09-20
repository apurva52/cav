import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDumpComponent } from './page-dump.component';

describe('PageDumpComponent', () => {
  let component: PageDumpComponent;
  let fixture: ComponentFixture<PageDumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageDumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
