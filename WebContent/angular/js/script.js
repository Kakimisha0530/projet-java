$.ajaxSetup({
    async : false
});

var hostes = 'http://www.leclubdesannonceurs.net';
var deviceToken;
var pageId = {inline:true,id:0};
var redirection , tracking_tab = [] , trace_data = {id:0} , trace_data_nav = {id:0};
var ttbis = [];
var version = 1.4;

var callB = function(){};

function getCurrentTime(){
    return Math.round((new Date()).getTime() / 1000);
}

function getTime(time_){
    var date = new Date(time_*1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);
    return formattedTime;
}

//
var animateApp = angular.module('animateApp', ['ngRoute', 'ngAnimate', 'LocalStorageModule', 'ngSanitize', 'ngTouch'],function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
 
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };
 
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});
// ,'chieffancypants.loadingBar']);

animateApp.config(function($routeProvider, $locationProvider, $httpProvider)// ,cfpLoadingBarProvider)
{
    // cfpLoadingBarProvider.includeSpinner = true;
    $routeProvider.when('/', {
        templateUrl : 'views/home.html',
        controller : 'mainController'
    }).when('/agenda', {
        templateUrl : 'views/agenda.html',
        controller : 'agendaCtrl'
    }).when('/connexion', {
        templateUrl : 'views/connexion.html',
        controller : 'connexionCtrl'
    }).when('/membres', {
        templateUrl : 'views/membres.html',
        controller : 'membresCtrl'
    }).when('/marque', {
        templateUrl : 'views/marque.html',
        controller : 'marqueCtrl'
    }).when('/galerie', {
        templateUrl : 'views/galerie.html',
        controller : 'galerieCtrl'
    }).when('/carriere', {
        templateUrl : 'views/carriere.html',
        controller : 'carriereCtrl'
    }).when('/contenu', {
        templateUrl : 'views/contenu.html',
        controller : 'contenuCtrl'
    }).when('/parametres', {
        templateUrl : 'views/parametres.html',
        controller : 'parametresCtrl'
    }).when('/galerie_detail/:myid', {
        templateUrl : 'views/galerie_detail.html',
        controller : 'g_detailCtrl'
    }).when('/actualite', {
        templateUrl : 'views/actualite.html',
        controller : 'actualiteCtrl'
    }).when('/carriere_a', {
        templateUrl : 'views/carriere_agence.html',
        controller : 'carriere_cCtrl'
    }).when('/profil_detail/:userid/email/:mail', {
        templateUrl : 'views/profil_detail.html',
        controller : 'profil_dCtrl'
    }).when('/actu/:eventid', {
        templateUrl : 'views/actu_detail.html',
        controller : 'actu_dCtrl'
    }).when('/partenaires', {
        templateUrl : 'views/partenaires.html',
        controller : 'partnersCtrl'
    }).when('/partenaire/:myid', {
        templateUrl : 'views/partners_details.html',
        controller : 'partner_dCtrl'
    }).when('/marque_d/:myid', {
        templateUrl : 'views/marque_details.html',
        controller : 'marque_dCtrl'
    }).when('/editprofil', {
        templateUrl : 'views/editprofil.html',
        controller : 'edit_profilCtrl'
    }).when('/editpartners', {
        templateUrl : 'views/editpartners.html',
        controller : 'edit_partnersCtrl'
    });

    /*$locationProvider.html5Mode(true);*/
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    delete $httpProvider.defaults.headers.common["X-Requested-With"];

});

