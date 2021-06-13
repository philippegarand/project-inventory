import { Button, Typography } from '@material-ui/core';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridColumnsToolbarButton,
  GridDensitySelector,
  GridFilterToolbarButton,
  GridToolbarContainer,
} from '@material-ui/data-grid';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/client';
import React, { useState } from 'react';
import { ACCOUNT_TYPE_ID } from '../Utils/enums';
import { IsUserAllowedOnPage } from '../Utils/functions';
import { FormDialog, Icon } from '../components';
import { FormikErrors, useFormik } from 'formik';
import { COMPONENT_TYPE, IComponent } from '../components/Factory';
import {
  AddProduct,
  EditProductInfo,
  GetProducts,
} from '../api/private/product';
import { Product } from '../types/product';
import { Category } from '../types/category';
import { AddCategory, GetCategories } from '../api/private/category';
import { renderCellExpand } from '../components/GridCellExpand';
import useMediaQuery from '../Utils/CustomHooks/mediaQuery';

import styles from '../styles/Inventory.module.css';
import { ACTION_TYPE, SEVERITY_TYPE } from '../Utils/store';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

interface ICtx extends NextPageContext {}
export async function getServerSideProps(ctx: ICtx) {
  const session = await getSession(ctx);
  const redirectObj = IsUserAllowedOnPage(session, ACCOUNT_TYPE_ID.MANAGER);

  if (redirectObj) return redirectObj;

  const res = await GetProducts(ctx);
  const resCategories = await GetCategories(ctx);
  return res.success
    ? {
        props: {
          userRole: session.user.role,
          products: res.data,
          categories: resCategories.success ? resCategories.data : [],
        },
      }
    : {
        props: {
          userRole: session.user.role,
          products: [],
          error: 'Could not fetch product, try again later...',
        },
      };
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridDensitySelector />
      <GridColumnsToolbarButton />
      <GridFilterToolbarButton />
    </GridToolbarContainer>
  );
}

interface FormValues {
  id: string;
  categoryId: number;
  productName: string;
  description: string;
  weight: number;
}

