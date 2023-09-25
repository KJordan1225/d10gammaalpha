<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* modules/contrib/project_browser/templates/project-browser-main-app.html.twig */
class __TwigTemplate_d22360090e76f9d6558179a99e56a5d8 extends Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
        $this->sandbox = $this->env->getExtension('\Twig\Extension\SandboxExtension');
        $this->checkSecurity();
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 8
        echo "
<div id=\"initial-loader\" class=\"ajax-progress ajax-progress--fullscreen\">
  <div class=\"ajax-progress__throbber ajax-progress__throbber--fullscreen\">
    &nbsp;
  </div>
</div>
<div id=\"project-browser\"></div>
";
    }

    public function getTemplateName()
    {
        return "modules/contrib/project_browser/templates/project-browser-main-app.html.twig";
    }

    public function getDebugInfo()
    {
        return array (  39 => 8,);
    }

    public function getSourceContext()
    {
        return new Source("", "modules/contrib/project_browser/templates/project-browser-main-app.html.twig", "/var/www/html/dxpr/d10gammaalpha/web/modules/contrib/project_browser/templates/project-browser-main-app.html.twig");
    }
    
    public function checkSecurity()
    {
        static $tags = array();
        static $filters = array();
        static $functions = array();

        try {
            $this->sandbox->checkSecurity(
                [],
                [],
                []
            );
        } catch (SecurityError $e) {
            $e->setSourceContext($this->source);

            if ($e instanceof SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

    }
}
