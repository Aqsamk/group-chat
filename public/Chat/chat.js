


// const messageForm = document.getElementById('message-form');
// const messageInput = document.getElementById('message-input');
// const messageList = document.getElementById('message-list');

// messageForm.addEventListener('submit', async (event) => {
//   event.preventDefault();
//   let messages = {messageInp: messageInput.value,}
//   const token = localStorage.getItem('token');
//   try {
//     const response = await axios.post('http://localhost:3000/user/chat',messages ,{headers:{Authorization:token}
      
//     });
//     const message = response.data.message;
//     const li = document.createElement('li');
//     li.innerHTML = `<span>${message.User.name}:</span> ${message.message}`;
//     messageList.appendChild(li);
//     messageInput.value = '';
//   } catch (error) {
//     console.error(error);
//   }
// });

// async function loadMessages() {
//   try {
//     const token  = localStorage.getItem('token')
//     // const decodeToken = parseJwt(token)
//     // console.log(decodeToken)
//     const response = await axios.get('http://localhost:3000/user/getchat',{ headers: {"Authorization" : token} });
//     const messages = response.data.messages;
//     for (const message of messages) {
//       const li = document.createElement('li');
//       li.innerHTML = `<span>${message.User.name}:</span> ${message.messageInp}`;
//       messageList.appendChild(li);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

///////////////////////////////////////////////////////

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

window.addEventListener('DOMContentLoaded', ()=> {
  const token  = localStorage.getItem('token')
  const decodeToken = parseJwt(token)
  console.log(decodeToken)
  const name = decodeToken.name;
  console.log(name)
  axios.get('http://localhost:3000/user/getchat', { headers: {"Authorization" : token} })
  .then(response => {
          response.data.messages.forEach(message => {

            addNewMessagetoUI(message);
          })
  }).catch(err => {
      showError(err)
  })
});
//
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
}

function showError(err){
  console.log(err);
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

