angular.module('documentManagerApp')
.service('DocumentService', function() {

	var documentService = this;

	var cacheFilled = false;
	var documentsCache = CacheFactory('documents');
	var observerCallbacks = [];
	var loadPromise = undefined;

	this.registerObserverCallback = function(callback) {
		observerCallbacks.push(callback);
	};

	var notifyObservers = function(eventName, uid) {
		var ev = {
			event: eventName,
			uid: uid,
			documents: documentsCache.values()
		};
		angular.forEach(observerCallbacks, function(callback) {
			callback(ev);
		});
	};
	
	
	

(function (OC, window, $, undefined) {
'use strict';

$(document).ready(function () {

var translations = {
    newDocument: $('#new-document-string').text()
};

// this documents object holds all our documents
var Documents = function (baseUrl) {
    this._baseUrl = baseUrl;
    this._documents = [];
    this._activeDocument = undefined;
};

Documents.prototype = {
    load: function (id) {
        var self = this;
        this._documents.forEach(function (document) {
            if (document.id === id) {
                document.active = true;
                self._activeDocument = document;
            } else {
                document.active = false;
            }
        });
    },
    getActive: function () {
        return this._activeDocument;
    },
    removeActive: function () {
        var index;
        var deferred = $.Deferred();
        var id = this._activeDocument.id;
        this._documents.forEach(function (document, counter) {
            if (document.id === id) {
                index = counter;
            }
        });

        if (index !== undefined) {
            // delete cached active document if necessary
            if (this._activeDocument === this._documents[index]) {
                delete this._activeDocument;
            }

            this._documents.splice(index, 1);

            $.ajax({
                url: this._baseUrl + '/' + id,
                method: 'DELETE'
            }).done(function () {
                deferred.resolve();
            }).fail(function () {
                deferred.reject();
            });
        } else {
            deferred.reject();
        }
        return deferred.promise();
    },
    create: function (document) {
        var deferred = $.Deferred();
        var self = this;
        $.ajax({
            url: this._baseUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(document)
        }).done(function (document) {
            self._documents.push(document);
            self._activeDocument = document;
            self.load(document.id);
            deferred.resolve();
        }).fail(function () {
            deferred.reject();
        });
        return deferred.promise();
    },
    getAll: function () {
        return this._documents;
    },
    loadAll: function () {
        var deferred = $.Deferred();
        var self = this;
        $.get(this._baseUrl).done(function (documents) {
            self._activeDocuments = undefined;
            self._documents = documents;
            deferred.resolve();
        }).fail(function () {
            deferred.reject();
        });
        return deferred.promise();
    },
    updateActive: function (title, organisation) {
        var document = this.getActive();
        document.title = title;
        document.organisation = organisation;

        return $.ajax({
            url: this._baseUrl + '/' + document.id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(document)
        });
    }
};

// this will be the view that is used to update the html
var View = function (documents) {
    this._documents = documents;
};

View.prototype = {
    renderContent: function () {
        var source = $('#content-tpl').html();
        var template = Handlebars.compile(source);
        var html = template({document: this._documents.getActive()});

        $('#editor').html(html);

        // handle saves
        var textarea = $('#app-content textarea');
        var self = this;
        $('#app-content button').click(function () {
            var organisation = textarea.val();
            var title = organisation.split('\n')[0]; // first line is the title

            self._documents.updateActive(title, organisation).done(function () {
                self.render();
            }).fail(function () {
                alert('Could not update document, not found');
            });
        });
    },
    renderNavigation: function () {
        var source = $('#navigation-tpl').html();
        var template = Handlebars.compile(source);
        var html = template({documents: this._documents.getAll()});

        $('#app-navigation ul').html(html);

        // create a new document
        var self = this;
        $('#new-document').click(function () {
            var document = {
                title: translations.newDocument,
                organisation: ''
            };

            self._documents.create(document).done(function() {
                self.render();
                $('#editor textarea').focus();
            }).fail(function () {
                alert('Could not create document');
            });
        });

        // show app menu
        $('#app-navigation .app-navigation-entry-utils-menu-button').click(function () {
            var entry = $(this).closest('.document');
            entry.find('.app-navigation-entry-menu').toggleClass('open');
        });

        // delete a document
        $('#app-navigation .document .delete').click(function () {
            var entry = $(this).closest('.document');
            entry.find('.app-navigation-entry-menu').removeClass('open');

            self._documents.removeActive().done(function () {
                self.render();
            }).fail(function () {
                alert('Could not delete document, not found');
            });
        });

        // load a document
        $('#app-navigation .document > a').click(function () {
            var id = parseInt($(this).parent().data('id'), 10);
            self._documents.load(id);
            self.render();
            $('#editor textarea').focus();
        });
    },
    render: function () {
        this.renderNavigation();
        this.renderContent();
    }
};

var documents = new Documents(OC.generateUrl('/apps/documentmanager/documents'));
var view = new View(documents);

documents.loadAll().done(function () {
    view.render();
}).fail(function () {
    alert('Could not load documents');
});


});

})(OC, window, jQuery);