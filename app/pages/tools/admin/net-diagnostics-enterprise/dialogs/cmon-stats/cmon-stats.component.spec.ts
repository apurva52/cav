import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmonStatsComponent } from './cmon-stats.component';

describe('CmonStatsComponent', () => {
  let component: CmonStatsComponent;
  let fixture: ComponentFixture<CmonStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmonStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmonStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
