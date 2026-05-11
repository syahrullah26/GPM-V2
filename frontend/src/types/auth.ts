export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  token: string;
  user: User;
}
