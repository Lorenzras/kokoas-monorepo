
import {  Grid, TextField } from '@mui/material';
import PageSubTitle from '../../../../../components/ui/labels/PageSubTitle';
//　import BasicSelect from '../../../../../components/ui/selects/BasicSelect';
import ConstructionAgent from './ConstructionAgent';
import LabeledCheckBox from '../../../../../components/ui/checkboxes/LabeledCheckBox';
import { useEffect, useState } from 'react';
import { APPIDS, KintoneRecord } from '../../../../../api/kintone';
import { FormikSelect } from '../../../../../components/ui/selects';



const ConstructionInfo = () => {
  const [constructionTypeOptions, setConstructionTypeOptions] = useState<Options>();

  useEffect(()=>{
    KintoneRecord.getRecords({
      app: APPIDS.constructionType,
    }).then((res) => {
      const rawConstOpts = res.records as unknown as ConstructionTypes.SavedData[];
      setConstructionTypeOptions(
        rawConstOpts
          .map(({ label, $id })=> ({ label: label.value, value: $id.value })),
      );
    });
  }, []);

  return (
    <>
      <PageSubTitle label='工事情報' />
      <Grid container item xs={12} md={6} spacing={2}>
        <Grid item xs={12} md={8} >
          {/* <BasicSelect name='constType' label='工事種別' options={constructionTypeOptions} /> */}
          <FormikSelect name='constType' label={'工事種別'} options={constructionTypeOptions}  />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="工事名称" placeholder='氏名/会社名様邸　工事種別' />
        </Grid>
      </Grid>

      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12} md={4}>
          <ConstructionAgent/>
        </Grid>

        <Grid item xs={12} md={4}>
          <ConstructionAgent number={2}/>
        </Grid>

        <Grid item xs={12} md={4}>
          <LabeledCheckBox label="工事担当者を確定する" helperText='※工事担当者が未定の場合はチェックしないでください。'/>
        </Grid>

      </Grid>


    </>
  );

};

export default ConstructionInfo;