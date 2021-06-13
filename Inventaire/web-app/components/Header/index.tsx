import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  AppBar,
  Avatar,
  Chip,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
  TextField,
  MenuItem,
  withStyles,
  Menu,
} from '@material-ui/core';
import { PAGES } from '../../Utils/enums';
import Link from 'next/link';
import DrawerMenu from './DrawerMenu';
import { useSession } from 'next-auth/client';
import { User } from 'next-auth';
import { Icon } from '..';
import { ACTION_TYPE, IStoreState } from '../../Utils/store';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },

  chip: {
    backgroundColor: theme.palette.background.default,
    border: '1px solid transparent',
    '&:hover, &:focus': {
      backgroundColor: `${theme.palette.background.default} !important`,
      border: `1px solid ${theme.palette.secondary.main} !important`,
    },
    [theme.breakpoints.up('sm')]: {
      marginLeft: '8px',
    },
  },
  avatar: {
    color: '#fff !important',
    backgroundColor: theme.palette.secondary.main,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

const CenteredMenuItem = withStyles({
  root: {
    justifyContent: 'center',
  },
})(MenuItem);

const CustomSelect = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    borderRadius: '4px',
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.secondary.main,
      },
    },
  },
}))(TextField);

export default function Header() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedWarehouse = useSelector(
    (state: IStoreState) => state.selectedWarehouse,
  );

  // TODO: not sure if best way
  const [session] = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    if (session) {
      setUser(session.user);
      setConnected(Boolean(session && session.user));
      if (!selectedWarehouse && session.user.warehouses.length) {
        dispatch({
          type: ACTION_TYPE.CHANGE_WAREHOUSE,
          warehouseId: session.user.warehouses[0].id,
        });
      }
    }
  }, [session]);

  const [currentPage, setCurrentPage] = useState(
    router.pathname.substring(1).charAt(0).toUpperCase(),
  );

  const [openDrawerMenu, setOpenDrawerMenu] = useState(false);
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl,
  ] = useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    const pageName = Object.keys(PAGES).find(
      (k) => PAGES[k] === router.pathname,
    );

    setCurrentPage(
      pageName
        ? pageName.charAt(0) + pageName.substring(1).toLocaleLowerCase()
        : 'Not Found',
    );
  }, [router.pathname]);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleWarehouseChange = (
    event: React.ChangeEvent<{ value: string }>,
  ) => {
    dispatch({
      type: ACTION_TYPE.CHANGE_WAREHOUSE,
      warehouseId: event.target.value,
    });
    handleMobileMenuClose();
  };

  const WarehouseSelect = useMemo(() => {
    if (!user?.warehouses || !user?.warehouses.length) return null;

    return (
      <CustomSelect
        select
        value={selectedWarehouse}
        onChange={handleWarehouseChange}
        variant="outlined"
        color="secondary"
        size="small"
      >
        {user.warehouses.map((w, index) => (
          <MenuItem key={index} value={w.id}>
            {w.name}
          </MenuItem>
        ))}
      </CustomSelect>
    );
  }, [user?.warehouses, selectedWarehouse]);

  const CurrentUser = (
    <Link href={PAGES.SETTINGS}>
      <Chip
        className={classes.chip}
        classes={{ avatar: classes.avatar }}
        avatar={<Avatar>{user?.name.charAt(0).toUpperCase()}</Avatar>}
        label={user?.name}
        variant="outlined"
        clickable
        onClick={handleMobileMenuClose}
      />
    </Link>
  );

  // not connected, show minimal header
  if (currentPage === 'Login') {
    return (
      <AppBar>
        <Toolbar>
          <Typography className={classes.title} variant="h6">
            Login
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <div>
      <AppBar>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpenDrawerMenu(true)}
            edge="start"
            className={classes.menuButton}
          >
            <Icon icon="Menu" />
          </IconButton>
          <Typography className={classes.title} variant="h6">
            {currentPage}
          </Typography>
          {connected ? (
            <div>
              <div className={classes.sectionDesktop}>
                {WarehouseSelect}
                {CurrentUser}
              </div>
              <div className={classes.sectionMobile}>
                <IconButton onClick={handleMobileMenuOpen} color="inherit">
                  <Icon icon="ExpandMore" />
                </IconButton>
              </div>
            </div>
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>
      {connected ? (
        <>
          <DrawerMenu
            open={openDrawerMenu}
            setOpen={setOpenDrawerMenu}
            userRole={user?.role}
          />
          {/*Mobile "expended" menu*/}
          <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id="account-menu-mobile"
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
          >
            <CenteredMenuItem>{CurrentUser}</CenteredMenuItem>
            {WarehouseSelect && (
              <CenteredMenuItem>{WarehouseSelect}</CenteredMenuItem>
            )}
          </Menu>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
