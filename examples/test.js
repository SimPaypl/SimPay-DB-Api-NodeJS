const SimPayDB = require( '../src/main.js' );

const simpayObject = new SimPayDB();

const exampleData = {
    id             : 1,
    status         : 'ORDER_PAYED',
    valuenet       : 1,
    valuenet_gross : 1,
    valuepartner   : 1,
    control        : 'test',
    number_from    : 123456789,
    sign           : 'bf113ff702ad6956dbb8c7e5e5c27c49634d688cee77bae47d7988cc9ab3d47a',
};

simpayObject.setApiKey( 'test' );

simpayObject.parse( exampleData );

if( simpayObject.isError() ) {
    console.log( simpayObject.okTransaction() );
}
else if( simpayObject.isTransactionPaid() ) {
    console.log( 'getControl', simpayObject.getControl() );
    console.log( 'getTransactionId', simpayObject.getTransactionId() );
    console.log( 'getValuePartner', simpayObject.getValuePartner() );
    console.log( 'getUserNumber', simpayObject.getUserNumber() );
    console.log( 'getStatus', simpayObject.getStatus() );
    console.log( 'getValue', simpayObject.getValue() );
    console.log( 'getValueGross', simpayObject.getValueGross() );
}
else{
    console.log( simpayObject.getErrorText() );
}

console.log( simpayObject.okTransaction() );
