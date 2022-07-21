import { Formik } from 'formik';
import {  CustomerForm, initialValues, validationSchema } from './form';
import { FormIndividualCustomer } from './FormIndividualCustomer';
import { useState, useEffect, useRef  } from 'react';
import { saveFormData } from './api/saveFormData';

import { useNavigate  } from 'react-router-dom';
import { getFormDataById } from './api/getFormDataById';
import { MemoContextProvider } from './parts/Memo/memoForm/MemoContext';
import { FormikMemo } from './parts/Memo/memoForm/FormikMemo';
//import { ConfirmDialog } from '../../../components/ui/dialogs/ConfirmDialog';
import { pages } from '../../Router';
import { useConfirmDialog, useQuery, useSnackBar } from  './../../../hooks';



export const FormikIndividualCustomer = () => {
  const { setDialogState } = useConfirmDialog();
  const [initialState, setInitialState] = useState<CustomerForm>(initialValues);
  const { setSnackState } = useSnackBar();
  const savedCustGroupId = useRef<string>();

  const recordId = useQuery().get('groupId') ?? undefined;
  const navigate = useNavigate();


  const handleNavigate = () => {
    setDialogState({
      title: '次へ進む',
      content: '工事情報を登録しますか。',
      handleYes: ()=>navigate(`${pages.projReg}?groupId=${savedCustGroupId.current}`),
    });

  };

  useEffect(()=>{

    if (!recordId) return;
    /* If edit mode */
    getFormDataById(recordId)
      .then(resp => {
        setInitialState(resp);
      });

  }, [recordId]);



  return (
    <MemoContextProvider>
      <Formik

        validateOnChange={true}
        validateOnMount
        initialValues={initialState}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log('entered');
          saveFormData({ ...values, id: recordId })
            .then((resp)=>{
              savedCustGroupId.current = resp.id;
              setSnackState({ open: true,
                message: '保存出来ました。',
                severity: 'success',
              });
              setTimeout(handleNavigate, 500);

            })
            .catch(err => {
              setSnackState({ open: true, message: 'エラーが発生しました。このエラーの再現について、管理者を連絡してください。' + err });
            })
            .finally(()=>{
              setSubmitting(false);
            });


        }}
      >

        <FormIndividualCustomer  />

      </Formik>
      <FormikMemo  />
    </MemoContextProvider>
  );
};