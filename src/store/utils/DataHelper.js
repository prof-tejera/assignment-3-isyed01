import { Storage } from "./Storage";
import { Converter } from "./Converter";

export class DataHelper {
    constructor({ id, definition }) {
        this.id = id;
        this.disk = new Storage(id)
        this.data = new Converter(definition);
    }

    write = (data) => {
        const compData = this.data.compress(data);
        this.disk.write(compData);
        return data;
    }

    read = () => {
        const value = this.disk.read();
        if(!value) return value;
        const data = this.data.expand( value )
        return data;
    }

    readWrite = (defaultValue={}) => {
        const storedValue = this.read();
        if(!storedValue){
            this.write(defaultValue);
            return defaultValue;
        }
        return { ...defaultValue, ...storedValue };



/*


        if(this.id==='app'){
            console.log(`DISK.readWrite(data): data = `)
            console.log(defaultValue)
        }
        const storedValue = this.read();
        if(!storedValue) this.write(defaultValue);



        const value = storedValue || defaultValue;
        if(this.id==='app'){
            console.log(`DISK.readWrite(data): returning = `)
            console.log(value)
        }
        return value;
        */
    }

    encode = (data) => {
        const compData = this.data.compress(data)
        const str = this.data.encode(compData)
        return str;

    }

    decode = (str) => {
        const compData = this.data.decode(str);
        if(compData===null) return compData
        const data = this.data.expand(compData);
        return data;
    }

}