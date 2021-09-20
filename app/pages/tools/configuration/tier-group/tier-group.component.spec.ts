import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TierGroupComponent } from './tier-group.component';

describe('TierGroupComponent', () => {
  let component: TierGroupComponent;
  let fixture: ComponentFixture<TierGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TierGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TierGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
