// async function addNewMessage(e){
//   e.preventDefault();

//   const messageDetails = {
//       messageInp : e.target.messageInp.value
//   }
//   console.log(messageDetails)
//   const token  = localStorage.getItem('token')
//   await axios.post('http://localhost:3000/user/chat',messageDetails,  { headers: {"Authorization" : token} })
//       .then((response) => {

//         addNewMessagetoUI(response.data.message);

//   }).catch(err => showError(err))
  
// }

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

async function addNewMessage(e) {
  e.preventDefault();

  const messageDetails = {
    messageInp: e.target.messageInp.value
  };

  console.log(messageDetails);

  const token = localStorage.getItem('token');

  try {
    const response = await axios.post(
      'http://localhost:3000/user/chat',
      messageDetails,
      { headers: { Authorization: token } }
    );

    addNewMessagetoUI(response.data.message);
  } catch (err) {
    showError(err);
  }
}

// Define the parseJwt function to decode a JWT token
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// Define the getChatMessages function to retrieve all chat messages from the server
async function getChatMessages(token) {
  // Get the messages from local storage if available
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  messages.forEach((message) => {
    addNewMessagetoUI(message);
  });

  try {
    const response = await axios.get('http://localhost:3000/user/getchat', {
      headers: { Authorization: token }
    });

    response.data.messages.forEach((message) => {
      addNewMessagetoUI(message);
    });
  } catch (err) {
    showError(err);
  }
}

// Define the getNewChatMessages function to retrieve new chat messages from the server
let lastMessageTimestamp = null;

async function getNewChatMessages(token) {
  try {
    const response = await axios.get('http://localhost:3000/user/getchat', {
      headers: { Authorization: token },
      params: { after: lastMessageTimestamp }
    });

    response.data.messages.forEach((message) => {
      addNewMessagetoUI(message);
    });

    // Update the timestamp of the latest message we received
    const lastMessage = response.data.messages[response.data.messages.length - 1];
    if (lastMessage) {
      lastMessageTimestamp = lastMessage.createdAt;
      localStorage.setItem('lastMessageTimestamp', lastMessageTimestamp);
    }
  } catch (err) {
    showError(err);
  }
}

// Call the getChatMessages function once on page load
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const decodeToken = parseJwt(token);
  const name = decodeToken.name;
  getChatMessages(token);
});

// Call the getNewChatMessages function every 5 seconds using setInterval
const token = localStorage.getItem('token');

// setInterval(() => {
//   getNewChatMessages(token);
// }, 5000);

// Define the addNewMessagetoUI function to add a new message to the UI
function addNewMessagetoUI(message) {
  const token = localStorage.getItem('token');
  const decodeToken = parseJwt(token);
  const name = decodeToken.name;
  const parentElement = document.getElementById('listofmessages');
  const messageElemId = `message-${message.id}`;
  parentElement.innerHTML += `
    <div id=${messageElemId}>
      ${message.userName}: ${message.messageInp}
    </div>
  `;

  // Store the message in local
   // Store the message in local storage
   const messages = JSON.parse(localStorage.getItem("messages")) || [];
   messages.push(message);
   localStorage.setItem("messages", JSON.stringify(messages));
}

function showError(err){
  console.log(err);
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

