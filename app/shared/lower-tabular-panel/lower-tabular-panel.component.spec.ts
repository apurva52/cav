import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LowerTabularPanelComponent } from './lower-tabular-panel.component';

describe('LowerTabularPanelComponent', () => {
  let component: LowerTabularPanelComponent;
  let fixture: ComponentFixture<LowerTabularPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LowerTabularPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowerTabularPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
