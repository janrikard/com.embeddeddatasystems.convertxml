'use strict';

const Homey = require('homey');


var linenumber=1;

var ROMId=null;
var temperature=null;
var tempstring=null;
var array =[];

class MyApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('MyApp has been initialized');

    const card =this.homey.flow.getActionCard('convert-edx-xml-to-json');

    card.registerRunListener(async (args) => {

      let jsonstring="\{\r\n\t\"Temperature\": \{\r\n\t\t\t";
      
      const { XMLinput } = args;

      args.XMLinput.split(/\r?\n/).forEach(line =>  {
        if (line.includes('<ROMId>')){

            line=line.replace('<ROMId>','');
            line=line.replace('</ROMId>','');
            ROMId=line;

        }
        if (line.includes('<Temperature Units="Centigrade">')){

          line=line.replace('<Temperature Units="Centigrade">','');
          line=line.replace('</Temperature>','');
          temperature=line;
      }

      if (ROMId!=null && temperature!=null){

        tempstring="\"";
        tempstring+=ROMId;
        tempstring+="\"\: ";
        tempstring+=temperature;
        ROMId=null;
        temperature=null;
        
        array.push(tempstring);
      }

        
        linenumber++;
      });
      
      for (let i = 0; i < array.length; i++) {
        jsonstring+=array[i];
        if (i<(array.length-1))
          jsonstring+="\,";
        jsonstring+="\r\n\t\t\t";
        
        
      }
      array =[];

      jsonstring+="\}\r\n\t\t\r\n\t\}";
      this.log(jsonstring);
      this.log(array);
      this.log(`Klart`);
      return {
        json_output: jsonstring
      };
      jsonstring="\{\r\n\t\"Temperature\": \{\r\n\t\t\t";
    })


  }

}

module.exports = MyApp;
