

export class TransactionAttributeFilter  {

        transactionName: string; 
        duration: DurationFilter;
        serverTime: DurationFilter;
        networkTime: DurationFilter;
        failedTransaction: boolean = false;
        sortBy: string = "";

        getDuration(): DurationFilter {
                return this.duration;
        }
        setDuration(duration: DurationFilter) {
                duration = this.duration;
        }
        getServerTime(): DurationFilter {
                return this.serverTime;
        }
        setServerTime(serverTime: DurationFilter) {
                serverTime = this.serverTime;
        }
        getNetworkTime(): DurationFilter {
                return this.networkTime;
        }
	setNetworkTime(networkTime: DurationFilter) {
                networkTime = this.networkTime;
        }
        isFailedTransaction(): boolean {
                return this.failedTransaction;
        }
        setFailedTransaction(failedTransaction: boolean) {
                failedTransaction = this.failedTransaction;
        }
        getSortBy(): string {
                return this.sortBy;
        }

        setSortBy(sortBy: string) {
                sortBy = this.sortBy;
        }


}

export class DurationFilter
{
  operator: string = "";
  operand1: string = "";
  operand2: string = "";
  	getOperator(): string {
                return this.operator;
        }
        setOperator(operator: string) {
                operator = this.operator;
        }
        getOperand1(): string {
	        return this.operand1;
        }
        setOperand1(operand1: string) {
                operand1 = this.operand1;
        }
        getOperand2(): string {
                return this.operand2;
        }
        setOperand2(operand2: string) {
                operand2 = this.operand2;
        }

}
