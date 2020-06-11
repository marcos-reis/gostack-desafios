import { getRepository, getCustomRepository } from 'typeorm';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryTitle,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryExists = await categoryRepository.findOne({
      where: { title: categoryTitle },
    });
    const balance = await transactionsRepository.getBalance();
    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Non-execution operation');
    }
    if (categoryExists) {
      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category: categoryExists,
      });
      await transactionsRepository.save(transaction);

      return transaction;
    }

    const category = categoryRepository.create({ title: categoryTitle });
    await categoryRepository.save(category);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category,
    });
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
