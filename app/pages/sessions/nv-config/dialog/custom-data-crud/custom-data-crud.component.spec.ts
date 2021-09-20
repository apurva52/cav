import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDataCrudComponent } from './custom-data-crud.component';

describe('CustomDataCrudComponent', () => {
  let component: CustomDataCrudComponent;
  let fixture: ComponentFixture<CustomDataCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDataCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDataCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
