import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import mascot from '../assets/logo.png';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../modules/user-management/hooks/useAuth';
import './navbar.css';

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const {logout, user} = useAuth();
  const settings = [{label: 'Logout', onPress: () => logout()}];
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Container maxWidth="xl">
      <Toolbar disableGutters style={{justifyContent: 'space-between'}}>
        <img src={mascot} alt="logo" style={{width: '190px', height: '38px',resize:'contain'}} />
        <Box sx={{flexGrow: 0}}>
          {!user?.name ? (
            <button className="login-button" onClick={() => navigate('/login')}>
              Login
            </button>
          ) : (
            <>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                  <Avatar alt={user?.name} src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{mt: '45px'}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}>
                {settings.map(setting => (
                  <MenuItem
                    key={setting.label}
                    onClick={() => {
                      handleCloseUserMenu();
                      setting.onPress();
                    }}>
                    <Typography sx={{textAlign: 'center'}}>
                      {setting.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </Container>
  );
}
export default ResponsiveAppBar;
