import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationpathanalysisComponent } from './navigationpathanalysis.component';

describe('NavigationpathanalysisComponent', () => {
  let component: NavigationpathanalysisComponent;
  let fixture: ComponentFixture<NavigationpathanalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationpathanalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationpathanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
