import { ModuleFields, TextField, FieldGroup, ColorField } from '@hubspot/cms-components/fields';
import type { QuoteTemplateContext } from '@hubspot/quote-dev-sdk';

interface HublData {
  isQuoteBlueprint: boolean;
  isInEditor: boolean;
  everything: QuoteTemplateContext;
}

interface Props {
  hublData: HublData;
}

export function Component({ hublData }: Props) {
  const {
    everything,
    isInEditor,
  } = hublData;

  return (
    <div>
      <p>
        {JSON.stringify(everything)}
      </p>
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField name="heading" label="Heading" default="Hello, World!" />
    <TextField name="buttonLabel" label="Button Label" default="Click me!" />
    <FieldGroup name="styles" label="Styles" tab="STYLE">
      <ColorField name="backgroundColor" label="Background Color" />
      <ColorField name="headingColor" label="Heading Color" />
    </FieldGroup>
  </ModuleFields>
);

export const meta = {
  label: 'Camo Details Module',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set hublData = {
    "everything": quoteTemplateContext,
    "isInEditor": is_in_editor,
  } %}
`;
