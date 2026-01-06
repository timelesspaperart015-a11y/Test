import { Customer } from '../types';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    group_name: 'VIP',
    note: 'Preferred contact via email.',
    balance: 1500,
    created_at: '2023-10-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Bob Smith',
    group_name: 'Regular',
    note: 'Pending renewal.',
    balance: 200,
    created_at: '2023-10-05T14:30:00Z',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    group_name: 'New',
    note: '',
    balance: 0,
    created_at: '2023-10-10T09:15:00Z',
  },
];
