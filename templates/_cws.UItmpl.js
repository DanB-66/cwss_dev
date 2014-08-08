<script type="text/html" id="UiTemplate">

<section id="intro">
    <img src="img/dan7.jpg"/>
    <a href="#" class="hide" tabindex="1">{i18n.uIhideIntro}</a>
    {generalIntro.introCopy|s}
</section>

<section id="controls">
    <section id="setMultipleControl">
        <h4>{i18n.uImultiItems}:</h4>
        <ul>
            <li><button>1</button></li>
            <li><button>2</button></li>
            <li><button>3</button></li>
            <li><button>4</button></li>
        </ul>
    </section>
    <section id="setLangControl">
        <h4>{i18n.uImultiLang}:</h4>
        <ul>
            <li id="en"><button>{i18n.localeNames.uIen}</button></li>
            <li id="fr"><button>{i18n.localeNames.uIfr}</button></li>
        </ul>
    </section>
    <section id="toggleIntro">
            <button>{i18n.uIShowIntro}</button>
    </section>
</section>

<a href="#" class="cwsCprev" title="{i18n.uIprevious}">{i18n.uIprevious}</a> 
<a href="#" class="cwsCnext" title="{i18n.uInext}">{i18n.uInext}</a>
<div class="carousel"></div>

</script>
