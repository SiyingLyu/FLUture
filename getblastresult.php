<?php

//Generate javascript to draw C3 pie graph
function generatePieChart($arr, $bindto)
{
	//Create string for props
	$stringProp = "";

	foreach ($arr as $key => $value) {
		//Skip empty values
		if($value == "")
			continue;
 		$stringProp .= "['$key', $value],";
	}

	$jsCode = <<<EOF
var chart = c3.generate({
    bindto: '#$bindto',
    data: {
        // iris data from R
        columns: [
EOF;
	$jsCode .= $stringProp;
	$jsCode .= <<<EOF
        ],
        type : 'pie',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    }
});
EOF;
	
	//Return data
	return $jsCode;
}

//Get sequence data in question
$seq_input = $_POST['seq'];
$blast_type = $_POST['blast'];

$temp = tmpfile();
fwrite($temp, $seq_input);
fseek($temp, 0);

//Send to blast
$path = stream_get_meta_data($temp);
$path = $path['uri'];

//Default NT, unless type = AA
if($blast_type == "aa")
{
        $result = shell_exec("/opt/ncbi-blast-2.7.1+/bin/blastp -query " . $path . " -db /var/www/BLASTdb/vdl_flu_aa -outfmt \"6 sseqid pident\" -perc_identity 98 -max_target_seqs=100 2>&1");
}
else
{
	$result = shell_exec("/opt/ncbi-blast-2.7.1+/bin/blastn -query " . $path . " -db /var/www/BLASTdb/vdl_flu_nt -outfmt \"6 sseqid pident\" -perc_identity 98 -max_target_seqs=100 2>&1");
}

//Delete temp
fclose($temp); // this removes the file

//Set up table
$table =  "<table class=\"wd-Table--striped wd-Table--hover\">";
$table .= "<thead><th>USDA Barcode</th><th>Received date</th><th>State</th><th>Subtype</th><th>HA clade</th><th>NA clade</th><th>% identity</th></thead>";
//Explode into expected
$result = str_replace("\t","+",$result);
$blastHits = explode("\n", $result);

//Broad error handeling
if(count($blastHits) < 2)
{
	//Send error message
	echo "<p>There was a problem with the input provided.</p>";
	//Exit gracefully
	return;
}

//Init arrays of interest
$state = array();
$haClade = array();
$naClade = array();

//Fill table and begin to calculate percentages
for ($i = 0; $i <= count($blastHits); $i++)
{
	//Table row
	$table .= "<tr>";

	$hits = explode("+", $blastHits[$i]);
	for ($j = 1; $j < count($hits); $j++)	//This j starts at 1 to leave out db id, less then the count ot leave off blank row
	{
		$table .= "<td>"; 
		
		//Add in an ncbi link if on the first item
		if($j == 1 && $hits[$j] != "")
		{
			$table .= "<a href=\"https://www.ncbi.nlm.nih.gov/nuccore/?term=" . $hits[$j] . "\">" . $hits[$j] . "</a></td>";
		}
		elseif($j == 1 && $hits[$j] == "")
		{
			$table .= "ISU VDL" . "</td>";
		}
		else
		{
			$table .= $hits[$j] . "</td>";		
		}

		//Add items to array to calculate propotion
		if($hits[$j] == "")
			 $hits[$j] = "Not Tested";
		if($j == 3) //state
			$state[] = $hits[$j];
		if($j == 5)
			$haClade[] = $hits[$j];
		if($j == 6)
			$naClade[] = $hits[$j];
	}

	//Clsoe row
	$table .= "</tr>";
}

$table .= "</table>";

//Process percentages
//Return an assoc array with % represented in input array
function getArrayProportions($arr)
{
	//Get unique values/ init vars
	$uniqueValues = array_unique($arr);
	$proportions = array();

	//Iterate through unique values
	for($i = 0; $i <= count($uniqueValues); $i++)
	{
		$proportions[$uniqueValues[$i]] = array_count_values($arr)[$uniqueValues[$i]];
	}
	
	//Return proportions
	return $proportions;
}

$stateProp = getArrayProportions($state);
$haProp = getArrayProportions($haClade);
$naProp = getArrayProportions($naClade);
$stateCode = generatePieChart($stateProp,"stateChart");
$haCode = generatePieChart($haProp,"haChart");
$naCode = generatePieChart($naProp,"naChart");

//Send back to server
echo $table;

echo "<script>";
echo $stateCode;
echo $haCode;
echo $naCode;
echo "</script>";
?>
