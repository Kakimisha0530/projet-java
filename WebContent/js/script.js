var wordMonth = new Array("JANVIER","FEVRIER","MARS","AVRIL","MAI","JUIN","JUILLET","AOUT","SEPTEMBRE","OCTOBRE","NOVEMBRE","DECEMBRE");
var wordWeek = new Array("DIMANCHE" , "LUNDI" , "MARDI" , "MERCREDI" , "JEUDI" , "VENDREDI" , "SAMEDI");
var changeview = function(vda){
};

var usercolor = "#94A385";

function getDateFromStr(str) {
	var y = str.substr(0, 4),
	    m = str.substr(4, 2),
	    d = str.substr(6, 2);
	m = parseInt(m) - 1;
	var dat = new Date(parseInt(y), parseInt(m), parseInt(d));
	return dat;
}

//retourne le premier jour de la semaine
function getFirstOfWeek(a, m, d) {
	var d;
	if (!a || !m || !d)
		d = new Date();
	else
		d = new Date(a, m, d);
	var f_m = d.getMonth();
	var f_y = d.getFullYear();
	var f_d = d.getDate() - d.getDay() + 1;

	if (f_d < 1) {
		f_m = m - 1;
		if (f_m < 0) {
			f_y -= 1;
			f_m = (f_m - 1) % 12;
		}
	}

	return getDateInt(f_y, (f_m + 1), f_d);
}

/////////////
function getFirstOfCurrentWeek(d) {
	if (!d)
		d = new Date();
	var day = d.getDay();
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? -6 : 1) - day);
	return getDateInt(d.getFullYear(), (d.getMonth() + 1), d.getDate());
}

function getLastOfCurrentWeek(d) {
	if (!d)
		d = new Date();
	var day = d.getDay();
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? 0 : 7) - day);
	return getDateInt(d.getFullYear(), (d.getMonth() + 1), d.getDate());
}

function parseDate(day,month,year){
	if(!day && !month && !year){
		var today = new Date();
		day = today.getDate();
		month = today.getMonth() + 1;
		year = today.getFullYear();	
	}
	day += "";
	day = ((day.length < 2)?("0" + day):day);
	month += "";
	month = ((month.length < 2)?("0" + month):month);
	return year + "" + month + "" + day;
}

function parseDateStr(str){
	var y = str.substr(0, 4), m = str.substr(4, 2), d = str.substr(6, 2);
	return [y,m,d];
}

var parseHourStr = function(str) {
	//alert(str);
    if(("" + str).length < 4)
    	str = "0" + str;
    str += "";
	var h = str.substr(0, 2);
	var m = str.substr(2, 2);
    return [h,m];
};

function formatDate(da,form,sep) {
	var fm = "";
	var day = "" + da.getDate();
	day = ((day.length < 2)?("0" + day):day);
	var month = "" + da.getMonth();
	month = ((month.length < 2)?("0" + month):month);
	var monthN = "" + (Number(month) + 1);
	monthN = ((monthN.length < 2)?("0" + monthN):monthN);
	//alert(monthN);
	var year = "" + da.getFullYear();
	var lid = [year,month,day,da.getDay()];
	
	switch (form) {
	case 1://yyyymmdd
		fm = lid[0] + "" + monthN + "" + lid[2];
		break;
	case 2:// dd#SEP#mm#SEP#yyyy
		if(sep)
			fm = lid[2] + sep + lid[1] + sep + lid[0];
		else
			fm = lid[2] + "/" + lid[1] + "/" + lid[0];
		break;
	case 3:// #jour_full# dd mm_full yyyy
		fm = ((sep)?wordWeek[lid[3]] + " " : "")+ lid[2] + " " + wordMonth[Number(lid[1])] + " " + lid[0];
		break;
	case 4://#jour_mini# dd mm_mini yyyy
		fm = ((sep)?wordWeek[lid[3]].substr(0,3) + ". " : "")+ lid[2] + " " + wordMonth[Number(lid[1])].substr(0,3) + ". " + lid[0];
		break;
	default:
		fm = lid;
		break;
	}
	return fm;
}

var GLOBAL_host = "";//'http://www.aichadiakite.com';

//
var animateApp = angular.module('animateApp', ['ngRoute', 'ngAnimate', 'LocalStorageModule', 'ngSanitize', 'ngTouch']);

