(function(angular) {

  'use strict';

  angular.module('calcentral.services').service('utilService', function($location, $rootScope, $window) {

    /**
     * Pass in controller name so we can set active location in menu
     * @param {String} name The name of the controller
     */
    var changeControllerName = function(name) {
      $rootScope.controllerName = name;
    };

    /**
     * Check whether CalCentral is being loaded within an iframe
     */
    var isInIframe = !!window.parent.frames.length;

    /**
     * Check if browser supports localStorage
     */
    var supportsLocalStorage = (function() {
      try {
        return 'localStorage' in window && window.localStorage !== null;
      } catch (e) {
        return false;
      }
    })();

    /**
     * Redirect to a page
     */
    var redirect = function(page) {
      $location.path('/' + page);
    };

    /**
     * Prevent a click event from bubbling up to its parents
     */
    var preventBubble = function($event) {

      // We don't need to do anything when you hit the enter key.
      // In that instance the event will be undefined.
      if (!$event) {
        return;
      }

      $event.stopPropagation();
      // When it's not an anchor tag, we also prevent the default event
      if ($event.target.nodeName !== 'A') {
        $event.preventDefault();
      }
    };

    /**
     * Set the title for the current web page
     * @param {String} title The title that you want to show for the current web page
     */
    var setTitle = function(title) {
      $rootScope.title = title + ' | CalCentral';
    };

    /**
     * Post a message to the parent
     * @param {String|Object} message Message you want to send over.
     */
    var iframePostMessage = function(message) {
      if ($window.parent) {
        $window.parent.postMessage(message, '*');
      }
    };

    /**
     * Update the iframe height on a regular basis
     */
    var iframeUpdateHeight = function() {
      if (isInIframe) {
        $window.setInterval(function updateHeight() {
          iframePostMessage({
            height: document.body.scrollHeight
          });
        }, 250);
      }
    };

    // Expose methods
    return {
      changeControllerName: changeControllerName,
      iframeUpdateHeight: iframeUpdateHeight,
      preventBubble: preventBubble,
      redirect: redirect,
      setTitle: setTitle,
      supportsLocalStorage: supportsLocalStorage
    };

  });

}(window.angular));
