import Manager from './src/dom/Manager';

const observerConfig = {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false,
};
const manager = new Manager();
manager.refreshRatings();

const findRatings = async (mutations) => {
  if (!manager.supports(mutations)) {
    // MutationsEvents does not concerns jawbone
    return;
  }
  manager.refreshRatings();
};



const observer = new MutationObserver(findRatings);
observer.observe(document.getElementsByClassName('mainView')[0], observerConfig);


