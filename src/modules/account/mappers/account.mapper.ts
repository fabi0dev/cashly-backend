import { AccountDTO } from '../dto/account.dto';
import { AccountEntity } from '../entities/account.entity';

export class AccountMapper {
  static toDTO(accountEntity: AccountEntity): AccountDTO {
    const { id, name, type, isDefault, balance, userId } = accountEntity;

    return {
      id,
      name,
      type,
      isDefault,
      balance,
      userId,
    };
  }
}
