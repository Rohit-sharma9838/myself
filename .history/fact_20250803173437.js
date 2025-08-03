function generateQR() {
  const input = document.getElementById("qrText").value;
  const qrImage = document.getElementById("qrImage");

  if (!input.trim()) {
    alert("Please enter text or a URL!");
    return;
  }

  const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    input
  )}&size=200x200`;

  qrImage.src = qrAPI;
}
