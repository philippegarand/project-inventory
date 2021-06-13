import React from 'react';
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { PAGES, ACCOUNT_TYPE_ID } from '../../../Utils/enums';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { ACTION_TYPE } from '../../../Utils/store';
import { Icon } from '../..';
import { iconsList } from '../../Icon';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    // justifyContent: 'flex-end',
  },
  drawerLogout: {
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%',
    width: '90%',
  },
  headerIcon: {
    marginLeft: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

interface INavItem {
  page: string;
  icon: keyof typeof iconsList;
  text: string;
  minRole: number;
}
const navItems: INavItem[] = [
  {
    page: PAGES.INVENTORY,
    icon: 'HomeWork',
    text: 'Inventory',
    minRole: ACCOUNT_TYPE_ID.NONE,
  },
  {
    page: PAGES.SCAN,
    icon: 'CropFree',
    text: 'Scan',
    minRole: ACCOUNT_TYPE_ID.EMPLOYEE,
  },
  {
    page: PAGES.RENT,
    icon: 'Assignment',
    text: 'Rent',
    minRole: ACCOUNT_TYPE_ID.EMPLOYEE,
  },
  {
    page: PAGES.PRODUCTS,
    icon: 'Dashboard',
    text: 'Products',
    minRole: ACCOUNT_TYPE_ID.MANAGER,
  },
  {
    page: PAGES.HISTORY,
    icon: 'EventNote',
    text: 'History',
    minRole: ACCOUNT_TYPE_ID.MANAGER,
  },
  {
    page: PAGES.WAREHOUSES,
    icon: 'BorderAll',
    text: 'Warehouses',
    minRole: ACCOUNT_TYPE_ID.EMPLOYEE,
  },
  {
    page: PAGES.EMPLOYEES,
    icon: 'People',
    text: 'Employees',
    minRole: ACCOUNT_TYPE_ID.MANAGER,
  },
  {
    page: PAGES.SETTINGS,
    icon: 'Settings',
    text: 'Settings',
    minRole: ACCOUNT_TYPE_ID.NONE,
  },
  {
    page: PAGES.ADMIN,
    icon: 'Lock',
    text: 'Admin',
    minRole: ACCOUNT_TYPE_ID.ADMIN,
  },
];

export default function DrawerMenu(props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userRole: number;
}) {
  const { open, setOpen, userRole } = props;
  const router = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch({
      type: ACTION_TYPE.LOGOUT,
    });
  };

  return (
    <Drawer
      className={classes.drawer}
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={() => setOpen(false)}
    >
      <div className={classes.drawerHeader}>
        <Typography variant="h5">Menu</Typography>
        <IconButton
          className={classes.headerIcon}
          onClick={() => setOpen(false)}
        >
          <Icon icon="ArrowBack" color="inherit" />
        </IconButton>
      </div>
      <Divider />
      <List disablePadding>
        {navItems.map((item, index) => {
          if (userRole > item.minRole) return null;
          return (
            <Link key={index} href={item.page}>
              <ListItem button divider onClick={() => setOpen(false)}>
                <ListItemIcon>
                  <Icon
                    icon={item.icon}
                    color={
                      router.pathname === item.page ? 'inherit' : 'primary'
                    }
                  />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </Link>
          );
        })}
        <Button
          className={classes.drawerLogout}
          variant="contained"
          color="primary"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </List>
    </Drawer>
  );
}
