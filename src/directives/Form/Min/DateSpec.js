describe('Gumga.core:directives:MaxDate', () => {
	let compile, scope, filter, controller;

	beforeEach(module('gumga.directives.form.min.date'));
	beforeEach(module('gumga.directives.form.form'));
	beforeEach(inject(($compile, $rootScope, $filter) => {
		scope = $rootScope;
		filter = $filter;

		let template = `
		<form novalidate gumga-form name="Teste" class="col-md-6 col-md-offset-6">
			<input type="date" ng-model="pessoa.nascimento" name="nascimento" ng-model="entity.foo" gumga-min-date="1980-10-10"/>
		</form>`

		let elm = angular.element(template);
		$compile(elm)(scope);
		controller = elm.controller('gumgaForm')
		scope.$digest();

	}));

	it('should valid input value',() => {
		spyOn(controller,'changeStateOfInput');
		scope.Teste.nascimento.$setViewValue('1980-10-09');
		expect(filter('date')(scope.pessoa.nascimento, 'yyyy-MM-dd')).toEqual('1980-10-09');
		expect(controller.changeStateOfInput).toHaveBeenCalledWith('nascimento', 'mindate', false, '1980-10-10');
		expect(scope.Teste.nascimento.$valid).toBe(false);
		expect(scope.Teste.nascimento.$invalid).toBe(true);
	});

	it('should invalid input value', () => {
		spyOn(controller,'changeStateOfInput');
		scope.Teste.nascimento.$setViewValue('1980-10-11');
		expect(filter('date')(scope.pessoa.nascimento, 'yyyy-MM-dd')).toEqual('1980-10-11');
		expect(controller.changeStateOfInput).toHaveBeenCalledWith('nascimento', 'mindate', true, '1980-10-10');
		expect(scope.Teste.nascimento.$valid).toBe(true);
		expect(scope.Teste.nascimento.$invalid).toBe(false);
	});
});
