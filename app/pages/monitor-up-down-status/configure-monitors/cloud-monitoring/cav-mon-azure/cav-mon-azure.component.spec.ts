import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavMonAzureComponent } from './cav-mon-azure.component';

describe('CavMonAzureComponent', () => {
  let component: CavMonAzureComponent;
  let fixture: ComponentFixture<CavMonAzureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavMonAzureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavMonAzureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