animateApp.config(function($routeProvider, $locationProvider, $httpProvider)
{
    $routeProvider.when('/', {
        templateUrl : 'views/home.html',
        controller : 'mainController'
    }).when('/connexion', {
        templateUrl : 'views/connexion.html',
        controller : 'connexionCtrl'
    }).when('/editActivite', {
        templateUrl : 'views/addac.html',
        controller : 'addacCtrl'
    }).when('/inscription', {
        templateUrl : 'views/inscription.html',
        controller : 'adduserCtrl'
    });

    //$locationProvider.html5Mode(true);
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    delete $httpProvider.defaults.headers.common["X-Requested-With"];

});


animateApp.run(['$rootScope', '$location', '$route' ,'$http', 'localStorageService', '$window', '$sce',
function($rootScope, $location, $route ,$http, localStorageService, $window, $sce) {
    
	$rootScope.connected = true;
	$rootScope.token = localStorageService.get('token');
    $rootScope.pr = localStorageService.get('profil');
    $rootScope.agenda_mode = localStorageService.get('mode');
    $rootScope.cates = localStorageService.get('cates');
    $rootScope.curr_ac_id = 0;
    $rootScope.curr_da = parseDate();
    
    var date_today = new Date();
    var d_year = date_today.getFullYear();
    var d_j = date_today.getDate();
    d_j = (d_j.length < 2) ? '0' + d_j : d_j;
    var d_month = date_today.getMonth();
    var mymois = ["JAN", "FEV", "MARS", "AVR", "MAI", "JUIN", "JUL", "AOUT", "SEP", "OCT", "NOV", "DEC"];
    
    changeview = function(vda){
    	//alert(vda);
    	$rootScope.changeview('jour',vda);
    };
    
    $rootScope.root_mois = mymois[(d_month%12)];
    $rootScope.root_jour = d_j;
    
	function isUndefined(_var_) {
        return (!_var_ || _var_ == '');
    }
    
    $rootScope.escapedHtml = function(str) {
        return (str == null || str == '') ? '' : (str.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' '));
    };

    $rootScope.connection = function(_user, sc, redi) {
        var _url = GLOBAL_host + "bytoken/connect?mai=" + _user.email + "&code=" + _user.code;
        $http.get(_url).success(function(data, status) {
        	//alert(JSON.stringify(data));
            if (data && data.message && data.message.type.toLowerCase() == 'ok') {
                var profil = data.donnees;
                profil['email'] = _user.email;
                profil['code'] = _user.code;
                profil['actif'] = 1;
                localStorageService.add('profil', JSON.stringify(profil));
                $rootScope.pr = profil;
                localStorageService.add('token', data.token);
                $rootScope.token = data.token;
                $rootScope.connected = true;
                localStorageService.add('mode', JSON.stringify({jour:true,semaine:false,mois:false,view:"jour"}));
                $rootScope.agenda_mode = {jour:true,semaine:false,mois:false,view:"jour"};
                $rootScope.getCates(data.token);
                $location.path(redi);
            }
            else
            {
                sc.erreur = data.message.values;
                sc.loading = false;
            }
        });
    };
    
    $rootScope.getCates = function(token) {
        var _url = GLOBAL_host + "bytoken/categories?token=" + token;
        $http.get(_url).success(function(data, status) {
        	//alert(JSON.stringify(data));
            if (data && data.message && data.message.type.toLowerCase() == 'ok') {
                localStorageService.add('cates', JSON.stringify(data.donnees));
                $rootScope.cates = data.donnees;
            }
            else
            {
                sc.erreur = data.message.values;
                sc.loading = false;
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
    
    $rootScope.parseDate = function(str) {
        var mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        var y = str.substr(0, 4), m = str.substr(4, 2), d = str.substr(6, 2);
        var res = '';
        res = d + " " + mois[parseInt(m) - 1] + " " + y;
        return res;
    };
    
    $rootScope.parseHour = function(str) {
    	//alert(str);
        if(("" + str).length < 4)
        	str = "0" + str;
        str += "";
    	var h = str.substr(0, 2);
    	var m = str.substr(2, 2);
        var res = '';
        res = h + ":" + m;
        return res;
    };

    if (isUndefined($rootScope.token)) {
    	if(!isUndefined($rootScope.pr)){
	        var _user_ = {
	        };
	        _user_.email = $rootScope.pr.email;
	        _user_.code = $rootScope.pr.code;
	        $rootScope.connection(_user_, $rootScope, '/');
	    }else {
	        $rootScope.connected = false;//.path('/connexion');
	    }
    }

    $rootScope.getUrl = function(val) {
        return $sce.trustAsResourceUrl(val);
    };
    
    $rootScope.disc = function() {
        localStorageService.clearAll();
        token = '';
        $rootScope.connected = false;
        $location.path('/');
    };

    $rootScope.open = function(_name) {
        $location.path(_name);
    };
    
    $rootScope.changeview = function(mode , vda){
    	//alert(mode + " : " + vda);
    	if(vda && Number(vda) > 0)
    		$rootScope.curr_da = vda;
    	$rootScope.agenda_mode = {jour:false,semaine:false,mois:false,view:"mois"};
    	$rootScope.agenda_mode[mode] = true;
    	$rootScope.agenda_mode.view = mode;
    	localStorageService.add('mode', JSON.stringify($rootScope.agenda_mode));
    	$route.reload();
    };
    
}]);

animateApp.controller('mainController', ['$scope', '$rootScope', '$http', '$location', '$route','localStorageService', '$window', '$sce',
function($scope, $rootScope, $http, $location, $route,localStorageService, $window, $sce) {
    if (!$rootScope.connected)
        $location.path('/connexion');

    $scope.user_profil = $rootScope.pr;
    $scope.page_name = 'page-home';
    $scope.ac_lis = {};

    $scope.loadAgenda = function(v_da){
    	//alert(v_da);
    	$scope.current_da = formatDate(getDateFromStr(v_da),3,true);
    	var _url = GLOBAL_host + "bytoken/activites?token=" + $rootScope.token + "&debut=" + v_da + "&fin=" + v_da;
        $http.get(_url).success(function(data, status) {
        	//alert(JSON.stringify(data));
            if (data && data.message && data.message.type.toLowerCase() == 'ok') {
            	$scope.ac_lis.left = data.donnees;
            	$scope.ac_lis.add_l = true;
            	if(data.donnees.length >= 10){
            		$scope.ac_lis.add_l = false;
            		$scope.ac_lis.add_r = false;
            	}
            	if(data.donnees.length > 5){
            		$scope.ac_lis.add_l = false;
            		$scope.ac_lis.add_r = data.donnees.length < 10;
            		$scope.ac_lis.left = data.donnees.splice(0,5);
            		$scope.ac_lis.right = data.donnees;
            	}
            	//
            }
        });
    };
    
    $scope.changedate = function(sp){
    	var da__ = getDateFromStr($rootScope.curr_da);
    	da__.setDate(da__.getDate() + sp);
    	$rootScope.curr_da = formatDate(da__,1);
    	//alert($rootScope.curr_da);
    	$scope.loadAgenda($rootScope.curr_da);
    };
    
    $scope.delAc = function(id) {
    	var _url = GLOBAL_host + "bytoken/delactivite?token=" + $rootScope.token + "&id=" + id;
        $http.get(_url).success(function(data, status) {
        	//alert(JSON.stringify(data));
            if (data && data.message && data.message.type.toLowerCase() == 'ok') {
            	//$scope.loadAgenda($rootScope.curr_da);
            	$route.reload();
            }
        });
    };
    
    $scope.editAc = function(id) {
    	$rootScope.curr_ac_id = id;
    	$location.path("editActivite");
    };
    
    $scope.parseHour_bis = function(da_d,da_f) {
        if(da_d == "0" && da_d == da_f)
        	return "Journée entière";
        return $rootScope.parseHour(da_d) + " - " + $rootScope.parseHour(da_f);
    };
    
    if($rootScope.agenda_mode.jour)
    	$scope.loadAgenda($rootScope.curr_da);

}]);

animateApp.controller('connexionCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$window',
function($scope, $rootScope, $http, $location, localStorageService, $window) {
    
    $scope.connect = function(_user) {
    	//alert("user = " + JSON.stringify(_user));
        $rootScope.connection(_user, $scope, '/');
    };
    
    $scope.openUrl = function(_uri) {
        $window.open(_uri, '_system', 'location=yes');
    };
}]);

animateApp.controller('adduserCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$window',
function($scope, $rootScope, $http, $location, localStorageService, $window) {
	$scope.saveprofil = function(user){
		alert(JSON.stringify(user));
		var _url = GLOBAL_host + "inscription?";
		var qr = "nom=" + $scope.user.nom ;
		qr += "&prenom=" + $scope.user.prenom ;
		qr += "&mai=" + $scope.user.email;
		qr += "&code=" + $scope.user.code;
		qr += "&tel=" + $scope.user.tel;  
		_url = _url + qr;
		if($scope.checkForm()){
			$http.post(_url)
	        .success(function(data, status) {
	        	//alert(JSON.stringify(data));
	            if (data && data.message && data.message.type.toLowerCase() == 'ok') {
	            	$scope.confirm = true;
	            }
	            else
	            	$scope.erreurs = data.message.values;
	        });
		}   
	};
	
	$scope.checkForm = function(){
		var valid = true;
		$scope.erreurs = [];
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if($scope.user.code != $scope.user.code1){
			$scope.erreurs.push("Les mots de passe ne sont pas identiques");
			valid = false;
		}
		if(!re.test($scope.user.email)){
			$scope.erreurs.push("L'adresse email n'est pas valide");
			valid = false;
		}
		if(isNaN($scope.user.tel) || $scope.user.tel.lenght < 10){
			$scope.erreurs.push("Veuillez entrer un numéro de téléphone valide.");
			valid = false;
		}
		
		return valid;
	};
}]);

animateApp.controller('addacCtrl', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$window',
function($scope, $rootScope, $http, $location, localStorageService, $window) {
	if (!$rootScope.connected)
        $location.path('/connexion');
	
	$scope.loadAc = function(id){
    	//alert(id);
    	$scope.cates = $rootScope.cates; 
    	var _url = GLOBAL_host + "bytoken/activites?token=" + $rootScope.token + "&id=" + id;
        $http.get(_url).success(function(data, status) {
        	//alert(JSON.stringify(data));
            if (data && data.message && data.message.type.toLowerCase() == 'ok') {
            	$scope.ac_view = data.donnees;
            	var deb__ = parseHourStr("" + data.donnees.debut);
            	var fin__ = parseHourStr("" + data.donnees.fin);
            	$scope.ac_view.deb_h = Number(deb__[0]);
            	$scope.ac_view.deb_m = Number(deb__[1]);
            	$scope.ac_view.fin_h = Number(fin__[0]);
            	$scope.ac_view.fin_m = Number(fin__[1]);
            	$scope.ac_view.all = (data.donnees.debut == data.donnees.debut && data.donnees.debut == "0");
            }
            else
            	$scope.ac_view = {};
        });
    };
    
    $scope.addAc = function(){
    	$scope.envoi = true;
    	$scope.ac_view.id = $rootScope.curr_ac_id;
    	alert(JSON.stringify($scope.ac_view));
    	if($scope.ac_view.texte == "" || $scope.ac_view.categorieId == "" || $scope.ac_view.categorieId == 0){
    		$scope.envoi = false;
    		alert("veuillez remplir tous les champs");
    	}
    	else
    		alert(" suite ");
    	if(!$scope.ac_view.debut || $scope.ac_view.debut == "")
    		$scope.ac_view.debut = 0;
    	if(!$scope.ac_view.debut || $scope.ac_view.fin == "")
    		$scope.ac_view.fin = 0;
    	
    	$scope.ac_view.vdate = $rootScope.curr_da;
    	
    	//$scope.cates = $rootScope.cates; 
    	if($scope.envoi){
    		alert(JSON.stringify($scope.ac_view));
    		var _url = GLOBAL_host + "bytoken/addactivite?token=" + $rootScope.token;
    		var qr = "id=" + $scope.ac_view.id ;
    		qr += "&vdate=" + $scope.ac_view.vdate ;
    		qr += "&categorieId=" + $scope.ac_view.categorieId;
    		qr += "&debut=" + $scope.ac_view.debut;
    		qr += "&fin=" + $scope.ac_view.fin;
    		qr += "&texte=" + $scope.ac_view.texte;   
    		_url = _url+"&"+qr;
            $http.post(_url)
            .success(function(data, status) {
            	alert(JSON.stringify(data));
                if (data && data.message && data.message.type.toLowerCase() == 'ok') {
                	$scope.ac_view = data.donnees;
                	$rootScope.curr_ac_id = data.donnees.id;
                	$location.path("/");
                }
                else
                	$scope.ac_view = {id:$rootScope.curr_ac_id};
            });
    	}
    	
    };
    
    $scope.loadAc($rootScope.curr_ac_id);
    //alert(JSON.stringify($rootScope.cates));
}]);
