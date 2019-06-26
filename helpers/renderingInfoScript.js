function getMobileMinWidthScript(context) {
  const isotypeObject = `window.${context.id}`;
  return `
    if (${isotypeObject} === undefined) {
      ${isotypeObject} = {};
    }
    ${isotypeObject}.element = document.querySelector("#${context.id}");

    ${isotypeObject}.removeArticleWidthClass = function(iconContainers, articleWidthClass) {
      iconContainers.forEach(function(iconContainer){ 
        iconContainer.classList.remove("q-isotype-icon-container" + "--" + iconContainer.dataset.containerType + "--" + articleWidthClass);
      });
    };

    ${isotypeObject}.addArticleWidthClass = function(iconContainers, articleWidthClass) {
      iconContainers.forEach(function(iconContainer){
        iconContainer.classList.add("q-isotype-icon-container" + "--" + iconContainer.dataset.containerType + "--" + articleWidthClass);
      });
    };

    ${isotypeObject}.handleMinWidth = function() {
      var iconContainers = document.querySelectorAll('.q-isotype-icon-container');
      if (${isotypeObject}.width > 400) {
        ${isotypeObject}.removeArticleWidthClass(iconContainers, "mobile");
        ${isotypeObject}.addArticleWidthClass(iconContainers, "content");
      } else {
        ${isotypeObject}.removeArticleWidthClass(iconContainers, "content");
        ${isotypeObject}.addArticleWidthClass(iconContainers, "mobile");
      } 
    };

    ${isotypeObject}.debounce = function(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };
    
    if (!window.q_domready) {
      window.q_domready = new Promise(function(resolve) {
        if (document.readyState && (document.readyState === 'interactive' || document.readyState === 'complete')) {
          resolve();
        } else {
          function onReady() {
            resolve();
            document.removeEventListener('DOMContentLoaded', onReady, true);
          }
          document.addEventListener('DOMContentLoaded', onReady, true);
          document.onreadystatechange = function() {
            if (document.readyState === "interactive") {
              resolve();
            }
          }
        }
      });
    }
    
    window.q_domready.then(function() {
      ${isotypeObject}.width = ${isotypeObject}.element.getBoundingClientRect().width;
      ${isotypeObject}.handleMinWidth();
    });

    

    window.addEventListener('resize', ${isotypeObject}.debounce(function() {
      requestAnimationFrame(function() {
        var newWidth = ${isotypeObject}.element.getBoundingClientRect().width;
        if (newWidth !== ${isotypeObject}.width) {
          ${isotypeObject}.width = newWidth;
          ${isotypeObject}.handleMinWidth();
        }
      });
    }, 250));
  `;
}

module.exports = {
  getMobileMinWidthScript: getMobileMinWidthScript
};
