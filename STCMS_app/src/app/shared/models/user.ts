export interface User {
  id: string; // maps to _id in MongoDB
  type_user: string;
  name: string;
  last_name: string;
  age: number;
  email: string;
  gender: string;
  tournaments: string[]; // assuming tournaments are stored as array of IDs
  createdAt: string; // or Date if you convert it
  updatedAt: string;
  accessToken?: string;
}
