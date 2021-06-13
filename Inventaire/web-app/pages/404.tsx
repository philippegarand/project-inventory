import { Button, Typography } from '@material-ui/core';
import Link from 'next/link';
import { PAGES } from '../Utils/enums';
import { Icon } from '../components';

import styles from '../styles/404.module.css';

export default function Custom404() {
  return (
    <div className={styles.content}>
      <Typography variant="h4" align="center">
        404 - Page Not Found
      </Typography>
      <Link href={PAGES.INVENTORY}>
        <Button
          className={styles.button}
          variant="contained"
          color="secondary"
          endIcon={<Icon icon="Home" />}
        >
          Go Home
        </Button>
      </Link>
    </div>
  );
}
