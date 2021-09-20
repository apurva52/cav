import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SnmpComponent } from "./snmp.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("SnmpComponent", () => {

  let fixture: ComponentFixture<SnmpComponent>;
  let component: SnmpComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [SnmpComponent]
    });

    fixture = TestBed.createComponent(SnmpComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
