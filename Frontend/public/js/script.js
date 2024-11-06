function toggleDetails() {
    const responseDiv = document.getElementById('response');
    const openButton = document.getElementById('openButton');
    
    if (responseDiv.style.display === 'block') {
        responseDiv.style.display = 'none';
        openButton.innerText = 'Open';
    } else {
        responseDiv.style.display = 'block';
        openButton.innerText = 'Close';
    }
}

document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (passwordField.type === 'password') {
        passwordField.type = 'text'; // Show password
        eyeIcon.classList.remove('ri-eye-off-fill'); 
        eyeIcon.classList.add('ri-eye-fill'); 
    } else {
        passwordField.type = 'password'; // Hide password
        eyeIcon.classList.remove('ri-eye-fill'); 
        eyeIcon.classList.add('ri-eye-off-fill'); 
    }
});



function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    document.getElementById('usernameError').innerText = '';
    document.getElementById('passwordError').innerText = '';

    let isValid = true; 

    if (!username) {
        document.getElementById('usernameError').innerText = "Please enter your username."; 
        isValid = false; 
    }

    if (!password) {
        document.getElementById('passwordError').innerText = "Please enter your password."; 
        isValid = false;
    }

    if (!role) {
        document.getElementById('roleError').innerText = "Please select your role."; 
        isValid = false; 
    }

    if (!isValid) {
        return; 
    }

    const isNumericUsername = /^\d{10}$/.test(username);
    const containsNonNumeric = /[^0-9]/.test(username);

    if (isNumericUsername && role !== 'student') {
        document.getElementById('roleError').innerText = "Please select a valid role."; 
        return; 
    }

    if (containsNonNumeric && role !== 'lecturer') {
        document.getElementById('roleError').innerText = "Please select a valid role."; 
        return; 
    }

    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': 'TU5ce4207d6fb3085aba32c5a74e72aa711e9e07ad870eb799d80eb6330f460223e6ddf0d1dabcfca1cf64daecc8900a42'
        },
        body: JSON.stringify({ "UserName" : username, "PassWord" : password })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').innerText = data.message;

        if (data.status) {
            let details = '';

            if (data.type === 'student') {

                document.getElementById('displayNameTH').innerText = `Name: ${data.displayname_th}`;
                document.getElementById('status').innerText = `Status: ${data.tu_status}`;

                details = `${data.displayname_th || 'ไม่ระบุ'}, ${data.faculty || 'ไม่ระบุ'}`;
            } 
            else if (data.type === 'employee') {

                document.getElementById('displayNameTH').innerText = `Name: ${data.displayname_th}`;
                document.getElementById('status').innerText = `Status: ${data.StatusEmp}`;

                details = `${data.displayname_th || 'ไม่ระบุ'}, ${data.organization || 'ไม่ระบุ'}`;
            }

            document.getElementById('response').innerText = details;
            document.getElementById('openButton').style.display = 'block';

            // ทำการบันทึกข้อมูลผู้ใช้ลงในตาราง students
            saveUserToDatabase(data);
        } else {
            alert("Error: ไม่สามารถ Login ได้สำเร็จ");
            document.getElementById('response').innerText = ''; 
            document.getElementById('openButton').style.display = 'none'; 
        }
    })
    .catch(error => console.error('Error:', error));

    
}

function saveUserToDatabase(data) {
    const userDetails = {
        userName: data.username || 'ไม่ระบุ',
        type: data.type,
        engName: data.displayname_en || 'ไม่ระบุ',
        email: data.email || 'ไม่ระบุ',
        faculty: data.faculty || 'ไม่ระบุ'
    };

    fetch('http://localhost:8080/api/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': 'TU5ce4207d6fb3085aba32c5a74e72aa711e9e07ad870eb799d80eb6330f460223e6ddf0d1dabcfca1cf64daecc8900a42'
        },
        body: JSON.stringify(userDetails)
    })
    .then(response => {
        if (response.ok) {
            console.log('User saved successfully!');
        } else {
            console.error('Failed to save user to database');
        }
    })
    .catch(error => console.error('Error:', error));
}

function requestForm() {
    location.reload();
}

function logout() {
    localStorage.removeItem('token'); 
    alert("You have been logged out."); 
    
    document.getElementById('username').value = ''; 
    document.getElementById('password').value = ''; 
    document.getElementById('role').selectedIndex = 0;

    document.getElementById('message').innerText = '';
}
