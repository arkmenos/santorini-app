import Mortal from "../Mortal";
import AphroditeRestriction from "../restrictions/AphroditeRestriction";

class Aphrodite extends Mortal{
    constructor(){
        super();
        this.setIdentifier("XI");
        this.setRestriction( new AphroditeRestriction(true, true))
    }
}

export default Aphrodite;