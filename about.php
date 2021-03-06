<?php
require 'autoload.php';
$theme = new Sample\Theme('');
$scripts = $theme->getOption('head_script');
$scripts["file"] = array("/js/jquery.min.js","/js/jquery-ui.min.js","/js/c3.min.js","/js/d3.v3.min.js","/js/dataloader.js");
$theme->setOption('head_script',$scripts,true);
$theme->addStyle('{{asset_path}}/css/c3.min.css');
$theme->addStyle('{{asset_path}}/css/jquery-ui.css');
$theme->drawHeader();
?>

<div class="content">

<h1>How to Cite</h1>
<p>If you use data provided by ISU <i>FLU</i>ture in your work, please credit in the following format;<br/><br/>  
Zeller, M. A., Anderson, T. K., Walia, R. R., Vincent, A. L., &amp; Gauger, P. C. (2018). ISU FLUture: a veterinary diagnostic laboratory web-based platform to monitor the temporal genetic patterns of Influenza A virus in swine. <i>BMC bioinformatics</i>, <i>19</i>(1), 397.
(data retrieved <?php echo (new DateTime())->format('d M, Y');?>).</p>

<h1>Contact</h1>
<h2>By Phone</h2>
<p>515-294-1950&nbsp;(Mon-Fri, 8 am - 5 pm CST)</p>

<h2>By Email</h2>
<p><b>Michael Zeller</b> <span style="unicode-bidi:bidi-override; direction: rtl;">ude.etatsai@rellezam</span><br/>
<b>Phillip Gauger DVM, PhD</b> <span style="unicode-bidi:bidi-override; direction: rtl;">ude.etatsai@reguagcp</span></p>

<h2>By Mail</h2>
<p>Veterinary Diagnostic Laboratory<br>
                                        College of Veterinary Medicine<br>
                                        Iowa State University<br>
                                        1850 Christensen Dr<br>
                                        Ames, IA 50011-1134</p>

<br>
<h1>Files for the 2018 McKean Swine Disease Workshop</h1>
<a href = "/files/tutorial2018.zip">Download</a>
</div>


<?php
$theme->drawFooter();
