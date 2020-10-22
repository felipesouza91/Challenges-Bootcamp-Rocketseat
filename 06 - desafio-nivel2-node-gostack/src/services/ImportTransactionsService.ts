import path from 'path';
import Transaction from '../models/Transaction';
import csvRead from '../util/csv-read';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  fileName: string;
}
class ImportTransactionsService {
  async execute({ fileName }: Request): Promise<Transaction[]> {
    const createTransactionsService = new CreateTransactionService();
    const filePath = path.join(uploadConfig.directory, fileName);
    const transactions: Transaction[] = [];
    const data = await csvRead(filePath);

    // eslint-disable-next-line no-restricted-syntax
    for await (const item of data) {
      const transaction = await createTransactionsService.execute({
        title: item[0],
        type: item[1],
        value: item[2],
        category: item[3],
      });
      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
