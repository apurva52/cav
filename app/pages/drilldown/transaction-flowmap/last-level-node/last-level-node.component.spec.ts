import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastLevelNodeComponent } from './last-level-node.component';

describe('LastLevelNodeComponent', () => {
  let component: LastLevelNodeComponent;
  let fixture: ComponentFixture<LastLevelNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastLevelNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastLevelNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
