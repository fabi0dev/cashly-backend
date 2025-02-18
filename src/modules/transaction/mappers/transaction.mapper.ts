import { TransactionDTO } from '../dto/transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionMapper {
  static toDTO(entity: TransactionEntity): TransactionDTO {
    const dto: TransactionDTO = {
      id: entity.id,
      amount: entity.amount,
      type: entity.type,
      date: entity.date,
      description: entity.description,
      userId: entity.userId,
      accountId: entity.accountId,
      category: entity.category,
    };

    return dto;
  }
}
