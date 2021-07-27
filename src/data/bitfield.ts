type Properties = [ string, number, number ][]

const mask = ( width: number ) => ( 1 << width ) - 1;

function propertiesWithShift( properties: [ string, number ][] ) {
    let shift = 0
    let result: Properties = []
    for ( let [ name, width ] of properties ) {
        result.push( [ name, width, shift ] )
        shift += width
    }
    return result
}

function fromArguments<T>( properties: Properties ) {
    let names = properties.map( ( component ) => component[ 0 ] )
    let parts = properties.map( ( [ name, width, shift ] ) => `(${name} << ${shift})` )
    let result = new Function( ...names, "return " + parts.join( " | " ) )
    return result as ( ...args: number[] ) => T
}

function fromObject<T>( properties: Properties ) {
    let parts = properties.map( ( [ name, width, shift ] ) => `(object.${name} << ${shift})` )
    let result = new Function( "object", "return " + parts.join( " | " ) )
    return result as ( object: { [ name: string ]: number } ) => T
}

function toObject<T>( properties: Properties ) {
    let parts = properties.map( ( [ name, width, shift ] ) => `${name}: (structVal >> ${shift}) & ${mask( width )}` )
    let result = new Function( "structVal", `return { ${parts.join( " , " )} }` )
    return result as ( structVal: T ) => { [ name: string ]: number }
}

interface Struct<T extends string> { as: T }
export type struct<T extends string> = number & Struct<T>

export default function bitfield<T extends struct<any>>( properties: [ string, number ][] ) {
    let bitCount = properties.map( ( component ) => component[ 1 ] ).reduce( ( x, y ) => x + y )
    if ( bitCount > 32 )
        throw new Error( "Components don't fit 32 bit number." )

    let _properties = propertiesWithShift( properties )

    let get: { [ name: string ]: ( structVal: T ) => number } = {}
    let set: { [ name: string ]: ( structVal: T, value: number ) => T } = {}

    for ( let [ name, width, shift ] of _properties ) {
        let getMask = mask( width )
        get[ name ] = ( structVal: T ) => ( structVal >> shift ) & getMask

        let setMask = ~( getMask << shift ) // Used to clear components bits.
        set[ name ] = ( structVal: T, value: number ) => ( ( structVal & setMask ) | ( ( value & getMask ) << shift ) ) as T
    }

    return {
        create: fromArguments<T>( _properties ),
        toObject: toObject<T>( _properties ),
        fromObject: fromObject<T>( _properties ),
        get,
        set
    }
}