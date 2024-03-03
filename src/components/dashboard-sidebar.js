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
  }]

export const DashboardSidebar = (props) => {
  const { open, onClose, management, accounts,tracking } = props;
  const user = props.user;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  const [trackingStatus, setTrackingStatus] = React.useState(false)
  // State to store dynamic navigation
  const [navigation, setNavigation] = React.useState([]);

  async function checkTrackingStatus() {
    const response = await tracking.methods.get_management_sc().call({ from: props.accounts })
    setTrackingStatus(response === props.management.options.address)
  }

  // Function to fetch user permissions and update navigation
  const updateUserNavigation = async () => {
    if (!management) return;

    const userPerms = await management.methods.get_user_perms(accounts).call();
    // Build dynamic navigation based on permissions
    const dynamicNavigation = [
      { href: '/user', icon: (<ChartBarIcon fontSize="small" />), title: 'Dashboard' },
      ...(userPerms.canPack ? [{ href: '/user/recipe', icon: (<HorizontalSplitIcon fontSize="small" />), title: 'Manage Recipes' }] : []),
      ...(userPerms.canPack ? [{ href: '/user/pack', icon: (<HorizontalSplitIcon fontSize="small" />), title: 'Manage Pack' }] : []),
      // Add more conditions based on permissions
    ];

    setNavigation(dynamicNavigation);
  };

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }
      updateUserNavigation();
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
                      {tracking.options.address}
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
            !props.isadmin && navigation.map((item) => (
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
