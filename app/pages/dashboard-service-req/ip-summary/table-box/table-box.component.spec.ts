import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBoxComponent } from './table-box.component';

describe('TableBoxComponent', () => {
  let component: TableBoxComponent;
  let fixture: ComponentFixture<TableBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
