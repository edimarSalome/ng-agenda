angular.module('angular-agenda',['ngSanitize'])
        .controller('agendaCtrl',['$scope', '$sce', '$filter', function($scope, $sce, $filter){
            var $ctrl = this;
            
            $ctrl.construct = function(){
                //Executa funções de dados personalizáveis da agenda
                $ctrl.setView('week');
                $ctrl.initAgenda();
                $ctrl.initUsuarios();
                $ctrl.initHorarios();
                $ctrl.initEventos();
                $scope.filtroUsuarios = {ativo:true};
            };
            
            $ctrl.initAgenda = function(){
                //Executa funções de dados padrão da agenda
                $ctrl.setDataAgenda();
                $ctrl.setWeekDays();
                $ctrl.setMonthDays();
            };
            
            $scope.isDataAgenda = function(date){ return $scope.getDate().isSame(date, 'day');};
            
            $ctrl.setDataAgenda = function(date){ $ctrl.dataAgenda = date ? date : moment();};
            
            $scope.getDate = function(){return $ctrl.dataAgenda;};
            
            $ctrl.previous = function(){$ctrl.dataAgenda.subtract(1, 'days');};
            
            $ctrl.next = function(){$ctrl.dataAgenda.add(1, 'days');};
            
            $ctrl.previousWeek = function(){$ctrl.dataAgenda.subtract(1, 'weeks'); $ctrl.setWeekDays();};
            
            $ctrl.nextWeek = function(){$ctrl.dataAgenda.add(1, 'weeks'); $ctrl.setWeekDays();};
            
            $ctrl.previousMonth = function(){$ctrl.dataAgenda.subtract(1, 'months'); if($scope.isView('week')){$ctrl.setWeekDays();}else if($scope.isView('month')){$ctrl.setMonthDays();}};
            
            $ctrl.nextMonth = function(){$ctrl.dataAgenda.add(1, 'months'); if($scope.isView('week')){$ctrl.setWeekDays();}else if($scope.isView('month')){$ctrl.setMonthDays();}};
            
            $ctrl.today = function(){$ctrl.setDataAgenda(); if('week'){$ctrl.setWeekDays();}};
            
            $scope.isToday = function(){return $scope.getDate().isSame(moment(), 'day');};
            
            $scope.isTodayWeek = function(){return $scope.getDate().isSame(moment(), 'week');};
            
            $ctrl.setView = function(view){
                if($ctrl.activeView && view === 'day'){$ctrl.setDataAgenda($ctrl.dataAgenda.startOf($ctrl.activeView));}
                else if(view=== 'week'){$ctrl.setWeekDays();}
                else if(view === 'month'){$ctrl.setMonthDays();}
                $ctrl.activeView = view === 'day' || view === 'week' || view === 'month' ? view : 'day';
            };
            
            $scope.getView = function(){return $ctrl.activeView;};
            
            $scope.isView = function(view){return $ctrl.activeView === view ? true : false;};
            
            $ctrl.setWeekDays = function(){
                var endOfWeek = moment($scope.getDate()).endOf('week');
                var startOfWeek = moment($scope.getDate()).startOf('week');

                $scope.weekDays = [];
                var day = startOfWeek;

                while (day <= endOfWeek) {
                    $scope.weekDays.push(day);
                    day = day.clone().add(1, 'd');
                }
            };
            
            $ctrl.setMonthDays = function(){
                var endOfMonth = moment($scope.getDate()).endOf('month');
                var startOfMonth = moment($scope.getDate()).startOf('month');

                $scope.monthDays = [];
                var day = startOfMonth;
                
                $ctrl.setWeekFirstDay(startOfMonth);
                $ctrl.setWeekLastDay(endOfMonth);

                while (day <= endOfMonth) {
                    $scope.monthDays.push(day);
                    day = day.clone().add(1, 'd');
                }
            };
            
            $ctrl.setWeekFirstDay = function(day){$scope.weekFirstDay = day.isoWeekday();};
            
            $ctrl.setWeekLastDay = function(day){$scope.weekLastDay = day.isoWeekday();};
            
            $scope.getMonthRepeater = function(location){
                var retorno = [];
                
                if(location === 'start'){
                    for(var i = 0;i<($scope.weekFirstDay); i++){retorno.push(i)};
                }else{
                    var repeater = $scope.weekLastDay === 7 ? 6 : 6-$scope.weekLastDay;
                    for(var i = 0; i<(repeater); i++){retorno.push(i)};
                }
                
                return retorno.length === 7 ? 0 : retorno;
                
            };
            
            $ctrl.setEvents = function(eventsArray){
                $ctrl.events = eventsArray;
            };
            
            $ctrl.getEvent = function(dateHour, user){
                var retorno = false;
                angular.forEach($ctrl.events, function(value, key){
                    var cond1 = value.date.format('DDMMYYHHmm') === dateHour.format('DDMMYYHHmm');
                    var cond2 = user ? value.user === user.id : true;
                    
                    if(cond1 && cond2){retorno = value;};
                });
                
                return retorno ? retorno : false;
            };
            
            $ctrl.getEventMonth = function(dateHour, user){
                var retorno = 0;
                angular.forEach($ctrl.events, function(value, key){
                    var cond1 = value.date.isSame(dateHour, 'day');
                    var cond2 = user ? value.user === user.id : true;
                    
                    if(cond1 && cond2){retorno++;};
                });
                
                return retorno ? retorno : false;
            };
            
            $scope.parseDayEvent = function(hour, minute, user){
                //Se necessário, converter string em number
                //hour = parseInt(hour); minute = parseInt(minute);
                var date = moment($scope.getDate());
                date.hour(hour).minute(minute);                
                
                var event = $ctrl.getEvent(date, user);                
                return event ? $sce.trustAsHtml("<div id='"+event.id+"' class='event-view'><span>"+event.name+"</span></div>"): '';
                
            };
            
            $scope.parseWeekEvent = function(hour, minute, date){
                //Se necessário, converter string em number
                //hour = parseInt(hour); minute = parseInt(minute);
                var date = moment(date);
                date.hour(hour).minute(minute);
                
                var event = $ctrl.getEvent(date, 0);
                return event ? "<div id='"+event.id+"' class='event-view'><span>"+event.name+"</span></div>": '';
                
            };
            
            $scope.parseMonthEvent = function(date){
                var date = moment(date);
                
                var eventCount = $ctrl.getEventMonth(date, 0);
                
                return eventCount ? "<div class='event-view-month'><span>"+eventCount+" <small>Agendamentos</small></span></div>": '';
                
            };
                        
            $scope.dClick = function(hora, minuto, usuario, element){
                $ctrl.dataAgenda.hour(hora).minute(minuto);
                if(element.currentTarget.childNodes.length){$ctrl.eventClick(element.currentTarget.childNodes[0].id);}
                else{$ctrl.dayClick(hora, minuto, usuario);}
            };
            
            $scope.wClick = function(hora, minuto, data, element){
                data.hour(hora).minute(minuto);
                if(element.currentTarget.childNodes.length){$ctrl.eventClick(element.currentTarget.childNodes[0].id);}
                else{$ctrl.weekClick(hora, minuto, data);}
            };
            
            
            //Métodos personalizáveis            
            
            
            $ctrl.dayClick = function(hora, minuto, usuario){
                alert('Você clicou em '+$ctrl.dataAgenda.format()+' do usuário '+usuario.nome);
            };
            
            $ctrl.weekClick = function(hora, minuto, data){
                alert('Você clicou em '+data.format());
            };
            
            $scope.monthClick = function(day){
                $ctrl.setView('day');
                $ctrl.setDataAgenda(day);
            };
            
            $scope.monthClickMobile = function(day){
                $ctrl.setView('week');
                $ctrl.setDataAgenda(day);
                $ctrl.setWeekDays();
            };
            
            $ctrl.eventClick = function(id){
                alert('Clique no evento'+id);
                
            };
            
            $ctrl.initHorarios = function(){
                $scope.horas = [{desc:"07"}, {desc:"08"}, {desc:"09"}, {desc:"10"},{desc:"11"}];
                
                $scope.minutos = [{desc:"00"},{desc:"15"},{desc:"30"},{desc:"45"}];
            };
            
            $ctrl.initUsuarios = function(){
                $scope.usuarios = [
                    {id:1, nome:'Dr. Edimar', ativo:true},
                    {id:2, nome:'Dr. Lauro Miller', ativo:true},
                    {id:3, nome:'Dr. Roger That!', ativo:false}
                    //{id:4,nome:'Dra. Gladis', ativo:false},
                    //{id:5, nome:'Dr. Mário Dias', ativo:false},
                    //{id:6, nome:'Dr. Daniel Frank', ativo:false},
                    //{id:7, nome:'Dr. Rafael Marcão', ativo:false}
                ];
            };
            
            $ctrl.initEventos = function(){
                var events = [
                    {id:1, name:"Comprar ingresso FINIT", date:moment().hour(7).minute(30), user:1},
                    {id:2, name:"Gerar relatório do mês", date:moment().hour(8).minute(00), user:1},
                    {id:3, name:"Reunião para marcar outra reunião", date:moment().hour(10).minute(30), user:1},
                    {id:4, name:"Questionar questão", date:moment().hour(9).minute(30), user:2},
                    {id:5, name:"Conferir itens a ser conferidos", date:moment().minute(15).add(1, 'days'), user:2}
                ];
                
                $ctrl.setEvents(events);
            };
            
            $ctrl.construct();
        }]);