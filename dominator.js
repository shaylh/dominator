window.dominator =
    (function () {

        var CALLBACK_DELAY = 20;

        var debug = false;
        var dom = {};
        var domGetter = {};
        var ready = false;

        window.addEventListener('load', function () {
            log('window loaded');
            ready = true;
        });

        function setDomId(id) {
            log('setDomId', id);
            dom[id] = document.getElementById(id);
            Object.defineProperty(domGetter, id, {
                get: function () {
                    log('get', id);
                    return dom[id];
                }
            });
        }

        function initId(id) {
            log('initId', id);
            runCallback(setDomId.bind(null, id));
        }

        function initIds(ids) {
            log('initIds', ids);
            ids.forEach(initId);
        }

        function onReady(param1, param2) {
            var param1Callback = typeof param1 === 'function';
            var param2Callback = typeof param2 === 'function';
            var param1String = typeof param1 === 'string';
            var param1Array = typeof param1 === 'object' && param1 instanceof Array;

            if (param1Callback) {
                runCallback(param1);
            } else if (param2Callback) {
                if (param1Array) {
                    initIds(param1);
                } else if (param1String) {
                    initId(param1);
                }
                runCallback(param2);
            }
        }

        function runCallback(callback){
            if(ready){
                callback(domGetter);
            } else {
                setTimeout(runCallback.bind(null, callback), CALLBACK_DELAY);
            }
        }

        function log() {
            if (debug) {
                console.log.apply(console, ['dominator'].concat(Array.prototype.slice.call(arguments)));
            }
        }

        return {
            /**
             * if window is already loaded, use this property for sync access to DOM elements
             */
            dom: domGetter,
            /**
             * init a DOM element with given id
             *
             * @param {string} id
             */
            initId: initId,
            /**
             * init multiple DOM elements with given ids
             *
             * @param {string[]} ids
             */
            initIds: initIds,
            /**
             * Executes a callback with initialized DOM elements.
             *
             * @param1 {function|string|string[]} a. callback to execute when DOM elements are fully loaded or b. DOM element id to initialize (same as .initId) or c. DOM elements ids to initialize (same as .initIds)
             * @param2 {function} callback to execute when DOM elements are fully loaded
             */
            onReady: onReady,
            /**
             * set debug mode true or false
             *
             * @param {boolean} isDebug
             */
            debug: function (isDebug) {
                debug = isDebug;
            }
        };
    })();

