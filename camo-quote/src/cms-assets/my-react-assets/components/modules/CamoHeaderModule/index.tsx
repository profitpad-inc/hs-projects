import { ModuleFields, TextField, FieldGroup, ColorField } from '@hubspot/cms-components/fields';
import type { QuoteTemplateContext } from '@hubspot/quote-dev-sdk';

interface FieldValues {
  sellerDetails: string;
  styles?: {
    backgroundColor?: { css: string };
    headingColor?: { css: string };
  };
}

interface HublData {
  isQuoteBlueprint: boolean;
  isInEditor: boolean;
  quoteQuote?: QuoteTemplateContext['quote'];
  quoteCompany?: {
    hs_object_id: number;
    name: string;
    address?: number;
    address_2?: number;
    city?: number;
    state?: number;
    zip?: number;
  };
}

interface Props {
  fieldValues: FieldValues;
  hublData: HublData;
}

export function Component({ fieldValues, hublData }: Props) {
  const {
    quoteQuote,
    quoteCompany,
    isQuoteBlueprint,
    isInEditor,
  } = hublData;

  function parseDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-CA').replace(/-/g, '/');
  }

  return (
    <div
      style={{
        backgroundColor: fieldValues.styles?.backgroundColor?.css,
        padding: 'calc(var(--spacing-unit) * 3) calc(var(--spacing-unit) * 4)',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        maxWidth: '1000px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '24px' }}>
        <img
          src="https://4185119.fs1.hubspotusercontent-na2.net/hubfs/4185119/LOGO.png"
          alt="Logo"
          style={{ maxWidth: '300px' }}
        />
        <p style={{ textAlign: 'left', margin: '80px' }}>
          {fieldValues.sellerDetails?.split('\\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </p>
      </div>
      <p style={{ marginLeft: '48px', textAlign: 'left', color: '#1FA9C9', fontSize: '24px' }}>
        QUOTE
      </p>

      <table style={{ marginLeft: '96px', width: '100%', maxWidth: '800px', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
        <tbody>
          <tr>
            <td style={{ color: '#999', verticalAlign: 'top', width: '360px', paddingRight: '18px' }}>SHIP TO</td>
            <td style={{ color: '#999', verticalAlign: 'top', paddingRight: '18px', whiteSpace: 'nowrap' }}>QUOTE</td>
            <td style={{ verticalAlign: 'top' }}>{String(quoteQuote?.hs_object_id ?? 0)}</td>
          </tr>
          <tr>
            <td style={{ verticalAlign: 'bottom' }}>{quoteCompany?.address}</td>
            <td style={{ color: '#999', verticalAlign: 'top', paddingRight: '18px', whiteSpace: 'nowrap' }}>DATE</td>
            <td style={{ verticalAlign: 'top' }}>{parseDate(Number(quoteQuote?.hs_lastmodifieddate ?? 0))}</td>
          </tr>
          <tr>
            <td style={{ verticalAlign: 'top' }}>
              <p style={{ marginTop: '4px' }}>{quoteCompany?.city}</p>
              <p>{quoteCompany?.state} {quoteCompany?.zip}</p></td>
            <td style={{ color: '#999', verticalAlign: 'top', paddingRight: '18px', width: '90px' }}>EXPIRATION DATE</td>
            <td style={{ verticalAlign: 'top' }}>{parseDate(Number(quoteQuote?.hs_expiration_date ?? 0))}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField name="sellerDetails" label="Seller Details" default="5150 FAIR OAKS BLVD. #302\nCARMICHAEL, CA 95608\nchris.becher@profitpad.com" />
    <FieldGroup name="styles" label="Styles" tab="STYLE">
      <ColorField name="backgroundColor" label="Background Color" />
      <ColorField name="headingColor" label="Heading Color" />
    </FieldGroup>
  </ModuleFields>
);

export const meta = {
  label: 'Camo Header Module',
  content_types: ['QUOTE', 'QUOTE_BLUEPRINT'],
};

export const hublDataTemplate = `
  {% set fallbackQuote = { "hs_contract_effective_start_date_type": "ON_AGREEMENT", "hs_created_by_user_id": 62490421, "hs_createdate": 1781660805099, "hs_currency": "USD", "hs_expiration_date": 1789444799999, "hs_lastmodifieddate": 1781660807646, "hs_object_id": 40322997805, "hs_object_source": "QUOTES", "hs_object_source_id": "userId:62490421", "hs_object_source_label": "QUOTES", "hs_object_source_user_id": 62490421, "hs_original_template_path": "@hubspot/cpq-theme/templates/quote.hubl.html", "hs_proposal_domain": "51458497.hs-sites.com", "hs_proposal_slug": "d1744knf2ncsjwxs", "hs_public_url_key": "f5c5cc0e280941af88eee8190d39f93a", "hs_quote_amount": 13195, "hs_quote_amount_in_home_currency": 13195, "hs_quote_number": "20260617-014645157", "hs_quote_owner_id": "62490421", "hs_quote_progression_status": "DRAFT", "hs_quote_status": "DRAFT", "hs_sender_email": "chris.becher@profitpad.com", "hs_sender_firstname": "Chris", "hs_sender_image_url": "https://api-na1.hubapi.com/userpreferences/v1/avatar/c9b976a1910b05e0bc0cfe118e7785a7", "hs_sender_lastname": "Becher", "hs_status": "DRAFT", "hs_store_payment_method_at_checkout": false, "hs_title": "Deal02", "hubspot_owner_id": "62490421" } %}

  {% set companyId = quoteTemplateContext.buyerCompany.hs_object_id %}
  {% if not companyId %}{% set companyId = '55656086066' %}{% endif %}
  {% set quoteCompany = crm_object("company", companyId, "name,address,address_2,city,state,zip") %}
  
  {% set hublData = {
    "quoteQuote": quoteTemplateContext.quote if quoteTemplateContext.quote else fallbackQuote,
    "quoteCompany": quoteCompany if quoteCompany else null,
    "isQuoteBlueprint": isQuoteBlueprint,
    "isInEditor": is_in_editor,
  } %}
`;
