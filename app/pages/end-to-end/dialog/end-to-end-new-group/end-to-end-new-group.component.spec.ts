import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndToEndNewGroupComponent } from './end-to-end-new-group.component';

describe('EndToEndNewGroupComponent', () => {
  let component: EndToEndNewGroupComponent;
  let fixture: ComponentFixture<EndToEndNewGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndToEndNewGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndToEndNewGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
