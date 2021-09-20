import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceholderNodeComponent } from './placeholder-node.component';

describe('PlaceholderNodeComponent', () => {
  let component: PlaceholderNodeComponent;
  let fixture: ComponentFixture<PlaceholderNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceholderNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceholderNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
