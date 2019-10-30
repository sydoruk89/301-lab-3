'use strict';

const page1 = 'data/page-1.json';
const page2 = 'data/page-2.json';

function Horns(horns) {
  this.url = horns.image_url;
  this.name = horns.title;
  this.desc = horns.description;
  this.keyword = horns.keyword;
  this.horns = horns.horns;
}


Horns.prototype.render = function() {
  let template = $('#photo-template').html();
  let templateRender = Handlebars.compile(template);
  return templateRender(this);
};


Horns.loadHorns = () => {
  $('main div').remove();
  Horns.allHorns.forEach(horns => {
    $('#image-container').append(horns.render());
  });
};


Horns.loadOptions = () => {
  const keyWords = [];

  $('#sorting option').not(':first').remove();

  Horns.allHorns.forEach((element) => {
    if (!keyWords.includes(element.keyword)){
      keyWords.push(element.keyword);
    }
  });
  keyWords.sort();

  keyWords.forEach(keyword =>  $('#sorting').append(`<option value = ${keyword}>${keyword}</option>`));

  $('#sorting').on('change', function() {
    let selected = $(this).val();
    $('main div').hide();
    $(`div[class="${selected}"]`).show();
    if(selected === 'default'){
      $('div').show();
    }
  });
};

Horns.readJson = (element) => {
  Horns.allHorns = [];
  $('main').empty();
  $.get(element, 'json')
    .then(data => {
      data.forEach(item => {
        Horns.allHorns.push(new Horns(item));
      });
    })
    .then(() => {
      Horns.sortBy(Horns.allHorns, 'name');
      Horns.loadHorns();
      Horns.loadOptions();
    });
};

Horns.sortBy = (arr, property) => {
  arr.sort( (a,b) => {
    let firstEl = a[property];
    let secondEl = b[property];
    if (firstEl < secondEl) {
      return -1;
    } if (firstEl > secondEl) {
      return 1;
    }
    return 0;
  })
  return arr;
};

Horns.handleSort = () => {
  $('#sort-by').on('change', function() {
    $('#sorting').val('default');
    $('main div').remove();
    Horns.sortBy(Horns.allHorns, $(this).val());
    Horns.allHorns.forEach(element => {
      $('#image-container').append(element.render());
    });
  });
};

Horns.handleImageEvents = () => {
  $('main').on('click', 'div', function(event) {
    event.stopPropagation();
    let $clone = $(this).clone();
    let elements = $clone[0].children;

    $('section').addClass('active').html(elements);

    $(window).scrollTop(0);
  });

  $('body').on('click', function() {
    const $section = $('section');
    $section.empty();
    $section.removeClass('active');
  });
};

$(() => {
  Horns.readJson(page1);
  $('#page1').on('click', function(){
    Horns.readJson(page1);
  });

  $('#page2').on('click', function(){
    Horns.readJson(page2);
  });
  Horns.handleSort();
  Horns.handleImageEvents();
});
