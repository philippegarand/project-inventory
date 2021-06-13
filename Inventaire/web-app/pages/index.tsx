import React, { useEffect, useRef, useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import {
  DataGrid,
  GridColDef,
  GridColumnsToolbarButton,
  GridDensitySelector,
  GridFilterToolbarButton,
  GridToolbarContainer,
} from '@material-ui/data-grid';
import {
  HttpTransportType,
  HubConnectionBuilder,
  IHttpConnectionOptions,
} from '@microsoft/signalr';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/client';
import { GetInventoryByWarehouse } from '../api/private/inventory';
import { IProdAv } from '../types/productAvailability';
import { ACCOUNT_TYPE_ID } from '../Utils/enums';
import { IsUserAllowedOnPage } from '../Utils/functions';
import styles from '../styles/Inventory.module.css';
import { FormDialog, Icon } from '../components';
import { FormikErrors, useFormik } from 'formik';
import { COMPONENT_TYPE, IComponent } from '../components/Factory';
import { IStoreState } from '../Utils/store';
import { useSelector } from 'react-redux';
import { User } from 'next-auth';
import {
  AddProductAvailability,
  GetProductsNames,
  SetProductQuantity,
} from '../api/private/product';
import useMediaQuery from '../Utils/CustomHooks/mediaQuery';
import { API_BASE_URL } from '../config';
import { ProductName } from '../types/product';

interface ICtx extends NextPageContext {}

export async function getServerSideProps(ctx: ICtx) {
  const session = await getSession(ctx);
  const redirectObj = IsUserAllowedOnPage(session, ACCOUNT_TYPE_ID.NONE);

  if (redirectObj) return redirectObj;

  const res = await GetProductsNames(ctx);

  if (session.user.role === ACCOUNT_TYPE_ID.NONE) {
    return {
      props: {
        error: 'No role yet, contact admin for help',
        productNames: [],
      },
    };
  }

  if (!session.user.warehouses.length) {
    return {
      props: {
        error: 'No warehouses available for this user, contact admin for help',
        productNames: [],
      },
    };
  }

  return {
    props: {
      user: session.user,
      productNames: res.success ? res.data : [],
      error: '',
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
  warehouse: number;
  quantity: number;
}

const editFields: IComponent[] = [
  {
    type: COMPONENT_TYPE.NUMBER,
    id: 'quantity',
    label: 'Quantity',
  },
];

export default function Home(props: {
  user: User;
  productNames: ProductName[];
  error?: string;
}) {
  const { error, user } = props;
  const { selectedWarehouse } = useSelector((state: IStoreState) => state);
  const isSmall = useMediaQuery(600);

  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const [products, setProducts] = useState<IProdAv[]>([]);
  const productsRef = useRef(null); // Important, make the signalR update work for some reason
  const selectedWarehouseRef = useRef(null); // Important, make the signalR update work for some reason

  const addFields: IComponent[] = [
    {
      type: COMPONENT_TYPE.AUTOCOMPLETE,
      id: 'id',
      label: 'ProductID',
      options: props.productNames.map((p) => ({
        value: p.productID,
        display: `${p.name} - ${p.productID}`,
      })),
    },

    {
      type: COMPONENT_TYPE.NUMBER,
      id: 'quantity',
      label: 'Quantity',
    },
  ];

  const timestampSent = useRef(null);
  const timestampReceived = useRef(null);

  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    selectedWarehouseRef.current = selectedWarehouse;
  }, [selectedWarehouse]);

  useEffect(() => {
    const options: IHttpConnectionOptions = {
      withCredentials: false,
      transport: HttpTransportType.ServerSentEvents,
    };

    const connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/productavailability`, options)
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then((result) => {
        console.log('Connected!');

        window.addEventListener('beforeunload', () => connection.stop());

        connection.on('ReceivePAUpdate', (paUpdate: IProdAv) => {
          timestampReceived.current = new Date();
          var timeUsed =
            (timestampReceived.current.getSeconds() -
              timestampSent.current.getSeconds()) *
              1000 +
            timestampReceived.current.getMilliseconds() -
            timestampSent.current.getMilliseconds();
          console.log(
            '[STR - METRIC] - Time elapsed between adding or sending quantity update and receiving SSE:',
            timeUsed,
            'ms',
          );
          let toSet: IProdAv[] = [...productsRef.current];

          var foundIndex = toSet.findIndex(
            (p) =>
              p.productID == paUpdate.productID &&
              p.warehouseID == paUpdate.warehouseID,
          );

          if (foundIndex != -1) {
            toSet[foundIndex].quantity = paUpdate.quantity;
            setProducts(toSet);
          } else if (selectedWarehouseRef.current == paUpdate.warehouseID) {
            setProducts([...toSet, paUpdate]);
          }
        });
      })
      .catch((e) => console.log('Connection failed: ', e));

    return () => {
      connection.stop();
      window.removeEventListener('beforeunload', () => connection.stop());
    };
  }, []);

  useEffect(() => {
    const getProduct = async () => {
      const res = await GetInventoryByWarehouse(selectedWarehouse);
      if (res.success) {
        setProducts(res.data);
      }
    };
    if (selectedWarehouse) getProduct();
  }, [selectedWarehouse]);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ProductID',
      flex: isSmall ? 0 : 1,
      width: isSmall ? 120 : 0,
    },
    {
      field: 'product',
      headerName: 'Product',
      flex: isSmall ? 0 : 1,
      width: isSmall ? 120 : 0,
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: isSmall ? 0 : 0.75,
      width: isSmall ? 120 : 0,
    },
    {
      field: 'weight',
      headerName: 'Weight',
      flex: isSmall ? 0 : 0.5,
      width: isSmall ? 100 : 0,
      type: 'number',
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
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
      renderCell: (params: any) => (
        <div
          className={styles.editButton}
          onClick={() => {
            handleEdit(params.row);
            setOpenEdit(true);
          }}
        >
          <Icon icon="Edit" />
        </div>
      ),
    },
  ];

  const validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    //if (!values.quantity) errors.quantity = "Can't be empty!";
    if (values.quantity < 0) errors.quantity = "Can't be negative!";
    if (!values.id) errors.id = "Can't be empty!";
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      id: '0',
      warehouse: 0,
      quantity: 0,
    },
    validate,
    validateOnChange: false,
    onSubmit: async (values: FormValues) => {
      timestampSent.current = new Date();
      const res = await SetProductQuantity(
        values.id,
        values.warehouse,
        values.quantity,
      );
      setOpenEdit(false);
    },
  });

  const handleEdit = (row) => {
    formik.setFieldValue('id', row.id);
    formik.setFieldValue('warehouse', row.warehouse);
    formik.setFieldValue('quantity', row.quantity);
  };
  ////////////////////////////////////////////////////////////////////////////
  const formikAdd = useFormik({
    initialValues: {
      id: '',
      warehouse: 0,
      quantity: 0,
    },
    validate,
    validateOnChange: false,
    onSubmit: async (values: FormValues) => {
      timestampSent.current = new Date();
      const res = await AddProductAvailability(
        values.id,
        values.warehouse,
        values.quantity,
      );
      setOpenAdd(false);
      formikAdd.resetForm();
    },
  });

  const handleAdd = () => {
    formikAdd.handleSubmit();
  };

  if (error) {
    return (
      <Typography className={styles.error} variant="h5" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{`Inventory: ${
        user.warehouses.find((w) => w.id === selectedWarehouse)?.name || ''
      }`}</h3>
      <DataGrid
        className={styles.dataGrid}
        rows={products?.map((p) => ({
          id: p.product.productID,
          warehouse: selectedWarehouse,
          category: p.product.category.name,
          product: p.product.name,
          weight: p.product.weight,
          quantity: p.quantity,
        }))}
        columns={columns}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
      <FormDialog
        open={openEdit}
        title="Edit"
        fields={editFields}
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
          formikAdd.setFieldValue('warehouse', selectedWarehouse);
          setOpenAdd(true);
        }}
      >
        Add
      </Button>

      <FormDialog
        open={openAdd}
        title="Add ProductAvailability"
        fields={addFields}
        confirmBtnText="Add"
        onConfirm={handleAdd}
        onClose={() => setOpenAdd(false)}
        formik={formikAdd}
        width="xs"
      />
    </div>
  );
}
