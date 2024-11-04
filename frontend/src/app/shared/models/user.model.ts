export interface User {
    _id: string;
    email: string;
    name: string;
    password: string;
    role: 'developer' | 'manager';
    rewards: number;
  }
  