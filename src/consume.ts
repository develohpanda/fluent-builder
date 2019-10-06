import {FluentBuilder, OptionalToNullType} from './index';

interface Numbers {
  req: number;
  opt?: number;
}

const initialObj: OptionalToNullType<Numbers> = {
  req: 1,
  opt: null,
};

new FluentBuilder<Numbers>(initialObj).mutate(set => set.opt().req(2));
