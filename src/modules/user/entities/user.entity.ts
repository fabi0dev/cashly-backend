export class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
