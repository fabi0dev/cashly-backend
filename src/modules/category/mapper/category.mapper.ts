import { CategoryDTO } from '../dto/category.dto';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryMapper {
  static toDTO(entity: CategoryEntity): CategoryDTO {
    return {
      id: entity.id,
      type: entity.type,
      name: entity.name,
      importanceLevel: entity.importanceLevel,
      isFavorite: entity.isFavorite,
      userId: entity.userId,
    };
  }
}
