/* eslint-disable class-methods-use-this */
const crypto = require( 'crypto' );

class SimPayDB {
    constructor() {
        this.error = false;
        this.errorCode = 0;

        this.apiKey = '';

        this.status = '';
        this.value = '';
        this.valueGross = '';
        this.control = '';

        this.transId = '';

        this.valuePartner = '';

        this.userNumber = '';
    }

    parse( data ) {
        if( typeof data.id === 'undefined' ) {
            this.setError( true, 1 );

            return false;
        }

        if( typeof data.status === 'undefined' ) {
            this.setError( true, 1 );

            return false;
        }

        if( typeof data.valuenet === 'undefined' ) {
            this.setError( true, 1 );

            return false;
        }

        if( typeof data.sign === 'undefined' ) {
            this.setError( true, 1 );

            return false;
        }

        this.status = String( data.status ).trim();
        this.value = String( data.valuenet ).trim();
        this.valueGross = String( data.valuenet_gross ).trim();

        if( typeof data.control !== 'undefined' ) {
            this.control = String( data.control ).trim();
        }

        if( typeof data.number_from !== 'undefined' ) {
            this.userNumber = String( data.number_from ).trim();
        }

        this.transId = String( data.id ).trim();

        this.valuePartner = String( data.valuepartner ).trim();

        const currentHash = crypto.createHash( 'sha256' ).update( this.transId + this.status + this.value + this.valuePartner + this.control + this.apiKey ).digest( 'hex' );

        if( currentHash !== data.sign ) {
            this.setError( true, 3 );

            return false;
        }

        this.value = parseFloat( this.value.replace( ',', '.' ) );

        if( this.value <= 0.00 ) {
            this.setError( true, 4 );
        }

        this.valuePartner = parseFloat( this.valuePartner.replace( ',', '.' ) );

        if( this.valuePartner <= 0.00 ) {
            this.setError( true, 4 );
        }

        return true;
    }

    isError() {
        return this.error;
    }

    getErrorText() {
        switch( this.errorCode ) {
        case 0:
            return 'No Error';
        case 1:
            return 'Missing Parameters';
        case 2:
            return 'No Sign Param';
        case 3:
            return 'Wrong Sign';
        case 4:
            return 'Wrong Amount Value';
        default:
            return 'No error';
        }
    }

    setError( state, code ) {
        this.error = state;
        this.errorCode = code;
    }

    setApiKey( key ) {
        this.apiKey = key;
    }

    getStatus() {
        return this.status;
    }

    getValue() {
        return this.value;
    }

    getValueGross() {
        return this.valueGross;
    }

    getControl() {
        return this.control;
    }

    isTransactionPaid() {
        return ( this.status === 'ORDER_PAYED' );
    }

    getTransactionId() {
        return this.transId;
    }

    okTransaction() {
        return 'OK';
    }

    getValuePartner() {
        return this.valuePartner;
    }

    getUserNumber() {
        return this.userNumber;
    }

    calculateRewardPartner( amount, provider ) {
        /*
        $provider =
        1 - Orange
        2 - Play
        3 - T-mobile
        4 - Plus
        */

        if( amount <= 0 ) {
            return 0.00;
        }

        let arrayComission = [];

        switch( provider ) {
        case 1: {
            arrayComission = [ 0.65, 0.65, 0.65 ];

            break;
        }
        case 2: {
            arrayComission = [ 0.55, 0.65, 0.70 ];

            break;
        }
        case 3: {
            arrayComission = [ 0.60, 0.60, 0.60 ];

            break;
        }
        case 4: {
            arrayComission = [ 0.50, 0.50, 0.50 ];

            break;
        }
        default: {
            arrayComission = [ 0, 0, 0 ];

            break;
        }
        }

        if( amount < 9 ) {
            return ( amount * arrayComission[ 0 ] ).toFixed( 2 );
        }

        if( amount < 25 ) {
            return ( amount * arrayComission[ 1 ] ).toFixed( 2 );
        }

        return ( amount * arrayComission[ 2 ] ).toFixed( 2 );
    }
}

module.exports = SimPayDB;
