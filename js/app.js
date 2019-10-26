'use strict';

const page1 = 'data/page-1.json';
const page2 = 'data/page-2.json';

function Horns(horns) {
  this.url = horns.image_url;
  this.name = horns.title;
  this.desc = horns.description;
  this.keyword = horns.keyword;
  this.num = horns.horns;
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

  $('option').not(':first').remove();

  Horns.allHorns.forEach((element) => {
    if (!keyWords.includes(element.keyword)){
      keyWords.push(element.keyword);
    }
  });
  keyWords.sort();

  keyWords.forEach(keyword =>  $('select').append(`<option value = ${keyword}>${keyword}</option>`));

  $('select').on('change', function() {
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
      Horns.sortByTitle(Horns.allHorns);
      Horns.loadHorns();
      Horns.loadOptions();
    });
};

Horns.sortByTitle = (arr) => {
  arr.sort( (a,b) => {
    if (a.name < b.name) {
      return -1;
    } if (a.name > b.name) {
      return 1;
    }
    return 0;
  })
  return arr;
};

$(() => {
  Horns.readJson(page1);
  $('#page1').on('click', function(){
    Horns.readJson(page1);
  });

  $('#page2').on('click', function(){
    Horns.readJson(page2);
  });
});
