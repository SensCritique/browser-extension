import {default as ProgressBar} from 'progressbar.js';

export default class Rating {
  createProgressBar(element){
    let bar = new ProgressBar.Circle(element, {
      strokeWidth: 10,
      easing: 'bounce',
      duration: 500,
      color: '#414141',
      trailColor: '#8e8e8e',
      trailWidth: 1,
      svgStyle: null,
      text: {
        autoStyleContainer: false,
      },
      step: function (state, circle) {
        circle.setText('?');
      },
    });
    bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    bar.text.style.fontSize = '1.5rem';
    bar.animate(1);

    return bar;
  }

}
