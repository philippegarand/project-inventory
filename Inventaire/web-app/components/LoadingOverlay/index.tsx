import { CircularProgress } from '@material-ui/core';
import styles from './LoadingOverlay.module.css';

/**
 * Use this component to display a loading overlay on top of the whole page,
 * blocking other components input.
 */
export default function LoadingOverlay(props: { isLoading: boolean }) {
  const { isLoading } = props;

  if (isLoading) {
    return (
      <div className={styles.loadingOverlay}>
        <CircularProgress color="secondary" size={100} />
      </div>
    );
  }

  return null;
}
