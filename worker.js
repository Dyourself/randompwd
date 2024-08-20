addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname === '/generate') {
    return handleGenerateRequest(url)
  }

  return new Response(renderHTML(), {
    headers: { 'Content-Type': 'text/html' }
  })
}

function handleGenerateRequest(url) {
  const numPasswords = parseInt(url.searchParams.get('numPasswords')) || 1;
  const length = parseInt(url.searchParams.get('length')) || 12;
  const useUppercase = url.searchParams.get('uppercase') === 'true';
  const useLowercase = url.searchParams.get('lowercase') === 'true';
  const useNumbers = url.searchParams.get('numbers') === 'true';
  const useSymbols = url.searchParams.get('symbols') === 'true';

  const passwords = [];

  for (let i = 0; i < numPasswords; i++) {
    passwords.push(generatePassword(length, useUppercase, useLowercase, useNumbers, useSymbols));
  }

  return new Response(passwords.join('\n'), {
    headers: { 'Content-Type': 'text/plain' }
  });
}

function generatePassword(length, useUppercase, useLowercase, useNumbers, useSymbols) {
  let charset = '';
  if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (useNumbers) charset += '0123456789';
  if (useSymbols) charset += '!@#$%^&*()_+~';

  if (charset.length === 0) {
    return 'Please select at least one character set.';
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

function renderHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Generator</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f4f4f4;
      margin: 0;
    }
    .container {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
    }
    input[type="number"] {
      width: 50px;
      margin-bottom: 20px;
    }
    button {
      padding: 10px 20px;
      background-color: #007BFF;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
    .output {
      margin-top: 20px;
      white-space: pre-wrap;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Generator</h1>
    <label for="numPasswords">Number of Passwords:</label>
    <input type="number" id="numPasswords" value="1" min="1" />

    <label for="length">Password Length:</label>
    <input type="number" id="length" value="12" min="1" />

    <label>
      <input type="checkbox" id="uppercase" checked /> Include Uppercase Letters
    </label>
    <label>
      <input type="checkbox" id="lowercase" checked /> Include Lowercase Letters
    </label>
    <label>
      <input type="checkbox" id="numbers" checked /> Include Numbers
    </label>
    <label>
      <input type="checkbox" id="symbols" /> Include Symbols
    </label>

    <button onclick="generatePasswords()">Generate Passwords</button>

    <div class="output" id="output"></div>
  </div>

  <script>
    async function generatePasswords() {
      const numPasswords = document.getElementById('numPasswords').value;
      const length = document.getElementById('length').value;
      const uppercase = document.getElementById('uppercase').checked;
      const lowercase = document.getElementById('lowercase').checked;
      const numbers = document.getElementById('numbers').checked;
      const symbols = document.getElementById('symbols').checked;

      const params = new URLSearchParams({
        numPasswords,
        length,
        uppercase,
        lowercase,
        numbers,
        symbols
      });

      const response = await fetch('/generate?' + params.toString());
      const passwords = await response.text();

      document.getElementById('output').textContent = passwords;
    }
  </script>
</body>
</html>
  `;
}