animateApp.directive('fileModel', ['$parse',
function($parse) {
    return {
        restrict : 'A',
        link : function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

animateApp.service('fileUpload', ['$http', '$rootScope',
function($http, $rootScope) {
    this.uploadFileToUrl = function(form, file, uploadUrl, callback) {
        var fd = new FormData();
        
        fd.append('token', form.token);
        fd.append('mai', form.mail);
        fd.append('id', form.id);
        fd.append('MAX_FILE_SIZE', form.size);
        fd.append('img', file);

        $http.post(uploadUrl, fd, {
            transformRequest : angular.identity,
            headers : {
                'Content-Type' : undefined
            }
        }).success(function(data) {
            //alert(JSON.stringify(data));
            if (data && data.message.type.toLowerCase() == 'ok') {
                //alert(JSON.stringify(data));
                $rootScope.connection($rootScope.pr, $rootScope, '/parametres');
            }

        }).error(function(data) {
            navigator.notification.alert('erreur');
        });
    }
}]);

animateApp.run(['$rootScope', '$location', '$http', 'localStorageService', '$window', '$sce',
function($rootScope, $location, $http, localStorageService, $window, $sce) {
    
    function isUndefined(_var_) {
        return (!_var_ || _var_ == '');
    }
    
    redirection = function(){
        //navigator.notification.alert(pageId.id);
        if(!pageId.inline && pageId.id > 0){
            pageId.inline = true;         
            
            if (pageId.id == 953)//EVENEMENTS
            {
                $location.path('/actualite');
            } else if (pageId.id == 951)//MARQUES
            {
                $location.path('/marque');
            } else if (pageId.id == 510)//MEMBRES
            {
                $location.path('/membres');
            } else if (pageId.id == 9530)//CONTENUS
            {
                $location.path('/contenu');
            } else {
                navigator.notification.alert("erreur");
            }

        }
    };
    
    $rootScope.tracePage = function(_id,det,btn,cnt){
        var temp = trace_data;
        var temp2 = trace_data_nav;
        if(_id < 20) trace_data_nav = {id:_id,time:getCurrentTime(),details:det};
        else trace_data = {id:_id,time:getCurrentTime(),details:det};
        if(btn){
            $rootScope.saveRecord();
        }
        
        if(temp2.id > 0 && temp2.id < 20 && trace_data_nav.id > 0 && trace_data_nav.id < 20 && temp2.id != trace_data_nav.id){
            $rootScope.saveRecordNav(temp2);
        }
        else if(temp2.id == trace_data_nav.id) {
            trace_data_nav = temp2;
        }
    };
    
    $rootScope.saveRecord = function(){
        if(trace_data.id > 0){
            $rootScope.tracking = localStorageService.get("tracking");
            if(!$rootScope.tracking)
                $rootScope.tracking = [];
            $rootScope.tracking.push({id:trace_data.id,timestamp:trace_data.time,duree:(getCurrentTime() - trace_data.time),details:trace_data.details});
            localStorageService.add("tracking",JSON.stringify($rootScope.tracking)); 
        }
    };
    
    $rootScope.saveRecordNav = function(obj){
        if(obj.id > 0){
            $rootScope.tracking = localStorageService.get("tracking");
            if(!$rootScope.tracking)
                $rootScope.tracking = [];
            
            var tt = getCurrentTime();
            var time_ = (getTime(obj.time) + " / " + getTime(tt));
            //alert(time_);
            $rootScope.tracking.push({id:obj.id,timestamp:obj.time,duree:tt - obj.time,details:obj.details});
            localStorageService.add("tracking",JSON.stringify($rootScope.tracking)); 
        }
    };
    
    $rootScope.$on("$locationChangeStart",function(newState,oldState){
        //$rootScope.saveRecord();
    });
    
    $rootScope.mySwiper = {};
    $rootScope.mySwiper.val = 1;
    $rootScope.mySwiper['class'] = "close";
    $rootScope.connectClass = "";
    
    //------------------------------------//
    $rootScope.count_agence = 10;
    $rootScope.count_marque = 10;
    $rootScope.count_contenu = 10;
    //------------------------------------//
    
    var date_today = new Date();
    var d_year = date_today.getFullYear();
    var d_j = date_today.getDate();
    d_j = (d_j.length < 2) ? '0' + d_j : d_j;
    var d_month = date_today.getMonth();
    var mymois = ["JAN", "FEV", "MARS", "AVR", "MAI", "JUIN", "JUL", "AOUT", "SEP", "OCT", "NOV", "DEC"];
    
    $rootScope.root_mois = mymois[(d_month%12)];
    $rootScope.root_jour = d_j;

    $rootScope.up = function() {
        $rootScope.mySwiper.val = ($rootScope.mySwiper.val + 1) % 2;
        $rootScope.mySwiper['class'] = ($rootScope.mySwiper.val == 1) ? 'close' : 'open';
    };

    $rootScope.openUrl = function(_uri) {
        $window.open(_uri, '_system', 'location=yes');
    };

    $rootScope.openUrl_s = function(_uri) {
        window.open(_uri, '_blank', 'location=no');
    };
    
    $rootScope.isNotVide = function(str) {
        return (str && str != "" && str.toLowerCase() != "[aucun]" && str.toLowerCase() != "aucun" 
            && str.toLowerCase() != "[autre]" && str.toLowerCase() != "autre");
    };

    $rootScope.host = 'http://www.leclubdesannonceurs.net';
    $rootScope.token = localStorageService.get('token');
    $rootScope.user_profil = localStorageService.get('details');
    $rootScope.event_user = localStorageService.get('dates_user');
    $rootScope.event_all = localStorageService.get('dates_all');
    $rootScope.pr = localStorageService.get('profil');
    $rootScope.lastest = localStorageService.get('lastest');
    $rootScope.tracking = localStorageService.get("tracking");
    $rootScope.media = "";
    $rootScope.note_id = "";
    $rootScope.note_value = "3";
    $rootScope.my_note = false;

    $rootScope.checkConnection = function(sc) {
        var state = true;
        
        if (navigator.connection && navigator.device) {
            var networkState = navigator.connection.type;
            var platform = window.device.platform.toLowerCase();
            switch(platform) {
                case "android":
                    state = networkState == Connection.WIFI || networkState == Connection.CELL_3G || networkState == Connection.CELL_4G;
                    break;
                case "ios":
                    state = networkState == Connection.CELL || networkState == Connection.WIFI;
                    break;
                case "win32nt":
                    state = networkState == Connection.CELL || networkState == Connection.WIFI;
                    break;
                default:
                    state = state = networkState == Connection.NONE || networkState == Connection.UNKNOWN;
                    break;
            };
            $rootScope.connectClass = (!state) ? "deconnect" : "";
            if (!state)
                sc.loading = false;
        }
                
        return state;
    };
    
    var _url = $rootScope.host + "/bytoken/index.php?mail=" + (($rootScope.pr)?$rootScope.pr.email : "") + "&code=" + (($rootScope.pr)?$rootScope.pr.code : "");
    $http.get(_url).success(function(data, status) {
        if (data && data.message && data.message.type.toLowerCase() == 'ok'){
            $rootScope.token = data.message.token;
            var _url1 = $rootScope.host + "/bytoken/tracking.php?token=" + data.message.token + "&id=" + data.message.token.split("-")[0];
            console.log($rootScope.tracking);
            $http.post(_url1,{trace : JSON.stringify($rootScope.tracking)}).success(function(res, status) {
                //alert(JSON.stringify(res));
                //if (res && res.message && res.message.type.toLowerCase() == 'ok'){
                    localStorageService.add("tracking",ttbis);
                    $rootScope.tracking = ttbis;
                /*}
                else
                    $rootScope.token = undefined;*/
            }).error(function(){
                
            });
        }
        else
            $rootScope.token = undefined;
    }).error(function(){
        
    });

    $rootScope.getSliderContent = function(sc) {
        $rootScope._is_connected = $rootScope.checkConnection(sc);
        var slide_membre = localStorageService.get('slide_membre');
        var slide_event1 = localStorageService.get('slide_event1');
        var slide_event2 = localStorageService.get('slide_event2');
        var slide_doc1 = localStorageService.get('slide_doc1');
        var slide_doc2 = localStorageService.get('slide_doc2');

        if ($rootScope._is_connected) {
            var url1 = $rootScope.host + "/bytoken/userslast.php?token=" + $rootScope.token + "&count=1";
            $http.get(url1).success(function(data) {
                if (data && !data.message && data.length > 0) {
                    sc.slide_membre = data[0];
                    $rootScope.lastest.membre.id = data[0].id;
                    if(slide_membre && slide_membre.id != $rootScope.lastest.membre.id)
                        $rootScope.lastest.membre.vue = false;
                    localStorageService.add('lastest', $rootScope.lastest);
                    localStorageService.add('slide_membre', data[0]);
                }
            });

            var url2 = $rootScope.host + "/bytoken/eventnext.php?token=" + $rootScope.token + "&count=2";
            $http.get(url2).success(function(data) {
                if (data && !data.message) {
                        sc.slide_event1 = (data.length > 0)?data[0]:{};
                        sc.slide_event1.affiche = (data.length > 0)?"":"drop";
                        sc.slide_event2 = (data.length > 1)?data[1]:{};
                        sc.slide_event2.affiche = (data.length > 1)?"else":"drop";
                                             
                        if(sc.slide_event1.affiche != "drop")
                            $rootScope.lastest.event.id = sc.slide_event1.id;
                        
                        if(slide_event1 && slide_event1.affiche != "drop" && sc.slide_event1.affiche != "drop" && sc.slide_event1.id != slide_event1.id && $rootScope.lastest.event.id != 0)
                            $rootScope.lastest.event.vue = false;
                        if(slide_event1 && slide_event1.affiche == "drop" && sc.slide_event1.affiche != "drop")
                            $rootScope.lastest.event.vue = false;
                        
                        localStorageService.add('lastest', $rootScope.lastest);
                        localStorageService.add('slide_event1', sc.slide_event1);
                        localStorageService.add('slide_event2', sc.slide_event2);
                }
            });

            var url3 = $rootScope.host + "/bytoken/markdocs.php?token=" + $rootScope.token + "&from=0&count=0";
            $http.get(url3).success(function(data) {
                if (data && !data.message){
                        sc.slide_doc1 = (data.length > 0)?data[0]:{};
                        sc.slide_doc1.affiche = (data.length > 0)?"":"drop";
                        sc.slide_doc2 = (data.length > 1)?data[1]:{};
                        sc.slide_doc2.affiche = (data.length > 1)?"else":"drop";
                        
                        
					if (sc.slide_doc1.affiche != "drop") {
						$rootScope.lastest.doc.id = sc.slide_doc1.id;
						var _url = $rootScope.host + "/bytoken/markdoc.php?token=" + $rootScope.token + "&id=" + sc.slide_doc1.id;

						$http.get(_url).success(function(data) {
							if (data && data.message && data.message.type.toLowerCase() == 'ok') {
								var dd1 = data.message;
								dd1.texte = $rootScope.escapedHtml(data.message.texte);
								dd1.affiche = sc.slide_doc1.affiche;
								sc.slide_doc1 = dd1;
								localStorageService.add('slide_doc1', sc.slide_doc1);
							}
						});

					}
					
					if (sc.slide_doc2.affiche != "drop") {
						var _url = $rootScope.host + "/bytoken/markdoc.php?token=" + $rootScope.token + "&id=" + sc.slide_doc2.id;

						$http.get(_url).success(function(data) {
							if (data && data.message && data.message.type.toLowerCase() == 'ok') {
								var dd2 = data.message;
								dd2.texte = $rootScope.escapedHtml(data.message.texte);
								dd2.affiche = sc.slide_doc2.affiche;
								sc.slide_doc2 = dd2;
								localStorageService.add('slide_doc2', sc.slide_doc2);
							}
						});

					}

                        
                        if(slide_doc1 && slide_doc1.affiche != "drop" && sc.slide_doc1.affiche != "drop" && sc.slide_doc1.id != slide_doc1.id && $rootScope.lastest.doc.id != 0)
                            $rootScope.lastest.doc.vue = false;
                        if(slide_doc1 && slide_doc1.affiche == "drop" && sc.slide_doc1.affiche != "drop")
                            $rootScope.lastest.doc.vue = false;
                        
                        localStorageService.add('lastest', $rootScope.lastest);
                        
                        //localStorageService.add('slide_doc2', sc.slide_doc2);
                }
            });
            
            var url4 = $rootScope.host + "/bytoken/contenus.php?token=" + $rootScope.token + "&from=0&count=1";
            $http.get(url4).success(function(data) {
                if (data && data.length > 0){
                        if($rootScope.lastest.content && $rootScope.lastest.content.id != data[0].id)
                            $rootScope.lastest.content.vue = false;
                        
                        $rootScope.lastest.content.id = data[0].id;
                        localStorageService.add('lastest', $rootScope.lastest);
                }
            });
            
        }
        else if (slide_membre && slide_event1 && slide_event2 && slide_doc1 && slide_doc2) {
            sc.slide_membre = slide_membre;
            sc.slide_event1 = slide_event1;
            sc.slide_event2 = slide_event2;
            sc.slide_doc1 = slide_doc1;
            sc.slide_doc2 = slide_doc2;
        }
    };
    
    $rootScope.escapedHtml = function(str) {
        return (str == null || str == '') ? '' : (str.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' '));
    };

    $rootScope.connection = function(_user, sc, redi) {
        var _url = $rootScope.host + "/bytoken/index.php?mail=" + _user.email + "&code=" + _user.code;
        $http.get(_url).success(function(data, status) {
            if (data && data.message && data.message.type == 'OK') {
                var profil = {
                };
                profil['email'] = _user.email;
                profil['code'] = _user.code;
                profil['actif'] = 1;
                localStorageService.add('profil', JSON.stringify(profil));
                $rootScope.pr = profil;
                localStorageService.add('token', data.message.token);
                $rootScope.token = data.message.token;
                $rootScope.connected = true;
                var deviceNumber = 2; /* 0=IOS , 1=ANDROID , 2=WINDOWS*/
                var getDeviceToken = $rootScope.host + "/bytoken/pushadd.php?token=" + $rootScope.token + '&userid=' + $rootScope.token.split('-')[0] + '&device=' + deviceNumber + '&devicetoken=' + deviceToken;
                $http.get(getDeviceToken).success(function(data) {
                    if (data && data.message && data.message.type.toLowerCase() == 'ok') {
                        localStorageService.add("deviceToken",deviceToken);
                    }
                    else if (data && data.message) {
                        //alert('echec calback');
                    }
                    else {
                        //alert('echec envoi');
                    }
                });
                
                _url = $rootScope.host + "/bytoken/user.php?token=" + $rootScope.token + '&mail=' + _user.email + '&id=' + $rootScope.token.split('-')[0];
                $http.get(_url).success(function(data) {
                    if (data && data.message && data.message.type.toLowerCase() == 'ok') {
                        $rootScope.user_profil = data.message;
                        if ($rootScope.user_profil.avatar == '' || $rootScope.user_profil.avatar == null) {
                            if ($rootScope.user_profil.civilite.toLowerCase() == 'monsieur')
                                $rootScope.user_profil.avatar = 'images/profil_h.svg';
                            else if ($rootScope.user_profil.civilite.toLowerCase() == 'madame')
                                $rootScope.user_profil.avatar = 'images/profil_f.svg';
                        }
                        $http.get($rootScope.host + "/bytoken/partners.php?token=" + $rootScope.token + '&mail=' + _user.email + '&id=' + $rootScope.user_profil.id).success(function(data, status) {
                            if (data && !data.message) {
                                var items = [];
                                $.each(data, function() {
                                    items.push(this.nom);
                                });
                                $rootScope.user_profil.partners = items.join(',');
                                localStorageService.add('details', JSON.stringify($rootScope.user_profil));
                            }
                        });
                        var date_today = new Date();
                        var d_year = date_today.getFullYear();
                        var d_j = date_today.getDate();
                        d_j = (d_j.length < 2) ? '0' + d_j : d_j;
                        var d_month = date_today.getMonth();
                        var nb = new Date((d_year + 1), (parseInt(d_month) + 1), -1).getDate() + 1;
                        var debut = (d_year - 1) + '' + ((('' + (d_month + 1)).length < 2) ? '0' + (d_month + 1) : (d_month + 1)) + '01';
                        var fin = (d_year + 1) + '' + ((('' + (d_month + 1)).length < 2) ? '0' + (d_month + 1) : (d_month + 1)) + nb;
                        $rootScope.setEvents_all(debut,debut, fin, $rootScope);
                        $rootScope.setEvents_user(debut, fin, $rootScope);
                        $rootScope.lastest = {};
                        $rootScope.lastest.membre = {id:0,vue:false};
                        $rootScope.lastest.event = {id:0,vue:false};
                        $rootScope.lastest.doc = {id:0,vue:false};
                        $rootScope.lastest.content = {id:0,vue:false};
                        localStorageService.add('lastest', $rootScope.lastest);
                        ttbis = (localStorageService.get("tracking"))?localStorageService.get("tracking"):[];
                        $rootScope.tracking = ttbis;
                        localStorageService.add("tracking",JSON.stringify($rootScope.tracking));
                        $rootScope.getSliderContent($rootScope);
                    }
                });
                $location.path(redi);
            }
            else
            {
                sc.erreur = 'Email ou mot de passe invalide !';
                sc.loading = false;
                navigator.notification.alert('Identifiants incorrects : ' + _user.email + ' / ' + _user.code,callB,"CONNEXION");
            }
        });
    };

    $rootScope.setEvents_user = function(debut, fin, sc) {
        sc.loading = true;
        $http.get($rootScope.host + "/bytoken/eventperiod.php?token=" + $rootScope.token + '&debut=' + debut + '&fin=' + fin + '&person=' + $rootScope.user_profil.id).success(function(data, status) {
            if (data && !data.message) {
                var _items = [];
                var e_u = [];
                localStorageService.add('events_user', JSON.stringify(e_u));
                var _i = data.length;
                $.each(data, function() {
                    var _d_ = this.date;
                    _items.push(_d_);

                    $http.get($rootScope.host + "/bytoken/eventdate.php?token=" + $rootScope.token + '&date=' + _d_ + '&person=' + $rootScope.user_profil.id).success(function(res, status) {
                        _i--;
                        if (res && !res.message) {
                            $.each(res, function() {
                                e_u.push(this.id)
                            });
                            localStorageService.add('events_user', JSON.stringify(e_u));
                            if (_i == 0)
                                sc.loading = false;
                        }
                    });
                });
                sc.event_user = _items;
                localStorageService.add('dates_user', JSON.stringify(_items));
            }
        });
    };

    $rootScope.setEvents_all = function(dateT,debut, fin, sc) {
        sc.loading = true;
        var _F_url = $rootScope.host + "/bytoken/eventperiod.php?token=" + $rootScope.token + '&debut=' + debut + '&fin=' + fin;
        $http.get(_F_url).success(function(data, status) {
            if (data && !data.message) {
                var _items = [];
                sc.actualites = [];
                $.each(data, function() {
                    var _d_ = this.date;
                    _items.push(_d_);
                    localStorageService.remove(('event_') + this.date)
                });
                $rootScope._sort(_items);
                $.each(_items, function(key, _d_) {
                    localStorageService.remove(('event_') + _d_);
                    $http.get($rootScope.host + "/bytoken/eventdate.php?token=" + $rootScope.token + '&date=' + _d_).success(function(res, status) {
                        if (res && !res.message) {
                            $.each(res, function() {
                                var _obj = this;
                                $http.get($rootScope.host + "/bytoken/eventdate.php?token=" + $rootScope.token + '&date=' + _d_ + '&person=' + $rootScope.user_profil.id).success(function(res, status) {
                                    var mr = [];
                                    if (res && !res.message) {
                                        $.each(res, function() {
                                            mr.push(this.id);
                                        });
                                        if ($.inArray(_obj.id, mr) >= 0)
                                            _obj.inscrit = 1;
                                        var r_r = (localStorageService.get(('event_') + _obj.debut)) ? localStorageService.get(('event_') + _obj.debut) : [];
                                        r_r.push(_obj);
                                        if(_obj.debut >= dateT) sc.actualites.push(_obj);
                                        $rootScope._sortByDate(sc.actualites);
                                        localStorageService.add(('event_') + _obj.debut, JSON.stringify(r_r));
                                    }
                                });
                            });
                            sc.loading = false;
                        }
                    });
                });
                sc.event_all = _items;
                localStorageService.add('dates_all', JSON.stringify(_items));
            }
        });
    };

    $rootScope._sort = function(x) {
        x.sort(function(a, b) {
            return parseInt(a) - parseInt(b);
        });
    };

    $rootScope._sortByDate = function(x) {
        x.sort(function(a, b) {
            return parseInt(a.date || a.debut) - parseInt(b.date || b.debut);
        });
    };
    
    $rootScope._sortByDate_inv = function(x) {
        x.sort(function(a, b) {
            return parseInt(b.date || b.debut) - parseInt(a.date || a.debut);
        });
    };

    if (!isUndefined($rootScope.token) || !isUndefined($rootScope.user_profil) || !isUndefined($rootScope.event_all) || !isUndefined($rootScope.event_user) || !isUndefined($rootScope.pr))
        $rootScope.connected = true;
    else if (!isUndefined($rootScope.pr) && !isUndefined($rootScope.token) && $rootScope.internet) {
        var _user_ = {
        };
        _user_.email = $rootScope.pr.email;
        _user_.code = $rootScope.pr.code;
        $rootScope.connection(_user_, $rootScope, '/');
    } else {
        $location.path('/connexion');
    }

    $rootScope.getphone = function(phone) {
        return phone.split(' ').join('');
    };

    $rootScope.getUrl = function(val) {
        return $sce.trustAsResourceUrl(val);
    };

    // $rootScope.getSliderContent($rootScope);
    
    if(localStorageService.get("version")) {
	    //alert('version');
	    var currentVersion = localStorageService.get("version");
	    currentVersion = parseFloat(currentVersion);
	    if(currentVersion != version){
		    ttbis = (localStorageService.get("tracking"))?localStorageService.get("tracking"):[];
			localStorageService.clearAll();
			localStorageService.add("version",version);
			$rootScope.connected = false;
			$location.path('/connexion');
	    }else{}
    }
    else{
    	ttbis = (localStorageService.get("tracking"))?localStorageService.get("tracking"):[];
    	localStorageService.clearAll();
	    localStorageService.add("version",version);
	    $rootScope.connected = false;
	    $location.path('/connexion');
    }

}]);

animateApp.controller('mainController', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$window', '$sce',
function($scope, $rootScope, $http, $location, localStorageService, $window, $sce) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);
    
    $rootScope.tracePage(1,"home");

    $scope.user_profil = $rootScope.user_profil;
    $scope.page_name = 'page-home';

    $scope.openUrl_s = function(_uri) {
        $window.open(_uri, '_blank', 'location=no');
    };

    $scope.getUrl = function(val) {
        return $sce.trustAsResourceUrl(val);
    };

    $scope.disc = function() {
        localStorageService.clearAll();
        token = '';
        $scope.connect = false;
        $location.path('/');
    };

    $scope.open = function(_name) {
        $location.path('/' + _name);
    };

    // $scope.media = "";

}]);

