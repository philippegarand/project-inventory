import classes from '*.module.css';
import {
  FormControlLabel,
  Checkbox,
  FormControl,
  FormHelperText,
  CheckboxProps,
} from '@material-ui/core';
import { FormikProps } from 'formik';
import React from 'react';

interface IProps extends CheckboxProps {
  id: string;
  label: string;
  formik: FormikProps<object>;
}
export default function FormikCheckbox(props: IProps) {
  const { id, label, formik, ...otherProps } = props;
  return (
    <FormControl error={Boolean(formik.errors[id])}>
      <FormControlLabel
        control={
          <Checkbox
            {...otherProps}
            id={id}
            name={id}
            checked={formik.values[id]}
            onChange={(event) => formik.setFieldValue(id, event.target.checked)}
            color="primary"
          />
        }
        label={label}
      />
      <FormHelperText>{formik.errors[id]}</FormHelperText>
    </FormControl>
  );
}
