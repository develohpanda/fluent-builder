import {BuilderProxyType, FluentBuilder} from './index';

interface Numbers {
  req: number;
  opt?: number;
}

const initialObj: BuilderProxyType<Numbers> = {
  req: 1,
  opt: null,
};

new FluentBuilder<Numbers>(initialObj).mutate(set => set.opt().req(2));