animateApp.controller('connexionCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$window',
function($scope, $rootScope, $http, $location, localStorageService, $window) {
    
    $scope.connect = function(_user) {
        $scope._is_connected = $rootScope.checkConnection($scope);
        if($scope._is_connected){
            $scope.loading = true;
        $rootScope.connection(_user, $scope, '/');
        }
        
    };
    $scope.openUrl = function(_uri) {
        $window.open(_uri, '_system', 'location=yes');
    };
}]);

animateApp.controller('agendaCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$window',
function($scope, $rootScope, $http, $location, localStorageService, $window) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);
    $rootScope.tracePage(4,"Agenda - Calendrier");

    $scope.loading = true;
    $rootScope.lastest.event.vue = true;
    localStorageService.add('lastest', $rootScope.lastest);

    $scope.user_profil = $rootScope.user_profil;

    $scope.openUrl = function(_uri) {
        $window.open(_uri, '_system', 'location=yes');
    };

    $scope.open = function(g_id) {
        $location.path('/actualite');
    };

    $scope.getMois = function(str) {
        var mymois = ["JAN", "FEV", "MARS", "AVR", "MAI", "JUIN", "JUL", "AOUT", "SEP", "OCT", "NOV", "DEC"];
        var m = (str) ? str.substr(4, 2) : '';
        return (str == '') ? '' : mymois[parseInt(m) - 1];
    };

    $scope.getJour = function(str) {
        return (str) ? str.substr(6, 2) : '';
    };

    $scope.back = function() {
        $scope.event_list = null;
        // localStorageService.get('event_' + _date);
        $scope.flou = '';
        // 'flou';
    };

    $scope.seeEvents = function(_date, _num) {
        $scope.event_list = localStorageService.get('event_' + _date);
        if ($scope.event_list && $scope.event_list != '') {
            //alert(JSON.stringify($scope.event_list));
            $scope.flou = 'flou';
        }
    };

    $scope.detailsEvent = function(eventid) {
        $location.path('/actu/' + eventid);
    };

    var date_today = new Date();
    var d_year = date_today.getFullYear();
    var d_month = date_today.getMonth();
    var m_event_user = localStorageService.get('dates_user');
    var m_event_all = localStorageService.get('dates_all');
    $scope.annee = {
    };
    $scope.annee['date'] = d_year;
    $scope.annee0 = {
    };
    $scope.annee0['date'] = d_year - 1;
    $scope.annee1 = {
    };
    $scope.annee1['date'] = d_year + 1;
    $scope.anneesList = {
    };
    $scope.moisList = {
    };

    var mois = ["JAN", "FEV", "MARS", "AVR", "MAI", "JUIN", "JUI", "AOUT", "SEP", "OCT", "NOV", "DEC"];

    function getMois(_m, aa) {
        var mymois = {
        };
        var m_style = [];
        _m = parseInt(_m);
        if (_m >= 0 && _m < 12) {
            mymois['mois'] = mois[_m];
            mymois['annee'] = aa;
            mymois['sem_list'] = {
            };

            var sem = {
            };

            var nb = new Date(aa, (parseInt(_m) + 1), -1).getDate() + 1;
            var first = new Date(aa, parseInt(_m), 1).getDay();
            first = (first == 0) ? 7 : first;
            var t = 0;
            var i = 1;
            var q = 1;
            var s = 1;
            for ( i = 1; i < first; i++) {
                var d = {
                };
                d['day'] = ' ';
                sem['' + q] = d;
                q++;
                t++;
            }
            for ( i = 1; i <= nb; i++) {
                var d = {
                };

                if (t == 7) {
                    mymois['sem_list']['' + s] = sem;
                    sem = {
                    };
                    s++;
                    q = 1;
                    t = 0;
                }
                d['day'] = i;
                d['date'] = aa + '' + ((('' + (_m + 1)).length < 2) ? '0' + (_m + 1) : (_m + 1)) + ((('' + i).length < 2) ? '0' + i : i);
                if (_m == d_month && i == date_today.getDate() && aa == d_year) {
                    d['class'] = 'day';
                }
                if ($.inArray(d.date, m_event_user) >= 0) {
                    d['class'] = (d['class']) ? (d['class'] + ' ' + 'event_user') : 'event_user';
                    if ($.inArray('event_user', m_style) < 0) {
                        m_style.push('event_user');
                    }
                } else if ($.inArray(d.date, m_event_all) >= 0) {
                    d['class'] = (d['class']) ? (d['class'] + ' ' + 'event_all') : 'event_all';
                    if ($.inArray('event_all', m_style) < 0 && $.inArray('event_user', m_style) < 0) {
                        m_style.push('event_all');
                    }
                }
                sem['' + q] = d;
                q++;
                t++;
            }

            if (t < 7) {
                for ( i = t + 1; i <= 7; i++) {
                    var d = {
                    };
                    d['day'] = ' ';
                    sem['' + q] = d;
                    q++;
                    t++;
                }
            }
            if (t == 7) {
                mymois['sem_list']['' + s] = sem;
            }

            mymois['class'] = m_style.join(' ');

        }
        return mymois;
    }


    $scope.moisView = true;

    var aa = d_year - 1;
    var items = [];
    var _m = d_month;
    var count = 11;

    for ( i = 0; i <= 25; i++) {
        if (_m > count) {
            _m = 0;
            aa++;
        }
        var m1 = getMois(_m, aa);
        m1['num'] = i;
        items.push(m1);

        if (aa == d_year - 1) {
            $scope.annee0['m' + _m] = {
            };
            $scope.annee0['m' + _m]['id'] = i;
            $scope.annee0['m' + _m]['class'] = m1['class'];
        } else if (aa == d_year) {
            $scope.annee['m' + _m] = {
            };
            $scope.annee['m' + _m]['id'] = i;
            $scope.annee['m' + _m]['class'] = m1['class'];
            if (_m == d_month) {
                $scope.annee['m' + _m]['class'] = ($scope.annee['m' + _m]['class']) ? ($scope.annee['m' + _m]['class'] + ' ' + 'day') : 'day';
            }
        } else if (aa == d_year + 1) {
            $scope.annee1['m' + _m] = {
            };
            $scope.annee1['m' + _m]['id'] = i;
            $scope.annee1['m' + _m]['class'] = m1['class'];
        }
        _m++;
    }

    var _m_l = {
    };
    var _t = 1;

    for (_n in items) {
        _m_l['m' + (items[_n].num + 1)] = items[_n];
        _t++;
    }
    $scope.moisList = _m_l;
    if (_t >= 24)
        $scope.loading = false;

}]);

