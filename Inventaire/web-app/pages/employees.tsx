import React from 'react';
import { DataGrid, GridCellParams, GridColumns } from '@material-ui/data-grid';
import styles from '../styles/Employees.module.css';
import { Employee, mapToEmployee } from '../types/user';
import { useState } from 'react';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/client';
import { ACCOUNT_TYPE_ID, ACCOUNT_TYPE_TEXT } from '../Utils/enums';
import { IsUserAllowedOnPage } from '../Utils/functions';
import { Button } from '@material-ui/core';
import FormDialog from '../components/FormDialog';
import { COMPONENT_TYPE, IComponent } from '../components/Factory';
import { FormikErrors, useFormik } from 'formik';
import { GetWarehouses } from '../api/private/warehouses';
import { GetUsers, AddEmployee, ModifyEmployee } from '../api/private/user';
import { useDispatch } from 'react-redux';
import { ACTION_TYPE, SEVERITY_TYPE } from '../Utils/store';
import { MinimalWarehouse, Warehouse } from '../types/warehouse';
import { GridCellExpand, Icon } from '../components';
import { ConvertAccountTypeToString } from '../Utils/functions';
import { renderCellExpand } from '../components/GridCellExpand';
import useMediaQuery from '../Utils/CustomHooks/mediaQuery';

interface ICtx extends NextPageContext {}
export async function getServerSideProps(ctx: ICtx) {
  const session = await getSession(ctx);
  const redirectObj = IsUserAllowedOnPage(session, ACCOUNT_TYPE_ID.MANAGER);
  if (redirectObj) return redirectObj;

  const usersRes = await GetUsers(ctx);
  const whsRes = await GetWarehouses(ctx);

  return {
    props: {
      userRole: session.user.role,
      users: usersRes.success ? usersRes.data.map((u) => mapToEmployee(u)) : [],
      warehouses: whsRes.success ? whsRes.data : [],
    },
  };
}

