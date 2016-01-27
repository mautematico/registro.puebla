
// create our angular app and inject ngAnimate and ui-router
// =============================================================================
angular.module('formApp', ['ngAnimate', 'ui.router'])

// configuring our routes
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: 'form.html',
            controller: 'formController'
        })

        // nested states
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('form.escuela', {
            url: '/escuela',
            templateUrl: 'form-escuela.html'
        })

        .state('form.personal', {
            url: '/personal',
            templateUrl: 'form-personal.html'
        })

        // url will be /form/interests
        .state('form.interests', {
            url: '/interests',
            templateUrl: 'form-interests.html'
        })

        // url will be /form/payment
        .state('form.payment', {
            url: '/payment',
            templateUrl: 'form-payment.html'
        });

    // catch all route
    // send users to the form page
    $urlRouterProvider.otherwise('/form/escuela');
})

// our controller for the form
// =============================================================================
.controller('formController', ['$scope','$http',function($scope,$http) {

    // we will store all of our form data in this object
    $scope.formData = {};
    $scope.newPoblado = {};
    $scope.newEscuela = {};
    $scope.newAlumno = {
      escuela: $scope.newEscuela.id
    };

    // function to process the form
    $scope.processForm = function() {
        alert('awesome!');
    };

    $scope.loadByType = function(type){
      var apiURL = 'http://localhost:1337/';
      var typePlural = null;

      switch (type) {
        case 'escuela':
          typePlural = 'escuelas';
          break;
        case 'poblado':
          typePlural = 'poblados';
          break;
        default:
          break;
      }

      if(typeURL === null){
        return;
      }

      var typeURL = apiURL + type;

      $http.get(typeURL)
      .then(function success(res){
        $scope[typePlural] = res.data;
        console.log("Info::", res.data.length , typePlural, "en memoria.");
      },function error(res){
        console.error("error cargando ", typePlural);
        alert("error cargando " + typePlural);
      });

    };

    $scope.seleccionarEscuela = function(escuela){
      $scope.newEscuela = {
        id: escuela.id,
        nombre: escuela.nombre,
        poblado : {
          nombre: escuela.poblado.nombre
        }
      };

      $scope.newAlumno.escuela = escuela.id;
    };

    $scope.reiniciarEscuela = function(){
      $scope.newAlumno.escuela = null;
      $scope.newEscuela = {};
    };

    $scope.esLaEscuelaElegida = function(escuela){
      return (escuela.id === $scope.newEscuela.id);
    };

    $scope.loadByType('escuela');
    $scope.loadByType('poblado');

}]);
