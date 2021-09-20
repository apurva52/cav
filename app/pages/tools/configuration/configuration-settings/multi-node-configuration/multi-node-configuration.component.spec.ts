import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiNodeConfigurationComponent } from './multi-node-configuration.component';

describe('MultiNodeConfigurationComponent', () => {
  let component: MultiNodeConfigurationComponent;
  let fixture: ComponentFixture<MultiNodeConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiNodeConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiNodeConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
