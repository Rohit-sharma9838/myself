document.getElementById('liveDemoBtn').addEventListener('click', function() {
  var iframe = document.getElementById('liveDemoFrame');
  iframe.style.display = 'block';  // iframe show kar do
  iframe.src = 'https://example.com/live-demo-url';  // apni live demo ki URL daal do
});