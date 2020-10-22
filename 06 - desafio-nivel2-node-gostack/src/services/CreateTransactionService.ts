import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    let cateroryExists = await categoryRepository.findOne({
      where: { title: category },
    });
    if (!cateroryExists) {
      const categorySaved = categoryRepository.create({
        title: category,
      });
      cateroryExists = await categoryRepository.save(categorySaved);
    }

    if (!cateroryExists.id) {
      throw new AppError('Error when save category', 400);
    }
    const transacationRepository = getCustomRepository(TransactionsRepository);
    const { total } = await transacationRepository.getBalance();
    if (type === 'outcome' && total - value < 0) {
      throw new AppError('You don`t have sould for this transactions!');
    }
    const transaction = await transacationRepository.create({
      title,
      value,
      type,
      category_id: cateroryExists.id,
    });
    await transacationRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
