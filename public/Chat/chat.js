async function addNewMessage(e){
  e.preventDefault();

  const messageDetails = {
      messageInp : e.target.messageInp.value
  }
  console.log(messageDetails)
  const token  = localStorage.getItem('token')
  await axios.post('http://localhost:3000/user/chat',messageDetails,  { headers: {"Authorization" : token} })
      .then((response) => {

        addNewMessagetoUI(response.data.message);

  }).catch(err => showError(err))
  
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}


// Define a function to make the API request

// const getChatMessages = (token) => {
//   axios.get('http://localhost:3000/user/getchat', { headers: {"Authorization" : token} })
//     .then(response => {
//       response.data.messages.forEach(message => {
//         addNewMessagetoUI(message);
//       })
//     })
//     .catch(err => {
//       showError(err)
//     });
// };

// Call the function once on page load
const getChatMessages = (token) => {
  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  messages.forEach((message) => {
    addNewMessagetoUI(message);
  });

  axios
    .get("http://localhost:3000/user/getchat", { headers: { Authorization: token } })
    .then((response) => {
      response.data.messages.forEach((message) => {
        addNewMessagetoUI(message);
      });
    })
    .catch((err) => {
      showError(err);
    });
};



let lastMessageTimestamp = null;

const getNewChatMessages = (token) => {
  axios
    .get("http://localhost:3000/user/getchat", {
      headers: { Authorization: token },
      params: { after: lastMessageTimestamp },
    })
    .then((response) => {
      response.data.messages.forEach((message) => {
        addNewMessagetoUI(message);
      });

      // Update the timestamp of the latest message we received
      const lastMessage = response.data.messages[response.data.messages.length - 1];
      if (lastMessage) {
        lastMessageTimestamp = lastMessage.createdAt;
        localStorage.setItem("lastMessageTimestamp", lastMessageTimestamp);
      }
    })
    .catch((err) => {
      showError(err);
    });
};

// Call the function every 5 seconds using setInterval
const token = localStorage.getItem("token");
getChatMessages(token);

setInterval(() => {
  getNewChatMessages(token);
}, 5000);


window.addEventListener('DOMContentLoaded', ()=> {
  const token  = localStorage.getItem('token');
  const decodeToken = parseJwt(token);
  console.log(decodeToken);
  const name = decodeToken.name;
  console.log(name);
  getChatMessages(token);
});

// Call the function every 5 seconds using setInterval
setInterval(() => {
  const token  = localStorage.getItem('token');
  getChatMessages(token);
}, 3000);
const intervalId = setInterval(() => {
  getChatMessages(token);
}, 5000);

// Stop the interval after 1 minute
setTimeout(() => {
  clearInterval(intervalId);
}, 40000);



function addNewMessagetoUI(message){
  const token  = localStorage.getItem('token')
  const decodeToken = parseJwt(token)
  //console.log(decodeToken)
  const name = decodeToken.name;
  const parentElement = document.getElementById('listofmessages');
  const messageElemId = `message-${message.id}`;
  parentElement.innerHTML += `
      <div id=${messageElemId} >
        ${message.userName} : ${message.messageInp}
         
      </div>`

   // Store the message in local storage
   const messages = JSON.parse(localStorage.getItem("messages")) || [];
   messages.push(message);
   localStorage.setItem("messages", JSON.stringify(messages));
}

function showError(err){
  console.log(err);
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

