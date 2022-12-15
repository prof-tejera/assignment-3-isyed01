
export class Storage {
    constructor( key='' ) {
        this.key = key;
    }

    // write to localStorage
    write = (value) => {
        const str = JSON.stringify(value)
        localStorage.setItem( this.key , str);
        return value;
    }

    // read from localStorage
    read = () => { 
        const str = localStorage.getItem(this.key);
        const value = str ? JSON.parse(str) : str;
        return value;
    }
}


