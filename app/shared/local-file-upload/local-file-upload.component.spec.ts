import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalFileUploadComponent } from './local-file-upload.component';

describe('LocalFileUploadComponent', () => {
  let component: LocalFileUploadComponent;
  let fixture: ComponentFixture<LocalFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