animateApp.controller('membresCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$window', '$anchorScroll',
function($scope, $rootScope, $http, $location, localStorageService, $window, $anchorScroll) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);
    $rootScope.tracePage(2,"Notre R&eacute;seau - Vous connaissez-vous ?");

    $scope.openUrl = function(_uri) {
        $window.open(_uri, '_system', 'location=yes');
    };

    $scope.user_profil = $rootScope.user_profil;
    $scope.page_name = 'page-membres';
    $scope.loading = true;

    $scope.partners = function() {
        $location.path('/partenaires');
    }
    var users = JSON.parse(localStorageService.get('users'));
    if (users)
        $scope.users = users;
    
else if ($rootScope.token) {
        var items = [];
        $http.get($rootScope.host + "/bytoken/users.php?token=" + $rootScope.token).success(function(data) {
            if (data) {
                var url = $rootScope.host + "/bytoken/expertises.php?token=" + $rootScope.token + '&from=0&count=0';
                $scope.loading = true;
                $http.get(url).success(function(res) {
                    if (res && res.length > 0) {
                        //alert(JSON.stringify(res));
                        $scope.expertises = res;
                    }
                });
                
                items = data;
                var lettre = '';
                var ind = 0;
                $.each(items, function() {
                    if (this.nom && lettre != this.nom.charAt(0).toLowerCase()) {
                        lettre = this.nom.charAt(0).toLowerCase();
                        this.first = this.nom.charAt(0).toLowerCase();
                    }
                    if (this.avatar == '') {
                        if (this.civilite.toLowerCase() == 'monsieur')
                            this.avatar = 'images/profil_h.svg';
                        else if (this.civilite.toLowerCase() == 'madame')
                            this.avatar = 'images/profil_f.svg';
                    }
                    if (ind == 0) {
                        this['_class'] = 'pair';
                        ind = 1;
                    } else {
                        this['_class'] = 'impair';
                        ind = 0;
                    }
                });
                $scope.users = items;
                $scope.usersList = items;
                $scope.loading = false;
                $rootScope.lastest.membre.vue = true;
                localStorageService.add('lastest', $rootScope.lastest);
            }
        });
    } else {
        $location.path('/');
    }

    $scope.member = function(mail, userid) {
        $location.path('/profil_detail/' + userid + '/email/' + mail);
    };

    $scope.lister = function(id) {
        var old = $location.hash();
        $location.hash(id);
        $anchorScroll();
        $location.hash(old);
    };
    
    $scope.filtrerExp = function(){
        $scope.usersList = $scope.users;
        if($scope.exp != ""){
            var num = Number($scope.exp);
            $scope.usersList = $.grep($scope.usersList,function(item){
                return $.inArray(num,item.expertises) >= 0;
            });
        }
    };

}]);

animateApp.controller('carriere_cCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$window',
function($scope, $rootScope, $http, $location, localStorageService, $window) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);
    $rootScope.tracePage(7,"Carri&egrave;re - Cabinets de recrutement");
    
    tracking_tab = localStorageService.get("tracking");

    $scope.openUrl = function(_uri) {
        $window.open(_uri, '_system', 'location=yes');
    };

    $scope.user_profil = $rootScope.user_profil;

    $scope.open = function(g_id) {
        $location.path('/carriere');
    };

    $scope._app = {
    };

    $scope._seeM = function(id) {
        var st = $scope._app['m' + id];
        $scope._app = {
        };
        if (!st)
            $scope._app['m' + id] = true;
    };

    $scope.gNum = function(num) {
        if (parseInt(num) % 2 == 0)
            return 'pair';
        else
            return 'impair';
    };

    $scope._seeT = function(id) {
        var st = $scope._app['t' + id];
        $scope._app = {
        };
        if (!st)
            $scope._app['t' + id] = true;
    };

    $scope.escapedHtml = function(str) {
        return (str) ? $rootScope.escapedHtml(str) : '';
    };

    $scope.seeprofil = function(id, mail) {
        $location.path('/profil_detail/' + id + '/email/' + mail);
    };

    $scope.getphone = function(phone) {
        return (phone) ? phone.split(' ').join('') : '';
    };

    $scope.getAvatar = function(user) {
        if ((!user.avatar || user.avatar == '') && user.civilite) {
            if (user.civilite.toLowerCase() == 'monsieur')
                return 'images/profil_h.svg';
            else if (user.civilite.toLowerCase() == 'madame')
                return 'images/profil_f.svg';
        }

        return user.avatar;
    };
    
    $scope.charger = function()
    {
        $scope.loading = true;
        var url = $rootScope.host + "/bytoken/cablist.php?token=" + $rootScope.token + "&from=" + $rootScope.count_agence + "&count=" + ($rootScope.count_agence + 11);
        $http.get(url).success(function(data) {
            if (data && !data.message)
            {
                $rootScope.count_agence += 10;
                $scope.suite = data.length > 10;
                if($scope.suite)
                    data = data.slice(0,9);
                $.each(data, function()
                {
                    var _obj = this;
                    var url1 = $rootScope.host + "/bytoken/cabassoc.php?token=" + $rootScope.token + "&id=" + _obj.id + "&from=0&count=0";
                    $http.get(url1).success(function(res)
                    {
                        $scope.loading = true;
                        if (res && !res.message)
                        {
                            _obj.assoc = res;
                            $scope.cabs['' + _obj.id] = _obj;
                        }
                        $scope.loading = false;
                    });
                });
                $scope.loading = false;
            }
        });
    };

    $scope.loading = true;
    var url = $rootScope.host + "/bytoken/cablist.php?token=" + $rootScope.token + "&from=0&count=11";
    $http.get(url).success(function(data) {
        if (data && !data.message)
        {
            $scope.cabs = {
            };
            $rootScope.count_agence = 10;
            
            $scope.suite = data.length > 10;
            if($scope.suite)
                data = data.slice(0,9);
                
            $.each(data, function() {
                var _obj = this;
                var url1 = $rootScope.host + "/bytoken/cabassoc.php?token=" + $rootScope.token + "&id=" + _obj.id + "&from=0&count=0";
                $http.get(url1).success(function(res) {
                    $scope.loading = true;
                    if (res && !res.message) {
                        _obj.assoc = res;
                        $scope.cabs['' + _obj.id] = _obj;
                    }
                    $scope.loading = false;
                });
            });
            $scope.loading = false;
        }
    });

}]);

animateApp.controller('marqueCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$window',
function($scope, $rootScope, $http, $location, localStorageService, $window) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);
    $rootScope.tracePage(5,"Une marque d'avance");

    $scope.openUrl = function(_uri) {
        $window.open(_uri, '_system', 'location=yes');
    };

    $scope.user_profil = $rootScope.user_profil;
    //$scope._is_connected = navigator.onLine;
    
    var _url = $rootScope.host + "/bytoken/markdocs.php?token=" + $rootScope.token + "&from=0&count=11";
    $scope.loading = true;
    $scope.documents = [];
    $http.get(_url).success(function(data)
    {
        if (data && !data.message)
        {
            $scope.suite = data.length > 10;
            if($scope.suite)
                data = data.slice(0,9);
            $scope.documents = data;
            $rootScope.count_marque = 10;
            $rootScope._sortByDate_inv($scope.documents);
        }

        $scope.loading = false;
        $rootScope.lastest.doc.vue = true;
        localStorageService.add('lastest', $rootScope.lastest);
    });
    
    $scope.charger = function()
    {
        var _url = $rootScope.host + "/bytoken/markdocs.php?token=" + $rootScope.token + "&from=" + $rootScope.count_marque + "&count=" + ($rootScope.count_marque + 11);
        $scope.loading = true;
        // $scope.documents = [];
        $http.get(_url).success(function(data)
        {
            if (data && !data.message)
            {
                $scope.suite = data.length > 10;
                if($scope.suite)
                    data = data.slice(0,9);
                $scope.documents = $scope.documents.concat(data);
                $rootScope.count_marque += 10;
                //$rootScope._sortByDate_inv($scope.documents);
            }
    
            $scope.loading = false;
        });
    };

    $scope.getNum = function(key) {
        if (parseInt(key) % 2 == 0)
            return '4';
        else
            return '5';
    };

    $scope.seedetails = function(id) {
        $location.path('/marque_d/' + id);
    };

}]);

