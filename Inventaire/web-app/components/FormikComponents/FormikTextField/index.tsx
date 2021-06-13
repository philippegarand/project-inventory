import {
  BaseTextFieldProps,
  Chip,
  createStyles,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { FormikProps } from 'formik';

const useStyles = makeStyles(() =>
  createStyles({
    quickButtonsArray: {
      display: 'flex',
      gap: 4,
    },
  }),
);

interface IProps extends BaseTextFieldProps {
  id: string;
  formik: FormikProps<object>;
  withQuickButtons?: boolean;
  submitOnEnter?: boolean;
}
export default function FormikTextField(props: IProps) {
  const {
    id,
    formik,
    variant = 'outlined',
    submitOnEnter = false,
    withQuickButtons = false,
    ...otherProps
  } = props;
  const classes = useStyles();

  const quickAdd = (num: number) => {
    formik.setFieldValue(id, formik.values[id] + num);
  };

  return (
    <>
      {withQuickButtons && (
        <>
          <div className={classes.quickButtonsArray}>
            <Chip label="+1" color="primary" onClick={() => quickAdd(1)} />
            <Chip label="+10" color="primary" onClick={() => quickAdd(10)} />
            <Chip label="+100" color="primary" onClick={() => quickAdd(100)} />
            <Chip
              label="+1000"
              color="primary"
              onClick={() => quickAdd(1000)}
            />
          </div>
          <div className={classes.quickButtonsArray}>
            <Chip label="‒1" color="primary" onClick={() => quickAdd(-1)} />
            <Chip label="‒10" color="primary" onClick={() => quickAdd(-10)} />
            <Chip label="‒100" color="primary" onClick={() => quickAdd(-100)} />
            <Chip
              label="‒1000"
              color="primary"
              onClick={() => quickAdd(-1000)}
            />
          </div>
        </>
      )}
      <TextField
        {...otherProps}
        id={id}
        name={id}
        variant={variant}
        onChange={(event, ...args) => formik.handleChange(event, ...args)}
        error={Boolean(formik.errors[id])}
        helperText={formik.errors[id]}
        value={formik.values[id]}
        onKeyPress={(e) => {
          if (submitOnEnter && e.key === 'Enter') {
            formik.handleSubmit();
            e.preventDefault();
          }
        }}
      />
    </>
  );
}
