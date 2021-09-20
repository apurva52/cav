import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MonStatsComponent } from './mon-stats.component';



describe('ServerSignatureMonitorComponent', () => {
  let component: MonStatsComponent;
  let fixture: ComponentFixture<MonStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
