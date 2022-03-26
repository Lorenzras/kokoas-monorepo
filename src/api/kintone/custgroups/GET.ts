import { APP_ID } from './config';
import { KintoneRecord } from './../config';

import { OneOf } from '@kintone/rest-api-client/lib/KintoneFields/types/field';

interface Result {
  record: Record<keyof CustomerGroupTypes.SavedData,  OneOf>
}

export const getCustGroup = (id: string) : Promise<Result> => {

  return KintoneRecord.getRecord({ app: APP_ID, id });

};

export const searchCustGroup = (searchStr: string) => {
  console.log(searchStr, 'searchString');
  return KintoneRecord.getRecords({
    app: APP_ID,
    query: `${'customerName'} like "${searchStr}"`,
  });
};