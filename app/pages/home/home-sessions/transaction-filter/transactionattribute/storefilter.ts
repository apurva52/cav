

export class StoreFilter  {

    storeName: string = "";
    storeId: number = -2;
    terminalId: number = -1;
    associateId: number = -1;
    transactionId: number = -1;

        getStoreName(): string {
                return this.storeName;
        }
        setStoreName(storeName: string) {
                storeName = this.storeName;
        }
        getStoreId(): number {
                return this.storeId;
        }
        setStoreId(storeId: number) {
                storeId = this.storeId;
        }
        getTerminalId(): number {
                return this.terminalId;
        }
        setTerminalId(terminalId: number) {
                terminalId = this.terminalId;
        }
        getAssociateId(): number {
                return this.associateId;
        }
        setAssociateId(associateId: number) {
                associateId = this.associateId;
        }
        getTransactionId(): number {
                return this.transactionId;
	}
	setTransactionId(transactionId: number) {
                transactionId = this.transactionId;
        }

}
