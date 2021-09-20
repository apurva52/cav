import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetFileDataComponent } from './get-file-data.component';

describe('GetFileDataComponent', () => {
  let component: GetFileDataComponent;
  let fixture: ComponentFixture<GetFileDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetFileDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetFileDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
