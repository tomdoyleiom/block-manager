/**
 * Turns a given string into a camel-cased string.
 *
 * @param {string} str The string to camel-case.
 * @param {string[]} [delimiters=[' ', '-']] The delimiters to use. If not provided, spaces, hyphens and underscores are used.
 * @returns {string} The camel-cased string.
 */
export const camelCase = (
  str: string,
  delimiters: string[] = [" ", "-", "_"]
): string => {
  if (!str) {
    return str;
  }

  const delimitersForRegex = delimiters
    .map((d) =>
      d === " "
        ? "\\s"
        : `${!/[a-z|A-Z]/g.test(d) ? "\\" : ""}${d.toLowerCase()}`
    )
    .join("|");
  const firstLettersRegex = new RegExp(`[${delimitersForRegex}](.)`, "g");

  return str
    .toLowerCase()
    .replace(firstLettersRegex, (_match, group) => group.toUpperCase());
};

export const pascalCase = (
  str: string,
  delimiters: string[] = [" ", "-", "_"]
): string => {
  const camelCaseStr = camelCase(str, delimiters);
  return camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1);
};

export const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

export const splitMultiLine = (str: string): string[] => {
  return str.split("\n");
};

const processCode = (unsafe: string) => {
  // strip off the <code> and <strong>tags
  unsafe = unsafe.replace(/<code>/gim, ``);
  unsafe = unsafe.replace(/<\/code>/gim, ``);
  unsafe = unsafe.replace(/<strong>/gim, ``);
  unsafe = unsafe.replace(/<\/strong>/gim, ``);
  // convert nested gt and lt to html entities
  unsafe = unsafe.replace(/&lt;/gim, "<");
  unsafe = unsafe.replace(/&gt;/gim, ">");
  return unsafe;
};

export const processRichText = (text: string) => {
  if (!text) {
    return "";
  }

  if (text.includes("<code>")) {
    // if the text contains code, then we need to escape the html
    text = processCode(text);
  }

  return (
    text
      .replace(
        /<table/gim,
        `<div class="table-responsive"><table class="table table-striped"`
      )
      .replace(/<\/table>/gim, `</table></div>`)
      // append mb-4 to  all hX tags
      .replace(/<h([1-6])/gim, `<h$1 class="mb-4"`)
      .replace(/<ul/gim, `<ul class="sc-list"`)
      .replace(/<code>/gim, ``)
      .replace(/<\/code>/gim, ``)
      .replace(/<strong>/gim, ``)
      .replace(/<\/strong>/gim, ``)
  );
};

/**
 *
 * @param text the text to preview (should not be html or markdown. If you're using a @RichText item, then use the 'text' attribute)
 * @param length the number of words to preview
 * @returns the preview text, with an ellipsis at the end
 */
export const previewText = (text: string, length: number = 20): string => {
  const words = text.split(" ");
  return words.slice(0, length).join(" ") + "...";
};

export const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};
