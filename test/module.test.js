/*jshint expr: true*/

var path = require( 'path' );
var newtonSync = require( path.resolve( path.join( __dirname, '..' ) ) );
var expect = require( 'chai' ).expect;


describe('my module', function( done ) {

    it('should load as a module', function(done) {
        expect( newtonSync ).to.exist;
        console.log(Object.keys(newtonSync));
        done();
    });

    //it('should set default config values', function( done ) {
        //var config = MyModule.getConfig();
        //expect( config.defaultValue1 ).to.equal( true );
        //done();
    //});

    //it('should override the default config values', function( done ) {
        //MyModule.init({
            //defaultValue1: false
        //});
        //var config = MyModule.getConfig();
        //expect( config.defaultValue1 ).to.equal(false);
        //expect( config.defaultValue2 ).to.equal(true);
        //done();
    //});

    //it('should run public api functions', function( done ) {
        //var results = MyModule.multiply( 2 );
        //expect( results ).to.deep.equal( [ 2, 4, 6 ] );
        //done();
    //});

    //it('should run module utils functions', function( done ) {
        //var html = MyModule.stripHTML( '<div class="my-class">some junk ãÅäÆ</div>' );
        //expect( html ).to.equal( '<div class="my-class">some junk </div>' );
        //done();
    //});

});
