// Function to handle the visibility of the phone input based on the selected contact method
document.getElementById('contact').addEventListener('change', function () {
    const phoneInput = document.getElementById('phoneInput');
    const phoneLabel = document.getElementById('phoneLabel');
    if (this.value === 'phone') {
        phoneInput.style.display = 'block';  // Show phone number input
        phoneLabel.style.display = 'block';  // Show phone label
    } else {
        phoneInput.style.display = 'none';   // Hide phone number input
        phoneLabel.style.display = 'none';   // Hide phone label
    }
});

// Function to handle form submission and provide real-time feedback
document.getElementById('userForm').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent default form submission

    const formData = new FormData(this);  // Capture form data

    try {
        // Example request (adjust the URL and logic based on your backend)
        const response = await fetch('/send-email', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // If form submission is successful
            document.getElementById('formMessage').style.display = 'block';
            document.getElementById('formError').style.display = 'none';

            // Optionally, display form submission summary
            displayFormSummary(formData);
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        // If an error occurs during form submission
        document.getElementById('formError').style.display = 'block';
        document.getElementById('formMessage').style.display = 'none';
    }
});

// Function to display the form submission summary
function displayFormSummary(formData) {
    const summaryElement = document.getElementById('summary');
    const name = formData.get('name');
    const email = formData.get('email');
    const contact = formData.get('contact');
    const phone = formData.get('phone');

    summaryElement.innerHTML = `
        <strong>Form Submission Summary:</strong><br>
        Name: ${name}<br>
        Email: ${email}<br>
        Preferred Contact: ${contact === 'phone' ? `Phone (${phone})` : 'Email'}
    `;
}
