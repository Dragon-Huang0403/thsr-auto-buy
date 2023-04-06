import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import React, {useState} from 'react';

const localStorageKey = {
  termsOfUse: {
    notShowAgain: 'termsOfUse_notShowAgain',
  },
} as const;

function TermsOfUseDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(() =>
    typeof window !== 'undefined' &&
    localStorage.getItem(localStorageKey.termsOfUse.notShowAgain)
      ? false
      : true,
  );
  const [checked, setChecked] = useState({
    termsOfUse: false,
    noShowAgain: false,
  });
  const handleConfirm = () => {
    setIsDialogOpen(false);
    if (checked.noShowAgain) {
      localStorage.setItem(localStorageKey.termsOfUse.notShowAgain, 'true');
    }
  };
  return (
    <Dialog open={isDialogOpen}>
      <DialogTitle>
        <Typography variant="h5" align="center">
          使用條款
        </Typography>
      </DialogTitle>
      <DialogContent>
        <FormControl component="fieldset" variant="standard">
          <FormGroup>
            <FormControlLabel
              label={
                '本網頁僅供練習技術用，請勿真實使用，如有違反高鐵訂票或其他相關規定，使用者自行負責'
              }
              control={
                <Checkbox
                  checked={checked.termsOfUse}
                  onChange={() => {
                    setChecked(prev => ({
                      ...prev,
                      termsOfUse: !prev.termsOfUse,
                    }));
                  }}
                />
              }
            />
            <FormControlLabel
              label={'不再顯示'}
              control={
                <Checkbox
                  checked={checked.noShowAgain}
                  onChange={() => {
                    setChecked(prev => ({
                      ...prev,
                      noShowAgain: !prev.noShowAgain,
                    }));
                  }}
                />
              }
            />
          </FormGroup>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{pb: 2, px: 2}}>
        <Button
          disabled={!checked.termsOfUse}
          onClick={handleConfirm}
          fullWidth
          variant="outlined"
        >
          確認
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TermsOfUseDialog;
