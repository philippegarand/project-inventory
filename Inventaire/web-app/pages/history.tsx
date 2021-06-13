import { NextPageContext } from 'next';
import { getSession } from 'next-auth/client';
import { GetHistories } from '../api/private/history';
import { ACCOUNT_TYPE_ID } from '../Utils/enums';
import { IsUserAllowedOnPage } from '../Utils/functions';
import styles from '../styles/History.module.css';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { Log } from '../types/history';
import moment from 'moment';
import useMediaQuery from '../Utils/CustomHooks/mediaQuery';
import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../config';
import {
  HttpTransportType,
  HubConnectionBuilder,
  IHttpConnectionOptions,
} from '@microsoft/signalr';
import { renderCellExpand } from '../components/GridCellExpand';

// Check if user is authenticated, else redirect to login
interface ICtx extends NextPageContext {}
export async function getServerSideProps(ctx: ICtx) {
  const session = await getSession(ctx);
  const redirectObj = IsUserAllowedOnPage(session, ACCOUNT_TYPE_ID.MANAGER);
  if (redirectObj) return redirectObj;

  const histories = await GetHistories(ctx);
  return {
    props: {
      logs: histories.success ? histories.data : [],
    },
  };
}

export default function history(props: { logs: Log[] }) {
  const isSmall = useMediaQuery(600);

  const [logs, setLogs] = useState(props.logs);

  const columns: GridColDef[] = [
    { field: 'id', flex: 1, hide: true },
    {
      field: 'date',
      headerName: 'Date',
      flex: isSmall ? 0 : 1,
      width: isSmall ? 170 : 0,
      renderCell: renderCellExpand,
    },
    {
      field: 'product',
      headerName: 'Product',
      flex: isSmall ? 0 : 1,
      width: isSmall ? 200 : 0,
      renderCell: renderCellExpand,
    },
    {
      field: 'warehouse',
      headerName: 'Warehouse',
      flex: isSmall ? 0 : 1,
      width: isSmall ? 200 : 0,
      renderCell: renderCellExpand,
    },
    {
      field: 'employee',
      headerName: 'Employee',
      flex: isSmall ? 0 : 1,
      width: isSmall ? 200 : 0,
      renderCell: renderCellExpand,
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: isSmall ? 0 : 0.5,
      width: isSmall ? 100 : 0,
      renderCell: (params) => (
        <div
          style={{
            color: params.value === 'Add' ? '#4caf50' : '#f44336',
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: isSmall ? 0 : 0.5,
      width: isSmall ? 120 : 0,
      type: 'number',
    },
  ];

  const latestLogs = useRef(null);
  latestLogs.current = logs;

  useEffect(() => {
    const options: IHttpConnectionOptions = {
      withCredentials: false,
      transport: HttpTransportType.ServerSentEvents,
    };

    const connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/history`, options)
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then((result) => {
        console.log('Connected!');

        window.addEventListener('beforeunload', () => connection.stop());

        connection.on('ReceiveLog', (log) => {
          const updatedLogs = [log, ...latestLogs.current];
          setLogs(updatedLogs);
        });
      })
      .catch((e) => console.log('Connection failed: ', e));

    return () => {
      connection.stop();
      window.removeEventListener('beforeunload', () => connection.stop());
    };
  }, []);

  return (
    <div className={styles.container}>
      <DataGrid
        className={styles.dataGrid}
        rows={logs.map((l) => ({
          id: l.id,
          date: moment(l.date).format('DD-MM-YYYY hh:mm a'),
          product: `${l.product} - ${l.productID}`,
          warehouse: `${l.warehouseID} - ${l.warehouse}`,
          employee: `${l.user} - ${l.userID}`,
          action: l.action,
          quantity: l.quantity,
        }))}
        columns={columns}
      />
    </div>
  );
}