export default function employees(props: {
  userRole: number;
  users: Employee[];
  warehouses: Warehouse[];
}) {
  const { userRole, users, warehouses } = props;
  const dispatch = useDispatch();
  const isSmall = useMediaQuery(600);

  const [employees, setEmployees] = useState<Employee[]>(users);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const columns: GridColumns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: isSmall ? 0 : 1,
      width: isSmall ? 150 : 0,
      renderCell: renderCellExpand,
    },
    {
      field: 'name',
      headerName: 'Full name',
      flex: isSmall ? 0 : 0.75,
      width: isSmall ? 150 : 0,
      renderCell: renderCellExpand,
    },
    {
      field: 'email',
      headerName: 'email',
      flex: isSmall ? 0 : 0.75,
      width: isSmall ? 150 : 0,
      renderCell: renderCellExpand,
    },
    {
      field: 'accountType',
      headerName: 'Type',
      flex: isSmall ? 0 : 0.5,
      width: isSmall ? 100 : 0,
      renderCell: (params: GridCellParams) => (
        <GridCellExpand
          value={ConvertAccountTypeToString(params.row.accountTypeId)}
          width={params.colDef.width}
        />
      ),
    },
    {
      field: 'warehouses',
      headerName: 'Warehouses',
      flex: isSmall ? 0 : 1,
      width: isSmall ? 150 : 0,
      renderCell: (params: GridCellParams) => (
        <GridCellExpand
          value={params.row.warehouses
            .map((w: MinimalWarehouse) => w.name)
            .join(', ')}
          width={params.colDef.width}
        />
      ),
    },
    {
      field: '',
      headerName: 'Actions',
      width: 85,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <div
          className={styles.editIcon}
          onClick={() => {
            handleEdit(params.row);
          }}
        >
          {params.row.accountTypeId === ACCOUNT_TYPE_ID.ADMIN &&
          userRole > ACCOUNT_TYPE_ID.ADMIN ? (
            <></>
          ) : (
            <Icon icon="Edit" />
          )}
        </div>
      ),
    },
  ];

  const accountTypes = [
    { value: ACCOUNT_TYPE_ID.MANAGER, display: ACCOUNT_TYPE_TEXT.MANAGER },
    {
      value: ACCOUNT_TYPE_ID.EMPLOYEE,
      display: ACCOUNT_TYPE_TEXT.EMPLOYEE,
    },
    { value: ACCOUNT_TYPE_ID.NONE, display: ACCOUNT_TYPE_TEXT.NONE },
  ];

  const addFields: IComponent[] = [
    {
      type: COMPONENT_TYPE.TEXT,
      id: 'name',
      label: 'Name',
    },
    {
      type: COMPONENT_TYPE.SELECT,
      id: 'accountTypeId',
      label: 'Account Type',
      options:
        userRole === ACCOUNT_TYPE_ID.ADMIN
          ? [
              {
                value: ACCOUNT_TYPE_ID.ADMIN,
                display: ACCOUNT_TYPE_TEXT.ADMIN,
              },
              ...accountTypes,
            ]
          : accountTypes,
    },
    {
      type: COMPONENT_TYPE.TEXT,
      id: 'email',
      label: 'Email',
    },
    {
      type: COMPONENT_TYPE.TEXT,
      id: 'password',
      label: 'Password',
      isPassword: true,
    },
    {
      type: COMPONENT_TYPE.MULTI_SELECT,
      id: 'warehouses',
      label: 'Warehouses',
      options: warehouses.map((wh) => ({
        value: wh.warehouseID,
        display: wh.name,
      })),
    },
  ];

  const editFields: IComponent[] = [
    {
      type: COMPONENT_TYPE.TEXT,
      id: 'name',
      label: 'Name',
    },
    {
      type: COMPONENT_TYPE.SELECT,
      id: 'accountTypeId',
      label: 'Account Type',
      options:
        userRole === ACCOUNT_TYPE_ID.ADMIN
          ? [
              {
                value: ACCOUNT_TYPE_ID.ADMIN,
                display: ACCOUNT_TYPE_TEXT.ADMIN,
              },
              ...accountTypes,
            ]
          : accountTypes,
    },
    {
      type: COMPONENT_TYPE.MULTI_SELECT,
      id: 'warehouses',
      label: 'Warehouses',
      options: warehouses.map((wh: Warehouse) => ({
        value: wh.warehouseID,
        display: wh.name,
      })),
    },
  ];

  interface FormAddValues {
    name: string;
    accountTypeId: number;
    email: string;
    password: string;
    warehouses: number[];
  }
  const validateAdd = (values: FormAddValues) => {
    const errors: FormikErrors<FormAddValues> = {};
    if (!values.name) errors.name = "Can't be empty!";
    if (values.name.length > 100) errors.name = 'Too long!';
    if (!values.email) errors.email = "Can't be empty!";
    if (values.email.length > 80) errors.email = 'Too long!';
    if (!values.password) errors.password = "Can't be empty!";
    return errors;
  };

  const formikAdd = useFormik({
    initialValues: {
      name: '',
      accountTypeId: ACCOUNT_TYPE_ID.NONE,
      email: '',
      password: '',
      warehouses: [],
    },
    validate: validateAdd,
    validateOnChange: false,
    onSubmit: async (values: FormAddValues) => {
      const res = await AddEmployee({
        name: values.name,
        warehouseIDs: values.warehouses,
        email: values.email,
        password: values.password,
        accountTypeID: values.accountTypeId,
      });

      if (!res.success) {
        dispatch({
          type: ACTION_TYPE.SNACKBAR,
          message: res.message || 'An error has occured',
          severity: SEVERITY_TYPE.ERROR,
        });
        return;
      }

      setEmployees([...employees, mapToEmployee(res.data)]);

      dispatch({
        type: ACTION_TYPE.SNACKBAR,
        message: 'Employee added!',
        severity: SEVERITY_TYPE.SUCCESS,
      });

      setOpenAdd(false);
      formikAdd.resetForm();
    },
  });

  interface FormEditValues {
    id: string;
    name: string;
    accountTypeId: number;
    warehouses: number[];
  }
  const validateEdit = (values: FormEditValues) => {
    const errors: FormikErrors<FormEditValues> = {};
    if (!values.name) errors.name = "Can't be empty!";
    if (values.name.length > 100) errors.name = 'Too long!';
    return errors;
  };

  const formikEdit = useFormik({
    initialValues: { id: '', name: '', accountTypeId: 4, warehouses: [] },
    validate: validateEdit,
    validateOnChange: false,
    onSubmit: async (values) => {
      const res = await ModifyEmployee({
        userID: values.id,
        name: values.name,
        warehouseIDs: values.warehouses,
        accountTypeID: values.accountTypeId,
      });

      if (!res.success) {
        dispatch({
          type: ACTION_TYPE.SNACKBAR,
          message: res.message || 'An error has occured',
          severity: SEVERITY_TYPE.ERROR,
        });
        return;
      }

      var warehousesToSet: MinimalWarehouse[] = [];
      values.warehouses.forEach((element) => {
        var res = warehouses.find((w: Warehouse) => w.warehouseID == element);
        warehousesToSet.push({ id: res.warehouseID, name: res.name });
      });

      let temp = employees;
      let user = employees.find((e) => e.id === values.id);
      temp[employees.findIndex((e) => e.id === values.id)] = {
        ...user,
        name: values.name,
        accountTypeId: values.accountTypeId,
        warehouses: warehousesToSet,
      };

      setEmployees(temp);

      dispatch({
        type: ACTION_TYPE.SNACKBAR,
        message: 'Employee updated!',
        severity: SEVERITY_TYPE.SUCCESS,
      });

      setOpenEdit(false);
      formikEdit.resetForm();
    },
  });

  const handleEdit = (row: any) => {
    formikEdit.setFieldValue('id', row.id);
    formikEdit.setFieldValue('name', row.name);
    formikEdit.setFieldValue('accountTypeId', row.accountTypeId);
    formikEdit.setFieldValue(
      'warehouses',
      row.warehouses.map((r: MinimalWarehouse) => r.id),
    );
    setOpenEdit(!openEdit);
  };

  const handleAddClose = () => {
    formikAdd.resetForm();
    setOpenAdd(false);
  };
  const handleEditClose = () => {
    formikEdit.resetForm();
    setOpenEdit(false);
  };

  return (
    <div className={styles.dataGridContainer}>
      <div className={styles.dataGrid}>
        <DataGrid rows={employees.map((e) => e)} columns={columns} pagination />
      </div>
      {openEdit && (
        <FormDialog
          open={openEdit}
          title="Edit Employee"
          fields={editFields}
          confirmBtnText="Edit"
          onConfirm={() => formikEdit.handleSubmit()}
          onClose={handleEditClose}
          formik={formikEdit}
          width="xs"
        />
      )}

      {openAdd && (
        <FormDialog
          open={openAdd}
          title="Add Employee"
          fields={addFields}
          confirmBtnText="Add"
          onConfirm={() => formikAdd.handleSubmit()}
          onClose={handleAddClose}
          formik={formikAdd}
          width="xs"
        />
      )}

      <Button
        className={styles.addButton}
        variant="contained"
        color="secondary"
        endIcon={<Icon icon="Add" />}
        size="large"
        onClick={() => setOpenAdd(true)}
      >
        Add
      </Button>
    </div>
  );
}
