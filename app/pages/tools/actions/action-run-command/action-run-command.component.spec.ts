import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionRunCommandComponent } from './action-run-command.component';


describe('RunCommandComponent', () => {
  let component: ActionRunCommandComponent;
  let fixture: ComponentFixture<ActionRunCommandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionRunCommandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionRunCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
