import {default as ProgressBar} from 'progressbar.js';

export default class Rating {
  constructor(rating) {
    this.rating = this.convertRatingInPercent(rating);
  }

  createProgressBar(element){
    let bar = new ProgressBar.Circle(element, {
      strokeWidth: 10,
      easing: 'easeInOut',
      duration: 500,
      color: this.getColor(),
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: null,
      text: {
        autoStyleContainer: false,
      },
      step: function (state, circle) {
        const value = Math.round(circle.value() * 100);
        circle.setText(value);
      },
    });
    bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    bar.text.style.fontSize = '1.5rem';
    bar.animate(this.rating);

    return bar;
  }

  convertRatingInPercent(rating) {
    rating = parseFloat(rating.replace(',', '.'));

    return parseFloat((rating / 5).toFixed(2));
  }

  getColor() {
    const rating = this.rating * 100;
    if (rating > 0 && rating < 25) {
      return '#B3302A';
    }
    if (rating >= 25 && rating < 50) {
      return '#c95400';
    }
    if (rating >= 50 && rating < 75) {
      return '#fecc00';
    }
    if (rating >= 75) {
      return '#2EB33B';
    }
  }

}
