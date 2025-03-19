export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserDto = {
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
};

export type UpdateUserDto = {
  firstName?: string;
  lastName?: string;
  role?: string;
};

export type IUserService = {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(createUserDto: CreateUserDto): Promise<User>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;
  delete(id: string): Promise<boolean>;
};

export enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}
