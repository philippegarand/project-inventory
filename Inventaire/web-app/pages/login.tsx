import { getSession } from 'next-auth/client';
import styles from '../styles/SignUp.module.css';
import { FormikTextField, LoadingOverlay } from '../components';
import { FormikErrors, useFormik } from 'formik';
import {
  Checkbox,
  Button,
  Card,
  Typography,
  Link,
  FormControlLabel,
  Divider,
} from '@material-ui/core';
import NextLink from 'next/link';
import { PAGES } from '../Utils/enums';
import { useDispatch } from 'react-redux';
import { ACTION_TYPE, SEVERITY_TYPE } from '../Utils/store';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface ICtx extends NextPageContext {}
export async function getServerSideProps(ctx: ICtx) {
  const session = await getSession(ctx);
  // Redirect if user is already connected
  return session && ctx.res && session.user
    ? {
        redirect: {
          destination: PAGES.INVENTORY,
          permanent: false,
        },
      }
    : {
        props: {
          session: null,
        },
      };
}

interface FormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function SignIn() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (router.query?.error) {
      dispatch({
        type: ACTION_TYPE.SNACKBAR,
        message: 'Credentials are wrong!',
        severity: SEVERITY_TYPE.ERROR,
      });
    }
  }, [router.query]);

  const validate = (values: FormValues) => {
    const { email, password } = values;
    const errors: FormikErrors<FormValues> = {};

    if (!email) {
      errors.email = 'Required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }

    if (!password) {
      errors.password = 'Required';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: { email: '', password: '', rememberMe: false },
    validate,
    validateOnChange: false,
    onSubmit: async (values) => {
      const { email, password, rememberMe } = values;

      setIsLoading(true);
      dispatch({
        type: ACTION_TYPE.LOGIN,
        user: {
          email,
          password,
        },
        rememberMe,
      });
    },
  });

  return (
    <div className={styles.SignUpContainer}>
      <LoadingOverlay isLoading={isLoading} />
      <Card className={styles.SignUpCard}>
        <Typography className={styles.Title} align="center" variant="h4">
          Login
        </Typography>
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
          submitOnEnter
        />
        <Button
          className={styles.LoginButton}
          variant="contained"
          color="primary"
          onClick={() => formik.handleSubmit()}
        >
          Login
        </Button>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                name="RememberMe"
                color="primary"
                onChange={(e) =>
                  formik.setFieldValue('rememberMe', e.target.checked)
                }
              />
            }
            label="Remember Me"
          />
          <NextLink href={PAGES.LOGIN}>
            <Link className={styles.ForgotPassword} variant="body2">
              Forgot Password?
            </Link>
          </NextLink>
        </div>
        <Divider className={styles.Divider} variant="middle" />
        <NextLink href={PAGES.SIGNUP}>
          <Button
            className={styles.LoginButton}
            color="secondary"
            variant="contained"
          >
            Create new account
          </Button>
        </NextLink>
      </Card>
    </div>
  );
}
