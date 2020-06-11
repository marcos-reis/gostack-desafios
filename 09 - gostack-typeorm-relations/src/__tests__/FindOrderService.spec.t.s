import OrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';
import ProductsRepository from '@modules/products/repositories/fakes/FakeProductsRepository';
import CustomersRepository from '@modules/customers/repositories/fakes/FakeCustomersRepository';
import FindOrderService from '@modules/orders/services/FindOrderService';

describe('FindOrder', () => {
  it('shold be able list to specific order', async () => {
    const fakeOrdersRepository = new OrdersRepository();
    const fakeProductRepository = new ProductsRepository();
    const fakeCustomersRepository = new CustomersRepository();
    const findOrder = new FindOrderService(
      fakeOrdersRepository,
      fakeProductRepository,
      fakeCustomersRepository,
    );

    const customer = await fakeCustomersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    });

    const product = await fakeProductRepository.create({
      name: 'RTX 2080',
      price: 2500,
      quantity: 3,
    });
    const productMap = {
      product_id: product.id,
      price: product.price,
      quantity: 1,
    };

    const order = await fakeOrdersRepository.create({
      customer,
      products: [productMap],
    });

    const findOrderById = await findOrder.execute({ id: order.id });

    expect(order).toEqual(findOrderById);
  });
});
