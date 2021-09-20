import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndToEndTierComponent } from './end-to-end-tier.component';

describe('EndToEndTierComponent', () => {
  let component: EndToEndTierComponent;
  let fixture: ComponentFixture<EndToEndTierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndToEndTierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndToEndTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
