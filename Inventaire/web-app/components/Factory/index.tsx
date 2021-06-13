import { FormikProps } from 'formik';
import React from 'react';
import {
  FormikAutoComplete,
  FormikMultiSelect,
  FormikSelect,
  FormikTextField,
} from '..';
import { IApiRes } from '../../api/types';
import FormikCheckbox from '../FormikComponents/FormikCheckbox';

export enum COMPONENT_TYPE {
  AUTOCOMPLETE = 'autocomplete',
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  SELECT = 'select',
  MULTI_SELECT = 'multi select',
  CHECKBOX = 'checkbox',
}

interface IBaseComponent {
  label: string;
  id: string;
  type: COMPONENT_TYPE;
  disabled?: boolean;
}
interface ITextFieldBased extends IBaseComponent {
  type:
    | COMPONENT_TYPE.TEXT
    | COMPONENT_TYPE.AUTOCOMPLETE
    | COMPONENT_TYPE.NUMBER
    | COMPONENT_TYPE.DATE
    | COMPONENT_TYPE.MULTI_SELECT
    | COMPONENT_TYPE.SELECT;
  variant?: 'standard' | 'outlined' | 'filled';
}
interface INumber extends ITextFieldBased {
  type: COMPONENT_TYPE.NUMBER;
  withQuickButtons?: boolean;
}
interface IAutoComplete extends ITextFieldBased {
  type: COMPONENT_TYPE.AUTOCOMPLETE;
  withCreateNew?: boolean;
  onAddNewOption?: (newValue: string) => any;
}
interface IText extends ITextFieldBased {
  type: COMPONENT_TYPE.TEXT;
  isPassword?: boolean;
}
interface ISelect extends ITextFieldBased {
  type: COMPONENT_TYPE.SELECT | COMPONENT_TYPE.MULTI_SELECT;
  options: {
    value: any;
    display: string;
  }[];
}

export type IComponent =
  | ISelect
  | INumber
  | IAutoComplete
  | IText
  | ITextFieldBased
  | IBaseComponent;
export default function Factory(props: {
  component: IComponent;
  formik: FormikProps<object>;
}) {
  const component = props.component;
  const formik = props.formik;

  switch (component.type) {
    case COMPONENT_TYPE.TEXT:
      return (
        <FormikTextField
          id={component.id}
          formik={formik}
          type={(component as IText).isPassword ? 'password' : 'Text'}
          label={component.label}
          disabled={component.disabled}
          variant={(component as ITextFieldBased).variant}
        />
      );
    case COMPONENT_TYPE.NUMBER:
      return (
        <FormikTextField
          id={component.id}
          formik={formik}
          type="number"
          label={component.label}
          InputLabelProps={{
            shrink: true,
          }}
          disabled={component.disabled}
          variant={(component as ITextFieldBased).variant}
          withQuickButtons={(component as INumber).withQuickButtons}
        />
      );
    case COMPONENT_TYPE.DATE:
      return (
        <FormikTextField
          id={component.id}
          formik={formik}
          type="date"
          label={component.label}
          InputLabelProps={{
            shrink: true,
          }}
          disabled={component.disabled}
          variant={(component as ITextFieldBased).variant}
        />
      );
    case COMPONENT_TYPE.SELECT:
      return (
        <FormikSelect
          id={component.id}
          label={component.label}
          options={(component as ISelect).options}
          formik={formik}
          disabled={component.disabled}
          variant={(component as ITextFieldBased).variant}
        />
      );
    case COMPONENT_TYPE.AUTOCOMPLETE:
      return (
        <FormikAutoComplete
          id={component.id}
          label={component.label}
          options={(component as ISelect).options}
          formik={formik}
          withCreateNew={(component as IAutoComplete).withCreateNew}
          onAddNewOption={(component as IAutoComplete).onAddNewOption}
          disabled={component.disabled}
          variant={(component as ITextFieldBased).variant}
        />
      );
    case COMPONENT_TYPE.MULTI_SELECT:
      return (
        <FormikMultiSelect
          id={component.id}
          label={component.label}
          options={(component as ISelect).options}
          formik={formik}
          disabled={component.disabled}
          variant={(component as ITextFieldBased).variant}
        />
      );
    case COMPONENT_TYPE.CHECKBOX:
      return (
        <FormikCheckbox
          id={component.id}
          label={component.label}
          formik={formik}
          disabled={component.disabled}
        />
      );
    default:
      return <div>Invalid component type</div>;
  }
}