animateApp.controller('marque_dCtrl', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'localStorageService', '$window', '$sce',
function($scope, $rootScope, $http, $location, $routeParams, localStorageService, $window, $sce) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);

    $scope.openUrl = function(_uri) {
        if (_uri && _uri != "")
            window.open(_uri, '_system', 'location=yes');
    };

    $scope.openUrl_vid = function(_uri) {
        var params = _uri.split('/');
        var video = params[params.length - 1].split('.')[0];
        var nb = 2;
        var rep = "";
        while(nb > 0 && params[params.length - nb] != "stockage")
        {
            rep += params[params.length - nb] + "_";
            nb ++;
        }

        var url = "http://www.leclubdesannonceurs.net/loadervideoApp/video.html?rep=" + rep + "&video=" + video;
        window.open(url, '_blank', 'location=no');
    };

    $scope.play_video = function(obj) {
        if (obj.video && obj.video != '')
            $scope.openUrl_vid(obj.video);
        else if ((!obj.video || obj.video == '') && obj.youtube && obj.youtube != '')
            $scope.play_sound(obj.youtube);
    };

    $scope.play_sound = function(_uri) {
        if (_uri && _uri != "")
            window.open(_uri, '_blank', 'location=no');
    };

    /*
     * $scope.play_video = function(_uri) { if(_uri && _uri != "")
     * $window.open(_uri, '_system', 'location=yes'); };
     */

    $scope.user_profil = $rootScope.user_profil;
    //$scope._is_connected = navigator.onLine;
    $scope.loading = true;

    var myid = $routeParams.myid;

    if (!myid || myid <= 0) {
        $location.path('/marque');
    }

    var _url = $rootScope.host + "/bytoken/markdoc.php?token=" + $rootScope.token + "&id=" + myid;
    $http.get(_url).success(function(data) {
        if (data && data.message && data.message.type.toLowerCase() == 'ok') {
            $rootScope.tracePage(23,"" + data.message.titre,true);
            // alert(JSON.stringify(data));
            $scope.marque = data.message;
            $rootScope.note_id = $scope.marque.id;
            $scope.marque.texte = $rootScope.escapedHtml(data.message.texte);
            $scope.loading = false;
            $rootScope.lastest.doc.vue = true;
            localStorageService.add('lastest', $rootScope.lastest);
        }
    });

    $scope.open = function() {
        $location.path('/marque');
    };

    $scope.parseDate = function(str) {
        var mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        var y = str.substr(0, 4), m = str.substr(4, 2), d = str.substr(6, 2);
        var res = '';
        res = d + " " + mois[parseInt(m) - 1] + " " + y;
        return res;
    };

    $rootScope.noter = function(doc, note) {
        if (note && note != "" && doc && doc != "") {
            $scope.loading = true;
            var url = $rootScope.host + "/bytoken/marknote.php?token=" + $rootScope.token + "&iddoc=" + doc + "&iduser=" + $rootScope.user_profil.id + "&note=" + note;

            $http.get(url).success(function(data) {
                if (data && data.message && data.message.type.toLowerCase() == 'ok') {
                    $rootScope.tracePage(69,$scope.marque.titre + " - vote - " + note,true);
                    navigator.notification.alert("Merci d'avoir noté cet article",callB,"UNE MARQUE D'AVANCE");
                    $scope.loading = true;
                    var _url = $rootScope.host + "/bytoken/markdoc.php?token=" + $rootScope.token + "&id=" + doc;
                    $http.get(_url).success(function(data) {
                        if (data && data.message && data.message.type.toLowerCase() == 'ok') {
                            $scope.marque = data.message;
                            $scope.marque.texte = $rootScope.escapedHtml(data.message.texte);
                        }
                        $scope.loading = false;
                    });
                } else {
                    //alert(url);
                    navigator.notification.alert("UN PROBLEME EST SURVENU.\nVEUILLEZ REESSAYER PLUS TARD.",callB,"UNE MARQUE D'AVANCE");
                    $scope.loading = false;
                }
            });
        }
    };

}]);

animateApp.controller('galerieCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$window',
function($scope, $rootScope, $http, $location, localStorageService, $window) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);
    $rootScope.tracePage(6,"Y &eacute;tiez vous ?");

    $scope.openUrl = function(_uri) {
        $window.open(_uri, '_system', 'location=yes');
    };

    $scope.open = function(g_id) {
        $location.path('/galerie_detail/' + g_id);
    };

    $scope.parseDate = function(str) {
        var mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        var y = str.substr(0, 4), m = str.substr(4, 2), d = str.substr(6, 2);
        var res = '';
        res = d + " " + mois[parseInt(m) - 1] + " " + y;
        return res;
    };

    $scope.loading = true;
    $http.get($rootScope.host + "/bytoken/galeriecates.php?token=" + $rootScope.token).success(function(res, status) {
        if (res && !res.message) {
            $scope.mygalerie = res;
            //$rootScope._sortByDate($scope.mygalerie);
            $scope.loading = false;
        }
    });

    $scope.user_profil = $rootScope.user_profil;

}]);

animateApp.controller('carriereCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$sce', '$window',
function($scope, $rootScope, $http, $location, localStorageService, $sce, $window) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);
    $rootScope.tracePage(8,"Carri&egrave;re - CVth&egrave;que");
    tracking_tab = localStorageService.get("tracking");;

    $scope.open = function() {
        $location.path('/carriere_a');
    };

    $scope.getFile = function(_uri) {
        $window.open(_uri, '_blank', 'toolbar=0,location=0,menubar=0');
    };

    $scope.seeprofil = function(id, mail) {
        $location.path('/profil_detail/' + id + '/email/' + mail);
    };

    $scope._app = {
    };

    $scope._see = function(id) {
        var st = $scope._app['t' + id];
        $scope._app = {
        };
        if (!st)
            $scope._app['t' + id] = 'open';
    };

    $scope.user_profil = $rootScope.user_profil;

    $scope.loading = true;

    var url = $rootScope.host + "/bytoken/cvlist.php?token= + " + $rootScope.token + "&from=0&count=0";

    $http.get(url).success(function(data) {
        if (data && !data.message) {
            var items = [];
            $.each(data, function() {
                // this.filename = getFilename(this);
                items.push(this);
            });
            $scope.cvlist = items;
            // alert(JSON.stringify(items));
            $scope.loading = false;
        }
    });

    $scope.getAvatar = function(user) {
        if ((!user.avatar || user.avatar == '') && user.civilite) {
            if (user.civilite.toLowerCase() == 'monsieur')
                return 'images/profil_h.svg';
            else if (user.civilite.toLowerCase() == 'madame')
                return 'images/profil_f.svg';
        }

        return user.avatar;
    };

    $scope.parseDate = function(str) {
        var mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        var y = str.substr(0, 4), m = str.substr(4, 2), d = str.substr(6, 2);
        var res = '';
        res = d + " " + mois[parseInt(m) - 1] + " " + y;
        return res;
    };

    $scope.escapedHtml = function(str) {
        return $rootScope.escapedHtml(str);
    };

}]);

animateApp.controller('actualiteCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$window',
function($scope, $rootScope, $http, $location, localStorageService, $window) {
    //$scope._is_connected = navigator.onLine;
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);
    $rootScope.tracePage(4,"Agenda - Fil d'actualit&eacute;");

    $scope.open = function(g_id) {
        $location.path('/agenda');
    };

    $scope.openUrl = function(_uri) {
        $window.open(_uri, '_system', 'location=yes');
    };

    $scope.seeEvent = function(eventid) {
        $location.path('/actu/' + eventid);
    };

    $scope.getMois = function(str) {
        var mymois = ["JAN", "FEV", "MARS", "AVR", "MAI", "JUIN", "JUL", "AOUT", "SEP", "OCT", "NOV", "DEC"];
        var m = (str) ? str.substr(4, 2) : '';
        return (str == '') ? '' : mymois[parseInt(m) - 1];
    };

    $scope.getJour = function(str) {
        return (str) ? str.substr(6, 2) : '';
    };

    var date_today = new Date();
    var d_year = date_today.getFullYear();
    var d_j = date_today.getDate();
    d_j = (d_j.length < 2) ? '0' + d_j : d_j;
    var d_month = date_today.getMonth();
    var nb = new Date((d_year + 1), (parseInt(d_month) + 1), -1).getDate() + 1;
    var debut = (d_year - 1) + '' + ((('' + (d_month + 1)).length < 2) ? '0' + (d_month + 1) : (d_month + 1)) + '01';
    var fin = (d_year + 1) + '' + ((('' + (d_month + 1)).length < 2) ? '0' + (d_month + 1) : (d_month + 1)) + nb;
    var dateT = d_year + '' + ((('' + (d_month + 1)).length < 2) ? '0' + (d_month + 1) : (d_month + 1)) + ((('' + (date_today.getDate())).length < 2) ? '0' + (date_today.getDate()) : (date_today.getDate()));
    $scope.user_profil = $rootScope.user_profil;

   
    if ($scope._is_connected) {
        $scope.loading = true;
        $rootScope.setEvents_all(dateT,debut, fin, $scope);
        $rootScope.setEvents_user(debut, fin, $scope);
    } else {
        var items = localStorageService.get('dates_all');
        $rootScope._sort(items);
        $scope.actualites = {};

        var a = 0;
        $.each(items, function(cl, value) {
            if (parseInt(value) >= parseInt(debut)) {
                $.each(localStorageService.get('event_' + value), function(key, val) {
                    $scope.actualites['' + a] = val;
                    a++;
                });
            }
            $scope.loading = false;
            $rootScope.lastest.event.vue = true;
            localStorageService.add('lastest', $rootScope.lastest);
        });
    }
    
}]);

animateApp.controller('parametresCtrl', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'localStorageService', '$window', 'fileUpload',
function($scope, $rootScope, $http, $location, $routeParams, localStorageService, $window, fileUpload) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);
    $rootScope.tracePage(10,"Param&egrave;tres - Param&egrave;tres g&eacute;n&eacute;raux");
    
    $scope.hostUrl = $rootScope.host;

    $scope.texte = $rootScope.pr.code;
    $scope.error = false;
    $scope.message = false;

    $scope.liste = {};
    
    $scope.editProfil = function(){
        $location.path('/editprofil');
    };
    
    $scope.editPartners = function(){
        $location.path('/editpartners');
    };

    $scope.changeAvatar = function() {
        var file = $scope.myFile;
        var form = {};
        form.mail = $rootScope.user_profil.mail;
        form.token = $rootScope.token;
        form.id = parseInt($rootScope.user_profil.id);
        form.size = "700000";

        var uploadUrl = 'http://www.leclubdesannonceurs.net/bytoken/avatar.php';
        fileUpload.uploadFileToUrl(form, file, uploadUrl, $scope);
    };

    $scope.deconnexion = function() {
        ttbis = (localStorageService.get("tracking"))?localStorageService.get("tracking"):[];
        localStorageService.clearAll();
        localStorageService.add("tracking",JSON.stringify(ttbis));
        localStorageService.add("version",version);
        $rootScope.connected = false;
        $location.path('/connexion');
    };

    $scope.changeMDP = function()
    {
        if ($scope.texte && $scope.texte != '' && $scope.texte != $rootScope.pr.code)
        {
            var url = $rootScope.host + "/bytoken/pwd.php?token=" + $rootScope.token + "&mail=" + $rootScope.user_profil.mail + "&id=" + $rootScope.user_profil.id + "&newcode=" + $scope.texte;
            $http.get(url).success(function(data)
            {
                if (data.message.type.toLowerCase() == 'ok')
                {
                    $scope.error = false;
                    $scope.message = "Votre mot de passe a été modifié avec succès !"
                    $scope.loading = true;
                    var _user = {};
                    _user.email = $rootScope.user_profil.mail;
                    _user.code = $scope.texte;
                    $scope.loading = false;
                    $scope.texte = "";
                    $rootScope.connection(_user, $rootScope, '/parametres');
                } 
                else
                {
                    $scope.error = "Une erreur est survenue lors du changement de votre mot de passe.";
                    $scope.message = false;
                }
            });
        }
        else
        {
            $scope.error = "Veuillez entrer un mot de passe valide et différent de l'ancien.";
            $scope.message = false;
        }
    };

    $scope.newsletter = function() {
        var news = (parseInt($rootScope.user_profil.newsletter) + 1) % 2;
        var message = "Voulez-vous vous " + ((news == '0') ? "dés" : "") + "inscrire " + ((news == '0') ? "de" : "à") + " la newsletter ?";
        
        navigator.notification.confirm(message, function(buttonIndex) {
            if (buttonIndex == 1) {
                var url = $rootScope.host + "/bytoken/newsletter.php?token=" + $rootScope.token + "&mail=" + $rootScope.user_profil.mail + "&id=" + $rootScope.user_profil.id + "&newsletter=" + news
                $http.get(url).success(function(data) {
                    if (data.message.type.toLowerCase() == 'ok') {
                        $rootScope.user_profil.newsletter = news;
                        $scope.user_profil = $rootScope.user_profil;
                        localStorageService.add('details', JSON.stringify($rootScope.user_profil));
                    } else
                        navigator.notification.alert('Une erreur est survenue lors de votre inscription à la newsletter', callB, "PARAMETRES");
                });
            }
        }, "PARAMETRES", ["Oui", "Non"]);

    };

}]);

