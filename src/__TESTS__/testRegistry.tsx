import { HeaderHeroBlockOptions } from "./ExampleBlocks/HeaderHeroBlock/HeaderHeroBlock";
import { HeroContainerBlockOptions } from "./ExampleBlocks/HeroContainerBlock/HeroContainerBlock";
import { TextBlockOptions } from "./ExampleBlocks/TextBlock";
import { BlogPostContainerBlockOptions } from "./ExampleBlocks/BlogPostContainerBlock/BlogPostContainerBlock";
import { IBlockRegistryOption } from "../BlockManager";

// end of imports

export const registry: IBlockRegistryOption[] = [
  // add your block options here
  BlogPostContainerBlockOptions,
  HeaderHeroBlockOptions,
  HeroContainerBlockOptions,
  TextBlockOptions,
];
