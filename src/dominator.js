window.Dominator =
    (function () {
        var CALLBACK_DELAY = 20;

        var debug, dom, domGetter, ready, timeouts;
        var dominatorInstance;
        var Dominator = function () {
            init();
        };

        Dominator.getInstance = function (restart) {
            if (!dominatorInstance || restart) {
                dominatorInstance = new Dominator();
            }
            return dominatorInstance;
        };

        function init() {
            clearTimeouts();
            debug = false;
            dom = {};
            domGetter = {};
            ready = false;
            window.addEventListener('load', function () {
                log('window loaded');
                ready = true;
            });
        }

        function isReady(){
            return ready;
        }

        function clearTimeouts() {
            if (timeouts) {
                timeouts.forEach(window.clearTimeout);
            }
            timeouts = [];
        }

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
            var actualIds = ids instanceof Array ? ids : [].slice.call(arguments);
            log('initIds', actualIds);
            actualIds.forEach(initId);
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

        function runCallback(callback) {
            if (isReady()) {
                callback(domGetter);
            } else {
                timeouts.push(setTimeout(runCallback.bind(null, callback), CALLBACK_DELAY));
            }
        }

        function log() {
            if (debug) {
                console.log.apply(console, ['dominator'].concat(Array.prototype.slice.call(arguments)));
            }
        }

        Dominator.prototype = {
            /**
             * if window is already loaded, use this property for sync access to DOM elements
             */
            get dom() {
                return domGetter;
            },
            /**
             * init a DOM element with given id
             *
             * @param {string} id
             */
            initId: initId,
            /**
             * init multiple DOM elements with given ids
             *
             * @param {string[]|...string} ids
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

        return Dominator;
    })();

