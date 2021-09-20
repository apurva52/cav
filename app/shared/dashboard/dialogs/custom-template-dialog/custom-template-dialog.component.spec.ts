import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTemplateDialogComponent } from './custom-template-dialog.component';

describe('CustomTemplateDialogComponent', () => {
  let component: CustomTemplateDialogComponent;
  let fixture: ComponentFixture<CustomTemplateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTemplateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
