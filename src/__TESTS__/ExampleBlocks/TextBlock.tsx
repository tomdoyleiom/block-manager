import { IBlockRegistryOption } from "../../BlockManager";
import CmsContent from "./CmsContent/CmsContent";

export const TextBlockQuery = `
... on Text {
  id
  text {
    html
    markdown
    raw
    text
  }
  colour
}
`;

export const TextBlockOptions: IBlockRegistryOption = {
  __typename: "Text",
  component: (index, rest: IRichTextProps) => (
    <TextBlock key={index} {...rest} />
  ),
};

export interface IRichTextProps {
  __typename: "Text";
  id: string;
  text: {
    text: string;
    html: string;
  };
  colour: string;
}

export const TextBlock: React.FC<IRichTextProps> = ({ id, text, colour }) => {
  return (
    <p
      title=""
      id={id}
      className="bg-brand1 p-3 p-md-5 d-flex align-items-center"
    >
      <div className="container container-fluid">
        <div className="row justify-content-center">
          <div className="col">
            <CmsContent content={text.html} />
          </div>
        </div>
      </div>
    </p>
  );
};
