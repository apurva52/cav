import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ServerSignatureMonitorComponent } from './server-signature-monitor.component';


describe('ServerSignatureMonitorComponent', () => {
  let component: ServerSignatureMonitorComponent;
  let fixture: ComponentFixture<ServerSignatureMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerSignatureMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerSignatureMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
