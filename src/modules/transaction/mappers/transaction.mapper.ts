import { TransactionDTO } from '../dto/transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionMapper {
  static toDTO(entity: TransactionEntity): TransactionDTO {
    const { id, amount, type, date, description, userId, accountId, category } =
      entity;

    return {
      id,
      amount,
      type,
      date,
      description,
      userId,
      accountId,
      category,
    };
  }
}
