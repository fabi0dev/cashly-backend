export class UserAuthDTO {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
