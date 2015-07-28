(function(){
	'use strict';

	Base.$inject =['$http','$q'];

	function Base($http,$q){
		function RestPrototype(url){
			this._url = url;
			this._query = {params: {start: 0,pageSize: 10}};
		}
		RestPrototype.prototype.get = _get;
		RestPrototype.prototype.resetAndGet = _resetAndGet;
		RestPrototype.prototype.getNew = _getNew;
		RestPrototype.prototype.getById = _getById;
		RestPrototype.prototype.save = _save;
		RestPrototype.prototype.update= _update;
		RestPrototype.prototype.delete = _delete;
		RestPrototype.prototype.sort = _sort;
		RestPrototype.prototype.deleteCollection = _deleteCollection;
		RestPrototype.prototype.saveImage = _saveImage;
		RestPrototype.prototype.deleteImage = _deleteImage;
		RestPrototype.prototype.getSearch = _getSearch;
		RestPrototype.prototype.getAdvancedSearch = _getAdvancedSearch;
		RestPrototype.prototype.resetDefaultState = _resetQuery;
		RestPrototype.prototype.super = {};
		RestPrototype.prototype.super.get = function(_this,page){
			return RestPrototype.prototype.get.call(_this,page);
		}
		function _get(page){
			if (page) {
				this._query.params.start = (page - 1) * this._query.params.pageSize;
				if (page < 1) throw 'Invalid page';
			}
			return $http.get(this._url,this._query);
		}
		function _getNew () {return $http.get(this._url + '/new')}
		function _getById(id){return $http.get(this._url + '/' + id);}
		function _save (v){return $http.post(this._url,v);}
		function _update (v){
			if(v.id){
				return $http.put(this._url + '/' + v.id ,v);
			}
			return this.save(v);
		}
		function _delete(v){return $http.delete(this._url + '/' + v.id);}
		function _resetQuery(){this._query = {params: {start: 0,pageSize: 10}};}

		function _resetAndGet(){
			this.resetDefaultState();
			return $http.get(this._url,this._query);
		}
		function _sort(f,w){
			this.resetDefaultState();
			this._query.params.sortField = f;
			this._query.params.sortDir = w;
			return $http.get(this._url,this._query);
		}
		function _deleteCollection(arr){
			var url = this._url;
			console.warn(arr);
			return $q.all(arr.map(function(v){
				return $http.delete(url + '/' + v.id);
			}))
		}
		function _saveImage(a,m){
			var fd = new FormData();
			fd.append(a,m);
			return $http.post(this._url + '/' +a ,fd,{
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});
		}
		function _deleteImage(a){
			var fd = new FormData();
			fd.append(a,{});
			return $http.delete(this._url + '/' +a,fd,{
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});
		}
		function _getSearch(f,p){
			this.resetDefaultState();
			(!p) ?  p = '' : angular.noop;
			this._query.params.q = p;
			this._query.params.searchFields = f;
			return this.get();
		}
		function _getAdvancedSearch(p){
			this._query.params = {}
			this._query.params.aq = p;
			return $http.get(this._url,this._query);
		}
		return RestPrototype;
	}

	angular.module('gumga.services.rest',[])
	.service('GumgaRest',Base);

})();