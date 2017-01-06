function loadData() {
    Papa.parse("/data/web.csv", {
        download: true,
        header: true,
        //dynamicTyping: true,
        complete: function(results) {
            data = results;
            //console.log(results)
        }
    });
}
 
function getData(xComponent, yComponent) {
	//var xComponent = $("#axisx").val();
        //var yComponent = $("#axisy").val();
console.log(xComponent);
console.log(yComponent);
        //Init array
        flu = {};
        xAxis = [];
        groups = [];
        for (var i = 0; i < data.data.length; i++) {
            //Grab X Component
            //console.log(data.data[i][xComponent]);
            if (data.data[i][xComponent] != null & data.data[i][xComponent] != '') {
                xData = data.data[i][xComponent].toString();
                //Special Cases
                //if (xComponent == "accessionID")
                //    xData = xData.substring(0, 4);
                if (xComponent == "H1" | xComponent == "H3" | xComponent == "N1" | xComponent == "N2") {
                    //Grab flu subtypes with ugly if
                    xData = "";
                    if (data.data[i].H1.toLowerCase() == "true")
                        xData = xData + "H1";
                    if (data.data[i].H3.toLowerCase() == "true")
                        xData = xData + "H3";
                    if (data.data[i].N1.toLowerCase() == "true")
                        xData = xData + "N1";
                    if (data.data[i].N2.toLowerCase() == "true")
                        xData = xData + "N2";
                    if (xData.length != 4)
                        xData = "Unsubtypable";
                } else if (xComponent == "age_days") //Special case age
                {
                    age = data.data[i][xComponent];
                    if (age >= 0 & age < 5)
                        xData = "neonate";
                    if (age >= 5 & age < 22)
                        xData = "suckling";
                    if (age >= 22 & age < 92)
                        xData = "nursery";
                    if (age >= 93 & age < 240)
                        xData = "grow finisher";
                    if (age >= 240)
                        xData = "adult";
                } else if (xComponent == "h3clade") //Special case H3 clades
                {
                    xData = data.data[i].clade;

                    //Cull for only h3
                    if (xData != "cluster_IV" & xData != "cluster_III" & xData != "cluster_IVA" & xData != "cluster_IVB" & xData != "cluster_IVE" & xData != "clusterIVF" & xData != "clusterIVC" & xData != "humanVac")
                        continue;
                } else if (xComponent == "h1clade") //Special case H1 clades
                {
                    xData = data.data[i].clade;

                    //Cull for only h1
                    if (xData != xData != "gamma" & xData != "gamma-like" & xData != "gamma2" & xData != "beta" & xData != "pdmH1" & xData != "delta1b" & xData != "delta1" & xData != "delta1a" & xData != "delta2")
                        continue;
                }
            } else
                continue;

            if (yComponent == "H1" | yComponent == "H3" | yComponent == "N1" | yComponent == "N2") {
                //Grab flu subtypes with ugly if
                yData = "";
                if (data.data[i].H1.toLowerCase() == "true")
                    yData = yData + "H1";
                if (data.data[i].H3.toLowerCase() == "true")
                    yData = yData + "H3";
                if (data.data[i].N1.toLowerCase() == "true")
                    yData = yData + "N1";
                if (data.data[i].N2.toLowerCase() == "true")
                    yData = yData + "N2";
                if (yData.length != 4)
                    yData = "Unsubtypable";
            } else if (yComponent == "age_days") //Special case age

            {
                age = data.data[i][yComponent];
                if (age >= 0 & age < 5)
                    yData = "neonate";
                if (age >= 5 & age < 22)
                    yData = "suckling";
                if (age >= 22 & age < 92)
                    yData = "nursery";
                if (age >= 93 & age < 240)
                    yData = "grow finisher";
                if (age >= 240)
                    yData = "adult";
            } else if (yComponent == "h3clade") //Special case H3 clades
            {
                yData = data.data[i].clade;

                //Cull for only h3
                if (yData != "cluster_IV" & yData != "cluster_III" & yData != "cluster_IVA" & yData != "cluster_IVB" & yData != "cluster_IVE" & yData != "clusterIVF" & yData != "clusterIVC" & yData != "humanVac")
                    continue;
            } else if (yComponent == "h1clade") //Special case H1 clades
            {
                yData = data.data[i].clade;

                //Cull for only h1
                if (yData != "gamma" & yData != "gamma-like" & yData != "gamma2" & yData != "beta" & yData != "pdmH1" & yData != "delta1b" & yData != "delta1" & yData != "delta1a" & yData != "delta2")
                    if (yData != "cluster_IV" & yData != "cluster_III" & yData != "cluster_IVA" & yData != "cluster_IVB" & yData != "cluster_IVE" & yData != "clusterIVF" & yData != "clusterIVC" & yData != "humanVac")
                        continue;
            } else
                yData = data.data[i][yComponent].toString();

            //Throw out unlabeled
            if (yData == null | yData == '')
                continue;

            //Create a complex structure
            if (flu[yData] == null) {
                flu[yData] = [];
            }

            if (flu[yData][xData] == null) {
                flu[yData][xData] = 0;
            } else {
                flu[yData][xData] = flu[yData][xData] + 1;
            }

            //Keep track of the x axis values & groups
            if (xAxis.indexOf(xData) < 0)
                xAxis.push(xData);
            if (groups.indexOf(yData) < 0)
                groups.push(yData);
        }
 }

//http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

