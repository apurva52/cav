import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetIntegrationComponent } from './reset-integration.component';

describe('ResetIntegrationComponent', () => {
  let component: ResetIntegrationComponent;
  let fixture: ComponentFixture<ResetIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
