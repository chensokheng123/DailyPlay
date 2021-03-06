import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import TextField from '@material-ui/core/TextField';
import { Button, fade, Grow } from '@material-ui/core';
import firebase from '../../utils/firebase';
import ThemeApi from '../../utils/ThemeApi';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: '500px',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minHeight: '40vh',
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'column',
  },
  btn: {
    background: '#242526',
    color: '#fff',
    '&:hover': {
      background: fade('#242526', 0.35),
    },
    padding: theme.spacing(2, 0),
    fontSize: '1rem',
    fontFamily: 'Quicksand',
  },
  input: {
    margin: theme.spacing(2, 0),
  },
  title: {
    fontSize: '2rem',
    fontFamily: 'Quicksand',
  },
  errorMsg: {
    color: 'red',
    fontSize: '1rem',
    fontFamily: 'Quicksand',
    letterSpacing: theme.spacing(0.2),
  },
}));

export default function SignUp({ open, setOpen }) {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [username, setUsername] = useState('');
  const { setAuthroize, setUser } = useContext(ThemeApi);
  const handleOnChange = (e) => {
    if (e.target.name === 'password') {
      setPassword(e.target.value);
    } else if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else {
      setUsername(e.target.value);
    }
  };

  const handleSubmit = async () => {
    if (username.trim().length === 0) {
      setErrorMsg('Please enter username');
      return;
    }
    const scoreRef = firebase.database().ref('Score').child(username);
    scoreRef.once('value', (snapshot) => {
      if (!snapshot.val()) {
        scoreRef.set({
          score: 0,
          updated: false,
        });
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((result) => {
            if (result.user) {
              result.user.updateProfile({ displayName: username });
              setAuthroize(true);
              setUser(result.user);
            }
          })
          .catch((e) => {
            setErrorMsg(e.message);
            scoreRef.remove();
          });
      } else {
        setErrorMsg('Username is already exist!!');
        return false;
      }
    });
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Grow
          in={open}
          style={{ transformOrigin: '0 0 0' }}
          {...(open ? { timeout: 1000 } : {})}
        >
          <div className={classes.paper}>
            <Typography className={classes.title}>SIGN UP</Typography>
            <Typography className={classes.errorMsg}>{errorMsg}</Typography>
            <TextField
              required
              className={classes.input}
              value={username}
              label="Username"
              helperText="You can not change the username"
              variant="outlined"
              name="username"
              onChange={handleOnChange}
            />

            <TextField
              className={classes.input}
              value={email}
              label="Email Address"
              helperText=""
              variant="outlined"
              name="email"
              onChange={handleOnChange}
            />
            <TextField
              className={classes.input}
              value={password}
              label="Password"
              helperText=""
              variant="outlined"
              type="password"
              name="password"
              onChange={handleOnChange}
            />
            <Button className={classes.btn} onClick={handleSubmit}>
              SIGN UP
            </Button>
          </div>
        </Grow>
      </Modal>
    </div>
  );
}
