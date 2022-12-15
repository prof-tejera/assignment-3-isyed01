const isObject = (value) => typeof value === 'object' && value !== null
const isArray = (value) => Array.isArray(value)

export class Converter {
    constructor( definition ){
        this.definition = definition;
    }

    encode = (data) => {
        const string = JSON.stringify( data );
        const encoded = encodeURI( string )
        const base64 = btoa( encoded );
        return base64;
    }

    decode = (str) => {
        try{ // no quick fix
            const encoded = atob(str)
            const string = decodeURI(encoded)
            return JSON.parse(string);
        } catch(err) {
            return null;
        }
    }

    compressData = (json, definition ) => {
        return Object.keys(definition).map(key => {
            const def = definition[key];
            const value = json[key];
            if(isObject(def)){
                if(isArray(def)){
                    return value.map(item => this.compressData(item, def[0]))
                }
                return this.compressData(value,def)
            }
            return value
        })
    }

    
    expandData = (data, definition) => {
        return Object.keys(definition).reduce((accum,key,index) => { 
            const def = definition[key];
            const value = data[index];
            if(isObject(def)){
                if(isArray(def)){
                    return {
                        ...accum,
                        [key]: value.map(item => this.expandData(item, def[0]))
                    }
                }
                return {
                    ...accum,
                    [key]: this.expandData(value, def)
                }
            }
            return { ...accum, [key]: value }
        },{})
    }

    compress = (data) => {
        return this.compressData(data, this.definition)
    }

    expand = (data) => {
        return this.expandData(data, this.definition)
    }

}


/////////////////////////////////////////////////////////////////
/*
const data1 = {
    id: 1,
    name: 2,
    settings: {
        theme: 3,
        timer: 2,
        precision: [1, 2, 3, 4, 5]
    },
    mapping: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ],
    ectivities: [
        { id: 0, name: 'namer1', time: 0 },
        { id: 1, name: 'namer2', time: 1 },
        { id: 2, name: 'namer3', time: 2 },
        { id: 3, name: 'namer4', time: 3 },
    ],
    uselessData1: 'hello',
    uselessData2: 'world',
    uselessData3: '!',
}

const map1 = {
    'id': null,
    'name' : null ,
    'settings': {
        'theme':null, 
        'timer':null, 
        'precision':null
    } ,
    'mapping' : null,
    'ectivities': [
        { 
            'id': null, 
            'name': null, 
            'time': null 
        },
    ],
    
}

const compactData = [
    1,
    2,
    [3, 2, [1, 2, 3, 4, 5] ],
    [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ],
    [
        [ 0, 'namer1', 0 ],
        [ 1, 'namer2', 1 ],
        [ 2, 'namer3', 2 ],
        [ 3, 'namer4', 3 ],
    ]
]




const conv = new Converter(map1);
const comp1 = conv.compress({ value: data1 });
console.log(comp1)
const exp1 = conv.expand({ value: comp1 });
console.log(exp1)
const comp2 = conv.compress({ value: data1, encode:true });
console.log(comp2)
const exp2 = conv.expand({ value: comp2, decode:true });
console.log(exp2)
*/