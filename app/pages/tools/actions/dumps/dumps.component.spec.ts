import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DumpsComponent } from './dumps.component';

describe('DumpsComponent', () => {
  let component: DumpsComponent;
  let fixture: ComponentFixture<DumpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DumpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DumpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
