import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateParams } from '../../../../helpers/url';
import { pages } from '../../../Router';
import { ListEstimate } from './ListEstimate';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export interface ConfirmationDialogRawProps {
  name: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
  options: Estimates.main.SavedData[]
}


export const ConfirmationDialogRaw = (props: ConfirmationDialogRawProps) => {
  const { name, onClose, value: valueProp, open, options, ...other } = props;
  const [value, setValue] = useState(valueProp);
  const radioGroupRef = useRef<HTMLElement>(null);
  
  const navigate = useNavigate();

  

  useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    navigate(`${pages.projEstimate}?${generateParams({ projEstimateId:value })}`);
    onClose(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  /**
   * 選択肢の生成
   */
  const actualOptions: OptionNode[] = options.map<OptionNode>((rec) => {
    const { $id } = rec;

    return {
      value: $id.value,
      key: $id.value,
      component: (<ListEstimate estimateRecord={rec} />),
    };
  });



  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>
        {'編集する見積もりを選択してください'}
      </DialogTitle>
      <DialogContent dividers>
        {Boolean(actualOptions.length) &&
          <RadioGroup
            name={name}
            ref={radioGroupRef}
            aria-label={name}
            value={value}
            onChange={handleChange}
          >
            {actualOptions?.map((option) => {
              return (
                <FormControlLabel
                  key={option.key}
                  value={option.value}
                  control={<Radio />}
                  label={option.component}
                />
              );
            })}

          </RadioGroup>}
          
          
        {!(actualOptions.length) &&
          <Stack direction={'row'} spacing={1}>
            <WarningAmberIcon /> 
            <Typography variant='body2'>
              見積もりはまだ作成されていません
            </Typography>
          </Stack>}

      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};