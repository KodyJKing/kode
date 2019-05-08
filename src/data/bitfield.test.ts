import test from "ava"
import bitfield from "./bitfield"

enum Type {
    Empty,
    Pawn,
    Knight,
    Bishop,
    Rook,
    Queen,
    King
}

enum Color {
    White,
    Black
}

let Piece = bitfield( [
    ["type", 3],
    ["color", 1],
    ["moved", 1]
] )

test( "constructor/setComponent", t => {
    let p = Piece.create( Type.King, Color.White, 0 )

    t.true( Piece.get.type( p ) === Type.King )
    t.true( Piece.get.color( p ) === Color.White )
    t.true( Piece.get.moved( p ) === 0 )

    p = Piece.set.type( p, Type.Rook )
    p = Piece.set.color( p, Color.Black )
    p = Piece.set.moved( p, 1 )

    t.true( Piece.get.type( p ) === Type.Rook )
    t.true( Piece.get.color( p ) === Color.Black )
    t.true( Piece.get.moved( p ) === 1 )
} )

test( "toObject/fromObject", t => {
    let object = { type: Type.King, color: Color.Black, moved: 0 }

    let p = Piece.create( Type.King, Color.Black, 0 )
    let q = Piece.fromObject( object )
    t.true( p === q )

    t.deepEqual( object, Piece.toObject( q ) )
} )