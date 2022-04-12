import { Button, Grid } from '@mui/material';
import { PageSubTitle } from '../../../../../components/ui/labels';
import {  FormikTextField } from '../../../../../components/ui/textfield';
import { SelectGender } from './SelectGender';
import { SelectBirtdate } from './SelectBirtdate';
import { FieldArray, ArrayHelpers, useFormikContext } from 'formik';
import { CustomerForm, CustomerFormKeys, CustomerInstanceKeys, initialCustomerValue } from '../../form';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Address } from './Address';


interface CustomerProps extends ArrayHelpers{
  customers: CustomerForm['customers']
  namePrefix: string,
  index: number,
}

const Customer =  <T extends CustomerInstanceKeys>(props: CustomerProps) => {
  const {
    namePrefix,
    index,
    push,
    remove,
    customers: { length },
  } = props;
  const maxCust = 3;
  const isLastCustomer = index === length - 1;
  const isMaxCust = maxCust === length;
  const isFirstCustomer = !index;


  return (
    <>
      <PageSubTitle label={`契約者${index + 1}`} xs={isFirstCustomer ? 12 : 8}/>
      {
        !isFirstCustomer &&
        <Grid container justifyContent={'flex-end'} item xs={4}>
          <Button variant="outlined" color="error" onClick={()=>remove(index)} startIcon={<PersonRemoveIcon />} fullWidth>
            削除
          </Button>
        </Grid>
      }


      <Grid item xs={12}>
        <FormikTextField name={`${namePrefix}${'custName' as T}`} label="氏名" placeholder='山田　太郎' />
      </Grid>
      <Grid item xs={12}>
        <FormikTextField name={`${namePrefix}${'custNameReading' as T}`} label="氏名フリガナ" placeholder='ヤマダ　タロウ' />
      </Grid>
      <SelectGender namePrefix={namePrefix}/>
      <SelectBirtdate namePrefix={namePrefix}/>
      <Address namePrefix={namePrefix} index={index}/>

      {
        isLastCustomer && !isMaxCust &&
        <Grid item xs={12}>
          <Button variant="outlined" color="success" startIcon={<PersonAddIcon />} onClick={() => push(initialCustomerValue)} fullWidth>
            契約者を追加する
          </Button>
        </Grid>
      }

    </>
  );
};

export const Customers = () => {
  const { values: { customers } } = useFormikContext<CustomerForm>();
  const arrayFieldName: CustomerFormKeys = 'customers';

  return (
    <Grid container item xs={6} spacing={2} justifyContent="space-between">
      <FieldArray
      name={arrayFieldName}
      render={(arrHelpers) => (
        <>
          {
            customers.map((_, index) => {
              const namePrefix = `${arrayFieldName}[${index}].`;
              return (
                <Customer key={index} index={index} namePrefix={namePrefix} {...arrHelpers} {...{ customers }}/>
              );
            })
          }
        </>
      )}
    />
    </Grid>
  );
};