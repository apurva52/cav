import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CpuBurstComponent } from "./cpu-burst.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("CpuBurstComponent", () => {

  let fixture: ComponentFixture<CpuBurstComponent>;
  let component: CpuBurstComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [CpuBurstComponent]
    });

    fixture = TestBed.createComponent(CpuBurstComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
