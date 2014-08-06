
require.paths.unshift('./lib');

var doT = require('dot')
  , doU = require('dou')
  , ejs = require('ejs')
  , jade = require('jade')
  , haml = require('hamljs')
  , jqtpl = require('jqtpl')
  , jst = require('jst')
  , Shotenjin = require('shotenjin')
  , nTenjin = require('nTenjin');

var ejsTemplate_escape = "<div><h1 class='header'><%= header %></h1><h2 class='header2'><%= header2 %></h2><h3 class='header3'><%= header3 %></h3><h4 class='header4'><%= header4 %></h4><h5 class='header5'><%= header5 %></h5><h6 class='header6'><%= header6 %></h6><ul class='list'><% for (var i = 0, l = list.length; i < l; i++) { %><li class='item'><%= list[i] %></li><% } %></ul></div>";
var ejsTemplate = "<div><h1 class='header'><%- header %></h1><h2 class='header2'><%- header2 %></h2><h3 class='header3'><%- header3 %></h3><h4 class='header4'><%- header4 %></h4><h5 class='header5'><%- header5 %></h5><h6 class='header6'><%- header6 %></h6><ul class='list'><% for (var i = 0, l = list.length; i < l; i++) { %><li class='item'><%- list[i] %></li><% } %></ul></div>";
var ejsTemplateFn = ejs.compile(ejsTemplate);
var ejsTemplateFn_escape = ejs.compile(ejsTemplate_escape);

var jadeTemplate = "div\n  h1.header!= header\n  h2.header2!= header2\n  h3.header3!= header3\n  h4.header4!= header4\n  h5.header5!= header5\n  h6.header6!= header6\n  ul.list\n    - each item in list\n      li.item!= item";
var jadeTemplateFn = jade.compile(jadeTemplate);
var jadeTemplate_escape = "div\n  h1.header= header\n  h2.header2= header2\n  h3.header3= header3\n  h4.header4= header4\n  h5.header5= header5\n  h6.header6= header6\n  ul.list\n    - each item in list\n      li.item= item";
var jadeTemplateFn_escape = jade.compile(jadeTemplate_escape);

var jQueryTemplateFn = jqtpl.template('test', "<div><h1 class='header'>{{html header}}</h1><h2 class='header2'>{{html header2}}</h2><h3 class='header3'>{{html header3}}</h3><h4 class='header4'>{{html header4}}</h4><h5 class='header5'>{{html header5}}</h5><h6 class='header6'>{{html header6}}</h6><ul class='list'>{{each list}}<li class='item'>{{html value}}</li>{{/each}}</ul></div>");
var jQueryTemplateFn_escape = jqtpl.template('test2', "<div><h1 class='header'>${header}</h1><h2 class='header2'>${ header2}</h2><h3 class='header3'>${ header3}</h3><h4 class='header4'>${ header4}</h4><h5 class='header5'>${header5}</h5><h6 class='header6'>${header6}</h6><ul class='list'>{{each list}}<li class='item'>${value}</li>{{/each}}</ul></div>");

var hamlTemplateFn = haml.compile("%div\n  %h1.header!= header\n  %h2.header2!= header2\n  %h3.header3!= header3\n  %h4.header4!= header4\n  %h5.header5!= header5\n  %h6.header6!= header6\n  %ul.list\n    - each item in list\n      %li.item!= item");
var hamlTemplateFn_escape = haml.compile("%div\n  %h1.header= header\n  %h2.header2= header2\n  %h3.header3= header3\n  %h4.header4= header4\n  %h5.header5= header5\n  %h6.header6= header6\n  %ul.list\n    - each item in list\n      %li.item= item");

var doTtemplateFn = doT.template("<div><h1 class='header'>{{= it.header }}</h1><h2 class='header2'>{{= it.header2 }}</h2><h3 class='header3'>{{= it.header3 }}</h3><h4 class='header4'>{{= it.header4 }}</h4><h5 class='header5'>{{= it.header5 }}</h5><h6 class='header6'>{{= it.header6 }}</h6><ul class='list'>{{ for (var i = 0, l = it.list.length; i < l; i++) { }}<li class='item'>{{= it.list[i] }}</li>{{ } }}</ul></div>");
var doTtemplateFn_escape = doT.template("<div><h1 class='header'>{{! it.header }}</h1><h2 class='header2'>{{! it.header2 }}</h2><h3 class='header3'>{{! it.header3 }}</h3><h4 class='header4'>{{! it.header4 }}</h4><h5 class='header5'>{{! it.header5 }}</h5><h6 class='header6'>{{! it.header6 }}</h6><ul class='list'>{{ for (var i = 0, l = it.list.length; i < l; i++) { }}<li class='item'>{{! it.list[i] }}</li>{{ } }}</ul></div>");

