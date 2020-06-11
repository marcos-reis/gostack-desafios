import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '@modules/orders/infra/typeorm/entities/Order';
import { uuid } from 'uuidv4';
import IOrdersRepository from '../IOrdersRepository';

export default class FakeOrdersRepository implements IOrdersRepository {
  private orders: Order[] = [];

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = new Order();
    Object.assign(order, { id: uuid(), customer, order_products: products });

    this.orders.push(order);
    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const findOrder = this.orders.find(order => order.id === id);
    return findOrder;
  }
}
