import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandExecutionComponent } from './command-execution.component';

describe('CommandExecutionComponent', () => {
  let component: CommandExecutionComponent;
  let fixture: ComponentFixture<CommandExecutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandExecutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
