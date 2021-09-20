import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureIndexPatternComponent } from './configure-index-pattern.component';

describe('ConfigureIndexPatternComponent', () => {
  let component: ConfigureIndexPatternComponent;
  let fixture: ComponentFixture<ConfigureIndexPatternComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureIndexPatternComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureIndexPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
