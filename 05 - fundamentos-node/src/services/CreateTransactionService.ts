import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: TransactionDTO): Transaction {
    const balance = this.transactionsRepository.getBalance();
    if (type == 'outcome' && balance.total < value) {
      throw new Error('Non-execution operation');
    }

    const transaction = this.transactionsRepository.create(title, value, type);
    return transaction;
  }
}

export default CreateTransactionService;
