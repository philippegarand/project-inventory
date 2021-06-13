import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import { FormikProps } from 'formik';

interface OptionType {
  inputValue?: string;
  value?: number;
  display?: string;
}

const filter = createFilterOptions<OptionType>();

interface IProps {
  id: string;
  label: string;
  options: {
    value: any;
    display: string;
  }[];
  formik: FormikProps<object>;
  withCreateNew?: boolean;
  onAddNewOption?: (newValue: string) => any;
  variant?: 'outlined' | 'standard' | 'filled';
  disabled?: boolean;
}

export default function FormikAutocomplete(props: IProps) {
  const {
    id,
    label,
    options,
    formik,
    withCreateNew = false,
    onAddNewOption,
    variant = 'outlined',
    disabled = false,
  } = props;

  const [value, setValue] = useState<OptionType | null>(
    formik.values[id] == 0
      ? null
      : options.find((x) => x.value === formik.values[id]),
  );

  return (
    <Autocomplete
      disabled={disabled}
      fullWidth
      value={value}
      onChange={async (event, newValue: OptionType) => {
        if (withCreateNew && newValue && newValue.inputValue) {
          const newValueDisplay =
            newValue.inputValue.charAt(0).toUpperCase() +
            newValue.inputValue.slice(1);
          const res = await onAddNewOption(newValueDisplay);

          if (res === -1) return;

          setValue({
            value: res,
            display: newValueDisplay,
          });
          formik.setFieldValue(id, res);
        } else {
          setValue(newValue);
          formik.setFieldValue(id, Boolean(newValue) ? newValue.value : '');
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        // Suggest the creation of a new value
        if (withCreateNew && params.inputValue !== '') {
          filtered.push({
            inputValue: params.inputValue,
            display: `Add "${params.inputValue}"`,
          });
        }
        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      getOptionSelected={(option: OptionType, value: OptionType) =>
        option.value === value.value
      }
      getOptionLabel={(option) => {
        // Add "xxx" option created dynamically
        if (withCreateNew && option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.display;
      }}
      renderOption={(option) => option.display}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={`Type to search${withCreateNew ? ' or add new' : ''}`}
          variant={variant}
          error={Boolean(formik.errors[id])}
          helperText={formik.errors[id]}
        />
      )}
    />
  );
}
