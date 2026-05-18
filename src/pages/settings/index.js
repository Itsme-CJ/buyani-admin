import {
  Box, Button, CircularProgress, Container, Divider,
  Grid, IconButton, InputAdornment, Paper, Typography
} from '@material-ui/core';
import { TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import React, { useContext, useEffect, useState } from 'react';
import Title from '../../components/title';
import useStyles from './styles';
import { AuthContext } from '../../context/AuthContext';
import api from '../../service/api';
import { request } from '../../service/request';
import { API_METHOD } from '../../utility/constant';

const Settings = (props) => {
  const { notify } = props;
  const classes = useStyles();
  const { state } = useContext(AuthContext);

  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [email, setEmail]           = useState('');
  const [phoneNumber, setPhone]     = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving]     = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [loading, setLoading]   = useState(true);

  // â”€â”€ Load current user â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const load = async () => {
      try {
        const res = await request({ url: api.USERS_BY_TOKEN, method: API_METHOD.GET });
        const u = res.data;
        setFirstName(u.firstName || '');
        setLastName(u.lastName   || '');
        setEmail(u.email         || '');
        setPhone(u.phoneNumber   || '');
      } catch (e) {
        notify('error', 'Failed to load account info.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // â”€â”€ Save profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      notify('error', 'First name, last name and email are required.');
      return;
    }
    setSaving(true);
    try {
      await request({
        url: `${api.USER_API}/update`,
        method: API_METHOD.PATCH,
        data: {
          userId: state.user?.userId,
          firstName,
          lastName,
          email,
          phoneNumber,
        },
      });
      notify('success', 'Profile updated successfully!');
    } catch (e) {
      notify('error', 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // â”€â”€ Change password â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      notify('error', 'Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      notify('error', 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      notify('error', 'Password must be at least 6 characters.');
      return;
    }
    setChangingPw(true);
    try {
      await request({
        url: `${api.USER_API}/update`,
        method: API_METHOD.PATCH,
        data: {
          userId: state.user?.userId,
          password: newPassword,
        },
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      notify('success', 'Password changed successfully!');
    } catch (e) {
      notify('error', 'Failed to change password.');
    } finally {
      setChangingPw(false);
    }
  };

  if (loading) {
    return (
      <Container className={classes.container}>
        <Title name="Account Settings" />
        <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container className={classes.container}>
      <Title name="Account Settings" />

      {/* â”€â”€ Profile Info â”€â”€ */}
      <Paper className={classes.paper}>
        <Box style={{ padding: '16px 16px 0' }}>
          <Typography variant="subtitle1"><strong>Profile Information</strong></Typography>
        </Box>
        <Grid container spacing={2} style={{ padding: '16px' }}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              value={phoneNumber}
              onChange={e => setPhone(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
        <Box className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? <CircularProgress color="inherit" size={22} /> : 'Save Changes'}
          </Button>
        </Box>
      </Paper>

      {/* â”€â”€ Change Password â”€â”€ */}
      <Paper className={classes.paper} style={{ marginTop: '24px' }}>
        <Box style={{ padding: '16px 16px 0' }}>
          <Typography variant="subtitle1"><strong>Change Password</strong></Typography>
        </Box>
        <Grid container spacing={2} style={{ padding: '16px' }}>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowCurrent(p => !p)}>
                      {showCurrent ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <TextField
              fullWidth
              label="New Password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowNew(p => !p)}>
                      {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowConfirm(p => !p)}>
                      {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Box className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleChangePassword}
            disabled={changingPw}
          >
            {changingPw ? <CircularProgress color="inherit" size={22} /> : 'Change Password'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;