export default function products(props: {
  error?: string;
  products: Product[];
  categories: Category[];
}) {
  const { error, products, categories } = props;

  const isSmall = useMediaQuery(600);
  const dispatch = useDispatch();
  const router = useRouter();

  const [categoriesOptions, setCategoriesOptions] = useState<Category[]>(
    categories,
  );
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const fields: IComponent[] = [
    {
      type: COMPONENT_TYPE.AUTOCOMPLETE,
      id: 'categoryId',
      label: 'Category',
      options: categoriesOptions?.map((cat) => ({
        value: cat.categoryID,
        display: cat.name,
      })),
      withCreateNew: true,
      onAddNewOption: async (newValue: string) => {
        const res = await AddCategory({ categoryID: 0, name: newValue });
        if (!res.success) {
          dispatch({
            type: ACTION_TYPE.SNACKBAR,
            message: res.message || 'An error has occured',
            severity: SEVERITY_TYPE.ERROR,
          });
          return -1;
        }

        setCategoriesOptions([...categoriesOptions, res.data]);

        dispatch({
          type: ACTION_TYPE.SNACKBAR,
          message: 'Category added!',
          severity: SEVERITY_TYPE.SUCCESS,
        });

        return res.data.categoryID;
      },
    },
    {
      type: COMPONENT_TYPE.TEXT,
      id: 'productName',
      label: 'Name',
    },
    {
      type: COMPONENT_TYPE.TEXT,
      id: 'description',
      label: 'Description',
    },
    {
      type: COMPONENT_TYPE.NUMBER,
      id: 'weight',
      label: 'Weight',
    },
  ];

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ProductID',
      flex: isSmall ? 0 : 1,
      width: isSmall ? 120 : 0,
      renderCell: renderCellExpand,
    },
    {
      field: 'product',
      headerName: 'Product',
      flex: isSmall ? 0 : 1,
      width: isSmall ? 120 : 0,
      renderCell: renderCellExpand,
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: isSmall ? 0 : 1,
      width: isSmall ? 120 : 0,
      renderCell: (params) => <div>{params.row.category.name}</div>,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: isSmall ? 0 : 1,
      width: isSmall ? 140 : 0,
      renderCell: renderCellExpand,
    },
    {
      field: 'weight',
      headerName: 'Weight',
      flex: isSmall ? 0 : 0.5,
      width: isSmall ? 120 : 0,
      type: 'number',
    },
    {
      field: '',
      headerName: 'Actions',
      width: 82,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => (
        <div
          className={styles.editButton}
          onClick={() => {
            handleEdit(params.row);
          }}
        >
          <Icon icon="Edit" />
        </div>
      ),
    },
  ];

  const handleProductStateChange = (values: FormValues) => {
    let toSet: Product[] = products;
    const foundIndex = toSet.findIndex((p) => p.productID == values.id);

    if (foundIndex === -1) return;

    toSet[foundIndex] = {
      productID: values.id,
      category: categoriesOptions.find(
        (c) => c.categoryID == values.categoryId,
      ),
      name: values.productName,
      description: values.description,
      weight: values.weight,
    };
  };

  const validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (!values.categoryId) errors.categoryId = "Can't be empty!";
    if (!values.productName) errors.productName = "Can't be empty!";
    if (!values.description) errors.description = "Can't be empty!";
    if (values.weight == 0) errors.weight = 'Everything as a weight!';
    if (values.weight < 0) errors.weight = "Can't be negative!";
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      id: '',
      categoryId: 0,
      description: '',
      productName: '',
      weight: 0,
    },
    validate,
    validateOnChange: false,

    onSubmit: async (values: FormValues) => {
      const res = await EditProductInfo(
        values.id,
        values.categoryId,
        values.productName,
        values.description,
        values.weight,
      );
      setOpenEdit(false);
      handleProductStateChange(values);
      formik.resetForm();
    },
  });

  const handleEdit = (row) => {
    formik.setFieldValue('id', row.id);
    formik.setFieldValue('categoryId', row.category.categoryID);
    formik.setFieldValue('productName', row.product);
    formik.setFieldValue('description', row.description);
    formik.setFieldValue('weight', row.weight);
    setOpenEdit(true);
  };
  ////////////////////////////////////////////////////////////////////////////
  const formikAdd = useFormik({
    initialValues: {
      id: '',
      categoryId: 0,
      description: '',
      productName: '',
      weight: 0,
    },
    validate,
    validateOnChange: false,
    onSubmit: async (values: FormValues) => {
      const res = await AddProduct(
        values.categoryId,
        values.productName,
        values.description,
        values.weight,
      );

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
        message: 'Product added!',
        severity: SEVERITY_TYPE.SUCCESS,
      });

      router.replace(router.asPath);
      setOpenAdd(false);
      formikAdd.resetForm();
    },
  });

  const handleAdd = () => {
    formikAdd.handleSubmit();
  };

  if (error) {
    return (
      <Typography className={styles.error} variant="h5">
        {error}
      </Typography>
    );
  }

  return (
    <div className={styles.container}>
      <DataGrid
        className={styles.dataGrid}
        rows={products?.map((p) => ({
          id: p.productID,
          category: p.category,
          product: p.name,
          description: p.description,
          weight: p.weight,
        }))}
        columns={columns}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
      <FormDialog
        open={openEdit}
        title="Edit Product"
        fields={fields}
        confirmBtnText="Edit"
        onConfirm={() => formik.handleSubmit()}
        onClose={() => setOpenEdit(false)}
        formik={formik}
        width="xs"
      />

      <Button
        className={styles.addButton}
        variant="contained"
        color="secondary"
        endIcon={<Icon icon="Add" />}
        size="large"
        onClick={() => {
          setOpenAdd(true);
        }}
      >
        Add
      </Button>

      <FormDialog
        open={openAdd}
        title="Add Product"
        fields={fields}
        confirmBtnText="Add"
        onConfirm={handleAdd}
        onClose={() => setOpenAdd(false)}
        formik={formikAdd}
        width="xs"
      />
    </div>
  );
}
