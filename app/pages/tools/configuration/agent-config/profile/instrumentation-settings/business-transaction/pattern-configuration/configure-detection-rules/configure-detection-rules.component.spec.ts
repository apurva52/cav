import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureDetectionRulesComponent } from './configure-detection-rules.component';

describe('ConfigureDetectionRulesComponent', () => {
  let component: ConfigureDetectionRulesComponent;
  let fixture: ComponentFixture<ConfigureDetectionRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureDetectionRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureDetectionRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
