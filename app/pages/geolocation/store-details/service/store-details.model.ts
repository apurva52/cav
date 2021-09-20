export interface StoreDetailsData{
    name?: string;
    data?: StoreData[];
}

export interface StoreDataPayload{


}

export interface StoreData{
    tps?: any;
    responseTime?: any;
    error?: any;
    scanPerMin?: any;
    orderPlacedPerMin?: any;
    name?: string;
    store?: string;
    critical?: any;
    major?: any;
    city?: string;
}