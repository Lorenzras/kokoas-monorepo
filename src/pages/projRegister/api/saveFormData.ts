import { TypeOfProjForm } from '../../../pages/projRegister/form';
import { APPIDS, KintoneRecord } from '../../../api/kintone/config';
import { saveProjectToCustGroup } from './saveProjectToCustGroup';
import { getCustGroupById } from './getCustGroupById';


export const convertToKintone = (
  rawValues: TypeOfProjForm,
  custGroupRecord: TypeOfCustomerGroup,
): Partial<ConstructionDetails.SavedData>  => {
  const {
    cocoConst1, cocoConst2, constructionTypeId, constructionName,
    isAgentConfirmed, postal, address1, address2, addressKari, isChkAddressKari,
    buildingType, custGroupId, status,
    cancelStatus,
  } = rawValues;

  const {
    members,
    agents: custGroupAgents,
  } = custGroupRecord;

  console.log(rawValues, 'rawValues');


  return {
    ...(custGroupId ? { custGroupId: { value: custGroupId } } : undefined),

    constructionTypeId: { value: constructionTypeId },
    constructionName: { value: constructionName },
    isAgentConfirmed: { value: (+isAgentConfirmed).toString() },
    postal: { value: postal },
    address1: { value: address1 },
    address2: { value: address2 },
    addressKari: { value: addressKari },
    isChkAddressKari: { value: (+isChkAddressKari).toString() },
    buildingType: { value: buildingType },
    agents: {
      type: 'SUBTABLE',
      value: [cocoConst1, cocoConst2]
        .filter(Boolean)
        .map(item => {
          return {
            id: '',
            value: {
              agentType: { value: 'cocoConst' as AgentType },
              employeeId: { value: item as string },
              employeeName: { value: '' },
            },
          };
        }).concat(custGroupAgents.value.map(cga => {
          const { employeeId, agentType } = cga.value;
          return {
            id: '',
            value: {
              agentType: { value: agentType.value as AgentType },
              employeeId: { value: employeeId.value },
              employeeName: { value: 'auto' },
            },
          };

        }) ),
    },

    custGroup: {
      type: 'SUBTABLE',
      value: members.value.map(m => {
        const { customerId } = m.value;
        return {
          id: '',
          value: {
            custId: customerId,
            custName: { value: 'auto' },
            custNameReading: { value: 'auto' },
          },
        };
      }),
    },
    status: {  value: status  },
    cancelStatus: { value: cancelStatus.join(',') },
  };

};


/**
 * Upserts records
 *
 * @param rawValues
 * @returns
 */
export const saveConstructionData = async (
  rawValues: TypeOfProjForm,
) : Promise<{
  id: string,
  revision: string,
}> => {
  try {


    const { recordId, custGroupId } = rawValues;
    // Also retrieve and save latest custGroup Record to ProjDetails Record.
    const custGroupRecord = await getCustGroupById(custGroupId);
    const record = convertToKintone(rawValues, custGroupRecord);


    if (recordId) {
    /* Update */
      return await KintoneRecord.updateRecord({
        app: APPIDS.constructionDetails,
        id: recordId as string,
        record,
      })
        .then((result) => ({
          id: recordId.toString(),
          revision: result.revision,
        }));
    } else {
    /* New Record */
      return await KintoneRecord.addRecord({
        app: APPIDS.constructionDetails,
        record,
      });
    }
  } catch (err) {
    throw new Error(err.message);
  }
};


export const saveFormData = async (rawValues: TypeOfProjForm) : Promise<{
  id: string,
  revision: string,
}> =>{

  return saveConstructionData(rawValues)
    .then(async resp => {

      await saveProjectToCustGroup(
        resp.id,
        rawValues.custGroupId!,
        [rawValues.cocoConst1, rawValues.cocoConst2],
      );

      return resp;
    }).catch((err) => {
      throw new Error('Error occured, contact administrator' + err);
    });

};