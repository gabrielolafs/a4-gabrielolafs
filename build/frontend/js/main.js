function daysUntilDue(dueDate) {
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);
    const timeDiff = dueDateObj - currentDate;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

async function updateTable() {
    const response = await fetch('/tasks');
    const responseText = await response.text();
    console.log('Response Text:', responseText);

    try {
        const data = JSON.parse(responseText);
        const tableBody = document.querySelector('#completedTasksBody');
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" ${item.complete === 'on' ? 'checked' : ''} data-task="${item.task}"></td>
                <td>${daysUntilDue(item.dueDate)}</td>
                <td>${item.task}</td>
                <td>${item.priority}</td>
                <td>${item.dueDate.split('T')[0]}</td>
                <td><button class="delete-btn" data-task="${item.task}">🗑️</button></td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', handleCheckboxChange);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteTask);
        });
    } catch (error) {
        console.error('Failed to parse JSON:', error);
    }
}

async function handleDeleteTask(event) {
    const button = event.target;
    const task = button.getAttribute('data-task');

    const response = await fetch('/delete-task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task })
    });

    if (response.ok) {
        console.log('Task deleted successfully');
        updateTable();
    } else {
        console.error('Failed to delete task');
    }
}

async function handleCheckboxChange(event) {
    const checkbox = event.target;
    const task = checkbox.getAttribute('data-task');
    const complete = checkbox.checked ? "on" : "off";

    const response = await fetch('/update-task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task, complete })
    });

    if (response.ok) {
        console.log('Task updated successfully');
    } else {
        console.error('Failed to update task');
    }
}

async function submit(event) {
    event.preventDefault();

    // Check if the user is authenticated
    const authResponse = await fetch('/auth-check');
    if (authResponse.status !== 200) {
        alert('You should log in first.');
        window.location.href = '/login';
        return;
    }

    const input = document.querySelector("#taskForm");
    const formData = new FormData(input);
    const object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    });

    // checking for no dupe tasks
    const response = await fetch('/tasks');
    const responseText = await response.text();
    console.log('Response Text:', responseText);

    try {
        const data = JSON.parse(responseText);
        const isDuplicate = data.some(task => task.task === object.task);

        if (isDuplicate) {
            alert('No duplicates allowed: Task already exists.');
            return;
        }

        const body = JSON.stringify(object);

        await fetch("/submit", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        });

        await updateTable();
    } catch (error) {
        console.error('Failed to parse JSON:', error);
    }
}

async function fetchUserInfo() {
    const response = await fetch('/user-info');
    if (response.ok) {
        const user = await response.json();
        const userInfoDiv = document.querySelector('#user-info');
        userInfoDiv.innerHTML = `
            <span>Signed in as ${user.username}</span>
            <button id="sign-out" class="btn btn-link">Not you? Sign out</button>
        `;
        document.querySelector('#sign-out').addEventListener('click', async () => {
            await fetch('/sign-out', { method: 'POST' });
            window.location.href = '/login';
        });
    }
    else {
        const userInfoDiv = document.querySelector('#user-info');
        userInfoDiv.innerHTML = `
            <span>Not signed in. </span>
            <button id="sign-out" class="btn btn-link">Sign in?</button>
        `;
        document.querySelector('#sign-out').addEventListener('click', async () => {
            await fetch('/sign-out', { method: 'POST' });
            window.location.href = '/login';
        });
    }
}

window.onload = function() {
    fetchUserInfo();
    const button = document.querySelector("button");
    button.onclick = submit;

    updateTable();
}
