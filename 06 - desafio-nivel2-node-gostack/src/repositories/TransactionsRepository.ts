import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const { total } = await this.createQueryBuilder()
      .select('SUM(value)', 'total')
      .getRawOne();
    const { income } = await this.createQueryBuilder()
      .select('SUM(value)', 'income')
      .where('type = :type', { type: 'income' })
      .getRawOne();
    const outcome = total - income;
    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
