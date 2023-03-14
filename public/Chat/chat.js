async function chating(e) {
    try {
      e.preventDefault();
      const chatstarted = {
        message : e.target.messageInp.value,
      };
      console.log(chatstarted);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/user/chat",
        chatstarted,
        { headers: { Authorization: token } }
      );
      addNewMessagetoUI(response);
      console.log(response)
    } catch (err) {
      console.log(err)
    }
  }

  function displayMessages(messages) {
    const messageList = document.getElementById('message-list');
    
    // Clear message list
    messageList.innerHTML = '';
    
    // Add each message to message list
    messages.forEach((message) => {
      const li = document.createElement('li');
      li.innerText = `${message.user}: ${message.message}`;
      messageList.appendChild(li);
    });
  }


  axios.get('/messages')
  .then((response) => {
    const messages = response.data;
    displayMessages(messages);
  })
  .catch((error) => {
    console.log(error);
  });