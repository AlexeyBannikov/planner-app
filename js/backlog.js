const renderBacklogTasks = (tasks) => {
  const tasksList = document.querySelector('.backlog__tasks');

  for (const task of tasks) {
    const li = document.createElement('li');
    li.classList.add('backlog__task', 'task-hint');
    li.setAttribute('planStartDate', `${task.planStartDate}`);
    li.setAttribute('creationDate', `${task.creationDate}`);
    li.setAttribute('task', `${task.subject}`);
    li.setAttribute('planEndDate', `${task.planEndDate}`);
    li.setAttribute('data', `с ${task.planStartDate} по ${task.planEndDate}`);
    li.innerHTML = `${task.subject}`;
    tasksList.append(li);
  }
};

document.querySelector('.backlog__input').oninput = (e) => {
  const value = e.target.value.toLowerCase();
  const tasks = document.querySelectorAll('.backlog__tasks li');

  if (value !== '') {
    for (const task of tasks) {
      if (task.innerText.toLowerCase().includes(value)) {
        task.classList.remove('hide');
      } else {
        task.classList.add('hide');
      }
    }
  } else {
    for (const task of tasks) {
      task.classList.remove('hide');
    }
  }
};
