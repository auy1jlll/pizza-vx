const token = "20f3fc433ce77dbcc466dec9f1a3b02df22d9b78aa0ab6b52124e52179632e19";

fetch('http://localhost:3005/api/auth/validate-reset-token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ token })
})
.then(response => response.json())
.then(data => console.log('Token validation result:', data))
.catch(error => console.error('Error:', error));
