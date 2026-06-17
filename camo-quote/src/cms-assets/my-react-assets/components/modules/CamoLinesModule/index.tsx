import { ModuleFields, TextField, FieldGroup, ColorField } from '@hubspot/cms-components/fields';
import type { QuoteTemplateContext } from '@hubspot/quote-dev-sdk';

interface FieldValues {
  heading: string;
  buttonLabel: string;
  styles?: {
    backgroundColor?: { css: string };
    headingColor?: { css: string };
  };
}

interface HublData {
  isQuoteBlueprint: boolean;
  isInEditor: boolean;
  quoteDeal?: {
    hs_object_id: number;
    dealname: string;
    description?: string;
    amount?: number;
    discount?: number;
    sales_tax?: number;
    total_amount?: number;
  };
  quoteLines: Array<{
    hs_object_id: number;
    name: string;
    description?: string;
    hs_sku?: string;
    price: number;
    amount: number;
    quantity: number;
    custom_tax?: string;
  }>;
}

interface Props {
  fieldValues: FieldValues;
  hublData: HublData;
}

export function Component({ fieldValues, hublData }: Props) {
  const {
    quoteDeal,
    quoteLines: rawQuoteLines,
    isInEditor,
  } = hublData;


  const parseAmount = (val: string | number | undefined) =>
    parseFloat(String(val ?? 0).replace(/[$,]/g, ''))

  const formatAmount = (val: string | number | undefined): string =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseAmount(val));

  const quoteLines = [...new Map((rawQuoteLines || []).map(line => [line.hs_sku, line])).values()]
    .sort((a, b) => parseAmount(b.amount) - parseAmount(a.amount))

  return (
    <div
      style={{
        backgroundColor: fieldValues.styles?.backgroundColor?.css,
        padding: 'calc(var(--spacing-unit) * 3) calc(var(--spacing-unit) * 4)',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#333' }}>
        <thead>
          <tr style={{ backgroundColor: '#D1EFF5' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left', color: '#1FA9C9', fontSize: '13px' }}>NAME</th>
            <th style={{ padding: '10px 12px', textAlign: 'left', color: '#1FA9C9', fontSize: '13px' }}>DESCRIPTION</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#1FA9C9', fontSize: '13px' }}>QTY</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#1FA9C9', fontSize: '13px' }}>RATE</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#1FA9C9', fontSize: '13px' }}>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {quoteLines?.map((line, i) => (
            <tr key={i}>
              <td
                style={{ padding: '14px 12px', verticalAlign: 'top', lineHeight: '1.6', maxWidth: '200px' }}
                dangerouslySetInnerHTML={{ __html: line.name ?? '' }}
              />
              <td
                style={{ padding: '14px 12px', verticalAlign: 'top', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: line.description ?? '' }}
              />
              <td style={{ padding: '14px 12px', verticalAlign: 'top', textAlign: 'right', whiteSpace: 'nowrap' }}>{line.quantity}</td>
              <td style={{ padding: '14px 12px', verticalAlign: 'top', textAlign: 'right', whiteSpace: 'nowrap' }}>{formatAmount(line.price)}</td>
              <td style={{ padding: '14px 12px', verticalAlign: 'top', textAlign: 'right', whiteSpace: 'nowrap' }}>{formatAmount(line.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: '36px' }}></div>
      <table style={{ width: '100%', maxWidth: '450px', borderCollapse: 'collapse', fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#333', marginTop: '0', marginLeft: 'auto' }}>
        <tbody>
          <tr>
            <td style={{ padding: '14px 12px', color: '#999' }}>SUBTOTAL</td>
            <td style={{ padding: '14px 12px', textAlign: 'right' }}>{formatAmount(quoteDeal?.amount || 0)}</td>
          </tr>
          <tr>
            <td style={{ padding: '14px 12px', color: '#999' }}>Discount</td>
            <td style={{ padding: '14px 12px', textAlign: 'right' }}>{formatAmount(quoteDeal?.discount || 0)}</td>
          </tr>
          <tr>
            <td style={{ padding: '14px 12px', color: '#999' }}>Sales Tax</td>
            <td style={{ padding: '14px 12px', textAlign: 'right' }}>{formatAmount(quoteDeal?.sales_tax || 0)}</td>
          </tr>
          <tr>
            <td style={{ padding: '14px 12px', color: '#999' }}>TOTAL</td>
            <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>{formatAmount(quoteDeal?.total_amount || 0)}</td>
          </tr>
        </tbody>
      </table>
      {/* <p>
        - - - - - - - - -
      </p>
      <p>
        {JSON.stringify(quoteDeal || { "deal": "deal" })}
      </p>
      <p>
        {JSON.stringify(quoteLines)}
      </p> */}
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
  label: 'Camo Lines Module',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set dealId = quoteTemplateContext.deal.hs_object_id %}
  {% if not dealId %}{% set dealId = '60182271329' %}{% endif %}
  {% set quoteDeal = crm_object("deal", dealId, "dealname,description,amount,total_amount,sales_tax,discount") %}

  {% set lineItemIds = quoteTemplateContext.lineItems | map(attribute="hs_object_id") | list %}
  {% if not lineItemIds or lineItemIds | length == 0 %}{% set lineItemIds = ['56016798526', '56016798525'] %}{% endif %}
  {% set quoteLines = crm_objects("line_item", lineItemIds, "name,description,hs_sku,price,amount,quantity,custom_tax") %}

  {% set hublData = {
    "quoteDeal": quoteDeal if quoteDeal else null,
    "quoteLines": quoteLines.results if quoteLines else [],
    "isQuoteBlueprint": isQuoteBlueprint,
    "isInEditor": is_in_editor,
  } %}
`;
