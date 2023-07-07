// Array para armazenar as tarefas
let tasks = [];

// Função para exibir as tarefas existentes
function displayTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    // Cria um novo item de lista para a tarefa
    const li = document.createElement('li');

    // Cria um elemento de parágrafo para o título da tarefa
    const titleParagraph = document.createElement('p');
    titleParagraph.textContent = 'Title: ' + task.title;
    li.appendChild(titleParagraph);

    // Cria um elemento de parágrafo para a descrição da tarefa
    const descriptionParagraph = document.createElement('p');
    descriptionParagraph.textContent = 'Description: ' + task.description;
    li.appendChild(descriptionParagraph);

    // Cria botões de edição e exclusão para cada tarefa
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => editTask(task.id, index));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(task.id, index));

    li.appendChild(editButton);
    li.appendChild(deleteButton);

    // Adiciona o item de lista à lista de tarefas
    taskList.appendChild(li);
  });
}

// Função para adicionar uma nova tarefa
async function addTask() {
  const taskTitleInput = document.getElementById('taskTitleInput');
  const taskDescriptionInput = document.getElementById('taskDescriptionInput');

  if (taskTitleInput.value !== '' && taskDescriptionInput.value !== '') {
    // Cria o objeto de tarefa
    const newTask = {
      title: taskTitleInput.value,
      description: taskDescriptionInput.value,
    };

    // Faz uma requisição POST para a API
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

    // Limpa os campos de entrada
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
  }
}

// Função para editar uma tarefa
async function editTask(id, index) {
  const updatedTitle = prompt('Enter the new title for the task:');
  const updatedDescription = prompt('Enter the new description for the task:');

  if (updatedTitle !== null && updatedDescription !== null) {
    const updatedTask = {
      id: index,
      title: updatedTitle,
      description: updatedDescription
    };

    // Faz uma requisição PATCH para a API
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

// Função para excluir uma tarefa
async function deleteTask(id, index) {
  const confirmDelete = confirm('Are you sure you want to delete this task?');

  if (confirmDelete) {
    // Faz uma requisição DELETE para a API
    const response = await fetch(`http://localhost/to-do-list-api/routes/tasks.php?id=${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      tasks.splice(index, 1);
    
      displayTasks();
    }
  }
}

// Função para obter todas as tarefas da API
async function getTasks() {
  // Faz uma requisição GET para a API
  const response = await fetch('http://localhost/to-do-list-api/routes/tasks.php/tasks');

  if (response.ok) {
    const data = await response.json();
    tasks = data
    displayTasks();
  }
}

// Obtém o botão e adiciona um evento de clique
const addTaskButton = document.getElementById('addTaskButton');
addTaskButton.addEventListener('click', addTask);

// Chama a função para obter todas as tarefas quando a página é carregada
getTasks();

