        var logs;
        var sites={};
        var base="C:\\\\Websites\\\\";
        var pathRegex=new RegExp(base+"(.+?)(\\\\.*)","i");
        function filereader(files) {
            var reader = new FileReader();
            reader.readAsText(files[0]);
            reader.onload = function (e) {
                config = { header: true, skipEmptyLines: true };
                logs = Papa.parse(reader.result, config);
                //console.log(logs);
                parseErrors(logs.data);
            }
        }

        function parseErrors(theLogs) {
            //console.log(theLogs.length)
            for (i = 0; i < theLogs.length; i++) {
                //parsing logs
                if (theLogs[i].Severity == "Error") {
                    messageParts = theLogs[i].Message.split(" The specific sequence of files included or processed is: ");
                    console.log(i,messageParts);
                    errorMessage = messageParts[0];
                    //"Error","ajp-bio-8012-exec-618","05/24/15","16:21:17",,"Exception thrown by error-handling template:"
                    pathParts = messageParts[1].split(", line: ");
                    //theLogs[i].file=pathParts[0];
                    theLogs[i].line=pathParts[1]?pathParts[1].slice(0,-1):0;
		fileParts=pathParts[0].match(pathRegex);
		try{
			site=fileParts[1];
			file=fileParts[2];
		}catch(e){
			site="Internal";
			file=pathParts[0];
			//console.log(i);
		}
		//creating sites
		if(!sites[site])sites[site]={"name":site,"errors":{count:1}};
		if(!sites[site].errors[errorMessage]){
			sites[site].errors[errorMessage]={count:1,files:{}};
			sites[site].errors[errorMessage].files[file]=[[theLogs[i].Date,theLogs[i].Time]];
		}else{
			sites[site].errors[errorMessage].count++;
			sites[site].errors.count++;
			if(!sites[site].errors[errorMessage].files[file]){
				sites[site].errors[errorMessage].files[file]=[[theLogs[i].Date,theLogs[i].Time]];
			}else{
				sites[site].errors[errorMessage].files[file].push([theLogs[i].Date,theLogs[i].Time]);
			}
		}
                }
            }
            console.log(sites);
        }
        
        

        /*
        sites=[site1,site2,site3,...]
        site={name:"",errors:[error1,error2,error3,...]}
        error={errorMessage:"",files:[file1,file2,file3...]}
        file={path:"",lines:[line#:[[date,time]],noline:[[date,time]]]}
        */
