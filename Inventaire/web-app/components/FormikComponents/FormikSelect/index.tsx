import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from '@material-ui/core';
import { FormikProps } from 'formik';
import React, { useState } from 'react';

interface IProps extends SelectProps {
  id: string;
  label: string;
  options: {
    value: any;
    display: string;
  }[];
  formik: FormikProps<object>;
}
export default function FormikSelect(props: IProps) {
  const { id, label, options, formik, ...otherProps } = props;

  return (
    <FormControl variant="outlined" error={Boolean(formik.errors[id])}>
      <InputLabel>{label}</InputLabel>
      <Select
        {...otherProps}
        displayEmpty
        id={id}
        name={id}
        label={label}
        value={formik.values[id] === 0 ? '' : formik.values[id]}
        onChange={(event) => formik.setFieldValue(id, event.target.value)}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.display}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{formik.errors[id]}</FormHelperText>
    </FormControl>
  );
}
