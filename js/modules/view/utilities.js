import Billy from "../data/billy.js";



class Current {
    static my_billy;
    static current_billy;
    
    constructor(){
        this.my_billy = this.get_billy(); 
        this.current_billy = this.get_last_billy();
    }

    get_billy() {
        this.my_billy = Object.keys(localStorage)
            .filter(key => key.startsWith('Billy#'))
            .map(key => JSON.parse(localStorage?.getItem(key)))
            .sort( billy => billy.modified )
            .map(billy => Billy(billy));
        return this.my_billy;
    };

    get_last_billy() {
        this.current_billy = this.my_billy.reduce( (prev, curr) => prev?.modified > curr?.modified ? prev : curr, undefined );
        return this.current_billy;
    }
}

export default new Current();
