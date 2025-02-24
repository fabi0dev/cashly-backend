import { PartialType } from '@nestjs/mapped-types';
import { CreateReadExtractDto } from './create-read-extract.dto';

export class UpdateReadExtractDto extends PartialType(CreateReadExtractDto) {}
