describe('DIRECTIVE: GumgaList',function () {
  var scope
  ,   controller
  ,   columns
  ,   isHex = '/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/';
  beforeEach(module('gumga.directives.list'));

  beforeEach(
    inject(
      function($rootScope,$compile){
        function getData(number){
          var names = ['João','Juca','Marcos','José','Amarildo','Wladnelson','Jefferson','Maria','Jacinto','Júlia','Carla','Maria Cláudia'];
          var surnames = ['Santana','Silva','Miranda','Souza','Santos','Pereira','Oliveira','Lima','Araújo','Ribeiro','Mendes','Barros','Pinto'];
          var professions = ['Padeiro','Açougueiro','Vendedor de coco','Carpinteiro','Professor de Tecnologia da Informação','Desempregado','Programador','Analsita de Testes', 'Analista de Aviões de Papel','Manufaturador de Aviões de Papel','Campeão do minicurso de Android','Jogador de Futebol']
          var _data = [];
          function isEven(number){ return number % 2 == 0}
          for(var i = 0; i < number;i++){
            _data.push({
              name: names[Math.floor(Math.random()*names.length)] + ' ' + surnames[Math.floor(Math.random()*surnames.length)],
              age: Math.floor(Math.random()*50),
              profession: professions[Math.floor(Math.random()*professions.length)],
              hasDog: isEven(Math.floor(Math.random()*4))
            })
          }
          return _data;
        }

        scope = $rootScope.$new();
        scope.arrayList = getData(100);
        scope.configz = {};
        scope.configz.columns = 'name,age,profession,hasDog';
        var element = angular.element('<gumga-list selected="selectedModel" data="arrayList" configuration="configz" sort="sort(field,dir)"></gumga-list>');
        $compile(element)(scope);
        controller = element.controller('gumgaList');
        scope.sort = function(field,dir){};
        spyOn(scope,'sort');
      }
    )
  )
  describe('Passing data to the component:',function(){
    it('should get all the needed configuration',function(){
      expect(controller.config.selection).toEqual('single');
      expect(controller.config.sortDefault).toEqual(undefined);
      expect(controller.config.itemsPerPage).toEqual(null);
      expect(controller.config.conditional).toEqual(angular.noop);
      expect(controller.config.sort).toEqual(angular.noop);
      expect(controller.config.onClick).toEqual(angular.noop);
      expect(controller.config.onDoubleClick).toEqual(angular.noop);
      expect(controller.config.onSort).toEqual(angular.noop);
      expect(controller.config.columns[0]).toEqual({ conditional: angular.noop, content: '{{$value.name}}', name: 'name', size: '', sortField: null, title: 'NAME' })
      expect(controller.config.columns[1]).toEqual({ conditional: angular.noop, content: '{{$value.age}}', name: 'age', size: '', sortField: null, title: 'AGE' })
      expect(controller.config.columns[2]).toEqual({ conditional: angular.noop, content: '{{$value.profession}}', name: 'profession', size: '', sortField: null, title: 'PROFESSION' })

    });
  })

  describe('Testing functions',function(){
    it('Should select every item',function(){
      scope.selectedValues.push({name: 'oi'});
      scope.selectedValues.push({name: 'io'});
      scope.selectedValues.push({name: 'oiio'});
      controller.selectedIndexes.push(0);
      controller.selectedIndexes.push(1);
      controller.selectedIndexes.push(2);
      controller.selectAll(false);
      expect(controller.selectedIndexes.length).toEqual(0);
      expect(scope.selectedValues.length).toEqual(0);
      controller.data.forEach(function(val){
        expect(val.__checked).toBeFalsy();
      })
    })

    it('Should call outer sort',function(){
      controller.sortProxy('name','asc');
      expect(scope.sort).toHaveBeenCalledWith('name','asc');
      controller.sortProxy('name','desc');
      expect(scope.sort).toHaveBeenCalledWith('name','desc');
    })

    it('Should select only one row at time',function(){
      controller.selectRow(0,controller.data[0],{target: {}});
      delete controller.data[0].__checked;
      expect(scope.selectedValues[0]).toEqual(controller.data[0]);
      expect(controller.selectedIndexes[0]).toEqual(0);
      controller.selectRow(1,controller.data[1],{target: {}});
      expect(controller.selectedIndexes[0]).toEqual(1);
      delete controller.data[1].__checked;
      expect(scope.selectedValues[0]).toEqual(controller.data[1]);
    })


    it('Should select more than one row at time',function(){
      controller.config.selection = 'multi';
      controller.selectRow(0,controller.data[0],{target: {}});
      controller.selectRow(1,controller.data[1],{target: {}});
      controller.selectRow(4,controller.data[4],{target: {}});
      expect(controller.selectedIndexes[0]).toEqual(0);
      expect(controller.selectedIndexes[1]).toEqual(1);
      expect(controller.selectedIndexes[2]).toEqual(4);
    })


    it('Should select only one row at time in selected',function(){
      controller.config.selection = 'single';
      controller.selectRow(0,controller.data[0],{target: {}});
      delete controller.data[0].__checked;
      expect(controller.selected).toEqual(controller.data[0]);
      expect(controller.selectedIndexes[0]).toEqual(0);
      controller.selectRow(1,controller.data[1],{target: {}});
      expect(controller.selectedIndexes[0]).toEqual(1);
      delete controller.data[1].__checked;
      expect(controller.selected).toEqual(controller.data[1]);
    })


    it('Should select more than one row at time in selected',function(){
      controller.config.selection = 'multi';
      controller.selectRow(0,controller.data[0],{target: {}});
      controller.selectRow(1,controller.data[1],{target: {}});
      controller.selectRow(4,controller.data[4],{target: {}});
      expect(controller.selected[0]).toEqual(controller.data[0]);
      expect(controller.selected[1]).toEqual(controller.data[1]);
      expect(controller.selected[2]).toEqual(controller.data[4]);
    })

    it('Should remove item from selected',function(){
      controller.config.selection = 'multi';
      controller.selectRow(0,controller.data[0],{target: {}});
      controller.selectRow(1,controller.data[1],{target: {}});
      controller.selectRow(4,controller.data[4],{target: {}});
      expect(controller.selected[0]).toEqual(controller.data[0]);
      expect(controller.selected[1]).toEqual(controller.data[1]);
      expect(controller.selected[2]).toEqual(controller.data[4]);
    })

    it('Should unselect item from selected',function(){
      controller.config.selection = 'multi';
      controller.selectRow(0,controller.data[0],{target: {}});
      controller.selectRow(1,controller.data[1],{target: {}});
      controller.selectRow(1,controller.data[1],{target: {}});
      controller.selectRow(4,controller.data[4],{target: {}});
      expect(controller.selected[0]).toEqual(controller.data[0]);
      expect(controller.selected[1]).toEqual(controller.data[4]);
      expect(controller.selected[2]).toBeUndefined();

    })
  })


})
