import { UserDTO } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static entityToDTO(entity: UserEntity): UserDTO {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      picture: entity.picture || null,
    };
  }
}
