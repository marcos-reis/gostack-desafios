import Product from '@modules/products/infra/typeorm/entities/Product';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import { uuid } from 'uuidv4';

interface IFindProducts {
  id: string;
}

export default class FakeProductsRepository implements IProductsRepository {
  private products: Product[] = [];

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = new Product();
    Object.assign(product, { id: uuid(), name, price, quantity });
    this.products.push(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProduct = this.products.find(product => product.name === name);

    return findProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const findedProducts: Product[] = [];
    products.map(async product => {
      const findedProduct = await this.products.find(
        findProduct => findProduct.id === product.id,
      );
      if (findedProduct) {
        findedProducts.push(findedProduct);
      }
    });
    return findedProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    products.map(async product => {
      const findedProduct = this.products.find(
        findProduct => product.id === findProduct.id,
      );
      if (findedProduct) {
        findedProduct.quantity -= product.quantity;
        this.products.push(findedProduct);
      }
    });
    return this.products;
  }
}
