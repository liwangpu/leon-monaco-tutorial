

import { Options } from "./options";
export default class OptionProvider {


    public GetLatestOptions(): Options {

            return new Options(null, 'auto', false, 'debug', true,60,250,false, true, false, false, false, [], false, false,false,0, 1000, 
            false,false,false, true, true, false, false, true, true,null,null,null,['**/.git' ,'**/.svn','**/.hg','**/CVS','**/.DS_Store'],2500   );
        
      
    }

}