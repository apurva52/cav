import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonAwsComponent } from './cav-mon-aws.component';

describe('CavMonAwsComponent', () => {
  let component: CavMonAwsComponent;
  let fixture: ComponentFixture<CavMonAwsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonAwsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonAwsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
