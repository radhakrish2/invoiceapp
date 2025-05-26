export interface Client
{
    clientId?: number; // Optional for creating a new client
    name: string;
    email: string;
    companyName: string;
    address: string;
    userId: number; // Assuming you're sending only the userId to backend
}