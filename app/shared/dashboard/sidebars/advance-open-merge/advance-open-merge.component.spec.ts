import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceOpenMergeComponent } from './advance-open-merge.component';

describe('AdvanceOpenMergeComponent', () => {
  let component: AdvanceOpenMergeComponent;
  let fixture: ComponentFixture<AdvanceOpenMergeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceOpenMergeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceOpenMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
