'use strict';

function Horns(horns) {
  this.url = horns.image_url;
  this.name = horns.title;
  this.desc = horns.description;
  this.keyword = horns.keyword;
  this.num = horns.horns;
}

Horns.page1Horns = [];
Horns.page2Horns = [];
const keyWords = [];


Horns.prototype.render = function() {
  $('main').append('<section class="clone"></div>');
  let hornClone = $('section[class="clone"]');
  let hornHtml = $('#photo-template').html();
  hornClone.html(hornHtml);
  hornClone.find('h2').text(this.name);
  hornClone.find('img').attr('src', this.url);
  hornClone.find('p').text(this.desc);
  hornClone.removeClass('clone');
  hornClone.attr('class', this.keyword);
}

Horns.loadHorns1 = () => {
    Horns.page1Horns.forEach(horns => horns.render());
    $('button[id="page1"]').on('click', function() {
        $('section').hide();
        Horns.page1Horns.forEach(horns => horns.render());
    });
};

Horns.loadHorns2 = () => {
    $('button[id="page2"]').on('click', function() {
        $('section').hide();
        Horns.page2Horns.forEach(horns => horns.render());
    });
}

Horns.prototype.renderOption = function() {
  if (!keyWords.includes(this.keyword)){
    keyWords.push(this.keyword);
    $('select').append(`<option value = ${this.keyword}>${this.keyword}</option>`);
  }
};

Horns.loadOptions1 = () => {
  Horns.page1Horns.forEach((element) => element.renderOption());
  $('select').on('change', function() {
    let selected = $(this).val();
    $('main div').hide();
    $(`div[class="${selected}"]`).show();
    if(selected === 'default'){
      $('div').show();
    }
  });
};

Horns.loadOptions2 = () => {
  Horns.page2Horns.forEach((element) => element.renderOption());
  $('select').on('change', function() {
    let selected = $(this).val();
    $('main div').hide();
    $(`div[class="${selected}"]`).show();
    if(selected === 'default'){
      $('div').show();
    }
  });
};

Horns.readJson1 = () => {
    $.get('data/page-1.json', 'json')
    .then(data => {
        data.forEach(item => {
            Horns.page1Horns.push(new Horns(item));
        });
    })
    .then(() => {
        Horns.loadHorns1();
        Horns.loadOptions1();
    });
}


Horns.readJson2 = () => {
    $.get('data/page-2.json', 'json')
    .then(data => {
        data.forEach(item => {
            Horns.page2Horns.push(new Horns(item));
        });
    })
    .then(() => {
        Horns.loadHorns2();
        Horns.loadOptions2();
    });
}

// ------load data on page------

$(() => Horns.readJson1());
$(() => Horns.readJson2());

