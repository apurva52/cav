import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestInitialisationComponent } from './test-initialisation.component';

describe('TestInitialisationComponent', () => {
  let component: TestInitialisationComponent;
  let fixture: ComponentFixture<TestInitialisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestInitialisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestInitialisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
