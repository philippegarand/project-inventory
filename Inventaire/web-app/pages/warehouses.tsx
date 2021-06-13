import { Button, Card, Typography, Fab } from '@material-ui/core';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/client';
import { Warehouse } from '../types/warehouse';
import { ACCOUNT_TYPE_ID } from '../Utils/enums';
import { IsUserAllowedOnPage } from '../Utils/functions';
import { FormDialog, Icon } from '../components';
import useMediaQuery from '../Utils/CustomHooks/mediaQuery';
import { AddWarehouse, GetWarehouses } from '../api/private/warehouses';
import { useState } from 'react';
import { COMPONENT_TYPE, IComponent } from '../components/Factory/index';
import { FormikErrors, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { ACTION_TYPE, SEVERITY_TYPE } from '../Utils/store';

import styles from '../styles/Warehouses.module.css';

interface ICtx extends NextPageContext {}
export async function getServerSideProps(ctx: ICtx) {
  const session = await getSession(ctx);

  const redirectObj = IsUserAllowedOnPage(session, ACCOUNT_TYPE_ID.EMPLOYEE);
  if (redirectObj) return redirectObj;

  const res = await GetWarehouses(ctx);
  return res.success
    ? {
        props: {
          userRole: session.user.role,
          warehouses: res.data,
        },
      }
    : {
        props: {
          userRole: session.user.role,
          warehouses: [],
          error: 'Could not fetch warehouses, try again later...',
        },
      };
}

const addFields: IComponent[] = [
  {
    type: COMPONENT_TYPE.TEXT,
    id: 'name',
    label: 'Name',
  },
  {
    type: COMPONENT_TYPE.TEXT,
    id: 'address',
    label: 'Address',
  },
  {
    type: COMPONENT_TYPE.TEXT,
    id: 'country',
    label: 'Country',
  },
  {
    type: COMPONENT_TYPE.TEXT,
    id: 'postalCode',
    label: 'Postal Code',
  },
];

interface FormValues {
  name: string;
  address: string;
  country: string;
  postalCode: string;
}
export default function warehouses(props: {
  userRole: number;
  warehouses: Warehouse[];
  error?: string;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userRole, warehouses, error } = props;
  const isMobile = useMediaQuery(600);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.name) errors.name = "Can't be empty!";
    if (values.name.length > 30) errors.name = 'Too long!';
    if (!values.address) errors.address = "Can't be empty!";
    if (values.address.length > 100) errors.address = 'Too long!';
    if (!values.country) errors.country = "Can't be empty!";
    if (values.country.length > 90) errors.country = 'Too long!';
    if (!values.postalCode) errors.postalCode = "Can't be empty!";
    if (values.postalCode.length > 20) errors.postalCode = 'Too long!';
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      address: '',
      country: '',
      postalCode: '',
    },
    validate,
    validateOnChange: false,
    onSubmit: async (values: FormValues) => {
      const res = await AddWarehouse({ ...values });
      if (!res.success) {
        dispatch({
          type: ACTION_TYPE.SNACKBAR,
          message: res.message || 'An error has occured',
          severity: SEVERITY_TYPE.ERROR,
        });
        return;
      }

      dispatch({
        type: ACTION_TYPE.SNACKBAR,
        message: 'Warehouse added!',
        severity: SEVERITY_TYPE.SUCCESS,
      });
      // Triggers getServerSideProps()
      router.replace(router.asPath);
      setOpenAdd(false);
      formik.resetForm();
    },
  });

  const handleAdd = () => {
    formik.handleSubmit();
  };

  if (error) {
    return (
      <div className={styles.noContent}>
        <Typography variant="h5">{error}</Typography>
      </div>
    );
  }

  if (!warehouses.length) {
    return userRole === ACCOUNT_TYPE_ID.ADMIN ? (
      <div className={styles.noContent}>
        <Typography variant="h5">No warehouses, add one here</Typography>
        <Button
          variant="contained"
          color="secondary"
          endIcon={<Icon icon="Add" />}
          size="large"
          onClick={() => setOpenAdd(true)}
        >
          Add
        </Button>
        <FormDialog
          open={openAdd}
          title="Add Warehouse"
          fields={addFields}
          confirmBtnText="Add"
          onConfirm={handleAdd}
          onClose={() => setOpenAdd(false)}
          formik={formik}
          width="xs"
        />
      </div>
    ) : (
      <div className={styles.noContent}>
        <Typography variant="h5" align="center">
          No warehouses added yet by admins
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h4">Available warehouses</Typography>
        {userRole === ACCOUNT_TYPE_ID.ADMIN ? (
          <>
            <FormDialog
              open={openAdd}
              title="Add Warehouse"
              fields={addFields}
              confirmBtnText="Add"
              onConfirm={handleAdd}
              onClose={() => setOpenAdd(false)}
              formik={formik}
              width="xs"
            />
            {isMobile ? (
              <Fab
                className={styles.btnAdd}
                color="secondary"
                onClick={() => setOpenAdd(true)}
              >
                <Icon icon="Add" />
              </Fab>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                endIcon={<Icon icon="Add" />}
                size="large"
                onClick={() => setOpenAdd(true)}
              >
                Add
              </Button>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      {warehouses.map((wh, index) => (
        <Card key={index} className={styles.card}>
          <div className={styles.field}>
            <Typography variant="h6">Name:</Typography>
            <Typography variant="body1">{wh.name}</Typography>
          </div>
          <div className={styles.field}>
            <Typography variant="h6">ID:</Typography>
            <Typography variant="body1">{wh.warehouseID}</Typography>
          </div>
          <div className={styles.field}>
            <Typography variant="h6">Address:</Typography>
            <Typography variant="body1">{wh.address}</Typography>
          </div>
          <div className={styles.field}>
            <Typography variant="h6">Country:</Typography>
            <Typography variant="body1">{wh.country}</Typography>
          </div>
          <div className={styles.field}>
            <Typography variant="h6">Postal Code:</Typography>
            <Typography variant="body1">{wh.postalCode}</Typography>
          </div>
        </Card>
      ))}
    </div>
  );
}
