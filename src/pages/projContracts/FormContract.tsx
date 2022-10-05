import { Form } from 'formik';
import { MainContainer } from '../../components/ui/containers';
import { PageSubTitle, PageTitle } from '../../components/ui/labels';
import { ContractPageShortcuts } from './parts/ContractPageShortcuts';
import { getFieldName } from './form';
import {  Grid } from '@mui/material';
import { SearchProjField } from './parts/SearchProjField';
import { ContractInfo } from './parts/contractInfo/ContractInfo';
import { EmptyBox } from '../../components/ui/information/EmptyBox';
import {
  useUpdateProjId,
} from './hooks';

import { SelectProjEstimates } from '../../components/ui/selects';
import { PaymentSchedule } from './parts/paymentSchedule/PaymentSchedule';
import { GridNextDivider } from './parts/GridNextDivider';
import { ScrollToFieldError } from '../../components/utils/ScrollToFieldError';
import { ComponentProps } from 'react';
import { calculateEstimate } from '../../api/others/calculateEstimate';

export const FormContract = ({
  handleChangeSelectedEstimate,
  calculatedEstimate,
}: {
  handleChangeSelectedEstimate: ComponentProps<typeof SelectProjEstimates>['handleChange'],
  calculatedEstimate?: Awaited<ReturnType<typeof calculateEstimate>>
}) => {

  const {
    values,
  } = useUpdateProjId();

  const { projEstimateId, projId, projName } = values;

  const { totalAmountInclTax } = calculatedEstimate ?? {};

  /* 本当に小数点切り捨ていいか、要確認 */
  const roundedTotalAmt = Math.round(totalAmountInclTax ?? 0);

  return (
    <Form noValidate>
      <ScrollToFieldError />
      <MainContainer justifyContent={'space-between'}>
        <PageTitle label='契約' />


        <Grid item xs={12} md={4} >
          <SearchProjField
            label="工事情報の検索"
            name={getFieldName('projId')}
            projName={projName}
          />
        </Grid>

        {/* 見積もり選択フィールド */}
        <Grid item xs={12}
          md={8}
          lg={6}
        >
          <SelectProjEstimates
            projId={projId}
            projEstimateId={projEstimateId}
            handleChange={handleChangeSelectedEstimate}
          />

        </Grid>

        {/* 契約内容 */}
        <ContractInfo />

        <GridNextDivider isShow={!!projEstimateId} />

        {/* 支払い予定入力 */}
        {!!projEstimateId && (
          <>
            <PageSubTitle label='支払い予定' />
            <PaymentSchedule totalAmount={roundedTotalAmt} />
          </>
        )}



        {/* 契約のプレビュー */}
        {/*         {!!projEstimateId && previewUrl &&
        <Preview
          previewUrl={previewUrl}
          previewLoading={previewLoading}
        />} */}

        {!projEstimateId &&
          <Grid item xs={12}>
            <EmptyBox>
              見積を選択してください。
            </EmptyBox>
          </Grid>}

      </MainContainer>

      {!!projId &&  <ContractPageShortcuts />}


    </Form>
  );
};