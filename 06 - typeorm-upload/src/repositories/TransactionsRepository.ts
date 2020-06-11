import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public all(): Promise<Transaction[]> {
    return this.find();
  }

  public async getBalance(): Promise<Balance> {
    const balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };
    const transactions = await this.find();
    transactions.map(item => {
      if (item.type === 'income') {
        balance.income += item.value;
      }
      if (item.type === 'outcome') {
        balance.outcome += item.value;
      }
      return null;
    });

    balance.total = balance.income - balance.outcome;
    return balance;
  }
}

export default TransactionsRepository;
