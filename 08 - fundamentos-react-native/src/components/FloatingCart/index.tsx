import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const productsPrices = products.map(product => {
      return product.price * product.quantity;
    });
    let totalValue = 0;
    productsPrices.map(price => {
      totalValue += price;
      return totalValue;
    });

    return formatValue(totalValue);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    if (products.length > 1) {
      let totalItem = 0;
      products.map(val => {
        totalItem += val.quantity;
      });

      return totalItem;
    }
    if (products.length === 1) {
      return products[0].quantity;
    }
    return 0;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />

        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
