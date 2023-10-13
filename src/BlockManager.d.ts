import { JSX } from "react";
export interface IBlockComponent {
  __typename: string;
  [x: string]: unknown;
}

export interface IBlockRegistryOption {
  __typename: string;
  component: (index: number, rest: any) => JSX.Element;
  cols?: number;
}

interface IBlockManagerProps {
  blocks: IBlockComponent[];
  registry: IBlockRegistryOption[];
}
