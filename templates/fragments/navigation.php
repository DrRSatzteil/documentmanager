<div ng-controller="organisationlistCtrl as organisationList"

<!-- translation strings
<div style="display:none" id="new-document-string"><?php p($l->t('New document')); ?></div>

<script id="navigation-tpl" type="text/x-handlebars-template">
    <li id="new-document"><a href="#"><?php p($l->t('Add document')); ?></a></li>
    {{#each documents}}
        <li class="document with-menu {{#if active}}active{{/if}}"  data-id="{{ id }}">
            <a href="#">{{ title }}</a>
            <div class="app-navigation-entry-utils">
                <ul>
                    <li class="app-navigation-entry-utils-menu-button svg"><button></button></li>
                </ul>
            </div>

            <div class="app-navigation-entry-menu">
                <ul>
                    <li><button class="delete icon-delete svg" title="delete"></button></li>
                </ul>
            </div>
        </li>
    {{/each}}
</script>

<ul></ul>-->