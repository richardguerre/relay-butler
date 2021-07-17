/**
 * This file shows all available Handlebar expressions in template files.
 */

/** TemplateProps is the root API for all template files. For example, you can access `componentName` by inserting {{componentName}} in a template file. */
export type TemplateProps = {
  componentName: string;
  fragments: TemplateFragment[];
  query: string;
};

export type TemplateFragment = {
  name: string;
  propName: string;
  raw: string;
  selectionSet: string[];
};

export type TemplateQuery = {
  raw: string;
  fragments: {
    propName: string;
    dataPath: string;
  }[];
};
