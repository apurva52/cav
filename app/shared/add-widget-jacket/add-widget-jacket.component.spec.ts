import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWidgetJacketComponent } from './add-widget-jacket.component';

describe('AddWidgetJacketComponent', () => {
  let component: AddWidgetJacketComponent;
  let fixture: ComponentFixture<AddWidgetJacketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWidgetJacketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWidgetJacketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
