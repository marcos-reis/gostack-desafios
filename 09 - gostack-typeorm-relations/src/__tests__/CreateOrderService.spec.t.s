import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';
import FakeCustomersRepository from '@modules/customers/repositories/fakes/FakeCustomersRepository';
import FakeProductsRepository from '@modules/products/repositories/fakes/FakeProductsRepository';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import AppError from '@shared/errors/AppError';

describe('CreateOrder', () => {
  it('should be able create a new order', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const fakeCustomersRepository = new FakeCustomersRepository();
    const fakeOrdersRepository = new FakeOrdersRepository();
    const createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeProductsRepository,
      fakeCustomersRepository,
    );

    const customer = await fakeCustomersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const product1 = await fakeProductsRepository.create({
      name: 'Processador Intel i5 9600k',
      price: 1800,
      quantity: 10,
    });

    const product2 = await fakeProductsRepository.create({
      name: 'Placa Mãe Gigabyte Z390 Aorus Elite',
      price: 1300,
      quantity: 10,
    });

    const order = await createOrder.execute({
      customer_id: customer.id,
      products: [
        { id: product1.id, quantity: 3 },
        { id: product2.id, quantity: 2 },
      ],
    });

    expect(order).toHaveProperty('customer');
    expect(order).toHaveProperty('order_products');
    expect(order.order_products).toEqual(
      expect.arrayContaining([
        {
          product_id: product1.id,
          quantity: 3,
          price: product1.price,
        },
        {
          product_id: product2.id,
          quantity: 2,
          price: product2.price,
        },
      ]),
    );
  });

  it('should not be able create a new order with customer inexistent', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const fakeCustomersRepository = new FakeCustomersRepository();
    const fakeOrdersRepository = new FakeOrdersRepository();
    const createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeProductsRepository,
      fakeCustomersRepository,
    );

    const product1 = await fakeProductsRepository.create({
      name: 'Processador Intel i5 9600k',
      price: 1800,
      quantity: 1,
    });

    const product2 = await fakeProductsRepository.create({
      name: 'Placa Mãe Gigabyte Z390 Aorus Elite',
      price: 1300,
      quantity: 1,
    });

    await expect(
      createOrder.execute({
        customer_id: 'inexistent-customer-id',
        products: [
          { id: product1.id, quantity: product1.quantity },
          { id: product2.id, quantity: product2.quantity },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able create a new order with a product our many products inexistent', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const fakeCustomersRepository = new FakeCustomersRepository();
    const fakeOrdersRepository = new FakeOrdersRepository();
    const createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeProductsRepository,
      fakeCustomersRepository,
    );
    const customer = await fakeCustomersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const product1 = await fakeProductsRepository.create({
      name: 'Processador Intel i5 9600k',
      price: 1800,
      quantity: 1,
    });

    await expect(
      createOrder.execute({
        customer_id: customer.id,
        products: [
          { id: product1.id, quantity: product1.quantity },
          { id: 'inexistent-id', quantity: 5 },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      createOrder.execute({
        customer_id: customer.id,
        products: [{ id: 'inexistent-id', quantity: 5 }],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able updated the quantity of itens to database', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const fakeCustomersRepository = new FakeCustomersRepository();
    const fakeOrdersRepository = new FakeOrdersRepository();
    const createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeProductsRepository,
      fakeCustomersRepository,
    );

    const customer = await fakeCustomersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const product = await fakeProductsRepository.create({
      name: 'Processador Intel i5 9600k',
      price: 1800,
      quantity: 5,
    });

    await createOrder.execute({
      customer_id: customer.id,
      products: [{ id: product.id, quantity: 2 }],
    });

    const findProduct = await fakeProductsRepository.findByName(product.name);

    expect(findProduct?.quantity).toEqual(product.quantity);
  });
});
