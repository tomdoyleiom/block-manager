import React from "react";
import {
  IBlockManagerProps,
  IBlockComponent,
  IBlockRegistryOption,
} from "./types";

const BlockManager: React.FC<IBlockManagerProps> = ({
  blocks,
  registry,
  options,
}) => {
  if (options) {
    // todo: remove this in the future.
    console.log(options);
  }
  // console.log(blocks)
  const getBlockComponent = (
    block: IBlockComponent,
    index: number,
    registry: IBlockRegistryOption[]
  ) => {
    const { __typename, ...rest } = block;
    const component = registry
      .find((x) => x.__typename === __typename)
      ?.component(index, rest);
    if (!component) {
      console.error(
        `Unexpected block type: ${__typename}, perhaps you need to add ${__typename} the BlockManager Registry?`,
        getExampleRegistryFromBlock(rest, __typename),
        getExampleGeneratorFromBlock(rest, __typename)
      );
    }
    return component;
  };

  return (
    <>
      {blocks && blocks.length
        ? blocks.map((block, index) => (
            <React.Fragment key={`${block.__typename}-${index}`}>
              {getBlockComponent(block, index, registry)}
            </React.Fragment>
          ))
        : null}
    </>
  );
};

const getExampleGeneratorFromBlock = (data: any, __typename: string) => {
  if (__typename) {
    return `to automatically generate this block, along with its associated query and registry entry, run the following command: npx hygen "Block Component" with-prompt --name ${__typename}`;
  }
};

const getExamplePropsFromBlock = (data: any, __typename: string) => {
  if (data && typeof data === "object") {
    const keys = Object.keys(data);
    const props = keys.map((key) => {
      const value = data[key];
      return `${key}: ${typeof value}`;
    });
    return `export interface I${__typename}Props { ${props.join(" ")} }`;
  }
};

const getExampleRegistryFromBlock = (data: any, name: string) => {
  const block = name;
  if (block) {
    return {
      __typename: name,
      component: `(index, rest: I${block}Props) => <${block}Block key={index} {...rest} />`,
      interface: getExamplePropsFromBlock(data, name),
    };
  }
};

export default BlockManager;
