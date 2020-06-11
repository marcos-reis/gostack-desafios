import { getRepository } from 'typeorm';

import { isUuid } from 'uuidv4';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getRepository(Transaction);
    const transactionIdIsValid = isUuid(id);
    if (!transactionIdIsValid) {
      throw new AppError('Transaction id not is valid');
    }
    const transactionExists = await transactionsRepository.findOne(id);
    if (!transactionExists) {
      throw new AppError('Transaction not found');
    }
    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
