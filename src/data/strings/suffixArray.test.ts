import test, { ExecutionContext } from "ava"
import suffixArray, { naiveSuffixArray, suffixArrayToString } from "./suffixArray";

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse posuere justo vel euismod placerat. Sed sagittis risus et risus pretium cursus. Suspendisse at nibh lectus. Nam sollicitudin velit urna, tincidunt faucibus neque rhoncus eu. Proin ac leo metus. Phasellus id placerat ex, ac convallis enim. Etiam at velit quis magna euismod laoreet ac sed eros. Vivamus luctus ac nisl in auctor.
Donec pretium nisl non est hendrerit, vel viverra est semper. Proin convallis nibh sit amet ligula molestie, et vestibulum massa interdum. Curabitur dictum justo et lacus semper blandit. Suspendisse sit amet sem tempus, pellentesque ex vitae, placerat justo. Aliquam enim mi, sodales in purus eget, cursus tincidunt nisi. Aenean quis condimentum quam. Maecenas nec luctus augue. Morbi diam turpis, ultrices ut finibus at, sodales vitae urna.
Proin et enim eros. Fusce sit amet magna nec sapien semper auctor in sit amet sapien. Nulla facilisi. Integer vitae vestibulum neque. Suspendisse ultricies risus eu eros accumsan semper. Vivamus blandit varius metus, vitae tristique sem fringilla ut. In lobortis dictum lobortis. Ut eu quam mauris.
Quisque et libero massa. Etiam blandit fermentum metus pellentesque tincidunt. Mauris varius ipsum augue, et tempor orci consectetur in. Cras et mattis erat, vitae tincidunt turpis. Donec tristique lobortis nisl, ac dignissim mi volutpat vitae. Nulla diam est, venenatis et dapibus sed, tincidunt at justo. Aenean mollis vel lacus quis mollis. Quisque fermentum ultrices placerat.
Morbi viverra sagittis sapien, et consequat ex aliquet et. Donec tincidunt eleifend mauris sed semper. Cras porttitor odio suscipit, rhoncus mauris in, placerat augue. Fusce vulputate elit vitae ante auctor elementum. Quisque dui eros, pharetra in diam eu, fringilla tempus risus. Nullam et facilisis lacus. In ac ex diam. Vivamus congue bibendum lorem, sit amet congue turpis ultricies nec. Nunc nec sagittis lacus. Quisque ipsum sem, gravida sed ex ut, placerat cursus dolor. Sed tempus facilisis ipsum. Morbi at fermentum nisi. Nam porttitor purus risus, eget euismod dui luctus sit amet.
In hac habitasse platea dictumst. Quisque accumsan nulla lacus, et dapibus sapien auctor sed. Vestibulum semper tempus vulputate. Integer aliquam, lorem et vulputate venenatis, arcu erat tincidunt felis, et tincidunt tellus neque quis quam. Aenean posuere, enim et aliquam rhoncus, libero tortor sollicitudin quam, iaculis rhoncus dolor ante nec orci. Cras consectetur quis tortor vitae vehicula. Nam a erat justo. Donec arcu arcu, blandit id mi sit amet, ultricies posuere turpis. Suspendisse potenti. Nunc at risus vitae erat elementum accumsan. Suspendisse id odio eu arcu viverra sodales a egestas augue. Nulla ullamcorper nunc eu dolor vehicula, nec auctor mi faucibus.
Aenean ac ex turpis. Maecenas ultricies gravida lacinia. Morbi et arcu risus. Cras vel sem non nunc pellentesque sodales vitae sit amet odio. Vestibulum fringilla ac enim in auctor. Phasellus maximus non turpis in fringilla. Sed ultricies neque nisl, tempus tristique nisi porttitor nec.
Vivamus metus neque, scelerisque tincidunt accumsan vehicula, facilisis vitae nibh. Aliquam sit amet magna non sem facilisis tempor. Aliquam mauris mi, commodo ac vestibulum vel, tristique pharetra arcu. In maximus congue risus, non sollicitudin ligula euismod ornare. Quisque et accumsan nisi. Curabitur lacinia nisl et arcu ultricies dapibus. Etiam commodo neque turpis, sit amet interdum ligula convallis nec. Duis et odio sed tellus venenatis suscipit a vitae dui. Proin eleifend mauris bibendum, imperdiet neque in, eleifend dolor. Duis viverra ex orci, at suscipit magna suscipit mollis. Vestibulum erat lorem, vehicula et posuere at, dignissim et mi. Sed in faucibus augue. Donec volutpat auctor velit eu molestie.
Proin vitae nunc eu mi venenatis finibus ut ac dui. Nam auctor ipsum enim, ut mattis velit ornare in. Ut eget diam lorem. Curabitur diam neque, scelerisque vitae maximus vitae, ullamcorper ac nisi. Etiam ultrices consectetur eros ac viverra. Nam a lacus justo. Nunc volutpat, eros eu consequat tempus, sem eros pretium velit, vitae pulvinar nisi libero a purus. Etiam et sodales dui. Vestibulum iaculis in nulla nec hendrerit. Ut eget augue eget risus fringilla viverra sit amet eu nulla. Maecenas dapibus lectus nec diam dapibus laoreet.
Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent tincidunt nisi quis porta lacinia. Curabitur nec augue scelerisque, venenatis sem quis, consequat arcu. Proin in nulla tellus. Proin turpis justo, porta id odio vel, consequat facilisis tortor. Etiam tincidunt risus lectus, et suscipit arcu condimentum at. Aliquam euismod felis sed maximus dapibus. Sed eget euismod sem, ut vulputate ex. Integer ornare vulputate eros in congue. Morbi cursus at sapien quis ultrices. Fusce elementum pharetra ipsum vitae malesuada. Aliquam turpis augue, commodo in dapibus ut, lacinia quis nisi. Donec non tellus ornare diam interdum interdum id eu orci. Morbi quis risus nunc. Curabitur tristique ex mauris, id interdum dolor convallis a.
`

const repeatedLoremIpsum = ( () => {
    let result = [ loremIpsum ]
    for ( let i = 0; i < 3; i++ )
        result.push( loremIpsum )
    return result.join( "" )
} )()

function checkString( text: string, perfTest = false, t: ExecutionContext ) {
    if ( perfTest ) console.time( "DC3" )
    let actual = suffixArray( text )
    if ( perfTest ) console.timeEnd( "DC3" )
    if ( perfTest ) console.time( "naive" )
    let expected = naiveSuffixArray( text )
    if ( perfTest ) console.timeEnd( "naive" )
    if ( perfTest ) console.log()
    let content = actual.toString() + "\n" + expected.toString()
    t.assert( actual.toString() == expected.toString(), content )
}

test( "0", t => {
    t.pass()
    // let texts = [
    //     // "banana",
    //     // "yabbadabbado",
    //     // "aaaaa",
    //     // "cats-cats",
    //     // "she sells sea shells by the sea shore",
    //     "chat-bhat-ahat-",
    //     // loremIpsum,
    //     // repeatedLoremIpsum
    // ]

    // for ( let text of texts )
    //     checkString( text, true, t )
} )

// test( "performance", t => {
//     console.time( "suffixArray" )
//     // suffixArray( loremIpsum )
//     checkString(loremIpsum, t)
//     console.timeEnd( "suffixArray" )
//     t.pass()
// } )

