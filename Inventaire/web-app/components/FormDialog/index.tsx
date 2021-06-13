import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
} from '@material-ui/core';
import { FormikProps } from 'formik';
import React from 'react';
import Factory, { IComponent } from '../Factory/index';

/* USAGE EXAMPLE
 *  const fields: IComponent[] = [
 *    {
 *      type: COMPONENT_TYPE.TEXT,
 *      id: 'text',
 *      label: 'Text',
 *    },
 *    {
 *      type: COMPONENT_TYPE.NUMBER,
 *      id: 'number',
 *      label: 'Number',
 *    },
 *    {
 *      type: COMPONENT_TYPE.DATE,
 *      id: 'date',
 *      label: 'Date',
 *    },
 *    {
 *      type: COMPONENT_TYPE.SELECT,
 *      id: 'select',
 *      label: 'Select',
 *      options: [
 *        { display: 'Option 1', value: 1 },
 *        { display: 'Option 2', value: 2 },
 *        { display: 'Option 3', value: 3 },
 *        { display: 'Option 4', value: 4 },
 *      ],
 *    },
 *    {
 *      type: COMPONENT_TYPE.MULTI_SELECT,
 *      id: 'multiselect',
 *      label: 'Multi Select',
 *      options: [
 *        { display: 'Option 1', value: 1 },
 *        { display: 'Option 2', value: 2 },
 *        { display: 'Option 3', value: 3 },
 *        { display: 'Option 4', value: 4 },
 *      ],
 *    },
 *    {
 *      type: COMPONENT_TYPE.CHECKBOX,
 *      id: 'checkbox',
 *      label: 'Checkbox',
 *    },
 *  ];
 */

interface IProps {
  open: boolean;
  title: string;
  fields: IComponent[];
  confirmBtnText: string;
  onConfirm: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClose: Function;
  formik: FormikProps<object>;
  width?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Form Dialog using component factory.
 * See file for usage example
 * @param open state of dialog
 * @param title dialog title
 * @param fields fields of dialog. Must be an array of IComponent[]. Use COMPONENT_TYPE enum for types.
 * @param confirmBtnText text of the confirm button
 * @param onConfirm function to handle dialog confirm click
 * @param onClose function to handle dialog close
 * @param formik formik hook with initial values that fit with fields id
 * @param width optional width of dialog
 */
export default function FormDialog(props: IProps) {
  const {
    open,
    title,
    fields,
    confirmBtnText,
    onConfirm,
    onClose,
    formik,
    width,
  } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={width}
        fullWidth={Boolean(width)}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          {fields.map((field: IComponent, index) => (
            <Factory key={index} component={field} formik={formik} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="primary">
            {confirmBtnText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
