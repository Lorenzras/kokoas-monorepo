import { Stack } from '@mui/material';
import { RefundFieldGroup } from './RefundFieldGroup';
import { PaymentContainer } from './PaymentContainer';
import { PaymentFields } from './PaymentFields';
import { RemainingAmountInfo } from './RemainingAmountInfo';
import { TotalPaymentAmount } from './TotalPaymentAmount';
import { PaymentMethod } from './PaymentMethod';
import { useFormikContext } from 'formik';
import { TypeOfForm } from '../../form';
import useDeepCompareEffect from 'use-deep-compare-effect';

export const PaymentSchedule = ({
  totalAmount = 0,
}: {
  totalAmount?: number
}) => {

  const { values, setValues, dirty } = useFormikContext<TypeOfForm>();
  const { paymentFields } = values;


  useDeepCompareEffect(() => {

    if (dirty) {
      const newRemainingAmt = paymentFields
        .reduce((acc, { amount }) => acc - +amount, totalAmount);
      setValues((prev) => ({ ...prev, remainingAmt: newRemainingAmt }));
    }


  }, [paymentFields || {}, totalAmount, dirty]);

  return (
    <PaymentContainer>
      <Stack spacing={2}>

        <TotalPaymentAmount totalAmount={totalAmount} />

        <RemainingAmountInfo />

        <PaymentFields />

        <RefundFieldGroup />

        <PaymentMethod />

      </Stack>
    </PaymentContainer>
  );
};