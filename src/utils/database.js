import firebase from './firebase';

const findOpponent = (userID) => {
  const QueuesRef = firebase.database().ref('Queues');
  QueuesRef.once('value', (snapshot) => {
    const queues = snapshot.val();
    if (!queues) {
      QueuesRef.child(userID).set({
        isFull: false,
        host: userID,
        client: '',
      });
    } else {
      for (let queueId in queues) {
        if (!queues[queueId].isFull) {
          QueuesRef.child(queueId).update({
            isFull: true,
            client: userID,
          });
        } else {
          QueuesRef.child(userID).set({
            isFull: false,
            host: userID,
            client: '',
          });
        }
      }
    }
  });
};

const listenQueue = (userID, history) => {
  const QueueRef = firebase.database().ref(`Queues`);
  QueueRef.on('value', (snapshot) => {
    const queues = snapshot.val();
    for (let id in queues) {
      if (
        queues[id].isFull &&
        [queues[id].host, queues[id].client].includes(userID)
      ) {
        console.log(
          `MATCH FOUND:\nHOST:${queues[id].host}, CLIENT:${queues[id].client}`
        );

        // create board
        const MatchRef = firebase.database().ref('Matches');
        const myBoard = MatchRef.child(userID);

        const opponent = [queues[id].host, queues[id].client].filter(
          (id) => id !== userID
        )[0];

        myBoard.set({
          board: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          playerTurn: queues[id].host,
          move: userID === queues[id].host ? 'x' : 'o',
          opponent,
        });

        // remove queue
        QueueRef.child(id).remove();

        // update user score
        const username = firebase.auth().currentUser.displayName;
        const scoreRef = firebase.database().ref(`Score/${username}`);
        scoreRef.update({
          updated: false,
        });

        // enter the game
        history.push('/tictactoe/play');
      }
    }
  });
};

const cancelFind = (userID) => {
  firebase.database().ref(`Queues/${userID}`).remove();
};

export { findOpponent, listenQueue, cancelFind };
