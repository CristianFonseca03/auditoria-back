export interface IUser {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  password?: string;
  role: IUserRole;
}

export type IUserRole = "admin" | "client";