animateApp.controller('contenuCtrl', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'localStorageService', '$window', '$sce',
function($scope, $rootScope, $http, $location, $routeParams, localStorageService, $window, $sce) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);
    $rootScope.tracePage(9,"Nos contenus");
    tracking_tab = localStorageService.get("tracking");

    $scope.user_profil = $rootScope.user_profil;
    
    $scope.loading = true;
    var url = $rootScope.host + "/bytoken/contenus.php?token=" + $rootScope.token + "&from=0&count=11";

    $http.get(url).success(function(data) {
        if (data && !data.message) {
            
            $scope.cates = {};
            $scope.suite = data.length > 10;
            if($scope.suite)
                data = data.slice(0,9);
            $scope.contenu = data;
            $rootScope.count_contenu = 10;
            
            $.each(data, function()
            {
                    $scope.cates['' + this.categorieId] = {};
                    $scope.cates[''+this.categorieId]['texte'] = this.categorie;
            });
            $rootScope._sortByDate_inv($scope.contenu);
            $scope.loading = false;
            $rootScope.lastest.content.vue = true;
            localStorageService.add('lastest', $rootScope.lastest);
        }
    });
    
    $scope.charger = function()
    {
        $scope.loading = true;
        var url = $rootScope.host + "/bytoken/contenus.php?token=" + $rootScope.token + "&from=" + $rootScope.count_contenu + "&count=" + ($rootScope.count_contenu + 11);  
        $http.get(url).success(function(data) {
            if (data && !data.message)
            {
                $scope.suite = data.length > 10;
                if($scope.suite)
                    data = data.slice(0,9);
                $scope.contenu = $scope.contenu.concat(data);
                $rootScope.count_contenu += 10;
    
                $.each(data, function()
                {
                        $scope.cates['' + this.categorieId] = {};
                        $scope.cates[''+this.categorieId]['texte'] = this.categorie;
                });
                $rootScope._sortByDate_inv($scope.contenu);
                $scope.loading = false;
            }
        }); 
    };

    $rootScope.media = "";

    $scope.readMedia = function(val) {
        if (val.video && val.video != "") {
            $rootScope.media = val.video;
            $rootScope.video = true;
            $rootScope.youtube = false;
        } else if (val.youtube && val.youtube != "") {
            $rootScope.media = val.youtube;
            $rootScope.video = false;
            $rootScope.youtube = true;
        } else
            $rootScope.media = "";

    };

    $scope.parseDate = function(str) {
        var mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        var y = str.substr(0, 4), m = str.substr(4, 2), d = str.substr(6, 2);
        var res = '';
        res = d + " " + mois[parseInt(m) - 1] + " " + y;
        return res;
    };

    $scope.getlogo = function(val) {
        if (!val.photo || val.photo == '')
            return '';

        return val.photo;
    };

    $scope.openUrl = function(_uri) {
        window.open(_uri, '_system', 'location=yes');
    };

    $scope.openUrl_s = function(_uri) {
        window.open(_uri, '_blank', 'location=no');
    };

    $scope.openUrl_vid = function(_uri)
    {
        var params = _uri.split('/');
        var video = params[params.length - 1].split('.')[0];
        var nb = 2;
        var rep = "";
        while(nb > 0 && params[params.length - nb] != "stockage")
        {
            rep += params[params.length - nb] + "_";
            nb ++;
        }

        var url = "http://www.leclubdesannonceurs.net/loadervideoApp/video.html?rep=" + rep + "&video=" + video;
        window.open(url, '_blank', 'location=no');
    };
    
}]);

animateApp.controller('g_detailCtrl', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'localStorageService', '$window',
function($scope, $rootScope, $http, $location, $routeParams, localStorageService, $window) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);

    $scope.open = function() {
        $location.path('/galerie');
    }

    $scope.parseDate = function(str) {
        var mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        var y = str.substr(0, 4), m = str.substr(4, 2), d = str.substr(6, 2);
        var res = '';
        res = d + " " + mois[parseInt(m) - 1] + " " + y;
        return res;
    };

    var id_g = $routeParams.myid;
    $scope.loading = true;
    $http.get($rootScope.host + "/bytoken/galeriecate.php?token=" + $rootScope.token + "&cate=" + id_g).success(function(res, status) {
        if (res && res.message && res.message.type == 'OK') {
            $scope.mygalerie = res.message;
            $rootScope.tracePage(24,res.message.titrecate + " - " + res.message.titregalerie);
            $http.get($rootScope.host + "/bytoken/galeriephotos.php?token=" + $rootScope.token + "&cate=" + id_g).success(function(res, status) {
                if (res && !res.message) {
                    $scope.photos = res;
                    $scope.loading = false;
                }
            });
        }
    });

    $scope.user_profil = $rootScope.user_profil;

}]);

animateApp.controller('profil_dCtrl', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'localStorageService', '$window',
function($scope, $rootScope, $http, $location, $routeParams, localStorageService, $window) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);

    $scope.user_profil = $rootScope.user_profil;

    $scope.open = function() {
        $location.path('/membres');
    };

    $scope.openUrl_s = function(_uri) {
        $window.open(_uri, '_blank', 'location=no');
    };

    $scope.getphone = function(phone) {
        return (phone) ? phone.split(' ').join('') : '';
    };

    var userid = $routeParams.userid;
    var mail = $routeParams.mail;

    var profil = {
    };

    if (userid && mail && $rootScope.token) {
        $scope.loading = true;
        $http.get($rootScope.host + "/bytoken/user.php?token=" + $rootScope.token + '&mail=' + mail + '&id=' + userid).success(function(data, status) {
            if (data && data.message && data.message.type.toLowerCase() == 'ok') {
                profil = data.message;
                $rootScope.tracePage(20,profil.prenom + " " + profil.nom,true);
                if (profil.avatar == '') {
                    if (profil.civilite.toLowerCase() == 'monsieur')
                        profil.avatar = 'images/profil_h.svg';
                    else if (profil.civilite.toLowerCase() == 'madame')
                        profil.avatar = 'images/profil_f.svg';
                }

                $http.get($rootScope.host + "/bytoken/partners.php?token=" + $rootScope.token + '&mail=' + mail + '&id=' + userid).success(function(data, status) {
                    if (data) {
                        var items = [];
                        $.each(data, function() {
                            items.push(this.nom);
                        });
                        profil.partners = items.join(',');
                        $scope.profil = profil;
                        $scope.loading = false;
                    }
                });
            }
        });
    } else if (!$rootScope.token)
        $location.path('/');
    else
        $location.path('/membres');
}]);

