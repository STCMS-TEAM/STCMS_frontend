export interface User {
  name: string;
  last_name: string;
  email: string;
  password: string;
  gender: string;
  age: number;
  phone_number: string;
  accessToken?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
