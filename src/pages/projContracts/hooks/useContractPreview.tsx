import { useFormikContext } from 'formik';
import {  useState } from 'react';
import { useSnackBar } from '../../../hooks';
import { base64ToBlob } from '../../../lib';
import { downloadContract } from '../api/docusign/downloadContract';
import { TypeOfForm } from '../form';
/**
 * Hook for generating preview url.
 * This also wraps some of useFormikContext's props.
 * @return {Object} result
 * @return {string} previewUrl - The URL of the preview.
 * @return {TFormStatus} result.formStatus - wraps Formik's status to a safer type.
 * @return {TypeOfForm} result.values - Formik values as is.
 * @return {boolean} result.previewLoading - whether preview is still loading
 * @return {boolean} result.formLoading - whether form is busy overall.
 */
export const useContractPreview = () => {
  const { values, status, setValues } = useFormikContext<TypeOfForm>();

  const [previewUrl, setPreviewUrl] = useState('');
  const [previewLoading, setPreviewLoading] = useState(true);
  const { setSnackState } = useSnackBar();

  const formStatus: TFormStatus = status;
  const formLoading = formStatus === 'busy' || previewLoading;

  const handlePreview = async (newForm: TypeOfForm) => {
    try {
      setPreviewLoading(true);

      const res = await downloadContract({
        form: newForm,
        fileType: 'pdf',
      });

      if (!res) return;
      if (previewUrl) URL.revokeObjectURL(previewUrl); // free Memory

      const base64 = res;

      if (base64) {
        const blob = base64ToBlob( base64, 'application/pdf' );
        const url = URL.createObjectURL( blob );
        setPreviewUrl(url);
      } else {
        setPreviewUrl('');
      }

    } catch (err) {

      setSnackState({
        open: true,
        severity: 'error',
        message: `プレビューの取得が失敗しました。管理者をご連絡ください。${err.message}`,
      });

    } finally {
      setPreviewLoading(false);
    }

  };


  return {
    handlePreview,
    formStatus,
    previewLoading,
    formLoading,
    previewUrl,
    setValues,
    values,
  };
};