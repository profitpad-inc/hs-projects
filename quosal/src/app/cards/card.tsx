import {
  CrmContext,
  ExtensionPointApiActions,
  Text,
} from '@hubspot/ui-extensions';
import { hubspot, logger } from '@hubspot/ui-extensions';
import { useCrmProperties } from '@hubspot/ui-extensions/crm';


interface CrmExtensionProps {
  context: CrmContext;
  actions: ExtensionPointApiActions<'crm.record.tab'>;
}

hubspot.extend<'crm.record.tab'>(({ context, actions }: CrmExtensionProps) => (
  <CrmExtension context={context} actions={actions} />
));

const CrmExtension = ({ context, actions }: CrmExtensionProps) => {

  const { properties: deal, isLoading: dealLoading, error: dealError } = useCrmProperties([
    'dealname',
    'region_deal',
    'machine_type',
    'amount',
    'state_province',
    'industry_deal',
    'hs_object_id',
  ]);

  logger.debug(JSON.stringify(deal, null, 2));

  return (
    <>
        <Text>
          Add a layer of UI customization to your app by including app cards
          that can display data.
          {JSON.stringify(deal, null, 2)}
        </Text>
    </>
  );
};
