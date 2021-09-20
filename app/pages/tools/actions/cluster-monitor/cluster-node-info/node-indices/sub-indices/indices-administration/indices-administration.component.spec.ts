import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicesAdministrationComponent } from './indices-administration.component';

describe('IndicesAdministrationComponent', () => {
  let component: IndicesAdministrationComponent;
  let fixture: ComponentFixture<IndicesAdministrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicesAdministrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicesAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
