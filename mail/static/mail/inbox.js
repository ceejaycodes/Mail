document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
 

  // By default, load the inbox
  load_mailbox('inbox');

  // handle compose form submission
  document.querySelector('#compose-form').addEventListener('submit', send_mail);
});


// function to send mail
function send_mail(event){
  event.preventDefault();

const receivers = document.querySelector("#compose-recipients").value;
const subject = document.querySelector("#compose-subject").value;
const emailBody = document.querySelector("#compose-body").value;
  fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: receivers,
          subject: subject,
          body: emailBody
        })
      })

      .then(response => response.json())
      .then(mailbox => {
        load_mailbox(mailbox='sent')})
      };

 // function to reply mail
function reply_mail(id){
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single-page').style.display = 'none';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    const sender =email.sender
    const recepients = email.recipients
    const subject =email.subject.charAt(0).toUpperCase() + email.subject.slice(1)
    const body =email.body
    const timestamp =email.timestamp

    document.querySelector("#compose-recipients").value = sender
    document.querySelector("#compose-subject").value = `RE:${subject}`
    document.querySelector("#compose-body").value = `On ${timestamp}, ${sender} wrote: ${body}...`
  });


        };


function view_mail(id){
  // Show the mailbox and hide other views
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single-page').style.display = 'block';
 
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
            read: true
       })
     })
  // fetch email by id
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    const sender =email.sender
    const recepients = email. recipients
    const subject =email.subject.charAt(0).toUpperCase() + email.subject.slice(1)
    const body =email.body
    const timestamp =email.timestamp
    const viewpage = document.querySelector('#single-page')
    viewpage.innerHTML = `<div>
    <span>From: <strong>${sender}</strong> To:<strong>${recepients}</strong> </span> 
    <h3>${subject}</h3> 
    <p>${body}</p> 
    <i><p>${timestamp}</p></i>
    <button id='archive' class='btn btn-primary'>Archive</button>
    <button id='reply' class='btn btn-success'>Reply</button>
    </div>`;
    
     // get archive button
  const archivebtn = document.querySelector('#archive')
  const replybtn = document.querySelector('#reply')
  replybtn.addEventListener('click', () => reply_mail(email.id))

    // run check if the email is archived
  if(email.archived){
    archivebtn.innerHTML = 'Unarchive'
    archivebtn.addEventListener('click',() =>{  
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
              archived: false
         })
       })
        .then(mailbox => {
        load_mailbox(mailbox='inbox')});
      })
  
  } else
      {
      archivebtn.innerHTML = 'Archive'
      archivebtn.addEventListener('click',() =>{
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
                archived: true
           })
         })
          .then(mailbox => {
          load_mailbox(mailbox='archive')});
        })  
    };

  });
   
      };

// function to display the compose form
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single-page').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
};


// function to load mailbox
function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-page').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  

  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  
  // create unorderedlist
  const unordered = document.createElement('ul');

  // add classes for styling
  unordered.classList.add('list-group');
  unordered.classList.add('list-group-flush');
  document.querySelector('#emails-view').append(unordered);
 
   
  // // fetch mail from server
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => emails.forEach(email => {
    const id = email.id;
    const sender = email.sender;
    const subject = email.subject;
    const time = email.timestamp;
    const read = email.read;
    const element = document.createElement('li');
    const origin = (read) ? "gray":"white";
    element.style.backgroundColor = origin
    element.classList.add('list-group-item');
    element.classList.add('list-style');
    element.classList.add('element')
    element.innerHTML = `<span><strong><p>${sender}</p></strong>  <p>${subject}</p>  <p>${time}</p></span>`;
    element.style.border = 'ridge'
    element.addEventListener('mouseover', function(){element.style.backgroundColor = '#0b6efd';
    element.style.color = 'white';})
    element.addEventListener('mouseout', function(){element.style.backgroundColor = origin;
    element.style.color = 'black';})
    element.addEventListener('click', function(){
      view_mail(id)
    });
    unordered.append(element);
  }));
};




 




