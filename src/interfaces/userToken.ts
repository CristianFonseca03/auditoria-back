export interface IUserToken {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  status: boolean;
  firstLogin: boolean;
  attempts: number;
}