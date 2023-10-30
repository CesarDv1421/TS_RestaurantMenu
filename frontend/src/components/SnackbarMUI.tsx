import { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

//Material UI
import { Slide } from '@mui/material';

interface SnackbarTypes {
  type?: string;
  styles?: string;
  message: string;
}

interface Props {
  message: SnackbarTypes | undefined; // Cambia el tipo esperado a Snackbar | undefined
  setMessage: React.Dispatch<React.SetStateAction<SnackbarTypes | undefined>>; // Cambia el tipo de setMessage
  style: 'success' | 'warning' | 'error' | 'info';
}

const SnackbarMUI: React.FC<Props> = ({ message, setMessage, style }) => {
  const [showMessage, setShowMessage] = useState(true);

  return (
    <Snackbar
      open={showMessage}
      TransitionComponent={Slide}
      autoHideDuration={2000}
      anchorOrigin={{
        vertical: 'bottom', // Posición vertical: 'top', 'bottom'
        horizontal: 'center', // Posición horizontal: 'left', 'center', 'right'
      }}
      onClose={() => {
        setShowMessage(false);
        setTimeout(() => {
          setMessage({ type: '', styles: '', message: '' });
        }, 150);
      }}
    >
      <Alert severity={style} variant='filled'>
        {message?.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarMUI;
