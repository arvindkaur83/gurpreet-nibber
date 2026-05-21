firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// 🔐 App Check
const appCheck = firebase.appCheck();

appCheck.activate(
  "6LemS_YsAAAAAAqHAU0w5LPX8KwrV1llavFIq4q0",
  true // auto refresh tokens
);