import { IBlockRegistryOption } from "../../../types";
import CmsContent from "../CmsContent/CmsContent";
import React from "react";

// Add the query to the page query at ./app/src/queries.ts
export const HeaderHeroBlockQuery = `
... on HeaderHero {
  id
  backgroundImage {
    lg {
      url
      width
      height
    }
    md {
      url
      width
      height
    }
    sm {
      url
      width
      height
    }
  }
  boxColour
  boxText {
    html
  }
  button {
    ... on ModalButton {
      id
    }
  }
  title
}
`;

export interface IHeaderHeroBlockProps {
  __typename: "HeaderHero";
  id: string;
  title: string;
  boxColour: string;
}

// Add these options to the block registry at ./app/src/components/BlockManager/registry.tsx
export const HeaderHeroBlockOptions: IBlockRegistryOption = {
  __typename: "HeaderHero",
  component: (index: number, rest: IHeaderHeroBlockProps) => (
    <HeaderHeroBlock key={index} {...rest} />
  ),
  cols: 3,
};

export const HeaderHeroBlock: React.FC<IHeaderHeroBlockProps> = ({
  title,
  boxColour,
}) => {
  return (
    <>
      <div className="headerContainer">
        <div className="imageBg d-block d-md-none">
          <img
            src="http://placehold.co/833x1819"
            className="img-fluid w-100"
            width={833}
            height={1819}
            style={{ height: "100%" }}
          />
        </div>
        <div className={`imageBg d-none d-md-block d-lg-none`}>
          <img
            src="http://placehold.co/1199x1477"
            className="img-fluid w-100"
            width={1199}
            height={1477}
          />
        </div>
        <div className={`imageBg d-none d-lg-block`}>
          <img
            src="http://placehold.co/1199x1477"
            className="img-fluid w-100"
            width={1199}
            height={1477}
          />
        </div>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className={`headerText text-center position-relative`}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
