import Mortal from "../Mortal";
import AphroditeRestrictions from "../restrictions/AphroditeRestrictions";

class Aphrodite extends Mortal{
    constructor(){
        super();
        this.setIdentifier("XI");
        this.setRestriction( new AphroditeRestrictions(true, true))
    }
}

export default Aphrodite;