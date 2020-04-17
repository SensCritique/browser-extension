import Manager from './dom/Manager';

const manager = new Manager();

setInterval(() => {
  manager.refreshRatings();
}, 2000);

