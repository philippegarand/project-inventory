import React, { useEffect, useState } from 'react';
import { Card, Typography } from '@material-ui/core';
import dynamic from 'next/dynamic';
import { getSession } from 'next-auth/client';
import { NextPageContext } from 'next';
import { ACCOUNT_TYPE_ID } from '../Utils/enums';
import { IsUserAllowedOnPage } from '../Utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_TYPE, IStoreState, SEVERITY_TYPE } from '../Utils/store';
import { COMPONENT_TYPE, IComponent } from '../components/Factory';
import { EditProductQuantity, GetProductDetails } from '../api/private/product';
import { Product } from '../types/product';
import { FormDialog } from '../components';
import { FormikErrors, useFormik } from 'formik';
import { MinimalWarehouse } from '../types/warehouse';

import styles from '../styles/Scanner.module.css';

// react-qr-reader package cause warning that we can't fix...
// see https://github.com/JodusNodus/react-qr-reader/issues/138
const QrReader = dynamic(() => import('react-qr-reader'), {
  ssr: false,
});

// Check if user is authenticated, else redirect to login
interface ICtx extends NextPageContext {}
export async function getServerSideProps(ctx: ICtx) {
  const session = await getSession(ctx);
  return (
    IsUserAllowedOnPage(session, ACCOUNT_TYPE_ID.EMPLOYEE) || {
      props: {
        warehouses: session.user.warehouses,
      },
    }
  );
}

interface FormValues {
  id: string;
  name: string;
  category: string;
  description: string;
  weight: number;
  quantity: number;
  warehouse: number;
}
export default function Scan(props: { warehouses: MinimalWarehouse[] }) {
  const { warehouses } = props;
  const dispatch = useDispatch();
  const selectedWarehouse = useSelector(
    (state: IStoreState) => state.selectedWarehouse,
  );

  const [scanResult, setScanResult] = useState<string>('');
  const [productDetails, setProductDetails] = useState<Product>(null);
  const [openDetails, setOpenDetails] = useState<boolean>(false);

  const fields: IComponent[] = [
    {
      type: COMPONENT_TYPE.TEXT,
      id: 'id',
      label: 'ID',
      disabled: true,
      variant: 'standard',
    },
    {
      type: COMPONENT_TYPE.TEXT,
      id: 'name',
      label: 'Name',
      disabled: true,
      variant: 'standard',
    },
    {
      type: COMPONENT_TYPE.TEXT,
      id: 'category',
      label: 'Category',
      disabled: true,
      variant: 'standard',
    },
    {
      type: COMPONENT_TYPE.TEXT,
      id: 'description',
      label: 'Description',
      disabled: true,
      variant: 'standard',
    },
    {
      type: COMPONENT_TYPE.NUMBER,
      id: 'weight',
      label: 'Weight',
      disabled: true,
      variant: 'standard',
    },
    {
      type: COMPONENT_TYPE.NUMBER,
      id: 'quantity',
      label: 'Edit Quantity',
      variant: 'standard',
      withQuickButtons: true,
    },
    {
      type: COMPONENT_TYPE.SELECT,
      id: 'warehouse',
      label: 'In Warehouse',
      options: warehouses?.map((w) => ({ display: w.name, value: w.id })),
      variant: 'standard',
    },
  ];

  useEffect(() => {
    const GetProduct = async () => {
      const res = await GetProductDetails(scanResult);

      if (!res.success) {
        dispatch({
          type: ACTION_TYPE.SNACKBAR,
          message: 'Product could not be found...',
          severity: SEVERITY_TYPE.ERROR,
        });
        // wait a bit to avoid spam
        await new Promise((res) => setTimeout(res, 5000));
        setScanResult('');
        return;
      }

      setProductDetails(res.data);
    };

    if (scanResult && scanResult.length) {
      GetProduct();
    }
  }, [scanResult]);

  useEffect(() => {
    if (!productDetails) return;

    // When got product from api, open form
    formik.setFieldValue('id', productDetails.productID);
    formik.setFieldValue('name', productDetails.name);
    formik.setFieldValue('category', productDetails.category.name);
    formik.setFieldValue('description', productDetails.description);
    formik.setFieldValue('weight', productDetails.weight);
    formik.setFieldValue('warehouse', selectedWarehouse);

    setOpenDetails(true);
  }, [productDetails]);

  const handleErrorWebCam = (error: any) => {
    console.log(error);
  };

  const handleScanWebCam = (result: string) => {
    if (!result) return;
    setScanResult(result);
  };

  const validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.quantity) errors.quantity = "Can't be empty!";
    else if (!Number.isInteger(values.quantity))
      errors.quantity = 'Must be an integer!';
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      category: '',
      description: '',
      weight: 0,
      quantity: 0,
      warehouse: 0,
    },
    validate,
    validateOnChange: false,
    onSubmit: async (values: FormValues) => {
      const { id, warehouse, quantity } = values;
      const res = await EditProductQuantity(id, warehouse, quantity);

      if (!res.success) {
        dispatch({
          type: ACTION_TYPE.SNACKBAR,
          message: res.message,
          severity: SEVERITY_TYPE.ERROR,
        });
        return;
      }

      dispatch({
        type: ACTION_TYPE.SNACKBAR,
        message: `Product quantity ${quantity > 0 ? 'added' : 'removed'}!`,
        severity: SEVERITY_TYPE.SUCCESS,
      });

      handleClose();
    },
  });

  const handleQuantityEdit = () => {
    formik.handleSubmit();
  };

  const handleClose = () => {
    setScanResult('');
    setOpenDetails(false);
    formik.setFieldValue('quantity', 0);
  };

  return (
    <Card className={styles.container}>
      <Typography className={styles.message}>
        Show product QR Code to the camera
      </Typography>
      {!openDetails && (
        <QrReader
          className={styles.reader}
          onError={handleErrorWebCam}
          onScan={handleScanWebCam}
        />
      )}
      <FormDialog
        open={openDetails}
        title="Product Details"
        fields={fields}
        confirmBtnText="Submit"
        onConfirm={handleQuantityEdit}
        onClose={handleClose}
        formik={formik}
        width="xs"
      />
    </Card>
  );
}
