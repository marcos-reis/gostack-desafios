import FakeProductsRepository from '@modules/products/repositories/fakes/FakeProductsRepository';
import CreateProductService from '@modules/products/services/CreateProductService';
import AppError from '@shared/errors/AppError';

describe('CreateProduct', () => {
  it('shoud be able create a product', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const createProduct = new CreateProductService(fakeProductsRepository);

    const product = await createProduct.execute({
      name: 'Cadeira Gamer Gigabyte',
      price: 1400,
      quantity: 5,
    });

    expect(product).toHaveProperty('id');
  });

  it('shoud not be able create a product already existent', async () => {
    const fakeProductsRepository = new FakeProductsRepository();
    const createProduct = new CreateProductService(fakeProductsRepository);

    await createProduct.execute({
      name: 'Cadeira Gamer Gigabyte',
      price: 1400,
      quantity: 5,
    });

    await expect(
      createProduct.execute({
        name: 'Cadeira Gamer Gigabyte',
        price: 1400,
        quantity: 5,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
