
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
        .state('form.elegirescuela', {
            url: '/escuela',
            templateUrl: 'form-elegir-escuela.html'
        })

        .state('form.registrarescuela', {
            url: '/registrar-escuela',
            templateUrl: 'form-registrar-escuela.html'
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
    $scope.newPoblado = {nombre:''};
    $scope.newEscuela = {nombre:'',poblado:{nombre:''}};
    $scope.newAlumno = {
      escuela: null
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
          nombre: escuela.poblado.nombre,
          id:escuela.poblado.id
        }
      };

      if(escuela.poblado === parseInt(escuela.poblado, 10) ){
        $scope.newEscuela.poblado.id = escuela.poblado;
      }

      $scope.newAlumno.escuela = escuela.id;
    };

    $scope.seleccionarPobladoE = function(poblado){
      $scope.newEscuela.poblado = {
          id: poblado.id,
          nombre: poblado.nombre
      };
    };

    $scope.reiniciarEscuela = function(){
      $scope.newAlumno.escuela = null;
      $scope.newEscuela = {nombre:'',poblado:{nombre:''}};
    };

    $scope.reiniciarPobladoE = function(){
      console.log("Reiniciando poblado");

      $scope.newEscuela.poblado = {
        nombre : '',
      };

    };

    $scope.esLaEscuelaElegida = function(escuela){
      return (escuela.id === $scope.newEscuela.id);
    };

    $scope.validarNewEscuela = function(){
      if( $scope.newEscuela.nombre && $scope.newEscuela.poblado.id)
        return true;
      return false;
    };

    $scope.registrarNewEscuela = function(){
      var apiURL = 'http://localhost:1337/';
      var typeURL = apiURL + 'escuela';

      $http({
        url: typeURL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: {
          nombre: $scope.newEscuela.nombre,
          poblado: $scope.newEscuela.poblado.id
        }
      })
      .then(function success(res){
        console.log("Info:: Respuesta del servidor: ", res.data);
        if(res.data.id){
          $scope.seleccionarEscuela(res.data);
          $scope.mensajeParaUsuario = {
            success:true,
            mensaje: 'La escuela ' + res.data.nombre + 'fue registrada con éxito, con id: ' + res.data.id
          };

        }

      },function error(res){
        console.error("Error: Respuesta del servidor: ", res.data);
        if(res.data.error){
          $scope.mensajeParaUsuario = {
            error:true,
            mensaje: 'Hay un error en los datos enviados, la escuela no se registró. Quizás no se especificó el poblado de la lista.'
          };
        }

      });

    };

    $scope.esElPobladoEE = function(poblado){
      return (poblado.id === $scope.newEscuela.poblado.id);
    };

    $scope.loadByType('escuela');
    $scope.loadByType('poblado');

}]);
