import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewflowpathanalysisComponent } from './viewflowpathanalysis.component';

describe('ViewflowpathanalysisComponent', () => {
  let component: ViewflowpathanalysisComponent;
  let fixture: ComponentFixture<ViewflowpathanalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewflowpathanalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewflowpathanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
