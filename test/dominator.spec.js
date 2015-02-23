describe('dominator', function () {

    var callbacks = {};
    var windowLoaded;
    var dominator;

    function loadWindow() {
        if (callbacks.load) {
            windowLoaded = true;
            callbacks.load();
        }
    }

    function unloadWindow() {
        if (callbacks.unload) {
            windowLoaded = false;
            callbacks.unload();
        }
    }

    beforeEach(function () {
        spyOn(window, 'addEventListener').and.callFake(function (eventName, callback) {
            callbacks[eventName] = callback;
        });
        spyOn(document, 'getElementById').and.callFake(function (id) {
            return windowLoaded && {id: 'mock_' + id};
        });
    });

    afterEach(function () {
        unloadWindow();
    });

    describe('initId', function(){

        beforeEach(function(){
            dominator = Dominator.getInstance(true);
        });

        afterEach(function () {
            unloadWindow();
        });

        it('should not init element if window is not loaded yet', function(){
            dominator.initId('div1');
            expect(dominator.dom.div1).toBeUndefined();
        });

        it('should init element when window is loaded', function(done){
            dominator.initId('div1');
            loadWindow();
            setTimeout(function(){
                expect(dominator.dom.div1).toEqual({id: 'mock_div1'});
                done();
            }, 20);
        });

    });

    describe('initIds', function(){

        beforeEach(function(){
            dominator = Dominator.getInstance(true);
        });

        afterEach(function () {
            unloadWindow();
        });

        it('should not init elements if window is not loaded yet', function(){
            dominator.initIds(['div1', 'div2']);
            dominator.initIds('div3', 'div4');
            expect(dominator.dom.div1).toBeUndefined();
            expect(dominator.dom.div2).toBeUndefined();
            expect(dominator.dom.div3).toBeUndefined();
            expect(dominator.dom.div4).toBeUndefined();
        });

        it('should init elements when window is loaded (ids may be array of strings or separate params)', function(done){
            dominator.initIds(['div1', 'div2']);
            dominator.initIds('div3', 'div4');
            loadWindow();
            setTimeout(function(){
                expect(dominator.dom.div1).toEqual({id: 'mock_div1'});
                expect(dominator.dom.div2).toEqual({id: 'mock_div2'});
                expect(dominator.dom.div3).toEqual({id: 'mock_div3'});
                expect(dominator.dom.div4).toEqual({id: 'mock_div4'});
                done();
            }, 20);
        });
    });

    describe('onReady', function(){

        beforeEach(function(){
            dominator = Dominator.getInstance(true);
        });

        afterEach(function () {
            unloadWindow();
        });

        it('should execute callback with dom when site is ready (window loaded)', function(done){
            dominator.initIds(['div1', 'div2']);
            dominator.initIds('div3', 'div4');
            dominator.onReady(function(dom){
                expect(dom.div1).toEqual({id: 'mock_div1'});
                expect(dom.div2).toEqual({id: 'mock_div2'});
                expect(dom.div3).toEqual({id: 'mock_div3'});
                expect(dom.div4).toEqual({id: 'mock_div4'});
                done();
            });
            loadWindow();
        });

        it('should support initializing new DOM elements on the fly', function(done){
            dominator.onReady(function(dom){
                var newDiv = document.createElement('div');
                newDiv.setAttribute('id', 'div5');
                document.body.appendChild(newDiv);
                dominator.initId('div5');
                expect(dom.div5).toEqual({id: 'mock_div5'});
                done();
            });
            loadWindow();
        });

    });
});