const addTaskButton = document.getElementById('addTask');
const apiUrl = 'https://653485e2e1b6f4c59046c7c7.mockapi.io/api/users/219222914/tasks';

const taskTitleInput = document.getElementById('title');
const taskDescriptionInput = document.getElementById('description');
const statusInput = document.getElementById('status');
const priorityInput = document.getElementById('priority');
const tagInput = document.getElementById('tag');
const dueDateInput = document.getElementById('dueDate');

addTaskButton.addEventListener('click', () => {

    const isTitleValid = taskTitleInput.value.trim() !== '';
    const isDescriptionValid = taskDescriptionInput.value.trim() !== '';
    const isStatusValid = statusInput.value.trim() !== '';
    const isPriorityValid = priorityInput.value.trim() !== '';
    const isTagValid = tagInput.value.trim() !== '';
    const isDueDateValid = dueDateInput.value.trim() !== '';

    if (!isTitleValid) {
        taskTitleInput.style.border = '1px solid red';
        alert('El campo "Título" es obligatorio.');
        return;
    } else {
        taskTitleInput.style.border = '1px solid #ccc';
    }

    if (!isDescriptionValid) {
        taskDescriptionInput.style.border = '1px solid red';
        alert('El campo "Descripción" es obligatorio.');
        return;
    } else {
        taskDescriptionInput.style.border = '1px solid #ccc';
    }

    if (!isStatusValid) {
        statusInput.style.border = '1px solid red';
        alert('El campo "Estado" es obligatorio.');
        return;
    } else {
        statusInput.style.border = '1px solid #ccc';
    }

    if (!isPriorityValid) {
        priorityInput.style.border = '1px solid red';
        alert('El campo "Prioridad" es obligatorio.');
        return;
    } else {
        priorityInput.style.border = '1px solid #ccc';
    }

    if (!isTagValid) {
        tagInput.style.border = '1px solid red';
        alert('El campo "Etiqueta" es obligatorio.');
        return;
    } else {
        tagInput.style.border = '1px solid #ccc';
    }

    if (!isDueDateValid) {
        dueDateInput.style.border = '1px solid red';
        alert('El campo "Fecha de vencimiento" es obligatorio.');
        return;
    } else {
        dueDateInput.style.border = '1px solid #ccc';
    }


    const allFieldsValid = isTitleValid && isDescriptionValid && isStatusValid && isPriorityValid && isTagValid && isDueDateValid;

    if (allFieldsValid) {
        addTask();
    }
});

function addTask() {
    const taskTitle = taskTitleInput.value;
    const taskDescription = taskDescriptionInput.value;
    const taskStatus = statusInput.value;
    const taskPriority = priorityInput.value;
    const taskTag = tagInput.value;
    const taskDueDate = dueDateInput.value;

    const requiredFields = [
        { field: taskTitle, name: 'Título' },
        { field: taskDescription, name: 'Descripción' },
        { field: taskStatus, name: 'Estado' },
        { field: taskPriority, name: 'Prioridad' },
        { field: taskTag, name: 'Etiqueta' },
        { field: taskDueDate, name: 'Fecha de vencimiento' }
    ];

    for (const { field, name } of requiredFields) {
        if (field.trim() === '') {
            alert(`El campo "${name}" es obligatorio.`);
            return;
        }
    }

    const taskData = {
        title: taskTitle,
        description: taskDescription,
        completed: taskStatus === 'Completada',
        priority: taskPriority,
        tag: taskTag,
        dueDate: taskDueDate
    };
    console.log(taskData);
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        createTask(data);
        clearForm();
    })
    .catch(error => console.error('Error al agregar tarea:', error));
}


function createTask(task) {
    const table = document.getElementById('taskList');
    const newRow = table.insertRow(table.rows.length);
    newRow.dataset.taskId = task.id;

    const titleCell = newRow.insertCell(0);
    titleCell.textContent = task.title;

    const descriptionCell = newRow.insertCell(1);
    descriptionCell.textContent = task.description;

    const statusCell = newRow.insertCell(2);
    statusCell.textContent = task.completed ? 'Completada' : 'Pendiente';

    const priorityCell = newRow.insertCell(3);
    priorityCell.textContent = task.priority;

    const tagCell = newRow.insertCell(4);
    tagCell.textContent = task.tag;

    const dueDateCell = newRow.insertCell(5);
    dueDateCell.textContent = task.dueDate;

    const editCell = newRow.insertCell(6);
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.classList.add('edit-button'); 
    editButton.addEventListener('click', () => {
        editTask(task.id, newRow);
    });
    editCell.appendChild(editButton);

    const deleteCell = newRow.insertCell(7);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('delete-button'); 
    deleteButton.style.backgroundColor = 'red'; 
    deleteButton.addEventListener('click', () => {
        deleteTask(task.id, newRow);
    });
    deleteCell.appendChild(deleteButton);
}

function editTask(taskId, row) {
    const titleCell = row.cells[0];
    const descriptionCell = row.cells[1];
    const statusCell = row.cells[2];
    const priorityCell = row.cells[3];
    const tagCell = row.cells[4];
    const dueDateCell = row.cells[5];

    titleCell.contentEditable = true;
    descriptionCell.contentEditable = true;
    statusCell.contentEditable = true;
    priorityCell.contentEditable = true; 
    tagCell.contentEditable = true;
    dueDateCell.contentEditable = true;

    const editButton = row.cells[6].querySelector('button');
    editButton.textContent = 'Guardar';
    editButton.removeEventListener('click', () => editTask(taskId, row));
    editButton.addEventListener('click', () => {
        saveTask(taskId, row);
    });
}

function saveTask(taskId, row) {
    const titleCell = row.cells[0];
    const descriptionCell = row.cells[1];
    const statusCell = row.cells[2];
    const priorityCell = row.cells[3];
    const tagCell = row.cells[4];
    const dueDateCell = row.cells[5];

    titleCell.contentEditable = false;
    descriptionCell.contentEditable = false;
    statusCell.contentEditable = false;
    priorityCell.contentEditable = false;
    tagCell.contentEditable = false;
    dueDateCell.contentEditable = false;

    const editButton = row.cells[6].querySelector('button');
    editButton.textContent = 'Editar';
    editButton.removeEventListener('click', () => saveTask(taskId, row));
    editButton.addEventListener('click', () => {
        editTask(taskId, row);
    });

    const updatedTitle = titleCell.textContent;
    const updatedDescription = descriptionCell.textContent;
    const updatedStatus = statusCell.textContent;
    const updatedPriority = priorityCell.textContent;
    const updatedTag = tagCell.textContent;
    const updatedDueDate = dueDateCell.textContent;

    if (updatedTitle.trim() === '') {
        alert('El título de la tarea es obligatorio.');
        return;
    }

    const updatedData = {
        title: updatedTitle,
        description: updatedDescription,
        completed: updatedStatus === 'Completada',
        priority: updatedPriority,
        tag: updatedTag,
        dueDate: updatedDueDate
    };

    fetch(`${apiUrl}/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .catch(error => console.error('Error al actualizar tarea:', error));
}

function deleteTask(taskId, row) {
    fetch(`${apiUrl}/${taskId}`, {
        method: 'DELETE'
    })
    .then(() => {
        row.remove();
    })
    .catch(error => console.error('Error al eliminar tarea:', error));
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('status').value = 'Pendiente';
    document.getElementById('priority').value = 'Alta';
    document.getElementById('tag').value = '';
    document.getElementById('dueDate').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(task => {
            console.log(task);
            createTask(task);
        });
    })
    .catch(error => console.error('Error al obtener tareas:', error));
});
