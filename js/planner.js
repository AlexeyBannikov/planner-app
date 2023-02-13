const currentWeek = [];
const currentDate = new Date();
const now = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  currentDate.getDate(),
);

const setDates = () => {
  currentWeek.length = 0;

  for (let i = 0; i < 7; i++) {
    currentWeek.push({
      month: ('0' + (now.getMonth() + 1)).slice(-2),
      day: now.getDate(),
      year: now.getFullYear(),
    });
    now.setDate(now.getDate() + 1);
  }
};

const prevWeek = () => {
  now.setDate(now.getDate() - 14);
  rerender();
};

const renderUsers = (users, tasks) => {
  const usersList = document.querySelector('.planner__users');

  for (const user of users) {
    const div = document.createElement('div');
    const userName = document.createElement('div');
    const userTasks = tasks.filter((task) => task.id === user.id);

    div.classList.add('planner__grid');
    userName.classList.add('planner__user');
    userName.setAttribute('id', user.id);
    userName.setAttribute('surname', user.surname);
    userName.setAttribute('firstName', user.firstName);
    userName.innerText = `${user.surname} ${user.firstName}`;
    div.append(userName);

    for (let i = 0; i < 7; i++) {
      const day = document.createElement('ul');
      day.classList.add('planner__day');
      day.setAttribute('id', user.id);
      day.setAttribute('surname', user.surname);
      day.setAttribute('firstName', user.firstName);
      day.setAttribute(
        'data',
        `${currentWeek[i].year}-${currentWeek[i].month}-${currentWeek[i].day}`,
      );

      for (let j = 0; j < userTasks.length; j++) {
        if (userTasks[j].planStartDate === day.getAttribute('data')) {
          const dayTask = document.createElement('li');
          dayTask.classList.add('planner__task');
          dayTask.innerText = userTasks[j].task;
          day.append(dayTask);
        }
      }

      div.append(day);
      usersList.append(div);
    }
  }
};

const renderPlannerDates = () => {
  const datesList = document.querySelector('.planner__current-week');
  const prevButton = document.querySelector('.planner__button-prev');
  const nextButton = document.querySelector('.planner__button-next');
  nextButton.removeEventListener('click', rerender);
  prevButton.removeEventListener('click', prevWeek);

  const nameCol = document.createElement('div');
  nameCol.classList.add('planner__body-name');
  datesList.append(nameCol);

  for (const el of currentWeek) {
    const dateCol = document.createElement('div');
    dateCol.innerText = `${el.day}.${el.month}`;
    datesList.append(dateCol);
  }

  prevButton.addEventListener('click', prevWeek);
  nextButton.addEventListener('click', rerender);
};
