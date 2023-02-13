const tasksUrl =
  'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks';
const usersUrl =
  'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users';

const usersList = document.querySelector('.planner__users');
const usersWithTask = [];
let tasksData;
let usersData;

const fetchUsers = async () => {
  const res = await fetch(usersUrl);
  const users = await res.json();

  usersData = users;
};

const fetchTasks = async () => {
  const res = await fetch(tasksUrl);
  const tasks = await res.json();

  tasksData = tasks;
};

const renderAll = (users, tasks) => {
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < tasks.length; j++) {
      if (users[i].id == tasks[j].executor) {
        const userWithTask = {
          name: users[i].firstName,
          surname: users[i].surname,
          task: tasks[j].subject,
          planStartDate: tasks[j].planStartDate,
          creationDate: tasks[j].creationDate,
          planEndDate: tasks[j].planEndDate,
          id: users[i].id,
        };
        usersWithTask.push(userWithTask);
      }
    }
  }

  setDates();
  renderPlannerDates();
  renderUsers(usersData, usersWithTask);
  renderBacklogTasks(tasksData.filter((task) => !task.executor));
  dragAndDrop();
};

const dragAndDrop = () => {
  const tasksList = document.querySelector('.backlog__tasks');
  const tasks = document.querySelectorAll('.backlog__tasks li');

  for (const task of tasks) {
    task.draggable = true;
  }

  tasksList.addEventListener('dragstart', (e) => {
    e.target.classList.add('active');
    e.target.classList.add('remove-hint');
  });

  tasksList.addEventListener('dragend', (e) => {
    e.target.classList.remove('active');
    e.target.classList.remove('remove-hint');
  });

  usersList.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!e.target.classList.contains('planner__user')) {
      e.target.classList.add('hover');
    }
  });

  usersList.addEventListener('dragleave', (e) => {
    e.target.classList.remove('hover');
  });

  usersList.addEventListener('drop', (e) => {
    const activeElement = tasksList.querySelector('.active');
    const planStartDate = activeElement.getAttribute('planStartDate');
    const id = e.target.getAttribute('id');
    const days = document.querySelectorAll('.planner__day');

    if (e.target.classList.contains('planner__user')) {
      for (let i = 0; i < days.length; i++) {
        const dayDate = days[i].getAttribute('data');
        if (dayDate === planStartDate && days[i].id === id) {
          days[
            i
          ].innerHTML += `<li class='planner__task'>${activeElement.getAttribute(
            'task',
          )}</li>
          `;
        }
      }
    } else {
      e.target.innerHTML += `<li class='planner__task'>${activeElement.getAttribute(
        'task',
      )}</li>`;
    }

    usersWithTask.push({
      name: e.target.getAttribute('firstName'),
      surname: e.target.getAttribute('surname'),
      task: activeElement.getAttribute('task'),
      planStartDate: e.target.classList.contains('planner__user')
        ? planStartDate
        : e.target.getAttribute('data'),
      creationDate: activeElement.getAttribute('creationDate'),
      planEndDate: activeElement.getAttribute('planEndDate'),
      id: Number(e.target.getAttribute('id')),
    });

    e.target.classList.remove('hover');
    activeElement.classList.add('hide');
  });
};

const rerender = () => {
  const datesList = document.querySelector('.planner__current-week');
  usersList.innerHTML = '';
  datesList.innerHTML = '';

  setDates();
  renderPlannerDates();
  renderUsers(usersData, usersWithTask);
};

const init = async () => {
  const wrapper = document.querySelector('.wrapper');
  const loader = document.querySelector('.loader');
  const error = document.querySelector('.error');

  try {
    await fetchUsers();
    await fetchTasks();
    wrapper.classList.remove('hide');
  } catch (err) {
    error.classList.remove('hide');
    error.innerText = err.message;
  } finally {
    loader.classList.add('hide');
  }

  renderAll(usersData, tasksData);
};

init();
