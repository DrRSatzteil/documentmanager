<?php
script('documentmanager', 'angular.min');
script('documentmanager', 'angular-route.min');

script('documentmanager', 'setup');

script('documentmanager', 'service/documentService');
script('documentmanager', 'components/facetList/facetList_controller');
script('documentmanager', 'components/facetList/facetList_directive');
script('documentmanager', 'components/organisationList/organisationList_controller');
script('documentmanager', 'components/organisationList/organisationList_directive');
script('documentmanager', 'components/loadDocumentsButton/loadDocumentsButton_controller');
script('documentmanager', 'components/loadDocumentsButton/loadDocumentsButton_directive');

style('documentmanager', 'style');
?>

<div id="app" ng-app="documentManagerApp">
	
	<div id="app-navigation">
	   <div id="importscreen-sidebar-block" class="icon-loading" ng-show="$root.importing"></div>
	   <loaddocumentsbutton></loaddocumentsbutton>
	   <ul facetlist></ul>
	   <div id="app-settings">
	       <div id="app-settings-header">
	           <button class="settings-button" data-apps-slide-toggle="#app-settings-content">
	               <?php p($l->t('Settings'));?>
	           </button>
	       </div>
	       <div id="app-settings-content">
	           <addressBookList class="settings-section"></addressBookList>
	           <contactImport class="settings-section"></contactImport>
	           <sortBy class="settings-section"></sortBy>
			</div>
		</div>
	</div>

	<div id="app-content">
		<div id="app-content-wrapper">
		<div class="app-content-list" organisationlist></div>
		<div class="app-content-detail" ng-view></div>
		<importscreen id="importscreen-wrapper" ng-show="ctrl.importing"></importscreen>
		</div>
	</div>
	
</div>