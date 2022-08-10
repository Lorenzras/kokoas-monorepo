import { APPIDS, KintoneRecord } from '../../../api/kintone';

export const getProjEstimates = async (projId: string) => {
  if (!projId) throw new Error('Invalid project id.');

  const result = await KintoneRecord.getRecords({
    app: APPIDS.projectEstimate,
    query: `${((k: KeyOfProjEstimates)=>k)('projId')} = "${projId}"`,
  });

  return result.records as unknown as ProjectEstimates.SavedData[];
};