import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndToEndTierLevelComponent } from './end-to-end-tier-level.component';

describe('EndToEndTierLevelComponent', () => {
  let component: EndToEndTierLevelComponent;
  let fixture: ComponentFixture<EndToEndTierLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndToEndTierLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndToEndTierLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
