export interface IUser {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: IUserRole;
  status: boolean;
  firstLogin: boolean;
  attempts: number;
  oldPassword: string[];
}

export type IUserRole = "admin" | "editor" | "user";