animateApp.controller('actu_dCtrl', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'localStorageService', '$window', '$sce',
function($scope, $rootScope, $http, $location, $routeParams, localStorageService, $window, $sce) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);
    $rootScope.tracePage(4,"Agenda - D&eacute;tail");
    tracking_tab = localStorageService.get("tracking");;

    $scope.loading = true;
    $scope.texte = "";

    $scope.getUrl = function(val) {
        return $sce.trustAsResourceUrl(val);
    };
    
    $scope.isNoMail = function(str)
    {
        var tab = [];
        if(str != undefined && str != "")
        {
            var tab = str.split("@");
            return (tab.length > 1 && tab[1].toLowerCase() == "nomail.com");
        }
        return false;
    };

    function isPast(ev) {
        var date_today = new Date();
        var d_year = date_today.getFullYear();
        var d_month = parseInt(date_today.getMonth()) % 12;
        var nb = new Date((d_year + 1), (parseInt(d_month) + 1), -1).getDate() + 1;
        var d_t = d_year + '' + ((('' + (d_month + 1)).length < 2) ? '0' + (d_month + 1) : (d_month + 1)) + ((('' + (date_today.getDate())).length < 2) ? '0' + (date_today.getDate()) : (date_today.getDate()));

        //alert(d_t);
        return parseInt(d_t) >= parseInt(ev);
    };

    $scope.escapedHtml = function(str) {
        return $rootScope.escapedHtml(str);
    }

    $scope.showNote = function(val) {
        $rootScope.my_note = val;
    };

    $scope.openUrl = function() {
        $http.get($rootScope.host + "/bytoken/eventinfo.php?token=" + $rootScope.token + '&idevent=' + eventid).success(function(res, status) {
            if (res && res.message && res.message.type.toLowerCase() == 'ok') {
                $rootScope.tracePage(68,res.message.titre + " - synchronisation agenda natif",true);
                var addcalendar = res.message;
                var str;
                var strbis;
            
                function get_ents(str){
                    var temp = document.createElement("pre");
                    temp.innerHTML=str;
                    return (temp.firstChild)?temp.firstChild.nodeValue : "";
                }
                
                function parsecalendar(str, strbis) {
                    if(!/^(\d){8}$/.test(str)) return "invalid date";
                    var y = str.substr(0,4),
                        m = str.substr(4,2) - 1,
                        d = str.substr(6,2),
                        h = strbis.substr(0,2),
                        mi = strbis.substr(2,2);
                    return new Date(y,m,d,h,mi);
                }
                
                var _debut = addcalendar.debutdate.toString();
                var _debuth = addcalendar.debutheure.toString();
                if ( _debuth == "0"){
                    _debuth = "0000";
                }
                else if (_debuth.length ==  1){
                    _debuth = "000"+_debuth;
                }
                else if (_debuth.length ==  2){
                    _debuth = "00"+_debuth;
                }
                else if (_debuth.length ==  3){
                    _debuth = "0"+_debuth;
                }
                else{}
                _debut = parsecalendar(_debut, _debuth);
                var _fin = addcalendar.findate.toString();
                var _finh = addcalendar.finheure.toString();
                if ( _finh == "0"){
                    _finh = "2359";
                }
                else if (_finh.length ==  1){
                    _finh = "000"+_finh;
                }
                else if (_finh.length ==  2){
                    _finh = "00"+_finh;
                }
                else if (_debuth.length ==  3){
                    _finh = "0"+_finh;
                }
                else{}
                _fin = parsecalendar(_fin, _finh);
                var _titre = get_ents(addcalendar.titre);
                var _categorie = get_ents(addcalendar.categorie);
                var _pratique = get_ents(addcalendar.pratique);
                var _sujets = get_ents(addcalendar.sujetsproposes);
                var notes;
                
                notes = "Club des annonceurs - " + _categorie + " - " + _sujets;

                var success = function(message) { navigator.notification.alert("Cet évènement a été ajouté à votre agenda personnel",callB,"AGENDA"); };
                var error = function(message) { navigator.notification.alert("Cet évènement n'a pas pu être ajouté à votre agenda personnel",callB,"AGENDA"); };
                window.plugins.calendar.createEvent(_titre,_pratique,notes,_debut,_fin,success,error);
                
            }
        });

    };

    $scope.poster = function(test, idevent) {
        //$scope._is_connected = navigator.onLine;

        if (test != '' && $scope._is_connected) {
            $scope.loading = true;
            var url = $rootScope.host + "/bytoken/eventcomment.php?token=" + $rootScope.token + '&idevent=' + idevent + '&iduser=' + $rootScope.user_profil.id + "&texte=" + test;
            $http.get(url).success(function(data) {
                if (data && data.message && data.message.type.toLowerCase() == 'ok') {
                    $rootScope.tracePage(66,$scope.evenement.titre + " - commentaires",true);
                    navigator.notification.alert("Merci d'avoir laisser un commentaire.\nIl sera publié dès validation par le Club des annonceurs",callB,"AGENDA");
                    $scope.texte = '';
                    $scope.loading = false;
                }
            });
        }

    }

    $scope.gNum = function(nm) {
        if (parseInt(nm) % 2 == 0)
            return 'pair';
        else
            return 'impair';
    };

    $scope.inscription = function(stat) {
        if ($scope.evenement && $scope._is_connected) {
            var url = $rootScope.host + "/bytoken/" + ((stat == '0') ? "eventunsubscribe" : "eventsubscribe") + ".php?token=" + $rootScope.token + '&idevent=' + $scope.evenement.id + '&iduser=' + $rootScope.user_profil.id + ((stat == '0') ? "" : "&mail=" + $rootScope.user_profil.mail);
            var message = 'Voulez-vous vous ' + ((stat == '0') ? "dés" : "") + 'inscrire '  + ((stat == '0') ? "de" : "à") +  ' cet évènement ?';
            
            navigator.notification.confirm(message, function(buttonIndex) {
                if (buttonIndex == 1) {
                    $scope.loading = true;
                    $http.get(url).success(function(data) {
                        if (data && data.message && data.message.type.toLowerCase() == 'ok') {
                            var tab = localStorageService.get("events_user");
                            if (stat == 1 && $.inArray($scope.evenement.id, tab) < 0) {
                                tab.push($scope.evenement.id);
                                localStorageService.add("events_user", tab);
                                tab = localStorageService.get("dates_user");
                                tab.push($scope.evenement.date);
                                localStorageService.add("dates_user", tab);
                            } else if (stat == 0) {

                                tab = $.grep(tab, function(a) {
                                    return a != null && a != undefined && a != "" && a != $scope.evenement.id;
                                });
                                localStorageService.add("events_user", tab);
                                tab = localStorageService.get("dates_user");
                                tab = $.grep(tab, function(a) {
                                    return a != null && a != undefined && a != "" && a != $scope.evenement.date;
                                });
                                localStorageService.add("dates_user", tab);
                            }

                            $scope.loading = false;
                            $scope.evenement.inscrit = stat;
                        } else {
                            $scope.loading = false;
                        }
                    });
                }
            }, "AGENDA", ["Oui", "Non"]); 

        }
    };

    function parseDate(str) {
        var mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        var y = str.substr(0, 4), m = str.substr(4, 2), d = str.substr(6, 2);
        var res = '';
        res = d + " " + mois[parseInt(m) - 1] + " " + y;
        return res;
    };

    function getMois(str) {
        var mymois = ["JAN", "FEV", "MARS", "AVR", "MAI", "JUIN", "JUI", "AOUT", "SEP", "OCT", "NOV", "DEC"];
        var m = (str) ? str.substr(4, 2) : '';
        return (str == '') ? '' : mymois[parseInt(m) - 1];
    };

    function getJour(str) {
        return (str) ? str.substr(6, 2) : '';
    };

    $scope.getphone = function(phone) {
        return phone.split(' ').join('');
    };

    function parseHeure(str) {
        var h = str.substr(0, ((str.length >= 4) ? 2 : 1));
        var m = str.substr(((str.length >= 4) ? 2 : 1), 2);
        var res = ((h.length < 2) ? '0' + h : h) + "h" + m;
        return res;
    };

    $scope.getAvatar = function(user) {
        if (user.photo == '') {
            if (user.civilite.toLowerCase() == 'monsieur')
                user.photo = 'images/profil_h.svg';
            else if (user.civilite.toLowerCase() == 'madame')
                user.photo = 'images/profil_f.svg';
        }
        return user.photo;
    }
    var eventid = $routeParams.eventid;

    $http.get($rootScope.host + "/bytoken/eventinfo.php?token=" + $rootScope.token + '&idevent=' + eventid).success(function(res, status) {
        if (res && res.message && res.message.type.toLowerCase() == 'ok') {
            var event_ = res.message;
            event_.ispast = isPast(res.message.findate);
            event_.mois = getMois(res.message.debutdate);
            event_.jour = getJour(res.message.debutdate);
            event_.debutdate = parseDate(res.message.debutdate);
            event_.date = res.message.debutdate;
            event_.findate = parseDate(res.message.findate);
            event_.debutheure = parseHeure(res.message.debutheure);
            event_.finheure = parseHeure(res.message.finheure);
            $scope.evenement = event_;
            
            $rootScope.tracePage(22,event_.categorie + " - " + event_.titre,true);

            var _url_1 = $rootScope.host + "/bytoken/eventinscrits.php?token=" + $rootScope.token + '&idevent=' + eventid + "&intervenant=" + 1;
            $http.get(_url_1).success(function(_res, status) {
                if (_res && !_res.message) {
                    var t = [];
                    $scope.evenement.inter = _res;
                    $.each(_res, function() {
                        t.push(this.id)
                    });
                    if ($.inArray($rootScope.user_profil.id, t) >= 0)
                        $scope.evenement.inscrit = 1;
                }

                var _url_ = $rootScope.host + "/bytoken/eventinscrits.php?token=" + $rootScope.token + '&idevent=' + eventid + "&intervenant=" + 0;
                $http.get(_url_).success(function(data, status) {
                    if (data && !data.message) {
                        $scope.evenement.part = data;
                        var t = [];
                        $.each(data, function() {
                            t.push(this.id)
                        });
                        if ($.inArray($rootScope.user_profil.id, t) >= 0)
                            $scope.evenement.inscrit = 1;
                    }

                    var url1 = $rootScope.host + "/bytoken/eventcomments.php?token=" + $rootScope.token + '&idevent=' + eventid + "&from=0&count=0";

                    $http.get(url1).success(function(res) {
                        if (res && !res.message) {
                            $scope.commentaires = res;
                            $rootScope.note_id = eventid;
                            $scope.loading = false;
                            $rootScope.lastest.event.vue = true;
                            localStorageService.add('lastest', $rootScope.lastest);
                        }
                    });
                });
            });
        }
    });

    $scope.calendar = function() {
        $location.path('/agenda');
    };

    $scope.fil_actu = function() {
        $location.path('/actualite');
    };

    $rootScope.noter = function(eventid, note) {
        if (note && note != "" && eventid && eventid != "") {
            $scope.loading = true;
            var url = $rootScope.host + "/bytoken/eventnote.php?token=" + $rootScope.token + "&idevent=" + eventid + "&iduser=" + $rootScope.user_profil.id + "&note=" + note;

            var inscrit = ($scope.evenement.inscrit) ? $scope.evenement.inscrit : 0;

            $http.get(url).success(function(data) {
                if (data && data.message && data.message.type.toLowerCase() == 'ok') {
                    $rootScope.tracePage(67,$scope.evenement.titre + " - vote - " + note,true);
                    navigator.notification.alert("Merci d'avoir noté cet évènement",callB,"AGENDA");
                    $scope.loading = true;
                    $http.get($rootScope.host + "/bytoken/eventdate.php?token=" + $rootScope.token + '&date=' + $scope.evenement.debutdate).success(function(res) {
                        if (res && res.message && res.message.type.toLowerCase() == 'ok') {
                            var event_ = res.message;
                            event_.ispast = isPast(res.message.findate)
                            event_.mois = getMois(res.message.debutdate);
                            event_.jour = getJour(res.message.debutdate);
                            event_.date = res.message.debutdate;
                            event_.debutdate = parseDate(res.message.debutdate);
                            event_.findate = parseDate(res.message.findate);
                            event_.debutheure = parseHeure(res.message.debutheure);
                            event_.finheure = parseHeure(res.message.finheure);
                            $scope.evenement = event_;
                        }
                        $scope.loading = false;
                    });
                } else
                    navigator.notification.alert("UN PROBLEME EST SURVENU.\nVEUILLEZ REESSAYER PLUS TARD.",callB,"AGENDA")
            });
        }
    };

}]);

