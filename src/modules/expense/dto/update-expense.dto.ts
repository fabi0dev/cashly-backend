import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseDTO } from './create-expense.dto';

export class UpdateExpenseDto extends PartialType(CreateExpenseDTO) {}
