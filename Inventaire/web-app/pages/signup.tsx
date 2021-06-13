import React, { useState } from 'react';
import styles from '../styles/SignUp.module.css';
import { Button, Card, Typography, Link } from '@material-ui/core';
import { FormikErrors, useFormik } from 'formik';
import { FormikTextField, LoadingOverlay } from '../components';
import { PAGES } from '../Utils/enums';
import NextLink from 'next/link';
import { Signup } from '../api/public/auth';
import { useDispatch } from 'react-redux';
import { ACTION_TYPE } from '../Utils/store';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmedPassword: string;
}

export default function signup() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validate = (values: FormValues) => {
    const { email, name, password, confirmedPassword } = values;
    const errors: FormikErrors<FormValues> = {};

    if (!email) {
      errors.email = 'Required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }
    if (!name) {
      errors.name = 'Required';
    }
    if (!password) {
      errors.password = 'Required';
    }
    if (!confirmedPassword) {
      errors.confirmedPassword = 'Required';
    }
    if (password != confirmedPassword) {
      errors.password = "Passwords don't match";
      errors.confirmedPassword = "Passwords don't match";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmedPassword: '' },
    validate,
    validateOnChange: false,
    onSubmit: async (values, { setFieldError }) => {
      const { name, email, password } = values;

      setIsLoading(true);
      const res = await Signup({ name, email, password });

      if (!res.success) {
        setFieldError('email', res.message);
        setIsLoading(false);
        return;
      }

      dispatch({
        type: ACTION_TYPE.LOGIN,
        user: {
          email,
          password,
        },
        rememberMe: false,
      });
    },
  });

  return (
    <div className={styles.SignUpContainer}>
      <LoadingOverlay isLoading={isLoading} />
      <Card className={styles.SignUpCard}>
        <Typography className={styles.Title} align="center" variant="h4">
          Sign Up
        </Typography>

        <FormikTextField
          className={
            formik.errors.name
              ? styles.SignUpTextFieldError
              : styles.SignUpTextField
          }
          id="name"
          formik={formik}
          label="Name"
        />
        <FormikTextField
          className={
            formik.errors.email
              ? styles.SignUpTextFieldError
              : styles.SignUpTextField
          }
          id="email"
          formik={formik}
          label="Email"
        />
        <FormikTextField
          className={
            formik.errors.password
              ? styles.SignUpTextFieldError
              : styles.SignUpTextField
          }
          id="password"
          type="password"
          formik={formik}
          label="Password"
        />
        <FormikTextField
          className={
            formik.errors.confirmedPassword
              ? styles.SignUpTextFieldError
              : styles.SignUpTextField
          }
          id="confirmedPassword"
          type="password"
          formik={formik}
          label="Confirm Password"
        />
        <Button
          className={styles.SignUpButton}
          variant="contained"
          color="primary"
          onClick={() => formik.handleSubmit()}
        >
          Sign Up
        </Button>
        <Typography
          align="center"
          variant="body2"
          className={styles.AlignCenter}
        >
          Already have an account?
          <NextLink href={PAGES.LOGIN}>
            <Link className={styles.LogInHypertext} variant="body2">
              Log In
            </Link>
          </NextLink>
        </Typography>
      </Card>
    </div>
  );
}