animateApp.controller('partnersCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$window', '$anchorScroll',
function($scope, $rootScope, $http, $location, localStorageService, $window, $anchorScroll) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);
    $scope.loading = true;
    //$scope._is_connected = navigator.onLine;
    $rootScope.tracePage(3,"notre R&eacute;seau - Qui travaille avec qui ?");

    $scope.reseau = function() {
        $location.path('/membres');
    };
    
    $scope.lister = function(id) {
        var old = $location.hash();
        $location.hash(id);
        $anchorScroll();
        $location.hash(old);
    };

    $scope.openUrl = function(_uri) {
        $window.open(_uri, '_system', 'location=yes');
    };

    $scope.details = function(myid) {
        $location.path('/partenaire/' + myid);
    };

    var _url_ = $rootScope.host + "/bytoken/partlist.php?token=" + $rootScope.token + '&from=0&count=0';
    $http.get(_url_).success(function(data, status) {
        if (data && !data.message) {
            
            var url = $rootScope.host + "/bytoken/expertises.php?token=" + $rootScope.token + '&from=0&count=0';
            $scope.loading = true;
            $http.get(url).success(function(res) {
                if (res && res.length > 0) {
                    $scope.expertises = res;
                }
            });
            
            var items = data;
            var lettre = '';
            var ind = 0;
            $.each(items, function() {
                if (this.nom && lettre != this.nom.charAt(0).toLowerCase()) {
                    lettre = this.nom.charAt(0).toLowerCase();
                    this.first = this.nom.charAt(0).toLowerCase();
                }
                if (this.logo == '') {
                    this.logo = 'logo_societe.svg';
                }
                if (ind == 0) {
                    this['_class'] = 'pair';
                    ind = 1;
                } else {
                    this['_class'] = 'impair';
                    ind = 0;
                }
            });
            $scope.partners = items;
            $scope.partnersList = items;
            $scope.loading = false;
        }
    });
    
    $scope.filtrerExp = function(){
        $scope.partnersList = $scope.partners;
        if($scope.exp != ""){
            var num = Number($scope.exp);
            $scope.partnersList = $.grep($scope.partnersList,function(item){
                return $.inArray(num,item.expertises) >= 0;
            });
        }
    };

}]);

animateApp.controller('partner_dCtrl', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'localStorageService', '$window', '$sce',
function($scope, $rootScope, $http, $location, $routeParams, localStorageService, $window, $sce) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);

    $scope.loading = true;
    //$scope._is_connected = navigator.onLine;
    var myid = $routeParams.myid;

    $scope.openUrl = function(_uri) {
        $window.open(_uri, '_system', 'location=yes');
    };
    
    $scope.isNotVide = function(str) {
        return (str && str != "" && str.toLowerCase() != "[aucun]" && str.toLowerCase() != "aucun");
    };

    if (!myid)
        $location.path('/partenaires');

    $scope.getAvatar = function(user) {
        if (user.avatar == '' && user.civilite) {
            if (user.civilite.toLowerCase() == 'monsieur')
                user.avatar = 'images/profil_h.svg';
            else if (user.civilite.toLowerCase() == 'madame')
                user.avatar = 'images/profil_f.svg';
        }
        return user.avatar;
    };

    $scope.getphone = function(phone) {
        return phone.split(' ').join('');
    };

    $scope.getTexte = function(texte) {
        var t_ = $sce.getTrustedHtml(texte);
        return t_;
    };

    $scope.getNum = function(key) {
        if (parseInt(key) % 2 == 0)
            return 'pair';
        else
            return 'impair';
    };

    var _url_ = $rootScope.host + "/bytoken/partinfo.php?token=" + $rootScope.token + '&id=' + myid;
    $http.get(_url_).success(function(data, status) {
        if (data && data.message && data.message.type.toLowerCase() == 'ok') {
            $scope.partner = data.message;
            $rootScope.tracePage(21,data.message.nom,true);
            
            $scope.partner.texte = $rootScope.escapedHtml(data.message.texte);
            // .replace(/&lt;/g, '<').replace(/&gt;/g,'>')
            if ($scope.partner.logo == '')
                $scope.partner.logo = 'logo_societe.svg';

            var _url_1 = $rootScope.host + "/bytoken/partassoc.php?token=" + $rootScope.token + '&id=' + myid + '&from=0&count=0';
            $http.get(_url_1).success(function(res) {
                if (res && !res.message) {
                    $scope.assoc = res;
                    $scope.loading = false;
                }
            });
        }
    });

    $scope.open = function() {
        $location.path('/partenaires');
    }
}]);

animateApp.controller('sliderCtrl', ['$scope', '$rootScope', '$location', 'localStorageService', '$sce',
function($scope, $rootScope, $location, localStorageService, $sce) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);

    $rootScope.getSliderContent($scope);

    $scope.getMois = function(str) {
        var mymois = ["JAN", "FEV", "MARS", "AVR", "MAI", "JUIN", "JUL", "AOUT", "SEP", "OCT", "NOV", "DEC"];
        var m = (str) ? str.substr(4, 2) : '';
        return (str == '') ? '' : mymois[parseInt(m) - 1];
    };

    $scope.getJour = function(str) {
        return (str) ? str.substr(6, 2) : '';
    };

    $scope.member = function(mail, userid) {
        $location.path('/profil_detail/' + userid + '/email/' + mail);
    };

    $scope.seeEvent = function(eventid) {
        $location.path('/actu/' + eventid);
    };

    $scope.seeDoc = function(iddoc) {
        $location.path('/marque_d/' + iddoc);
    };

}]);

animateApp.controller('edit_profilCtrl', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'localStorageService', '$window', 'fileUpload',
function($scope, $rootScope, $http, $location, $routeParams, localStorageService, $window, fileUpload) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);
    $rootScope.tracePage(11,"Param&egrave;tres - Modification du profil");
    
    var url = $rootScope.host + "/bytoken/expertises.php?token=" + $rootScope.token + '&from=0&count=0';
    $scope.loading = true;
    $http.get(url).success(function(res) {
        if (res && res.length > 0) {
            //alert(JSON.stringify(res));
            $scope.expertises = {};
            $scope.expertises["liste"] = res;
            var exp1 = "";
            var exp2 = "";
            var exp3 = "";
            var exp4 = "";
            var exp5 = "";
            
            for(var i = 0; i < res.length ; i++) {
                  if($rootScope.user_profil.expertise1 == res[i].titre) exp1 = res[i].id;
                  if($rootScope.user_profil.expertise2 == res[i].titre) exp2 = res[i].id;
                  if($rootScope.user_profil.expertise3 == res[i].titre) exp3 = res[i].id;
                  if($rootScope.user_profil.expertise4 == res[i].titre) exp4 = res[i].id;
                  if($rootScope.user_profil.expertise5 == res[i].titre) exp5 = res[i].id;
                  
                  if(exp1 !== "" && exp2 !== "" && exp3 !== "" && exp4 !== "" && exp5 !== "") break;
            }
            
            $scope.expertises["exp1"] = exp1;
            $scope.expertises["exp2"] = exp2;
            $scope.expertises["exp3"] = exp3;
            $scope.expertises["exp4"] = exp4;
            $scope.expertises["exp5"] = exp5;
            
            $scope.loading = false;
        }
    });
    
    var url1 = $rootScope.host + "/bytoken/activlist.php?token=" + $rootScope.token + '&from=0&count=0';
    $scope.loading = true;
    $http.get(url1).success(function(res) {
        
        if (res && res.length > 0) {
            //alert(JSON.stringify(res));
            $scope.activites = {};
            $scope.activites["liste"] = res;
            var val = "";
            
            for(var i = 0; i < res.length ; i++) {
                  if($rootScope.user_profil.activite == res[i].titre) val = res[i].id;
                  
                  if(val != "") break;
            }
            
            $scope.activites["value"] = val;
            $scope.loading = false;
        }
    });
    
    var url2 = $rootScope.host + "/bytoken/pays.php?token=" + $rootScope.token + '&from=0&count=0';
    $scope.loading = true;
    $http.get(url2).success(function(res) {
        if (res && res.length > 0) {
            //alert(JSON.stringify(res));
            $scope.pays = {};
            $scope.pays["liste"] = res;
            var val = "";
            
            for(var i = 0; i < res.length ; i++) {
                  if($rootScope.user_profil.pays == res[i].titre) val = res[i].id;
                  
                  if(val != "") break;
            }
            
            $scope.pays["value"] = val;
            $scope.loading = false;
        }
    });
    
    $scope.open = function(){
       
        if ($scope._is_connected) {
            $rootScope.connection($rootScope.pr, $rootScope, '/parametres');
        } 
        else {
            $location.path('/parametres');
        }

    };
    
    $scope.hostUrl = $rootScope.host;
    $scope.logoUrl = $rootScope.host + "/bytoken/logosoc.php";
    
}]);

animateApp.controller('edit_partnersCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$window', '$anchorScroll',
function($scope, $rootScope, $http, $location, localStorageService, $window,$anchorScroll) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope._is_connected = $rootScope.checkConnection($scope);
    $rootScope.tracePage(12,"Param&egrave;tres - Modification des partenaires");
    
    $scope.loading = true;
    //$scope._is_connected = navigator.onLine;
    
    $scope.open = function(){
       if ($scope._is_connected) {
            $rootScope.connection($rootScope.pr, $rootScope, '/parametres');
        } 
        else {
            $location.path('/parametres');
        }
    };

    $scope.lister = function(id) {
        var old = $location.hash();
        $location.hash(id);
        $anchorScroll();
        $location.hash(old);
    };
    
    chargerliste();
    
    $scope.delPartner = function(part){
        var url = $rootScope.host + "/bytoken/partdelmembre.php?token=" + $rootScope.token + "&idassoc=" + part.idAssoc;
        $http.get(url).success(function(data){
            if(data && data.message && data.message.type.toLowerCase() == "ok"){
                chargerliste();
            }
        });
    };
    
    $scope.addPartner = function(part){
        var url = $rootScope.host + "/bytoken/partaddmembre.php?token=" + $rootScope.token + "&partenaire=" + part.id + "&membre=" + $rootScope.token.split('-')[0];
        $http.get(url).success(function(data){
            if(data && data.message && data.message.type.toLowerCase() == "ok"){
                chargerliste();
            }
        });
    };

    function chargerliste(){
        var _url_ = $rootScope.host + "/bytoken/partmember.php?token=" + $rootScope.token + "&membre=" + $rootScope.token.split('-')[0] + "&from=0&count=0";
        $http.get(_url_).success(function(res, status) {
            if (res && !res.message) {
                var listeId = {};
                $.each(res, function(){
                    listeId["id" + this.id] = this.idAssoc;
                });
                var _url_1 = $rootScope.host + "/bytoken/partlist.php?token=" + $rootScope.token + '&from=0&count=0';
                $http.get(_url_1).success(function(data){
                    var items = data;
                    var lettre = '';
                    var ind = 0;
                    $.each(items, function() {
                        if(listeId["id" + this.id])
                            this.idAssoc = listeId["id" + this.id];
                        else
                            this.idAssoc = 0;
                        
                        if (this.nom && lettre != this.nom.charAt(0).toLowerCase()) {
                            lettre = this.nom.charAt(0).toLowerCase();
                            this.first = this.nom.charAt(0).toLowerCase();
                        }
                        if (this.logo == '') {
                            this.logo = 'logo_societe.svg';
                        }
                        if (ind == 0) {
                            this['_class'] = 'pair';
                            ind = 1;
                        } else {
                            this['_class'] = 'impair';
                            ind = 0;
                        }
                    });
                    $scope.partnerslist = items;
                    $scope.loading = false;
                });
            }
        });
    }

}]);
