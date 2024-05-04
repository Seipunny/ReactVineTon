const express = require('express');
const cors = require('cors');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./firebaseAdminConfig.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(cors());
app.use(express.json());

app.get('/getCount', async (req, res) => {
  const { userId } = req.query;
  const usersRef = db.collection('users').doc(userId);

  try {
    const doc = await usersRef.get();
    if (doc.exists) {
      res.status(200).send({ count: doc.data().count });
    } else {
      res.status(200).send({ count: 0 }); // No record found, return count as 0
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.post('/updateCount', async (req, res) => {
  const { userId } = req.body;
  const usersRef = db.collection('users').doc(userId);

  try {
    const result = await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(usersRef);
      let newCount;
      if (doc.exists) {
        newCount = doc.data().count + 1;
        transaction.update(usersRef, { count: newCount });
      } else {
        newCount = 1;
        transaction.set(usersRef, { count: newCount });
      }
      return newCount;
    });
    res.status(200).send(`User registered or updated. Current count: ${result}`);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
