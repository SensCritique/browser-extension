import Allocine from './http/Allocine';
import MessageEventEnum from './dom/MessageEventEnum';

const allocine = new Allocine();

const fetchInfo = async (message, callback) => {
  switch (message.type) {
    case MessageEventEnum.INFO:
      return allocine.getVideoInfo(message.videoName, message.videoYear, message.videoType, callback);
    case MessageEventEnum.RATING:
      return allocine.getRating(message.value, callback);
  }
};

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  fetchInfo(message, callback).then(response => {
    callback(response);
  });

  return true;
});
