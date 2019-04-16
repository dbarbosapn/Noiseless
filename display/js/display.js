/*
 * Filename: main.js
 * Project: noiseless
 * Created Date: Monday, April 15th 2019, 7:11:20 pm
 * Author: Diogo Barbosa (pessoal.dbarbosa@gmail.com)
 * 
 * Copyright (c) 2019 Diogo Barbosa
 */

$(window).on('load', function(){ 
    $('#loader').loadgo({
        'direction':  'bt',
        'opacity':    0.9,
        'bgcolor':    '#2f3640'
    });
    $('#loader').loadgo('loop', 20);
});