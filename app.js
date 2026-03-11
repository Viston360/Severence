async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({username, password})
  });

  if(res.ok){
    showLinks();
  } else {
    alert('Login failed!');
  }
}

async function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/register', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({username, password})
  });

  if(res.ok){
    alert('Registered! Please login.');
  } else {
    alert('User exists!');
  }
}

async function touchLogin() {
  alert('Touch ID demo: login with password first to simulate Touch ID');
  // WebAuthn simplified
  login();
}

function showLinks() {
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('links-container').style.display = 'block';
  loadLinks();
}

async function addLink() {
  const url = document.getElementById('newLink').value;
  await fetch('/add-link', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({url})
  });
  document.getElementById('newLink').value = '';
  loadLinks();
}

async function loadLinks() {
  const res = await fetch('/links');
  const links = await res.json();
  const ul = document.getElementById('linkList');
  ul.innerHTML = '';
  links.forEach(link => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
    ul.appendChild(li);
  });
}
