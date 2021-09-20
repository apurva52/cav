export class StoreAttribute {
   storeId: number;
   terminalId: number;
   associateId: number;
   transactionId: number;

   constructor()
   {
     this.associateId = -1;
     this.storeId = -2;
     this.terminalId = -1;
     this.transactionId = -1;
   }
}
