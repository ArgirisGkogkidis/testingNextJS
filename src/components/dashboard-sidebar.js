import React, { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import { Selector as SelectorIcon } from '../icons/selector';
import { ShoppingBag as ShoppingBagIcon } from '../icons/shopping-bag';
import { Users as UsersIcon } from '../icons/users';
import { XCircle as XCircleIcon } from '../icons/x-circle';
import { Logo } from './logo';
import { NavItem } from './nav-item';

import GetAppIcon from '@mui/icons-material/GetApp';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import SendIcon from '@mui/icons-material/Send';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';

const adminNavigation = [
  {
    href: '/admin',
    icon: (<ChartBarIcon fontSize="small" />),
    title: 'Dashboard'
  },
  {
    href: '/admin/userpermissions',
    icon: (<UsersIcon fontSize="small" />),
    title: 'User Managment'
  },
  {
    href: '/admin/ingridients',
    icon: (<ShoppingBagIcon fontSize="small" />),
    title: 'Ingridients'
  },
  {
    href: '/admin/manage',
    icon: (<ShoppingBagIcon fontSize="small" />),
    title: 'Set contract access'
  }]
const userNavigation = [
  {
    href: '/user',
    icon: (<ChartBarIcon fontSize="small" />),
    title: 'Dashboard'
  },
  {
    href: '/user/minttoken',
    icon: (<DataSaverOnIcon />),
    title: 'Mint Token'
  },
  {
    href: '/user/pack',
    icon: (<DataSaverOnIcon />),
    title: 'Pack Token'
  },
  {
    href:'/user/viewpack',
    icon: (<DataSaverOnIcon />),
    title: 'My Packs'
  },
  {
    href: '/404',
    icon: (<XCircleIcon fontSize="small" />),
    title: 'Error'
  }
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const user = props.user;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  const [trackingStatus, setTrackingStatus] = React.useState(false)

  async function checkTrackingStatus() {
    const trackingContract = props.tracking;
    const response = await trackingContract.methods.get_management_sc().call({ from: props.accounts })
    setTrackingStatus(response === props.management.options.address)
  }

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
      checkTrackingStatus()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink
              href="/"
              passHref
            >
              <a>
                <Logo
                  sx={{
                    height: 42,
                    width: 42
                  }}
                />
              </a>
            </NextLink>
          </Box>
          <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                px: 3,
                py: '11px',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <div>
                <Typography
                  color="inherit"
                  variant="subtitle1"
                >
                  Blockchain Food Supply
                </Typography>
                <Typography
                  color="neutral.400"
                  variant="body2"
                >
                  Welcome
                  {' '}
                  : {user.firstName} {' '} {user.lastName}
                </Typography>
                <Typography
                  color="neutral.400"
                  variant="body2"
                >
                  Your access
                  {' '}
                  : {props.isadmin ? "Admin" : "User"}
                </Typography>

                {props.isadmin ?
                  <>
                    <Typography
                      color="neutral.400"
                      variant="body2"
                      noWrap
                      gutterBottom
                    >
                      Management Address:<br></br>
                      <span style={{ 'wordWrap': 'break-word' }}>
                        {props.management.options.address}
                      </span>
                    </Typography>
                    <Typography
                      color="neutral.400"
                      variant="body2"
                      noWrap
                      gutterBottom
                    >
                      Tracking Address:<br></br>
                      {props.tracking.options.address}
                    </Typography>
                  </> : <> </>
                }
                <Typography>
                  Tracking Status {' '}: {trackingStatus ? "Active" : "Inactive"}
                </Typography>
              </div>
              <SelectorIcon
                sx={{
                  color: 'neutral.500',
                  width: 14,
                  height: 14
                }}
              />
            </Box>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {
            props.isadmin &&
            adminNavigation.map((item) => (
              <NavItem
                key={item.title}
                icon={item.icon}
                href={item.href}
                title={item.title}
              />
            ))
          }
          {
            !props.isadmin && userNavigation.map((item) => (
              <NavItem
                key={item.title}
                icon={item.icon}
                href={item.href}
                title={item.title}
              />
            ))
          }
        </Box>
        <Divider sx={{ borderColor: '#2D3748' }} />
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
