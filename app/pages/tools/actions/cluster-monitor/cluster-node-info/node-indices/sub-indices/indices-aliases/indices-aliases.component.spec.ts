import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicesAliasesComponent } from './indices-aliases.component';

describe('IndicesAliasesComponent', () => {
  let component: IndicesAliasesComponent;
  let fixture: ComponentFixture<IndicesAliasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicesAliasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicesAliasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
