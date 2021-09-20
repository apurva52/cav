import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameIntegrationComponent } from './rename-integration.component';

describe('RenameIntegrationComponent', () => {
  let component: RenameIntegrationComponent;
  let fixture: ComponentFixture<RenameIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
