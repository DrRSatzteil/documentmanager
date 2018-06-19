angular.module('documentManagerApp')
.controller('loadDocumentsButtonCtrl', function($http, DocumentService) {
	var ctrl = this;

	ctrl.t = {
		loadDocuments : t('documentmanager', 'Load document(s)')
	};


	ctrl.loadDocuments = function() {
	    var title = t('documentmanager', 'Choose document to load into Document Manager');
	    var mimetypes = ['httpd/unix-directory', 'application/pdf'];
	    OC.dialogs.filepicker(title, _.bind(this.onCloudFileSelected, this), false, mimetypes);
	};
	
	ctrl.onCloudFileSelected = function(path) {
	    DocumentService.loadDocuments(path);
	}
});