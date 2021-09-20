import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopologyDetailsComponent } from './topology-details.component';

describe('TopologyDetailsComponent', () => {
  let component: TopologyDetailsComponent;
  let fixture: ComponentFixture<TopologyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopologyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopologyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
