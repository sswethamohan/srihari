// payment.js
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const amount = urlParams.get('amount');
    document.getElementById('amount').value = amount;
});

document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const upiId = document.getElementById('upi-id').value;
    const amount = document.getElementById('amount').value;

    if (upiId === '') {
        alert('Please enter your UPI ID.');
        return;
    }

    // Construct the UPI URL for Google Pay
    const upiPaymentUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=MerchantName&am=${encodeURIComponent(amount)}&cu=INR&url=https://pay.google.com`;

    // Redirect to the UPI payment URL
    window.location.href = upiPaymentUrl;

    alert(`Redirecting to Google Pay for payment of ₹${amount} to ${upiId}.`);

    // After a successful payment, send order details to WhatsApp
    setTimeout(() => {
        const orderDetails = `Payment of ₹${amount} successful to ${upiId}. Order details: ...`; // Customize this message
        const phoneNumber = '9486439344'; // Replace with the actual WhatsApp number

        fetch('http://localhost:3000/send-whatsapp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber, message: orderDetails })
        }).then(response => response.json()).then(data => {
            if (data.success) {
                alert('Order details sent to WhatsApp successfully.');
            } else {
                alert('Failed to send order details to WhatsApp.');
            }
        }).catch(error => {
            alert('Error sending order details to WhatsApp: ' + error.message);
        });
    }, 5000); // Adjust the delay as necessary to allow time for payment processing
});
