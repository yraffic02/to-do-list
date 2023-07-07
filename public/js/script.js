let tasks = [];

function displayTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {

    const li = document.createElement('li');

    const titleParagraph = document.createElement('p');
    titleParagraph.textContent = 'Titulo: ' + task.title;
    li.appendChild(titleParagraph);

    const descriptionParagraph = document.createElement('p');
    descriptionParagraph.textContent = 'Descrição: ' + task.description;
    li.appendChild(descriptionParagraph);


    const editButton = document.createElement('button');
    editButton.textContent = 'editar';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => editTask(task.id, index));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'deletar';
    deleteButton.addEventListener('click', () => deleteTask(task.id, index));

    li.appendChild(editButton);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
  });
}

async function addTask() {
  const taskTitleInput = document.getElementById('taskTitleInput');
  const taskDescriptionInput = document.getElementById('taskDescriptionInput');

  if (taskTitleInput.value !== '' && taskDescriptionInput.value !== '') {
    const newTask = {
      title: taskTitleInput.value,
      description: taskDescriptionInput.value,
    };

    const response = await fetch('http://localhost/to-do-list-api/routes/tasks.php/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    });

    if (response.ok) {
      const createdTask = await response.json();
      tasks.push(createdTask);
      displayTasks();
      window.location.reload()
    }

    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
  }
}

async function editTask(id, index) {
  const updatedTitle = prompt('qual é seu novo titilo:');
  const updatedDescription = prompt('qual é sua nova descrição');

  if (updatedTitle !== null && updatedDescription !== null) {
    const updatedTask = {
      id: index,
      title: updatedTitle,
      description: updatedDescription
    };

    const response = await fetch(`http://localhost/to-do-list-api/routes/index.php/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    });

    if (response.ok) {
      tasks[index].title = updatedTitle;
      tasks[index].description = updatedDescription;
      displayTasks();
    }
  }
}

async function deleteTask(id, index) {
  const confirmDelete = confirm('tem certeza que deseja deletar essa tarefa?');

  if (confirmDelete) {
    const response = await fetch(`http://localhost/to-do-list-api/routes/tasks.php?id=${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      tasks.splice(index, 1);
    
      displayTasks();
    }
  }
}

async function getTasks() {
  const response = await fetch('http://localhost/to-do-list-api/routes/tasks.php/tasks');

  if (response.ok) {
    const data = await response.json();
    tasks = data
    displayTasks();
  }
}

const addTaskButton = document.getElementById('addTaskButton');
addTaskButton.addEventListener('click', addTask);

getTasks();