var doUtemplateFn = doU.template("<div><h1 class='header'>{{= it.header }}</h1><h2 class='header2'>{{= it.header2 }}</h2><h3 class='header3'>{{= it.header3 }}</h3><h4 class='header4'>{{= it.header4 }}</h4><h5 class='header5'>{{= it.header5 }}</h5><h6 class='header6'>{{= it.header6 }}</h6><ul class='list'>{{ for (var i = 0, l = it.list.length; i < l; i++) { }}<li class='item'>{{= it.list[i] }}</li>{{ } }}</ul></div>");
var doUtemplateFn_escape = doU.template("<div><h1 class='header'>{{! it.header }}</h1><h2 class='header2'>{{! it.header2 }}</h2><h3 class='header3'>{{! it.header3 }}</h3><h4 class='header4'>{{! it.header4 }}</h4><h5 class='header5'>{{! it.header5 }}</h5><h6 class='header6'>{{! it.header6 }}</h6><ul class='list'>{{ for (var i = 0, l = it.list.length; i < l; i++) { }}<li class='item'>{{! it.list[i] }}</li>{{ } }}</ul></div>");

var tenjinTemplate = "<div><h1 class='header'>#{ header }</h1><h2 class='header2'>#{ header2 }</h2><h3 class='header3'>#{ header3 }</h3><h4 class='header4'>#{ header4 }</h4><h5 class='header5'>#{ header5 }</h5><h6 class='header6'>#{ header6 }</h6><ul class='list'><?js for (var i = 0, l = list.length; i < l; i++) { ?><li class='item'>#{ list[i] }</li><?js } ?></ul></div>";
var tenjinTemplate_escape = "<div><h1 class='header'>${ header }</h1><h2 class='header2'>${ header2 }</h2><h3 class='header3'>${ header3 }</h3><h4 class='header4'>${ header4 }</h4><h5 class='header5'>${ header5 }</h5><h6 class='header6'>${ header6 }</h6><ul class='list'><?js for (var i = 0, l = list.length; i < l; i++) { ?><li class='item'>${ list[i] }</li><?js } ?></ul></div>";

var convertedTenjinTemplate = new Shotenjin.Template();
convertedTenjinTemplate.convert(tenjinTemplate);
var convertedTenjinTemplate_escape = new Shotenjin.Template();
convertedTenjinTemplate_escape.convert(tenjinTemplate_escape);

var nTenjinTemplate = "<div><h1 class='header'>#{ it.header }</h1><h2 class='header2'>#{ it.header2 }</h2><h3 class='header3'>#{ it.header3 }</h3><h4 class='header4'>#{ it.header4 }</h4><h5 class='header5'>#{ it.header5 }</h5><h6 class='header6'>#{ it.header6 }</h6><ul class='list'><?js for (var i = 0, l = it.list.length; i < l; i++) { ?><li class='item'>#{ it.list[i] }</li><?js } ?></ul></div>";
var convertednTenjinTemplate = new nTenjin.Template();
var convertednTenjinTemplateFn = convertednTenjinTemplate.convert(nTenjinTemplate);

var nTenjinTemplate_escape = "<div><h1 class='header'>${ it.header }</h1><h2 class='header2'>${ it.header2 }</h2><h3 class='header3'>${ it.header3 }</h3><h4 class='header4'>${ it.header4 }</h4><h5 class='header5'>${ it.header5 }</h5><h6 class='header6'>${ it.header6 }</h6><ul class='list'><?js for (var i = 0, l = it.list.length; i < l; i++) { ?><li class='item'>${ it.list[i] }</li><?js } ?></ul></div>";

var convertednTenjinTemplate_escape = new nTenjin.Template();
var convertednTenjinTemplateFn_escape = convertednTenjinTemplate_escape.convert(nTenjinTemplate_escape);

var jstTemplateFn = jst.compile("<div><h1 class='header'>{{ header }}</h1><h2 class='header2'>{{ header2 }}</h2><h3 class='header3'>{{ header3 }}</h3><h4 class='header4'>{{ header4 }}</h4><h5 class='header5'>{{ header5 }}</h5><h6 class='header6'>{{ header6 }}</h6><ul class='list'>{% for (var i = 0, l = list.length; i < l; i++) { %}<li class='item'>{{ list[i] }}</li>{% } %}</ul></div>");

var jstTemplateFn_escape = jst.compile("<div><h1 class='header'>{{ e(header) }}</h1><h2 class='header2'>{{ e(header2) }}</h2><h3 class='header3'>{{ e(header3) }}</h3><h4 class='header4'>{{ e(header4) }}</h4><h5 class='header5'>{{ e(header5) }}</h5><h6 class='header6'>{{ e(header6) }}</h6><ul class='list'>{% for (var i = 0, l = list.length; i < l; i++) { %}<li class='item'>{{ e(list[i]) }}</li>{% } %}</ul></div>");

