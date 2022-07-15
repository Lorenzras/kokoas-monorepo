import { yumecocoDocusign } from '../../../../../config/settings';
import { TypeOfForm } from '../../form';


/* const getContentType = (fileType: string) => {
  switch (fileType) {
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'pdf' :
      return 'application/pdf+base64';
  }
};
 */
export const downloadContract = async ( {
  form,
  fileType,
} :
{
  form: TypeOfForm,
  fileType: 'pdf' | 'xlsx',
},
) : Promise<{
  data?: string,
  envelopeStatus?: TEnvelopeStatus,
  error?: string,
}> => {

  try {


    const {
      projId,
    } = form;

    if (!projId) throw new Error('Invalid Project Id.');
    const endpoint = `${yumecocoDocusign.baseUrl}/docusign/ukeoi/download?`;
    const data = {
      projId: projId,
      fileType: fileType,
    };

    const u = new URLSearchParams(data).toString();
    const [body, status] =  await kintone.proxy(
      endpoint + u, // concatinate parameters to endpoint
      'GET',
      {},
      data,
    );

    if (status == 200 && body) {
      return JSON.parse(body) ;
    } else {
      throw new Error(`Unhandled response status ${status}`);
    }

  } catch (err :any) {
    return {
      error: err.message,
    };
  }

};