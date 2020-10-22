import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

// import AppError from '../errors/AppError';
interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getRepository(Transaction);
    const transcation = await transactionsRepository.findOne(id);
    if (!transcation) {
      throw new AppError('Transaction not found');
    }
    await transactionsRepository.remove(transcation);
  }
}

export default DeleteTransactionService;
