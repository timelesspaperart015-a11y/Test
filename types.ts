// Define the Customer data model
export interface Customer {
  id: string;
  name: string;
  group_name: string;
  note: string;
  balance: number;
  created_at: string;
}

// Helper type for the form (excluding auto-generated fields)
export type CustomerFormData = Omit<Customer, 'id' | 'created_at'>;
