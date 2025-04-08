import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as pdf from 'pdf-parse';

export interface TransactionExtract {
  date: string;
  description: string;
  value: number;
  type: 'ENTRADA' | 'SAÍDA';
}

@Injectable()
export class ReadExtractService {
  async extractTransactionsFromPDF(
    pdfPath: string,
  ): Promise<TransactionExtract[]> {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    const text = data.text;
    const lines = text.split('\n');

    const transactions: TransactionExtract[] = [];
    const dateRegex = /\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/;
    const valueRegex = /[+-]?\s?R\$\s?\d{1,3}(?:\.\d{3})*(?:,\d{2})?/;

    let currentDate: string | null = null;

    for (const line of lines) {
      const dateMatch = line.match(dateRegex);
      const valueMatch = line.match(valueRegex);

      if (dateMatch) {
        currentDate = dateMatch[0];
      }

      if (valueMatch && currentDate) {
        let valueStr = valueMatch[0]
          .replace(/R\$\s?/, '')
          .trim()
          .replace(' ', '')
          .replace(/\./g, '')
          .replace(',', '.');

        const allValues = line.match(new RegExp(valueRegex, 'g')) || [];

        const type: 'ENTRADA' | 'SAÍDA' = valueStr.startsWith('-')
          ? 'SAÍDA'
          : 'ENTRADA';

        valueStr = allValues.length
          ? allValues[allValues.length - 1]
              .replace(/R\$\s?/, '')
              .trim()
              .replace(/\./g, '')
              .replace(',', '.')
          : valueStr;

        let value = parseFloat(valueStr);

        value = Math.abs(value);

        let description = line
          .replace(dateMatch ? dateMatch[0] : '', '')
          .trim();
        description = description.replace(valueMatch[0], '').trim();
        description = description
          .replace(/R\$\s?-?[\d]{1,3}(\.?\d{3})*(,\d{2})?/g, '')
          .trim();
        description = description.replace(/[-]+/g, '').trim();

        console.log({ date: currentDate, description, value, type });

        if (description && value > 0) {
          transactions.push({ date: currentDate, description, value, type });
        }
      }
    }

    return transactions;
  }
}
