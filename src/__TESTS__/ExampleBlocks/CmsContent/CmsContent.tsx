import showdown from "showdown";
import { processRichText } from "../../../utilities/stringUtilities";

export const CmsContent: React.FC<{ content: string; className?: string }> = ({
  content,
  className,
}) => {
  const converter = new showdown.Converter();

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: converter.makeHtml(processRichText(content)),
      }}
    />
  );
};

export default CmsContent;
