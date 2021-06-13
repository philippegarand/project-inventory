import {
  Button,
  Card,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/client';
import { ACCOUNT_TYPE_ID } from '../Utils/enums';
import { IsUserAllowedOnPage } from '../Utils/functions';

import styles from '../styles/Admin.module.css';
import { useState } from 'react';
import { FormikErrors, useFormik } from 'formik';
import { AddDummyData } from '../api/private/admin';
import { ACTION_TYPE, SEVERITY_TYPE } from '../Utils/store';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { LoadingOverlay } from '../components';

interface ICtx extends NextPageContext {}
export async function getServerSideProps(ctx: ICtx) {
  const session = await getSession(ctx);
  return (
    IsUserAllowedOnPage(session, ACCOUNT_TYPE_ID.ADMIN) || {
      props: {},
    }
  );
}

interface FormValues {
  nbCategories: number;
  nbWarehouses: number;
  nbProducts: number;
  nbProductAvailabilities: number;
  nbHistories: number;
}

export default function admin() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isOnCategories, setIsOnCategories] = useState(false);
  const [isOnWarehouses, setIsOnWarehouses] = useState(false);
  const [isOnProducts, setIsOnProducts] = useState(false);
  const [isOnPA, setIsOnPA] = useState(false);
  const [isOnHistories, setIsOnHistories] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validate = (values: FormValues) => {
    const {
      nbCategories,
      nbWarehouses,
      nbProducts,
      nbProductAvailabilities,
      nbHistories,
    } = values;
    const errors: FormikErrors<FormValues> = {};

    if (
      isOnCategories &&
      (isNaN(nbCategories) ||
        nbCategories <= 0 ||
        !Number.isInteger(nbCategories))
    ) {
      errors.nbCategories = 'Must be a positive integer';
    }
    if (
      isOnWarehouses &&
      (isNaN(nbWarehouses) ||
        nbWarehouses <= 0 ||
        !Number.isInteger(nbWarehouses))
    ) {
      errors.nbWarehouses = 'Mustbe a positive integer';
    }
    if (
      isOnProducts &&
      (isNaN(nbProducts) || nbProducts <= 0 || !Number.isInteger(nbProducts))
    ) {
      errors.nbProducts = 'Must be a positive integer';
    }
    if (
      isOnPA &&
      (isNaN(nbProductAvailabilities) ||
        nbProductAvailabilities <= 0 ||
        !Number.isInteger(nbProductAvailabilities))
    ) {
      errors.nbProductAvailabilities = 'Must be a positive integer';
    }
    if (
      isOnHistories &&
      (isNaN(nbHistories) || nbHistories <= 0 || !Number.isInteger(nbHistories))
    ) {
      errors.nbHistories = 'Must be a positive integer';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      nbCategories: 0,
      nbWarehouses: 0,
      nbProducts: 0,
      nbProductAvailabilities: 0,
      nbHistories: 0,
    },
    validate,
    validateOnChange: false,
    onSubmit: async (values: FormValues) => {
      const {
        nbCategories,
        nbWarehouses,
        nbProducts,
        nbProductAvailabilities,
        nbHistories,
      } = values;

      console.log(values);
      setIsLoading(true);

      const res = await AddDummyData({
        nbCategories: isOnCategories ? nbCategories : 0,
        nbWarehouses: isOnWarehouses ? nbWarehouses : 0,
        nbProducts: isOnProducts ? nbProducts : 0,
        nbProductAvailabilities: isOnPA ? nbProductAvailabilities : 0,
        nbHistories: isOnHistories ? nbHistories : 0,
      });

      if (!res.success) {
        dispatch({
          type: ACTION_TYPE.SNACKBAR,
          message: res.message || 'An error has occured',
          severity: SEVERITY_TYPE.ERROR,
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      dispatch({
        type: ACTION_TYPE.SNACKBAR,
        message: 'Dummy data added!',
        severity: SEVERITY_TYPE.SUCCESS,
      });

      router.reload();
    },
  });

  return (
    <div className={styles.content}>
      <LoadingOverlay isLoading={isLoading} />
      <Typography align="center">
        Use this tool to quickly add dummy data to the database
      </Typography>
      <Typography variant="caption" align="center">
        * Recommended to only use once with a clean DB, otherwise can't garantee
        the result
      </Typography>
      <Typography className={styles.text} variant="caption" align="center">
        * Also do not put more than (Products x Warehouse) - 1% PA (could cause
        infinite loop)
      </Typography>
      <Card className={styles.card}>
        <div className={styles.row}>
          <FormControlLabel
            className={styles.switch}
            control={
              <Switch
                color="primary"
                checked={isOnCategories}
                onChange={(e) => setIsOnCategories(e.target.checked)}
              />
            }
            label="Categories :"
          />
          <TextField
            id="nbCategories"
            className={styles.input}
            type="number"
            disabled={!isOnCategories}
            onChange={formik.handleChange}
            error={Boolean(formik.errors['nbCategories'])}
            helperText={formik.errors['nbCategories']}
            value={formik.values['nbCategories']}
          />
        </div>

        <div className={styles.row}>
          <FormControlLabel
            className={styles.switch}
            control={
              <Switch
                color="primary"
                checked={isOnWarehouses}
                onChange={(e) => setIsOnWarehouses(e.target.checked)}
              />
            }
            label="Warehouses :"
          />
          <TextField
            id="nbWarehouses"
            className={styles.input}
            type="number"
            disabled={!isOnWarehouses}
            onChange={formik.handleChange}
            error={Boolean(formik.errors['nbWarehouses'])}
            helperText={formik.errors['nbWarehouses']}
            value={formik.values['nbWarehouses']}
          />
        </div>

        <div className={styles.row}>
          <FormControlLabel
            className={styles.switch}
            control={
              <Switch
                color="primary"
                checked={isOnProducts}
                onChange={(e) => setIsOnProducts(e.target.checked)}
              />
            }
            label="Products :"
          />
          <TextField
            id="nbProducts"
            className={styles.input}
            type="number"
            disabled={!isOnProducts}
            onChange={formik.handleChange}
            error={Boolean(formik.errors['nbProducts'])}
            helperText={formik.errors['nbProducts']}
            value={formik.values['nbProducts']}
          />
        </div>

        <div className={styles.row}>
          <FormControlLabel
            className={styles.switch}
            control={
              <Switch
                color="primary"
                checked={isOnPA}
                onChange={(e) => setIsOnPA(e.target.checked)}
              />
            }
            label="ProductAvailabilities :"
          />
          <TextField
            id="nbProductAvailabilities"
            className={styles.input}
            type="number"
            disabled={!isOnPA}
            onChange={formik.handleChange}
            error={Boolean(formik.errors['nbProductAvailabilities'])}
            helperText={formik.errors['nbProductAvailabilities']}
            value={formik.values['nbProductAvailabilities']}
          />
        </div>

        <div className={styles.row}>
          <FormControlLabel
            className={styles.switch}
            control={
              <Switch
                color="primary"
                checked={isOnHistories}
                onChange={(e) => setIsOnHistories(e.target.checked)}
              />
            }
            label="Histories :"
          />
          <TextField
            id="nbHistories"
            className={styles.input}
            type="number"
            disabled={!isOnHistories}
            onChange={formik.handleChange}
            error={Boolean(formik.errors['nbHistories'])}
            helperText={formik.errors['nbHistories']}
            value={formik.values['nbHistories']}
          />
        </div>

        <Button
          className={styles.button}
          variant="contained"
          size="large"
          color="secondary"
          disabled={
            !isOnCategories &&
            !isOnWarehouses &&
            !isOnProducts &&
            !isOnPA &&
            !isOnHistories
          }
          onClick={() => formik.handleSubmit()}
        >
          Add dummy data
        </Button>
      </Card>
    </div>
  );
}
