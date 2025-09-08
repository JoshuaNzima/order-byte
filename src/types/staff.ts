export interface Order {
  id: string;
  organizationId: string;
  customerName: string;
  tableNumber: string;
  items: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffUser {
  id: string;
  organizationId: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  createdAt: Date;
}