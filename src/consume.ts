import {BuilderProxyType, FluentBuilder} from './index';

interface Product {
  title: number;
  description?: number;
}

const initialObj: BuilderProxyType<Product> = {
  title: 1,
  description: null,
};

new FluentBuilder<Product>(initialObj).mutate(set => set.description().title());
