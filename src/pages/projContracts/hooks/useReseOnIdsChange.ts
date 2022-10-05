import { parseISO } from 'date-fns';
import { ComponentProps, useCallback, useEffect, useState } from 'react';
import { calculateEstimate } from '../../../api/others/calculateEstimate';
import { SelectProjEstimates } from '../../../components/ui/selects';
import { getParam } from '../../../helpers/url';
import { useSnackBar } from '../../../hooks';
import { getProjDataById } from '../api/getProjDataById';
import { initialValues, TypeOfForm } from '../form';


/**
 * Wrapper hook to generate contract preview
 * in a declarative way.
 *
 * @returns {object} obj.selectedEstimate 選択された見積のレコード
 * @returns {object} obj.handleChangeEstimate 選択の変更際の関数
 */
export const useReseOnIdsChange = () => {
  const { setSnackState } = useSnackBar();
  const [newInitVals, setNewInitVals] = useState<TypeOfForm>(initialValues);
  const [calculatedEstimate, setCalculatedEstimate] = useState<Awaited<ReturnType<typeof calculateEstimate>>>();
  const [selectedEstimate, setSelectedEstimate] = useState<Estimates.main.SavedData>();

  const projIdFromURL = getParam('projId');
  const projEstimateIdFromURL = getParam('projEstimateId');




  const handleChangeSelectedEstimate : ComponentProps<typeof SelectProjEstimates>['handleChange'] = (
    selected,
    projEstimateId,
    calculated,
  ) => {

    console.log('EstimateChange', projEstimateId);

    if (!projEstimateId) return;



    /* Updated calculated estimates */
    setCalculatedEstimate(calculated);
    setSelectedEstimate(selected);

    const {
      envStatus,
      envDocFileKeys,
      envId,
      $revision,
      支払い: paymentSched,
      hasRefund,
      refundAmt,
      工事名称: projName,
      projId,
      startDate,
      startDaysAfterContract,
      finishDate,
      finishDaysAfterContract,
      payMethod,
      payDestination,
      completeDate,

    } = selected ?? {};

    const newPaymentFields : TypeOfForm['paymentFields'] = paymentSched?.value.length ? paymentSched?.value?.map(({ value: {
      isPayEnabled,
      paymentAmt,
      paymentDate,
    } }) => {
      return {
        checked: Boolean(+isPayEnabled.value ?? 0),
        amount: +(paymentAmt?.value ?? 0),
        payDate: paymentDate?.value ? parseISO(paymentDate.value) : '',
      };
    }) : initialValues.paymentFields ;

    const newRemainingAmt = newPaymentFields
      .reduce((acc, { amount }) => acc - +amount, calculated?.totalAmountInclTax || 0);

    setNewInitVals(prev => ({
      ...prev,
      projId: projId?.value || '',
      projName: projName?.value || '',
      projEstimateRevision: $revision?.value || '',
      projEstimateId: projEstimateId ?? '',
      envelopeId: envId?.value ?? '',
      envelopeStatus: envStatus?.value as TEnvelopeStatus ?? '',
      envDocFileKeys: envDocFileKeys?.value ?? [],
      envSelectedDoc: envDocFileKeys?.value[0]?.fileKey ?? '',
      completeDate: completeDate?.value || '',

      /* 支払い */
      startDate: startDate?.value || '',
      startDaysAfterContract: +(startDaysAfterContract?.value || 0),
      finishDate: finishDate?.value || '',
      finishDaysAfterContract: +(finishDaysAfterContract?.value || 0),
      payDestination: payDestination?.value || '',
      payMethod: (payMethod?.value || '振込') as TypeOfForm['payMethod'],

      paymentFields: newPaymentFields,
      remainingAmt: newRemainingAmt,

      hasRefund: Boolean(+(hasRefund?.value ?? 0)),
      refundAmt: +(refundAmt?.value ?? 0),
    }));

    if (!projEstimateId) setSelectedEstimate(undefined);

  };


  const handleChangeProjId = useCallback((projId: string) => {
    console.log('FIRE!', projId);
    if (!projId) {
      setNewInitVals(initialValues);
      return;
    }

    getProjDataById(projId)
      .then((formData) => {

        setNewInitVals({
          ...initialValues,
          ...formData,
        });

      })
      .catch((err) => {
        setSnackState({
          open: true,
          message: `レコード取得にエラーが発生しました。${err.message}`,
          severity: 'error',
        });
      });

  }, [setSnackState]);


  useEffect(() => {

    setNewInitVals(prev => ({
      ...prev,
      projEstimateId: projEstimateIdFromURL ?? '',
      projId: projIdFromURL ?? '',
    }));

    if (projIdFromURL) {
      handleChangeProjId(projIdFromURL);
    }

  }, [projEstimateIdFromURL, projIdFromURL, handleChangeProjId]);







  return {
    handleChangeSelectedEstimate,
    handleChangeProjId,
    newInitVals,
    calculatedEstimate,
    selectedEstimate,
  };
};