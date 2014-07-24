<script type="text/html" id="UiTemplate">

<section id="intro">
    {generalIntro.introCopy}
    <span class="hide">{i18n.uIhideIntro}</span>
</section>

<section id="controls">
    <section id="setMultipleControl">
        <h4>{i18n.uImultiItems}:</h4>
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
        </ul>
    </section>
    <section id="setLangControl">
        <h4>{i18n.uImultiLang}:</h4>
        <ul>
            <li id="en">{i18n.localeNames.uIen}</li>
            <li id="fr">{i18n.localeNames.uIfr}</li>
        </ul>
    </section>
    <section id="toggleIntro">{i18n.uIShowIntro}</section>
</section>

<a href="#" class="cwsCprev" title="{i18n.uIprevious}">{i18n.uIprevious}</a> 
<a href="#" class="cwsCnext" title="{i18n.uInext}">{i18n.uInext}</a>
<div class="carousel"></div>

</script>
