import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReadExtractService, TransactionExtract } from './read-extract.service';
import { multerConfig } from 'src/services/multer.service';

@Controller('read-extract')
export class ReadExtractController {
  constructor(private readonly readExtractService: ReadExtractService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<TransactionExtract[]> {
    /* if (!file) {
      return { message: 'Nenhum arquivo enviado.' };
    } */

    const transactions =
      await this.readExtractService.extractTransactionsFromPDF(file.path);

    return transactions;
  }
}
