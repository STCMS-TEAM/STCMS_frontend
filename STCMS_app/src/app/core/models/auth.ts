export interface User {
  name: string;
  last_name: string;
  email: string;
  password: string;
  gender: string;
  birthDate: Date;
  phone_number: string;
  accessToken?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
