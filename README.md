##AngularJs ng-agenda

[Link](https://github.com/edimarSalome/ng-agenda/edit/master/README.md) 

Componente construído utilizando angularJs, bootstrap e momentJs.

O visual foi criado utilizando Sass porém pode ser facilmente personalizado apenas substituindo o arquivo ngAgenda.css por sua folha de estilos.

### Getting started

Para utilizar o ng-agenda é necessário incluir algumas dependências

```markdown
<head>
    ...

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
</head>
<body>
    ...
    
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-sanitize.min.js"></script>
    <script src="http://momentjs.com/downloads/moment.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/locale/pt-br.js"></script>
</body>
```

E depois os arquivos do ng-agenda

```markdown
<head>
    ...
    <link href="css/style.css" rel="stylesheet" type="text/css"/>
</head>
<body>
    ...
    
    <script src="js/ng-agenda.min.js" type="text/javascript"></script>
</body>
```