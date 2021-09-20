import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionFlowpathDetailsComponent } from './transaction-flowpath-details.component';


describe('TransactionFlowpathDetailsComponent', () => {
  let component: TransactionFlowpathDetailsComponent;
  let fixture: ComponentFixture<TransactionFlowpathDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionFlowpathDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionFlowpathDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
