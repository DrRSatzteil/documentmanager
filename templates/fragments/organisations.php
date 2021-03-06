<script id="navigation-tpl" type="text/x-handlebars-template">
    {{#each organisations}}
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
                    <li><button class="history icon-history svg" title="history"></button></li>
                </ul>
            </div>
        </li>
    {{/each}}
</script>