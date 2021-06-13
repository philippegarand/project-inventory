import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { ACTION_TYPE, IStoreState } from '../../Utils/store';

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SnackBar() {
  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    snackbarDuration,
  } = useSelector((state: IStoreState) => state.snackbar);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(snackbarOpen);
  }, [snackbarOpen]);

  const handleClose = () => {
    setOpen(false);
    dispatch({
      type: ACTION_TYPE.SNACKBAR_RESET,
    });
  };

  // TODO: not the best for performance (workaround)
  return open ? (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={snackbarDuration || 4000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={snackbarSeverity}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
  ) : (
    <></>
  );
}