//Query for the data
function getJsonData(xComponent, yComponent, callback) {
	//Check if yComponents is array
	if(yComponent.constructor === Array) {
		fields = yComponent.join(",");
	} else {
		fields = yComponent;
	}
	
	//Add in xComponent
	fields = xComponent + "," + fields;

	//Change values
	fields = fields.replaceAll("Day","received_date");
	fields = fields.replaceAll("Month","received_date");
 	fields = fields.replaceAll("Year","received_date");
	fields = fields.replaceAll("WeekNum","received_date");
	fields = fields.replaceAll("H1","H1,H3,N1,N2");
	
	//Request data
	$.ajax({
		url: '/getdata.php',
		type: 'post',
		data: {'col': fields,'flags':flags},
 		success: function(data, status) {
			data = JSON.parse(data);
			preProcess(xComponent, yComponent, data, callback);
		},
 		error: function(xhr, desc, err) {
 			console.log(xhr);
 			console.log("Details: " + desc + "\nError:" + err);
 		}
	});
}

function preProcess(xComponent, yComponent, data, callback, flags = "") {
        //Init array
        flu = {};
        xAxis = [];
        groups = [];

        if(yComponent.constructor === Array) {
		for (var i = 0; i < data.length; i++) {
			for (var j = 0; j < yComponent.length; j++)
			{
                        	//Shorten Variables
                        	yData = data[i][yComponent[j]];
	                        xData = data[i][xComponent];

        	                //Throw out unlabeled
                	        if (yData == null | yData == '')
                        	        continue;

				//Special case, handle age_days
				if (yComponent[j] == "age_days") //Special case age
				{	
			                age = yData;
			                if (age >= 0 & age < 5)
			                    yData = "neonate";
			                if (age >= 5 & age < 22)
			                    yData = "suckling";
			                if (age >= 22 & age < 92)
			                    yData = "nursery";
			                if (age >= 93 & age < 240)
			                    yData = "grow finisher";
			                if (age >= 240)
			                    yData = "adult";
					data[i][yComponent[j]] = yData;
            			}

				//Process Dates
				if (yComponent[j] == "received_date")
				{
					specimenDate = new Date(yData);
					data[i]['year'] = specimenDate.getFullYear();
					data[i]['month'] = (specimenDate.getMonth() + 1);
					
					//Figure out day of year (ignore feb 29th)
					var yearStart = new Date(specimenDate.getFullYear(),0,1);
					data[i]['day'] = Math.ceil((specimenDate - yearStart) / 86400000);
					data[i]['week'] = Math.ceil((specimenDate - yearStart) / 86400000 / 7);
				}

				//Create Subtype Information
				if (yComponent[j] == "H1" || yComponent[j] == "H3")
				{
					subtype = "";
					if (parseInt(data[i]["H1"]) == 1)
						subtype += "H1";
					if (parseInt(data[i]["H3"]) == 1)
						subtype += "H3";
					if (parseInt(data[i]["N1"]) == 1)
						subtype += "N1";
					if (parseInt(data[i]["N2"]) == 1)
						subtype += "N2";
					if (subtype.length != 4)
						subtype = "";
					data[i]['subtype'] = subtype;
				}

				//Create clade information
				if (xComponent == "ha_clade")
				{
					//Define Clades
					var clade = xData;
					var h1clade = ['alpha','beta','gamma','gamma2','gamma2-beta-like','gamma-like','delta2','delta1a','delta1','delta1b','delta-like','pdmH1'];
					var h3clade = ['cluster_IV','cluster_IVA','cluster_IVB','cluster_IVE','cluster_IVF','cluster_IVD','cluster_IVC','human-like'];
						
					if (h1clade.indexOf(clade) != -1)
						data[i]['h1_clade'] = clade;
					if (h3clade.indexOf(clade) != -1)
						data[i]['h3_clade'] = clade;	
				}

	                        //Create a complex structure
        	                if (flu[yData] == null) {
                	                flu[yData] = [];
	                        }

        	                if (flu[yData][xData] == null) {
                	                flu[yData][xData] = 0;
	                        } else {
        	                        flu[yData][xData] = flu[yData][xData] + 1;
                	        }

                        	//Keep track of the x axis values & groups
	                        if (xAxis.indexOf(data[i][xComponent]) < 0)
        	                        xAxis.push(data[i][xComponent]);
                	        if (groups.indexOf(data[i][yComponent[j]]) < 0)
                        	        groups.push(data[i][yComponent[j]]);
			}
		}
	}
        else {
        	for (var i = 0; i < data.length; i++) {

			//Shorten Variables
			yData = data[i][yComponent];
			xData = data[i][xComponent];

			//Throw out unlabeled
	           	if (yData == null | yData == '')
        	        	continue;

            		//Create a complex structure
	            	if (flu[yData] == null) {
        	        	flu[yData] = [];
	            	}	

			if (flu[yData][xData] == null) {
                		flu[yData][xData] = 0;
	            	} else {
        	        	flu[yData][xData] = flu[yData][xData] + 1;
            		}

			//Keep track of the x axis values & groups
        		if (xAxis.indexOf(data[i][xComponent]) < 0)
        			xAxis.push(data[i][xComponent]);
		        if (groups.indexOf(data[i][yComponent]) < 0)
        		        groups.push(data[i][yComponent]);
		}
	}
	
	//Check structure
	callback(data);
}

//Place holder function for time being
function dateProcess(xData)
{
	//for dates, cull by year
	return xData.substr(0,4);
}
