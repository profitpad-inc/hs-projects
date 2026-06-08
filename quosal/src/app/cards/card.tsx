import {
  Text,
  TextArea,
} from '@hubspot/ui-extensions';
import { hubspot, logger } from '@hubspot/ui-extensions';
import { useCrmProperties } from '@hubspot/ui-extensions/crm';


hubspot.extend<'crm.record.tab'>(() => (
  <QuosalCard />
));

const QuosalCard = () => {

  const { properties: deal, isLoading: dealLoading, error: dealError } = useCrmProperties([
    'dealname',
    'region_deal',
    'machine_type',
    'amount',
    'state_province',
    'industry_deal',
    'hs_object_id',
  ]);

  // logger.debug(JSON.stringify(deal, null, 2));

  return (
    <>
      <Text>
        Add a layer of UI customization to your app by including app cards
        that can display data.
      </Text>
      <TextArea
          label="Deal"
          name="deal"
          value={JSON.stringify(deal, null, 2)}
          resize="vertical"
          rows={8}
        />
    </>
  );
};
