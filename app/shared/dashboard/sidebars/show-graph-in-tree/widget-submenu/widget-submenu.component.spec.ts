import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSubmenuComponent } from './widget-submenu.component';

describe('WidgetSubmenuComponent', () => {
  let component: WidgetSubmenuComponent;
  let fixture: ComponentFixture<WidgetSubmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetSubmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
