import { CustomerType } from './customer-type';

export interface Customer {
    // doi tuong
    id: number;
    CUT_ID: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    customerType: CustomerType;
}
