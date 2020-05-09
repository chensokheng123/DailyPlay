import React, { useState, useEffect, useContext } from 'react';
import { Button, fade, Grow, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Loading from '../../LoadingScreen/Loading';
import ThemeApi from '../../../utils/ThemeApi';
import firebase from '../../../utils/firebase';

const useStyles = makeStyles((theme) => ({
  btnFind: {
    background: '#1CA1F2',
    color: '#fff',
    fontSize: '1.2rem',
    letterSpacing: theme.spacing(0.5),
    fontFamily: 'Quicksand',
    '&:hover': {
      background: fade('#1CA1F2', 0.65),
    },
  },
  container: {
    height: '90vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  findingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finding: {
    fontSize: '2rem',
    color: '#fff',
    fontFamily: 'Quicksand',
    letterSpacing: theme.spacing(0.5),
  },
  btnCancel: {
    background: 'red',
    color: '#fff',
    padding: theme.spacing(1, 6),
    fontSize: '1rem',
    letterSpacing: theme.spacing(0.5),
    fontFamily: 'Quicksand',
    '&:hover': {
      background: fade('#ff0000', 0.65),
    },
  },
}));

export default function Find() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const { user } = useContext(ThemeApi);
  const handleCancel = () => {
    setOpen(!open);
  };
  const handleFind = () => {
    setOpen(!open);
  };

  // Listen for database change
  const listenQueue = () => {
    const QueueRef = firebase.database().ref(`Queues`);
    QueueRef.on('value', (snapshot) => {
      const queues = snapshot.val();
      for (let id in queues) {
        if (queues[id].isFull) {
          console.log(
            `MATCH FOUND:\nHOST:${queues[id].host}, CLIENT:${queues[id].client}`
          );
          QueueRef.child(id).remove();
        }
      }
    });
  };
  useEffect(() => {
    listenQueue();
  }, []);

  return (
    <div className={classes.container}>
      <Grow in={!open}>
        <Button className={classes.btnFind} onClick={handleFind}>
          Find Opponent
        </Button>
      </Grow>

      <Grow in={open}>
        <div>
          <div className={classes.findingContainer}>
            <Typography className={classes.finding}>Finding</Typography>
            <Loading color="#fff" height="30px" width="30px" />
          </div>
          <Button className={classes.btnCancel} onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Grow>
    </div>
  );
}
