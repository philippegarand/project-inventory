import React, { useState } from 'react';
import {
  FormControlLabel,
  Switch,
  Typography,
  Card,
  Button,
  Grid,
  Divider,
  IconButton,
  withStyles,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/Settings.module.css';
import { FormikTextField, Icon } from '../components';
import { FormikErrors, useFormik } from 'formik';
import { ACTION_TYPE, IStoreState, SEVERITY_TYPE } from '../Utils/store';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/client';
import { ACCOUNT_TYPE_ID } from '../Utils/enums';
import { User } from 'next-auth';
import {
  ConvertAccountTypeToString,
  IsUserAllowedOnPage,
} from '../Utils/functions';
import { ChangeEmail, ChangePassword } from '../api/private/user';
import useMediaQuery from '../Utils/CustomHooks/mediaQuery';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

interface ICtx extends NextPageContext {}
export async function getServerSideProps(ctx: ICtx) {
  const session = await getSession(ctx);
  return (
    IsUserAllowedOnPage(session, ACCOUNT_TYPE_ID.NONE) || {
      props: { user: session.user },
    }
  );
}

const StyledToggleButton = withStyles((theme) => ({
  root: {
    width: '50%',
    '&$selected': {
      backgroundColor: theme.palette.secondary.main,
      color: 'white',
      '&:hover': {
        backgroundColor: theme.palette.secondary.main,
      },
    },
  },
  selected: {},
}))(ToggleButton);

interface FormEmailValues {
  email: string;
}

interface FormPasswordValues {
  oldPassword: string;
  newPassword: string;
}

export default function settings(props: { user: User; updateSession: any }) {
  const userInfo = props.user;
  const darkTheme = useSelector((state: IStoreState) => state.darkTheme);
  const dispatch = useDispatch();

  const [emailState, setEmailState] = useState(false);
  const [passwordState, setPasswordState] = useState(false);

  const isMobile = useMediaQuery(600);

  const validateEmail = (values: FormEmailValues) => {
    const email = values;
    const errors: FormikErrors<FormEmailValues> = {};
    if (emailState) {
      if (!email) {
        errors.email = 'Required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = 'Invalid email address';
      }
    }
    return errors;
  };

  const formikEmail = useFormik({
    initialValues: { email: '' },
    validate: validateEmail,
    validateOnChange: false,
    onSubmit: async (values, { setFieldError }) => {
      const res = await ChangeEmail(userInfo.id, values.email);

      if (!res.success) {
        setFieldError('email', res.message);
        return;
      }

      userInfo.email = values.email;
      setEmailState(false);
      formikEmail.resetForm();

      dispatch({
        type: ACTION_TYPE.SNACKBAR,
        message: 'Email changed!',
        severity: SEVERITY_TYPE.SUCCESS,
      });
    },
  });

  const validatePassword = (values: FormPasswordValues) => {
    const { oldPassword, newPassword } = values;
    const errors: FormikErrors<FormPasswordValues> = {};

    if (passwordState) {
      if (!newPassword) {
        errors.newPassword = 'Required';
      }
      if (!oldPassword) {
        errors.oldPassword = 'Required';
      }
    }
    return errors;
  };

  const formikPassword = useFormik({
    initialValues: { oldPassword: '', newPassword: '' },
    validate: validatePassword,
    validateOnChange: false,
    onSubmit: async (values, { setFieldError }) => {
      const res = await ChangePassword(
        userInfo.id,
        values.oldPassword,
        values.newPassword,
      );

      if (!res.success) {
        setFieldError('oldPassword', res.message);
        return;
      }

      setPasswordState(false);
      formikPassword.resetForm();

      dispatch({
        type: ACTION_TYPE.SNACKBAR,
        message: 'Password changed!',
        severity: SEVERITY_TYPE.SUCCESS,
      });
    },
  });

  const handleThemeChange = () => {
    dispatch({
      type: ACTION_TYPE.CHANGE_THEME,
      darkTheme: !darkTheme,
    });
  };

  const showEmailChange = () => {
    return (
      <>
        <Typography className={styles.InformationLabel}>New Email</Typography>
        <FormikTextField
          className={styles.TextField}
          id="email"
          formik={formikEmail}
          label="New email"
          size="small"
        />
        <Button
          className={styles.actionColumn}
          variant="contained"
          color="primary"
          onClick={() => formikEmail.handleSubmit()}
          size="small"
        >
          Confirm
        </Button>
      </>
    );
  };

  const showPasswordChange = () => {
    return (
      <>
        <Typography className={styles.InformationLabel}>
          Old Password
        </Typography>
        <FormikTextField
          className={styles.TextField}
          formik={formikPassword}
          id="oldPassword"
          type="password"
          label="Old password"
          size="small"
        />
        <Typography className={styles.InformationLabel}>
          New Password
        </Typography>
        <FormikTextField
          className={styles.TextField}
          formik={formikPassword}
          id="newPassword"
          type="password"
          label="New password"
          size="small"
        />
        <Button
          className={styles.actionColumn}
          variant="contained"
          color="primary"
          onClick={() => formikPassword.handleSubmit()}
          size="small"
        >
          Confirm
        </Button>
      </>
    );
  };

  return (
    <div>
      <div className={styles.SettingsContainer}>
        <Card className={styles.SettingsCard}>
          <Typography className={styles.Title} align="center" variant="h4">
            Informations
          </Typography>
          <Divider className={styles.Divider} />
          <Grid className={styles.SettingsGrid}>
            <Typography className={styles.InformationLabel}>Email:</Typography>
            <Typography noWrap className={styles.InformationText}>
              {userInfo.email}
            </Typography>
            {isMobile ? (
              <IconButton
                className={styles.iconButton}
                onClick={() => setEmailState(!emailState)}
              >
                <Icon icon="Edit" color="primary" />
              </IconButton>
            ) : (
              <Button
                className={styles.actionColumn}
                variant="contained"
                color="primary"
                onClick={() => setEmailState(!emailState)}
                size="small"
              >
                Change Email
              </Button>
            )}

            {emailState && showEmailChange()}
            <Typography className={styles.InformationLabel}>Name</Typography>
            <Typography className={styles.InformationText}>
              {userInfo.name}
            </Typography>
            <Typography className={styles.InformationLabel}>
              Password:
            </Typography>
            <Typography className={styles.InformationText}>
              ••••••••••
            </Typography>
            {isMobile ? (
              <IconButton
                className={styles.iconButton}
                onClick={() => setPasswordState(!passwordState)}
              >
                <Icon icon="Edit" color="primary" />
              </IconButton>
            ) : (
              <Button
                className={styles.actionColumn}
                variant="contained"
                color="primary"
                onClick={() => setPasswordState(!passwordState)}
                size="small"
              >
                Change Password
              </Button>
            )}

            {passwordState && showPasswordChange()}
            <Typography className={styles.InformationLabel}>
              Account Type:
            </Typography>
            <Typography className={styles.InformationText}>
              {ConvertAccountTypeToString(userInfo.role)}
            </Typography>
            <Typography className={styles.InformationLabel}>Theme:</Typography>
            <Typography className={styles.InformationText}>
              {darkTheme ? 'Dark Theme' : 'Light Theme'}
            </Typography>
            <ToggleButtonGroup
              className={styles.actionColumn}
              value={darkTheme}
              exclusive
              onChange={handleThemeChange}
              size="small"
            >
              <StyledToggleButton value={true}>Dark</StyledToggleButton>
              <StyledToggleButton value={false}>Light</StyledToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Card>
      </div>
    </div>
  );
}
