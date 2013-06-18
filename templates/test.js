console.log('pre');

var compiled = dust.compile("<article>

    <h3>{projectName}</h3>
    <dl>
        <dt>Clienttest:</dt>
        <dd>{client}</dd>

        <dt>Agency:</dt>
        <dd>{agency}</dd>

        <dt>Project description:</dt>
        <dd>{projectDescription}</dd>

        <dt>Work undertaken:</dt>
        <dd>{extendedInfo.workUndertaken|s}</dd>

        {?extendedInfo.otherDetails}
            <dt>Other details:</dt>
            <dd>
                <ol>
                    {#extendedInfo.otherDetails}
                        <li>{.}</li>
                    {/extendedInfo.otherDetails}
                </ol>
            </dd>
        {/extendedInfo.otherDetails}

        {?assets.images}
            <dt>Images:</dt>
            <dd>
                <ul>
                    {#assets.images}
                        <li><img src="{.url}" alt="{.title}"/></li>
                    {/assets.images}
                </ul>
            </dd>
        {/assets.images}
        
        {?assets.links}
            <dt>Links:</dt>
            <dd>
                <ul>
                    {#assets.links}
                        <li><a href="{.url}" title="{.title}">{.title}</a></li>
                    {/assets.links}
                </ul>
            </dd>
        {/assets.links}
    </dl>

</article>", "cws")


debugger;