jst.configure({useIt: true});
var jstTemplateSpeedFn = jst.compile("<div><h1 class='header'>{{ it.header }}</h1><h2 class='header2'>{{ it.header2 }}</h2><h3 class='header3'>{{ it.header3 }}</h3><h4 class='header4'>{{ it.header4 }}</h4><h5 class='header5'>{{ it.header5 }}</h5><h6 class='header6'>{{ it.header6 }}</h6><ul class='list'>{% for (var i = 0, l = it.list.length; i < l; i++) { %}<li class='item'>{{ it.list[i] }}</li>{% } %}</ul></div>");
var jstTemplateSpeedFn_escape = jst.compile("<div><h1 class='header'>{{ e(it.header) }}</h1><h2 class='header2'>{{ e(it.header2) }}</h2><h3 class='header3'>{{ e(it.header3) }}</h3><h4 class='header4'>{{ e(it.header4) }}</h4><h5 class='header5'>{{ e(it.header5) }}</h5><h6 class='header6'>{{ e(it.header6) }}</h6><ul class='list'>{% for (var i = 0, l = it.list.length; i < l; i++) { %}<li class='item'>{{ e(it.list[i]) }}</li>{% } %}</ul></div>");

var sharedVariables = {
    header: "Header",
    header2: "Header2",
    header3: "Header3",
    header4: "Header4",
    header5: "Header5",
    header6: "Header6",
    list: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
};

var sharedVariables_escape = {
    header: "<Header>",
    header2: "<Header2>",
    header3: "<Header3>",
    header4: "<Header4>",
    header5: "<Header5>",
    header6: "<Header6>",
    list: ['&1', '&2', '&3', '&4', '&5', '&6', '&7', '&8', '&9', '&10']
};

var engines = [
    {
        name: 'doT',
        fn: function(vars) {
            return doTtemplateFn(vars);
        }, fn_with_escape: function(vars) {
            return doTtemplateFn_escape(vars);
        }
    }, {
        name: 'doU',
        fn: function(vars) {
            return doUtemplateFn(vars);
        }, fn_with_escape: function(vars) {
            return doUtemplateFn_escape(vars);
        }
    }, /*{
        name: 'tenjin',
        fn: function(vars) {
            convertedTenjinTemplate.render(vars);
        }, fn_with_escape: function(vars) {
            return convertedTenjinTemplate_escape.render(vars);
        }
    },*/ {
        name: 'nTenjin',
        fn: function(vars) {
            return convertednTenjinTemplateFn(vars);
        }, fn_with_escape: function(vars) {
            return convertednTenjinTemplateFn_escape(vars);
        }
    }, {
        name: 'jqtpl',
        fn: function(vars) {
            return jqtpl.tmpl(jQueryTemplateFn, vars);
        }, fn_with_escape: function(vars) {
            return jqtpl.tmpl(jQueryTemplateFn_escape, vars);
        }
    }, {
        name: 'ejs',
        fn: function(vars) {
            return ejsTemplateFn(vars);
        }, fn_with_escape: function(vars) {
            return ejsTemplateFn_escape(vars);
        }
    }, {
        name: 'haml',
        fn: function(vars) {
            return hamlTemplateFn(vars);
        }, fn_with_escape: function(vars) {
            return hamlTemplateFn_escape(vars);
        }
    }, {
        name: 'jade',
        fn: function(vars) {
            return jadeTemplateFn(vars);
        }, fn_with_escape: function(vars) {
            return jadeTemplateFn_escape(vars);
        }
    }, {
        name: 'jst',
        fn: function(vars) {
            return jstTemplateFn(vars);
        }, fn_with_escape: function(vars) {
            return jstTemplateFn_escape(vars);
        }
    }, {
        name: 'jst_speed',
        fn: function(vars) {
            return jstTemplateSpeedFn(vars);
        }, fn_with_escape: function(vars) {
            return jstTemplateSpeedFn_escape(vars);
        }
    }
];

var run_num = 100000;

console.log('\nNo escape, render ' + run_num + ' times:\n');
for(var i = 0, len = engines.length; i < len; i++) {
    var engine = engines[i];
    console.log(engine.name, 'running...');
    //console.log(engine.fn(sharedVariables));
    var start = new Date();
    for(var j = 0; j < run_num; j ++) {
        engine.fn(sharedVariables);
    }
    var seconds = (new Date() - start) / 1000;
    engine.seconds = seconds;
    console.log('use: ' + seconds + ' sec, rps: ' + (run_num / seconds));
    console.log('--------------------------------------------');
}

console.log('\nAll escape, render ' + run_num + ' times:\n');
for(var i = 0, len = engines.length; i < len; i++) {
    var engine = engines[i];
    if(!engine.fn_with_escape) continue;
    console.log(engine.name, 'running...');
    //console.log(engine.fn_with_escape(sharedVariables_escape));
    var start = new Date();
    for(var j = 0; j < run_num; j ++) {
        engine.fn_with_escape(sharedVariables_escape);
    }
    var seconds = (new Date() - start) / 1000;
    engine.seconds = seconds;
    console.log('use: ' + seconds + ' sec, rps: ' + (run_num / seconds));
    console.log('--------------------------------------------');
}
