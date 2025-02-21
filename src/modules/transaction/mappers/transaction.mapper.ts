import { formatDateUTCToISO } from 'src/utils/date';
import { TransactionDTO } from '../dto/transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionMapper {
  static toDTO(entity: TransactionEntity): TransactionDTO {
    const { id, amount, type, date, description, userId, accountId, category } =
      entity;
    const account = {
      id: accountId,
      name: entity.account.name,
    };

    return {
      id,
      amount,
      type,
      date: formatDateUTCToISO(date.toISOString()),
      description,
      userId,
      accountId,
      category,

      account,
    };
  }
}
