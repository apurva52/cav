import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNameCrudComponent } from './page-name-crud.component';

describe('PageNameCrudComponent', () => {
  let component: PageNameCrudComponent;
  let fixture: ComponentFixture<PageNameCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageNameCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNameCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
