import {
  Chip,
  createStyles,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  makeStyles,
  MenuItem,
  OutlinedInput,
  Select,
  SelectProps,
} from '@material-ui/core';
import { FormikProps } from 'formik';
import React from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
  }),
);

interface IProps extends SelectProps {
  id: string;
  label: string;
  options: {
    value: any;
    display: string;
  }[];
  formik: FormikProps<object>;
}
export default function FormikMultiSelect(props: IProps) {
  const classes = useStyles();
  const { id, label, options, formik, ...otherProps } = props;
  return (
    <FormControl variant="outlined" error={Boolean(formik.errors[id])}>
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        {...otherProps}
        multiple
        id={id}
        name={id}
        label={label}
        labelId={`${label}-label`}
        value={formik.values[id]}
        onChange={(event) => formik.setFieldValue(id, event.target.value)}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {(selected as number[]).map((value) => (
              <Chip
                key={value}
                label={options.find((o) => o.value === value).display}
                className={classes.chip}
              />
            ))}
          </div>
        )}
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
