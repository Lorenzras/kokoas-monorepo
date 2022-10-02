import { Form } from 'formik';
import { MainContainer } from '../../components/ui/containers';
import { PageSubTitle, PageTitle } from '../../components/ui/labels';
import { ContractPageShortcuts } from './parts/ContractPageShortcuts';
import { getFieldName } from './form';
import {  Grid, LinearProgress } from '@mui/material';
import { SearchProjField } from './parts/SearchProjField';
import { ContractInfo } from './parts/contractInfo/ContractInfo';
import { EmptyBox } from '../../components/ui/information/EmptyBox';
import { Preview } from './parts/Preview/Preview';
import {
  useUpdateProjId,
  useResolveParams,
  useEstimateChangeHandler,
} from './hooks/';

import { SelectProjEstimates } from '../../components/ui/selects';
import { PaymentSchedule } from './parts/paymentSchedule/PaymentSchedule';
import { GridNextDivider } from './parts/GridNextDivider';

export const FormContractPreview = () => {

  useResolveParams();

  const {
    formStatus,
    values,
  } = useUpdateProjId();

  const { projEstimateId, projId, projName } = values;

  const {
    previewUrl,
    previewLoading,
    calculatedEstimate,
    handleChangeEstimate,
  } = useEstimateChangeHandler();

  const { totalAmountInclTax } = calculatedEstimate ?? {};

  console.log(values);

  return (
    <Form noValidate>
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
            disabled={previewLoading}
            handleChange={handleChangeEstimate}
          />

        </Grid>

        {/* 契約内容 */}
        <ContractInfo />

        <GridNextDivider isShow={!!projEstimateId} />

        {/* 支払い予定入力 */}
        {!!projEstimateId && (
          <>
            <PageSubTitle label='支払い予定' />
            <PaymentSchedule totalAmount={totalAmountInclTax} />
          </>
        )}



        {/* 契約のプレビュー */}
        {!!projEstimateId && previewUrl &&
        <Preview
          previewUrl={previewUrl}
          previewLoading={previewLoading}
        />}

        {!projEstimateId &&
          <Grid item xs={12}>
            <EmptyBox>
              見積を選択してください。
            </EmptyBox>
          </Grid>}



        {(formStatus) === 'busy' && <Grid item xs={12}>
          <LinearProgress />
          </Grid>}

      </MainContainer>

      {!!projId &&  <ContractPageShortcuts />}


    </Form>
  );
};